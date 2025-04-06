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
    description: "A mesmerizing slime filled with sparkly glitter that shimmers like the night sky.",
    price: 12.99,
    inventory: 50,
    category: "Glitter Slime",
    featured: true,
    imagePath: "/images/products/1742428559580-icecreamparty_tactaslime_img_3238.png"
  },
  {
    name: "Crunchy Rainbow Slime",
    description: "A satisfyingly crunchy slime with rainbow-colored beads.",
    price: 14.99,
    inventory: 30,
    category: "Crunchy Slime",
    featured: true,
    imagePath: "/images/products/1742428398750-oops_gameover_tactaslime_img_3234.png"
  },
  {
    name: "Clear Ocean Slime",
    description: "A crystal clear slime with ocean-themed glitter and charms.",
    price: 13.99,
    inventory: 40,
    category: "Clear Slime",
    featured: true,
    imagePath: "/images/products/1742427971497-icecreamparty_tactaslime_img_3220.png"
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