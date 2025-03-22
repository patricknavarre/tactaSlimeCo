import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Add timestamp to filename to make it unique
    const timestamp = Date.now();
    const cleanFilename = `${timestamp}-${file.name
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .replace(/[^a-zA-Z0-9-_.]/g, '') // Remove special characters
      .toLowerCase()}`;                 // Convert to lowercase
    
    // Get the absolute path to the public directory
    const publicDir = path.join(process.cwd(), 'public');
    const uploadDir = path.join(publicDir, 'images', 'products');
    
    console.log('Upload API: Public directory:', publicDir);
    console.log('Upload API: Upload directory:', uploadDir);
    
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
    
    // Write the file
    await writeFile(filePath, buffer);
    console.log('Upload API: File written successfully');
    
    const imagePath = `/images/products/${cleanFilename}`;
    console.log('Upload API: File successfully saved. Returning path:', imagePath);
    
    // Return the path that can be stored in the database
    return NextResponse.json({ 
      success: true,
      imagePath: imagePath
    });
    
  } catch (error) {
    console.error('Upload API Error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Error uploading file', details: error.message },
      { status: 500 }
    );
  }
} 