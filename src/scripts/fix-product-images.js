import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'tactaSlime';

// Manual mapping of products to images
const productImageMap = {
  'Ice Cream Party': '/images/products/1742428559580-icecreamparty_tactaslime_img_3238.png',
  'Oops - Game Over': '/images/products/1742428398750-oops_gameover_tactaslime_img_3234.png',
  'Citrus Storm': '/images/products/1742427971497-icecreamparty_tactaslime_img_3220.png',
  'Boba Fun Slime': '/images/products/1742428232814-oops_gameover_tactaslime_img_3234.png',
  'Skincare Sundays Slime': '/images/products/1742427916349-icecreamparty_tactaslime_img_3220.png',
  'Clear Slime - Ocean Breeze': '/images/products/1742428173172-oops_gameover_tactaslime_img_3234.png'
};

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

    // Update each product's image path
    for (const product of allProducts) {
      const imagePath = productImageMap[product.name];
      
      if (imagePath) {
        console.log(`Updating image path for product ${product.name}:`);
        console.log(`  Old: ${product.imagePath}`);
        console.log(`  New: ${imagePath}`);
        
        await products.updateOne(
          { _id: product._id },
          { 
            $set: { 
              imagePath: imagePath,
              image: imagePath
            } 
          }
        );
      } else {
        console.warn(`No image mapping found for product ${product.name}`);
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