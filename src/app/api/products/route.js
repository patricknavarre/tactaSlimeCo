import { NextResponse } from 'next/server';
import clientPromise, { connectToDatabase } from '@/lib/mongodb';
import { createProductDocument } from '@/models/schemas';

// GET handler to fetch all products
export async function GET() {
  try {
    // Use the connectToDatabase function which handles potential issues
    const { client, db } = await connectToDatabase();
    
    // Handle the case where db is null
    if (!db) {
      console.error("Database connection failed");
      return NextResponse.json(
        { success: false, message: "Failed to connect to database. Please check your MongoDB configuration." },
        { status: 500 }
      );
    }
    
    // Get all products
    const products = await db.collection("products").find({}).toArray();
    
    return NextResponse.json({ 
      success: true, 
      products 
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST handler to add a new product
export async function POST(request) {
  try {
    // Use the connectToDatabase function which handles potential issues
    const { client, db } = await connectToDatabase();
    
    // Handle the case where db is null
    if (!db) {
      console.error("Database connection failed");
      return NextResponse.json(
        { success: false, message: "Failed to connect to database. Please check your MongoDB configuration." },
        { status: 500 }
      );
    }
    
    // Parse the JSON body from the request
    const productData = await request.json();
    
    console.log("Received product data:", JSON.stringify(productData));
    
    // Create a clean product object with required fields
    const newProduct = {
      name: productData.name || '',
      description: productData.description || '',
      price: parseFloat(productData.price || 0),
      inventory: parseInt(productData.inventory || 0, 10),
      category: productData.category || 'Uncategorized',
      featured: !!productData.featured,
      imagePath: productData.imagePath || '/images/products/default.jpg',
      sold_out: parseInt(productData.inventory || 0, 10) <= 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log("Cleaned product data:", JSON.stringify(newProduct));
    
    // Insert the new product
    const result = await db.collection("products").insertOne(newProduct);
    
    return NextResponse.json({ 
      success: true, 
      insertedId: result.insertedId,
      product: newProduct
    }, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 