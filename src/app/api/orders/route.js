import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { createOrderDocument } from '@/models/schemas';

// GET handler to fetch all orders
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("tactaSlime");
    
    // Get all orders, sorted by date descending (newest first)
    const orders = await db.collection("orders")
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json({ 
      success: true, 
      orders 
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST handler to create a new order
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("tactaSlime");
    
    // Parse the JSON body from the request
    const orderData = await request.json();
    
    // Format the data using our schema helper
    const newOrder = createOrderDocument(orderData);
    
    // Insert the new order
    const result = await db.collection("orders").insertOne(newOrder);
    
    return NextResponse.json({ 
      success: true, 
      insertedId: result.insertedId,
      order: newOrder
    }, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 