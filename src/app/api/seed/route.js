import { NextResponse } from 'next/server';
import clientPromise, { connectToDatabase } from '@/lib/mongodb';

// Sample product data
const productsData = [
  {
    name: "Ice Cream Party Slime",
    description: "A delightful slime that looks and feels like ice cream!",
    price: 14.99,
    inventory: 42,
    category: "Cloud Slime",
    featured: true,
    imagePath: "/images/products/1742428559580-icecreamparty_tactaslime_img_3238.png",
    images: [{
      url: "/images/products/1742428559580-icecreamparty_tactaslime_img_3238.png",
      alt: "Ice Cream Party Slime"
    }]
  },
  {
    name: "Game Over Slime",
    description: "A fun gaming-themed slime with amazing texture!",
    price: 12.99,
    inventory: 28,
    category: "Butter Slime",
    featured: true,
    imagePath: "/images/products/1742428398750-oops_gameover_tactaslime_img_3234.png",
    images: [{
      url: "/images/products/1742428398750-oops_gameover_tactaslime_img_3234.png",
      alt: "Game Over Slime"
    }]
  },
  {
    name: "Ice Cream Party Slime - Classic",
    description: "The classic version of our popular Ice Cream Party Slime!",
    price: 15.99,
    inventory: 16,
    category: "Cloud Slime",
    featured: true,
    imagePath: "/images/products/1742427971497-icecreamparty_tactaslime_img_3220.png",
    images: [{
      url: "/images/products/1742427971497-icecreamparty_tactaslime_img_3220.png",
      alt: "Ice Cream Party Slime - Classic"
    }]
  },
  {
    name: "Game Over Slime - Limited Edition",
    description: "A special edition of our popular gaming-themed slime!",
    price: 15.99,
    inventory: 16,
    category: "Butter Slime",
    featured: true,
    imagePath: "/images/products/1742428232814-oops_gameover_tactaslime_img_3234.png",
    images: [{
      url: "/images/products/1742428232814-oops_gameover_tactaslime_img_3234.png",
      alt: "Game Over Slime - Limited Edition"
    }]
  },
  {
    name: "Ice Cream Party Slime - Party Pack",
    description: "Perfect for parties! A larger size of our Ice Cream Party Slime.",
    price: 19.99,
    inventory: 34,
    category: "Cloud Slime",
    featured: false,
    imagePath: "/images/products/1742427916349-icecreamparty_tactaslime_img_3220.png",
    images: [{
      url: "/images/products/1742427916349-icecreamparty_tactaslime_img_3220.png",
      alt: "Ice Cream Party Slime - Party Pack"
    }]
  },
  {
    name: "Game Over Slime - Collector's Edition",
    description: "A special collector's edition of our gaming-themed slime.",
    price: 18.99,
    inventory: 22,
    category: "Butter Slime",
    featured: false,
    imagePath: "/images/products/1742428173172-oops_gameover_tactaslime_img_3234.png",
    images: [{
      url: "/images/products/1742428173172-oops_gameover_tactaslime_img_3234.png",
      alt: "Game Over Slime - Collector's Edition"
    }]
  }
];

export async function GET(request) {
  // Skip execution during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('Build phase detected, skipping database operations in /api/seed');
    return NextResponse.json({ 
      success: true, 
      message: `Build phase - seed API skipped`,
    });
  }
  
  try {
    const { client, db } = await connectToDatabase();
    
    // Check if we're in build mode and handle it gracefully
    if (!client || !db) {
      console.log('Database connection not available, skipping seed operation');
      return NextResponse.json({ 
        success: false, 
        message: `Database connection not available during build`,
      }, { status: 503 });
    }
    
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