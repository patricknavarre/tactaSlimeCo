import { MongoClient } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'tactaSlime';

async function updateImagePaths() {
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

    // Create a map of old filenames to new filenames
    const imageMap = new Map();
    files.forEach(file => {
      // Remove timestamp prefix if it exists
      const cleanName = file.replace(/^\d+-/, '');
      imageMap.set(cleanName, file);
    });

    // Update each product's image path
    for (const product of allProducts) {
      let oldPath = product.imagePath || product.image;
      
      if (oldPath) {
        const oldFilename = path.basename(oldPath);
        const newFilename = imageMap.get(oldFilename);

        if (newFilename) {
          const newPath = `/images/products/${newFilename}`;
          if (oldPath !== newPath) {
            console.log(`Updating image path for product ${product._id}:`);
            console.log(`  Old: ${oldPath}`);
            console.log(`  New: ${newPath}`);
            
            // Update both image and imagePath fields
            await products.updateOne(
              { _id: product._id },
              { 
                $set: { 
                  imagePath: newPath,
                  image: newPath
                } 
              }
            );
          }
        } else {
          console.warn(`No matching image found for product ${product._id}: ${oldFilename}`);
          // Set a default image if none is found
          const defaultPath = '/images/products/1742428559580-icecreamparty_tactaslime_img_3238.png';
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
      } else {
        console.warn(`No image path found for product ${product._id}`);
        // Set a default image if none is found
        const defaultPath = '/images/products/1742428559580-icecreamparty_tactaslime_img_3238.png';
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

    console.log('Image path update complete');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

updateImagePaths(); 