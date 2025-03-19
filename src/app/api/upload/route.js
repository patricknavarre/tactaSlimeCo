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
    const filename = file.name.replace(/\s+/g, '-').toLowerCase();
    
    // Create a unique filename to prevent overwrites
    const uniqueFilename = `${Date.now()}-${filename}`;
    
    // Ensure the uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'products');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
    
    const filePath = path.join(uploadDir, uniqueFilename);
    console.log('Upload API: Writing file to:', filePath);
    
    // Write the file
    await writeFile(filePath, buffer);
    
    const imagePath = `/images/products/${uniqueFilename}`;
    console.log('Upload API: File successfully saved. Returning path:', imagePath);
    
    // Return the path that can be stored in the database
    return NextResponse.json({ 
      success: true,
      imagePath: imagePath
    });
    
  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json(
      { error: 'Error uploading file', details: error.message },
      { status: 500 }
    );
  }
} 