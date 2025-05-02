import { put } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

// This file will test a direct upload to Blob storage
// Usage: BLOB_READ_WRITE_TOKEN=your_new_token node src/scripts/test-blob-upload.js

const token = process.env.BLOB_READ_WRITE_TOKEN;

if (!token) {
  console.error('Please provide a BLOB_READ_WRITE_TOKEN as an environment variable');
  console.error('Example: BLOB_READ_WRITE_TOKEN=your_token node src/scripts/test-blob-upload.js');
  process.exit(1);
}

console.log('Using token:', token.substring(0, 5) + '...' + token.substring(token.length - 5));

async function testUpload() {
  try {
    // Path to a test image
    const testImagePath = path.join(process.cwd(), 'public', 'images', 'products', '1745787091577-bobafun_img_3900.png');
    
    console.log('Reading test image from:', testImagePath);
    const fileContent = await fs.readFile(testImagePath);
    console.log('File size:', (fileContent.length / 1024).toFixed(2), 'KB');
    
    // Upload to Blob storage
    console.log('Uploading to Blob storage...');
    const { url } = await put('test-upload.png', fileContent, {
      access: 'public',
      addRandomSuffix: true
    });
    
    console.log('Success! Image uploaded to:', url);
    console.log('Try opening this URL in your browser to verify access');
    
  } catch (error) {
    console.error('Error uploading to Blob storage:', error.message);
    console.error('Full error:', error);
  }
}

testUpload(); 