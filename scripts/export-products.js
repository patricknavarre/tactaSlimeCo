require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function exportAndSeedProducts() {
  try {
    // Read the exported products
    const exportPath = path.join(process.cwd(), 'data', 'products-export.json');
    const products = JSON.parse(fs.readFileSync(exportPath, 'utf8'));

    // Ensure image paths are properly synced
    const updatedProducts = products.map(product => ({
      ...product,
      images: [{
        url: product.imagePath,
        alt: product.name
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Save updated products back to file
    fs.writeFileSync(exportPath, JSON.stringify(updatedProducts, null, 2));
    
    // Get the production API URL from environment or use default
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5051';
    const seedUrl = `${apiUrl}/api/seed`;
    
    console.log(`Seeding ${updatedProducts.length} products to ${seedUrl}...`);

    // Send products to seed API
    const response = await fetch(seedUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ADMIN_SECRET}`
      },
      body: JSON.stringify({ products: updatedProducts })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to seed products');
    }

    console.log('Success:', result.message);

  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

exportAndSeedProducts(); 