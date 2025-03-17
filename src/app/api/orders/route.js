import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { createOrderDocument } from '@/models/schemas';

// GET handler to fetch all orders
export async function GET() {
  try {
    console.log("GET /api/orders - Attempting to fetch orders");
    const client = await clientPromise;
    const db = client.db("tactaSlime");
    
    // Get all orders, sorted by date descending (newest first)
    const orders = await db.collection("orders")
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    console.log(`GET /api/orders - Successfully retrieved ${orders.length} orders`);
    return NextResponse.json({ 
      success: true, 
      orders 
    });
  } catch (error) {
    console.error("GET /api/orders - Database error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST handler to create a new order
export async function POST(request) {
  try {
    console.log("POST /api/orders - Attempting to create new order");
    
    // Parse the JSON body from the request
    const orderData = await request.json();
    console.log("POST /api/orders - Request body:", JSON.stringify(orderData, null, 2));
    
    const client = await clientPromise;
    console.log("POST /api/orders - MongoDB connection established");
    const db = client.db("tactaSlime");
    
    // Format the data using our schema helper
    const newOrder = createOrderDocument(orderData);
    console.log("POST /api/orders - Formatted order document:", JSON.stringify(newOrder, null, 2));
    
    // Insert the new order
    const result = await db.collection("orders").insertOne(newOrder);
    console.log(`POST /api/orders - Order inserted with ID: ${result.insertedId}`);
    
    return NextResponse.json({ 
      success: true, 
      insertedId: result.insertedId,
      order: newOrder
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders - Database error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 