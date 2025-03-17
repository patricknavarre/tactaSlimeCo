import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Sample product data
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

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("tactaSlime");
    
    // Get authorization header from request 
    const authHeader = request.headers.get('authorization');
    
    // Simple security check - require a token
    if (!authHeader || authHeader !== `Bearer ${process.env.SEED_API_KEY || 'tacta-secure-key'}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Clear existing products
    await db.collection("products").deleteMany({});
    
    // Add timestamp to products
    const productsWithTimestamp = productsData.map(product => ({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Insert products
    const result = await db.collection("products").insertMany(productsWithTimestamp);
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully added ${result.insertedCount} products`,
      products: productsWithTimestamp
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 