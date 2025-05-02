import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Get base URL for the current environment
function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export async function POST(request) {
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    IS_VERCEL: process.env.VERCEL,
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

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create a unique filename
    const timestamp = Date.now();
    const cleanFilename = `${timestamp}-${file.name
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .replace(/[^a-zA-Z0-9-_.]/g, '') // Remove special characters
      .toLowerCase()}`;                 // Convert to lowercase

    console.log('Upload API: Cleaned filename:', cleanFilename);

    // Check if in production environment
    const isProduction = process.env.VERCEL || process.env.VERCEL_ENV;
    
    if (isProduction) {
      // In production, we don't write to the filesystem directly
      // Instead, we return a path that will work after deployment
      console.log('Upload API: Production environment detected');
      
      // Return path to the image that would be at this location when deployed
      const imagePath = `/images/products/${cleanFilename}`;
      console.log('Upload API: Generated image path for production:', imagePath);
      
      return NextResponse.json({ 
        success: true,
        imagePath: imagePath,
        environment: 'vercel',
        message: 'Production mode: Using static image path',
        note: 'In production, upload image manually then rebuild/redeploy',
        envInfo
      });
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