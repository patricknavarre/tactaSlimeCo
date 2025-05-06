import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Get backend URL from environment or default to localhost
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5051';

export async function POST(request) {
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    IS_VERCEL: process.env.VERCEL,
    BACKEND_URL: BACKEND_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_REGION: process.env.VERCEL_REGION
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

    // Check if file size is too large (e.g., over 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { 
          error: 'File too large', 
          details: 'Maximum file size is 10MB',
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

    // Check if in production or development environment
    const isProduction = process.env.VERCEL || process.env.VERCEL_ENV;
    
    if (isProduction) {
      // In production, forward the upload to our Render backend
      console.log('Upload API: Production environment detected, forwarding to Render backend');
      
      try {
        // Create a new FormData to send to the backend
        const backendFormData = new FormData();
        backendFormData.append('file', file);
        backendFormData.append('filename', cleanFilename);
        
        // Send the file to the Render backend
        const backendUrl = `${BACKEND_URL}/api/upload`;
        console.log(`Upload API: Forwarding to backend URL: ${backendUrl}`);
        
        const backendResponse = await fetch(backendUrl, {
          method: 'POST',
          body: backendFormData,
        });
        
        if (!backendResponse.ok) {
          const errorText = await backendResponse.text();
          throw new Error(`Backend upload failed: ${backendResponse.status} - ${errorText}`);
        }
        
        const backendData = await backendResponse.json();
        console.log('Upload API: Backend response:', backendData);
        
        return NextResponse.json({
          success: true,
          imagePath: backendData.imageUrl || backendData.url || backendData.imagePath,
          environment: 'render',
          backendData
        });
      } catch (backendError) {
        console.error('Upload API: Backend upload error:', backendError);
        throw new Error(`Error forwarding to backend: ${backendError.message}`);
      }
    } else {
      // DEVELOPMENT ENVIRONMENT - Use local filesystem
      console.log('Upload API: Development environment, using filesystem storage');
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