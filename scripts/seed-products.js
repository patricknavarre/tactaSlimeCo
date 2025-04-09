require('dotenv').config({ path: '.env.production' });
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function seedProducts() {
  try {
    // Read the exported products
    const exportPath = path.join(process.cwd(), 'data', 'products-export.json');
    const products = JSON.parse(fs.readFileSync(exportPath, 'utf8'));

    // Get the production API URL from environment or use default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const seedUrl = `${apiUrl}/api/seed`;
    
    console.log(`Seeding ${products.length} products to ${seedUrl}...`);

    // Send products to seed API
    const response = await fetch(seedUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ADMIN_SECRET}`
      },
      body: JSON.stringify({ products })
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

seedProducts(); 