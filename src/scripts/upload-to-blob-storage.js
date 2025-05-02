import { put } from '@vercel/blob';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { MongoClient } from 'mongodb';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'tactaSlime';

async function uploadToBlobStorage() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('Error: BLOB_READ_WRITE_TOKEN environment variable is not set');
    console.log('Please set it in your .env.local file or run:');
    console.log('  npx vercel env add BLOB_READ_WRITE_TOKEN');
    process.exit(1);
  }

  if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI environment variable is not set');
    console.log('Please set it in your .env.local file');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(DB_NAME);
    const products = db.collection('products');

    // Get all products
    const allProducts = await products.find({}).toArray();
    console.log(`Found ${allProducts.length} products`);

    // Get list of image files
    const productsDir = path.join(process.cwd(), 'public', 'images', 'products');
    const files = await fs.readdir(productsDir);
    console.log(`Found ${files.length} image files in ${productsDir}`);

    // Upload each file and update the database
    console.log('Starting uploads to Vercel Blob Storage...');
    
    for (const file of files) {
      const filePath = path.join(productsDir, file);
      const fileStats = await fs.stat(filePath);
      
      if (!fileStats.isFile()) {
        console.log(`Skipping non-file: ${file}`);
        continue;
      }
      
      console.log(`Processing ${file} (${(fileStats.size / 1024).toFixed(2)} KB)`);
      
      try {
        // Read the file
        const fileContent = await fs.readFile(filePath);
        
        // Upload to Vercel Blob Storage
        const { url } = await put(file, fileContent, {
          access: 'public',
          addRandomSuffix: false,
          contentType: getContentType(file)
        });
        
        console.log(`  ✓ Uploaded to ${url}`);
        
        // Find products using this image path
        const localPath = `/images/products/${file}`;
        const productsToUpdate = allProducts.filter(p => 
          p.imagePath === localPath || p.image === localPath
        );
        
        if (productsToUpdate.length > 0) {
          console.log(`  ✓ Updating ${productsToUpdate.length} products with new URL`);
          
          // Update products with the new URL
          for (const product of productsToUpdate) {
            await products.updateOne(
              { _id: product._id },
              { 
                $set: { 
                  imagePath: url,
                  image: url
                } 
              }
            );
            console.log(`    - Updated ${product.name}`);
          }
        } else {
          console.log(`  ⚠ No products found using this image path: ${localPath}`);
        }
      } catch (error) {
        console.error(`  ✗ Error uploading ${file}:`, error.message);
      }
    }
    
    console.log('Upload to Blob Storage complete');
    await client.close();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Helper to determine content type based on file extension
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    case '.webp': return 'image/webp';
    default: return 'application/octet-stream';
  }
}

uploadToBlobStorage(); 