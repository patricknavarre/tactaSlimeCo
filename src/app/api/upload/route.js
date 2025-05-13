import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';

// Get backend URL from environment or default to localhost
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5051';

export async function POST(request) {
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    IS_VERCEL: process.env.VERCEL,
    BACKEND_URL: BACKEND_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_REGION: process.env.VERCEL_REGION,
    FORWARD_UPLOADS: process.env.FORWARD_UPLOADS,
    BLOB_TOKEN_EXISTS: !!process.env.BLOB_READ_WRITE_TOKEN
  };

  try {
    console.log('Upload API: Starting with environment:', envInfo);
    
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      console.error('Upload API: No file provided in request');
      return NextResponse.json(
        { 
          error: 'No file uploaded',
          envInfo 
        },
        { status: 400 }
      );
    }

    console.log('Upload API: File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Check if file size is too large (e.g., over 4MB for Vercel)
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { 
          error: 'File too large', 
          details: 'Maximum file size is 4MB',
          envInfo
        },
        { status: 400 }
      );
    }

    // Create a unique filename
    const timestamp = Date.now();
    const cleanFilename = `${timestamp}-${file.name
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .replace(/[^a-zA-Z0-9-_.]/g, '') // Remove special characters
      .toLowerCase()}`;                 // Convert to lowercase

    console.log('Upload API: Cleaned filename:', cleanFilename);

    // Check if we're in production (Vercel)
    const isProduction = process.env.VERCEL || process.env.VERCEL_ENV;
    
    // If we're in production and have blob storage token, use Vercel Blob
    if (isProduction && process.env.BLOB_READ_WRITE_TOKEN) {
      console.log('Upload API: Using Vercel Blob Storage');
      try {
        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Upload to Vercel Blob Storage
        const { url } = await put(cleanFilename, buffer, {
          access: 'public',
          addRandomSuffix: false,
          contentType: file.type
        });
        
        console.log('Upload API: File uploaded to Blob Storage:', url);
        
        return NextResponse.json({
          success: true,
          imagePath: url,
          environment: 'vercel-blob'
        });
      } catch (blobError) {
        console.error('Upload API: Blob storage error:', blobError);
        throw blobError; // Re-throw to be caught by the outer catch
      }
    }
    
    // For the Render backend - if forwarding is enabled
    const shouldForward = process.env.FORWARD_UPLOADS === 'true';
    const isForwarded = request.headers.get('x-is-forwarded') === 'true';
    
    if (shouldForward && !isForwarded) {
      // Forward the upload to our Render backend
      console.log(`Upload API: ${isProduction ? 'Production environment' : 'FORWARD_UPLOADS enabled'}, forwarding to Render backend`);
      
      try {
        // Create a new FormData to send to the backend
        const backendFormData = new FormData();
        backendFormData.append('file', file);
        backendFormData.append('filename', cleanFilename);
        
        // Ensure backend URL is properly formatted with http:// prefix
        let backendUrl = BACKEND_URL;
        if (!backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
          backendUrl = `http://${backendUrl}`; 
        }
        
        if (!backendUrl.endsWith('/')) {
          backendUrl += '/';
        }
        
        // Complete URL with api/upload path
        backendUrl += 'api/upload';
        
        console.log(`Upload API: Forwarding to backend URL: ${backendUrl}`);
        
        // Set a timeout for the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const backendResponse = await fetch(backendUrl, {
          method: 'POST',
          body: backendFormData,
          headers: {
            'x-is-forwarded': 'true' // Mark this request as forwarded to prevent loops
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!backendResponse.ok) {
          let errorText;
          try {
            errorText = await backendResponse.text();
          } catch (e) {
            errorText = `Could not read error response: ${e.message}`;
          }
          
          throw new Error(`Backend upload failed: ${backendResponse.status} - ${errorText}`);
        }
        
        // Try to parse the response as JSON
        let backendData;
        const contentType = backendResponse.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          backendData = await backendResponse.json();
        } else {
          const text = await backendResponse.text();
          console.log('Upload API: Backend returned non-JSON response:', text);
          backendData = { success: true, notes: "Non-JSON response", text: text.substring(0, 100) };
        }
        
        console.log('Upload API: Backend response:', backendData);
        
        return NextResponse.json({
          success: true,
          imagePath: backendData.imageUrl || backendData.url || backendData.imagePath || `/images/products/${cleanFilename}`,
          environment: 'render',
          backendData
        });
      } catch (backendError) {
        console.error('Upload API: Backend upload error:', backendError);
        
        // If we're in production, we shouldn't try to use local storage as fallback
        if (isProduction) {
          throw backendError; // Re-throw to be caught by the outer catch
        }
        
        // Otherwise, for development, continue to local file storage
        console.log('Upload API: Backend upload failed. Falling back to local storage.');
      }
    }
    
    // DEVELOPMENT ENVIRONMENT ONLY - Local filesystem storage
    if (!isProduction) {
      console.log('Upload API: Using local filesystem storage');
      const publicDir = path.join(process.cwd(), 'public');
      const uploadDir = path.join(publicDir, 'images', 'products');
      
      console.log('Upload API: Creating upload directory:', uploadDir);
      try {
        await mkdir(uploadDir, { recursive: true });
        console.log('Upload API: Directory created/verified');
      } catch (err) {
        console.error('Upload API: Error creating directory:', err);
        if (err.code !== 'EEXIST') {
          throw err;
        }
      }
      
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(uploadDir, cleanFilename);
      console.log('Upload API: Writing file to:', filePath);
      
      await writeFile(filePath, buffer);
      const imagePath = `/images/products/${cleanFilename}`;
      console.log('Upload API: File successfully saved. Returning path:', imagePath);
      
      return NextResponse.json({ 
        success: true,
        imagePath: imagePath,
        environment: 'local',
        envInfo
      });
    } else {
      // If we reached here in production, something went wrong
      throw new Error('No suitable storage method available in production');
    }
  } catch (error) {
    console.error('Upload API Error:', {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: 'Error uploading file', 
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
} 