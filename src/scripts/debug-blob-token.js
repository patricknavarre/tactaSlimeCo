import dotenv from 'dotenv';
import * as blob from '@vercel/blob';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

console.log('Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('BLOB_READ_WRITE_TOKEN exists:', !!process.env.BLOB_READ_WRITE_TOKEN);
console.log('BLOB_READ_WRITE_TOKEN length:', process.env.BLOB_READ_WRITE_TOKEN?.length);
console.log('Token starts with:', process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 5));
console.log('Token ends with:', process.env.BLOB_READ_WRITE_TOKEN?.substring(process.env.BLOB_READ_WRITE_TOKEN?.length - 5));

// Remove quotes if they exist
const cleanToken = process.env.BLOB_READ_WRITE_TOKEN?.replace(/"/g, '');
console.log('Clean token length:', cleanToken?.length);
console.log('Clean token starts with:', cleanToken?.substring(0, 5));

async function testBlobAccess() {
  try {
    // Try to list blobs
    console.log('\nAttempting to access Blob Storage...');
    
    // Get the blob token directly
    process.env.BLOB_READ_WRITE_TOKEN = cleanToken;
    
    const list = await blob.list();
    console.log('Success! Found', list.blobs.length, 'blobs');
    
    // List the first few blobs
    if (list.blobs.length > 0) {
      console.log('\nFirst few blobs:');
      for (let i = 0; i < Math.min(3, list.blobs.length); i++) {
        console.log(` - ${list.blobs[i].url}`);
      }
    }
  } catch (error) {
    console.error('Error accessing Blob Storage:', error.message);
  }
}

testBlobAccess(); 