require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');

async function exportProducts() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    const client = new MongoClient(uri);
    
    await client.connect();
    const db = client.db('tactaSlime');
    
    // Get all products
    const products = await db.collection('products').find({}).toArray();
    
    // Format products for seed API
    const formattedProducts = products.map(product => ({
      name: product.name,
      description: product.description,
      price: product.price,
      inventory: product.inventory,
      category: product.category,
      featured: product.featured,
      imagePath: product.imagePath,
      images: product.images || [{
        url: product.imagePath,
        alt: product.name
      }],
      video: product.video,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Save to a file
    const exportDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    const exportPath = path.join(exportDir, 'products-export.json');
    fs.writeFileSync(exportPath, JSON.stringify(formattedProducts, null, 2));
    
    console.log(`Exported ${formattedProducts.length} products to ${exportPath}`);
    
    await client.close();
    
  } catch (error) {
    console.error('Error exporting products:', error);
    process.exit(1);
  }
}

exportProducts(); 