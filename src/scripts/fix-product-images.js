import { MongoClient } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'tactaSlime';

async function fixProductImages() {
  if (!MONGODB_URI) {
    console.error('Please set MONGODB_URI in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const products = db.collection('products');

    // Get all products
    const allProducts = await products.find({}).toArray();
    console.log(`Found ${allProducts.length} products`);

    // Get list of actual image files
    const productsDir = path.join(process.cwd(), 'public', 'images', 'products');
    const files = await fs.readdir(productsDir);
    console.log(`Found ${files.length} image files`);

    // Create a map of filenames to full paths
    const imageMap = new Map();
    files.forEach(file => {
      imageMap.set(file, `/images/products/${file}`);
    });

    // Update each product's image path
    for (const product of allProducts) {
      // Find the most recent image file for this product
      const productImages = Array.from(imageMap.entries())
        .filter(([filename]) => filename.includes(product.name.toLowerCase().replace(/\s+/g, '')))
        .sort((a, b) => b[0].localeCompare(a[0])); // Sort by filename (most recent first)

      if (productImages.length > 0) {
        const newPath = productImages[0][1];
        console.log(`Updating image path for product ${product.name}:`);
        console.log(`  Old: ${product.imagePath}`);
        console.log(`  New: ${newPath}`);
        
        await products.updateOne(
          { _id: product._id },
          { 
            $set: { 
              imagePath: newPath,
              image: newPath
            } 
          }
        );
      } else {
        // If no matching image found, use a default image
        const defaultPath = '/images/products/1742428559580-icecreamparty_tactaslime_img_3238.png';
        console.log(`No matching image found for product ${product.name}, using default image`);
        
        await products.updateOne(
          { _id: product._id },
          { 
            $set: { 
              imagePath: defaultPath,
              image: defaultPath
            } 
          }
        );
      }
    }

    console.log('Product image paths update complete');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixProductImages(); 