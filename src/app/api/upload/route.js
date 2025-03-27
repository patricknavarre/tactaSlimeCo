import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import * as blob from '@vercel/blob';

export async function POST(request) {
  try {
    console.log('Upload API: Processing file upload request');
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      console.error('Upload API: No file provided in request');
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    console.log('Upload API: File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Create a unique filename
    const timestamp = Date.now();
    const cleanFilename = `${timestamp}-${file.name
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .replace(/[^a-zA-Z0-9-_.]/g, '') // Remove special characters
      .toLowerCase()}`;                 // Convert to lowercase

    // Log environment information
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      IS_VERCEL: process.env.VERCEL,
      BLOB_TOKEN_EXISTS: !!process.env.BLOB_READ_WRITE_TOKEN
    };
    console.log('Upload API: Environment Info:', envInfo);

    // Always try Vercel Blob storage first in production
    if (process.env.NODE_ENV === 'production') {
      try {
        console.log('Upload API: Using Vercel Blob storage (production environment)');
        const { url } = await blob.put(cleanFilename, file, {
          access: 'public',
          addRandomSuffix: false
        });
        console.log('Upload API: File uploaded to Blob Storage:', url);
        return NextResponse.json({ 
          success: true,
          imagePath: url
        });
      } catch (blobError) {
        console.error('Upload API: Blob storage error:', blobError);
        throw new Error(`Blob storage error: ${blobError.message}`);
      }
    }

    // Only use filesystem storage in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Upload API: Using filesystem storage (development environment)');
      const buffer = Buffer.from(await file.arrayBuffer());
      const publicDir = path.join(process.cwd(), 'public');
      const uploadDir = path.join(publicDir, 'images', 'products');
      
      console.log('Upload API: Creating upload directory:', uploadDir);
      await mkdir(uploadDir, { recursive: true });
      
      const filePath = path.join(uploadDir, cleanFilename);
      console.log('Upload API: Writing file to:', filePath);
      
      await writeFile(filePath, buffer);
      const imagePath = `/images/products/${cleanFilename}`;
      console.log('Upload API: File saved to filesystem:', imagePath);
      
      return NextResponse.json({ 
        success: true,
        imagePath: imagePath
      });
    }

    // If we get here, something is wrong with the environment
    throw new Error(`Invalid environment: ${process.env.NODE_ENV}. Expected 'development' or 'production'`);
    
  } catch (error) {
    console.error('Upload API Error:', error);
    console.error('Error stack:', error.stack);
    console.error('Environment:', {
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      isVercel: process.env.VERCEL,
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN
    });
    
    return NextResponse.json(
      { 
        error: 'Error uploading file', 
        details: error.message,
        env: process.env.NODE_ENV,
        envInfo: {
          nodeEnv: process.env.NODE_ENV,
          vercelEnv: process.env.VERCEL_ENV,
          isVercel: process.env.VERCEL,
          hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN
        }
      },
      { status: 500 }
    );
  }
} 