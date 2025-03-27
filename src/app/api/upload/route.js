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

    // Log detailed environment information
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      IS_VERCEL: process.env.VERCEL,
      BLOB_TOKEN_EXISTS: !!process.env.BLOB_READ_WRITE_TOKEN,
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_REGION: process.env.VERCEL_REGION
    };
    console.log('Upload API: Environment Info:', envInfo);

    // Create a unique filename
    const timestamp = Date.now();
    const cleanFilename = `${timestamp}-${file.name
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .replace(/[^a-zA-Z0-9-_.]/g, '') // Remove special characters
      .toLowerCase()}`;                 // Convert to lowercase

    console.log('Upload API: Cleaned filename:', cleanFilename);

    // Force blob storage if we're in Vercel (either production or preview)
    if (process.env.VERCEL || process.env.VERCEL_ENV) {
      try {
        console.log('Upload API: Using Vercel Blob storage (Vercel environment detected)');
        const { url } = await blob.put(cleanFilename, file, {
          access: 'public',
          addRandomSuffix: false
        });
        console.log('Upload API: Successfully uploaded to Blob Storage:', url);
        return NextResponse.json({ 
          success: true,
          imagePath: url,
          environment: 'vercel'
        });
      } catch (blobError) {
        console.error('Upload API: Blob storage error:', blobError);
        console.error('Upload API: Blob error details:', {
          message: blobError.message,
          stack: blobError.stack,
          code: blobError.code
        });
        throw new Error(`Blob storage error: ${blobError.message}`);
      }
    }

    // Only reach here for local development
    console.log('Upload API: Using filesystem storage (local development)');
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
      imagePath: imagePath,
      environment: 'local'
    });
    
  } catch (error) {
    console.error('Upload API Error:', error);
    console.error('Error stack:', error.stack);
    console.error('Environment:', {
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      isVercel: process.env.VERCEL,
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      vercelUrl: process.env.VERCEL_URL,
      vercelRegion: process.env.VERCEL_REGION
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
          hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
          vercelUrl: process.env.VERCEL_URL,
          vercelRegion: process.env.VERCEL_REGION
        }
      },
      { status: 500 }
    );
  }
} 