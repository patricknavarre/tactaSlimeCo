import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import * as blob from '@vercel/blob';

export async function POST(request) {
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    IS_VERCEL: process.env.VERCEL,
    BLOB_TOKEN_EXISTS: !!process.env.BLOB_READ_WRITE_TOKEN,
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

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create a unique filename
    const timestamp = Date.now();
    const cleanFilename = `${timestamp}-${file.name
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .replace(/[^a-zA-Z0-9-_.]/g, '') // Remove special characters
      .toLowerCase()}`;                 // Convert to lowercase

    console.log('Upload API: Cleaned filename:', cleanFilename);

    // Check environment - Production (Vercel) vs Development
    const isProduction = process.env.VERCEL || process.env.VERCEL_ENV;
    
    if (isProduction) {
      // PRODUCTION ENVIRONMENT - Must use Blob Storage
      try {
        console.log('Upload API: Production environment, attempting Vercel Blob storage upload');
        
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          console.error('Upload API: BLOB_READ_WRITE_TOKEN is not set in production environment');
          return NextResponse.json(
            { 
              error: 'Server configuration error', 
              details: 'Blob storage token not configured in production environment',
              envInfo
            },
            { status: 500 }
          );
        }
        
        const { url } = await blob.put(cleanFilename, file, {
          access: 'public',
          addRandomSuffix: false
        });
        
        console.log('Upload API: Successfully uploaded to Blob Storage:', url);
        return NextResponse.json({ 
          success: true,
          imagePath: url,
          environment: 'vercel',
          envInfo
        });
      } catch (blobError) {
        console.error('Upload API: Blob storage error:', {
          message: blobError.message,
          stack: blobError.stack,
          code: blobError.code
        });
        
        // In production with blob error, we need to report it clearly
        return NextResponse.json({ 
          error: 'Blob storage error', 
          details: blobError.message,
          message: 'Image upload failed. Please contact support to report this Blob storage issue.',
          envInfo
        }, { status: 500 });
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
      stack: error.stack,
      envInfo
    });
    
    return NextResponse.json(
      { 
        error: 'Error uploading file', 
        details: error.message,
        stack: error.stack,
        envInfo
      },
      { status: 500 }
    );
  }
} 