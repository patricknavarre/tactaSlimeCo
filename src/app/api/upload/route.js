import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request) {
  try {
    console.log('Upload API: Processing file upload request');
    
    // Check if we have the blob token
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('Upload API: BLOB_READ_WRITE_TOKEN is not set');
      throw new Error('Blob storage is not properly configured');
    }

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

    console.log('Upload API: Attempting to upload file:', cleanFilename);

    // Upload to Vercel Blob Storage with explicit token
    const { url } = await put(cleanFilename, file, {
      access: 'public',
      addRandomSuffix: false, // We already add a timestamp
      token: token // Explicitly pass the token
    });

    console.log('Upload API: File uploaded successfully to Blob Storage:', url);

    // Return the URL that can be stored in the database
    return NextResponse.json({ 
      success: true,
      imagePath: url
    });
    
  } catch (error) {
    console.error('Upload API Error:', error);
    console.error('Error stack:', error.stack);
    console.error('Environment check:', {
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    });
    
    return NextResponse.json(
      { 
        error: 'Error uploading file', 
        details: error.message,
        env: process.env.NODE_ENV 
      },
      { status: 500 }
    );
  }
} 