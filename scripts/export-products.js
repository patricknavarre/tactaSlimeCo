require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function seedToEnvironment(products, isProd = false) {
  try {
    // Use production URL if isProd is true, otherwise use local development URL
    const apiUrl = isProd ? 'https://tactaslime.com' : (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5051');
    const seedUrl = `${apiUrl}/api/seed`;
    
    console.log(`Seeding ${products.length} products to ${seedUrl}...`);

    const response = await fetch(seedUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ADMIN_SECRET}`
      },
      body: JSON.stringify({ products })
    });

    // Log the raw response for debugging
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid JSON response: ${responseText}`);
    }

    if (!response.ok) {
      throw new Error(result.error || `Failed to seed products: ${response.status} ${response.statusText}`);
    }

    console.log('Success:', result.message);
  } catch (error) {
    console.error(`Error seeding to ${isProd ? 'production' : 'development'}:`, error);
    throw error;
  }
}

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
    
    // Seed to development environment
    await seedToEnvironment(updatedProducts, false);
    
    // Ask user if they want to seed to production
    console.log('\nWould you like to seed to production (tactaslime.com)? Type "yes" to proceed:');
    process.stdin.once('data', async (data) => {
      const answer = data.toString().trim().toLowerCase();
      if (answer === 'yes') {
        try {
          await seedToEnvironment(updatedProducts, true);
        } catch (error) {
          console.error('Error seeding to production:', error);
        }
      }
      process.exit(0);
    });

  } catch (error) {
    console.error('Error in export and seed process:', error);
    process.exit(1);
  }
}

exportAndSeedProducts(); 