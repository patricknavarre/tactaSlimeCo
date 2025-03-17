// Script to sync CMS products to MongoDB
import clientPromise from '../lib/mongodb';

// Sample product data from the CMS
const productsData = [
  {
    name: "Bubblegum Cloud Slime",
    description: "A fluffy cloud slime with bubblegum scent that feels like you're touching a cloud!",
    price: 14.99,
    inventory: 42,
    category: "Cloud Slime",
    featured: true,
    imagePath: "/images/products/cloud-slime-bubblegum.jpg"
  },
  {
    name: "Butter Slime - Strawberry",
    description: "Soft and spreadable butter slime with a delightful strawberry scent.",
    price: 12.99,
    inventory: 28,
    category: "Butter Slime",
    featured: true,
    imagePath: "/images/products/butter-slime-strawberry.jpg"
  },
  {
    name: "Glitter Galaxy Slime",
    description: "Sparkly slime filled with glitter that resembles a galaxy of stars.",
    price: 15.99,
    inventory: 16,
    category: "Glitter Slime",
    featured: true,
    imagePath: "/images/products/glitter-galaxy-slime.jpg"
  },
  {
    name: "Crunchy Rainbow Slime",
    description: "Multi-colored slime with crunchy beads for a satisfying texture.",
    price: 13.99,
    inventory: 34,
    category: "Crunchy Slime",
    featured: false,
    imagePath: "/images/products/crunchy-rainbow-slime.jpg"
  },
  {
    name: "Clear Slime - Ocean Breeze",
    description: "Crystal clear slime with a refreshing ocean breeze scent.",
    price: 11.99,
    inventory: 22,
    category: "Clear Slime",
    featured: false,
    imagePath: "/images/products/clear-slime-ocean.jpg"
  },
  {
    name: "Foam Slime - Cotton Candy",
    description: "Fluffy foam slime with sweet cotton candy fragrance.",
    price: 12.99,
    inventory: 19,
    category: "Foam Slime",
    featured: false,
    imagePath: "/images/products/foam-slime-cotton-candy.jpg"
  }
];

async function syncProducts() {
  try {
    console.log("Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("tactaSlime");
    
    // Clear existing products collection
    console.log("Clearing existing products...");
    await db.collection("products").deleteMany({});
    
    // Add timestamp to each product
    const productsWithTimestamp = productsData.map(product => ({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Insert all products
    console.log("Inserting products...");
    const result = await db.collection("products").insertMany(productsWithTimestamp);
    
    console.log(`Successfully added ${result.insertedCount} products to database!`);
    
    return result;
  } catch (error) {
    console.error("Error syncing products:", error);
    throw error;
  }
}

// Execute the sync function
syncProducts()
  .then(() => {
    console.log("Product sync complete!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Product sync failed:", err);
    process.exit(1);
  }); 