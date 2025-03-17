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
    
    // Check if there's MongoDB validation on the collection
    try {
      const collInfo = await db.listCollections({ name: "orders" }).toArray();
      if (collInfo.length > 0) {
        console.log("POST /api/orders - Collection info:", JSON.stringify(collInfo[0], null, 2));
      }
    } catch (err) {
      console.log("POST /api/orders - Could not retrieve collection info:", err.message);
    }
    
    // Format the data using our schema helper
    const newOrder = createOrderDocument(orderData);
    console.log("POST /api/orders - Formatted order document:", JSON.stringify(newOrder, null, 2));
    
    // Fix common issues that might cause validation failures
    if (!newOrder.createdAt) newOrder.createdAt = new Date();
    if (!newOrder.updatedAt) newOrder.updatedAt = new Date();
    
    // Ensure items array has required fields
    if (Array.isArray(newOrder.items)) {
      newOrder.items = newOrder.items.map(item => ({
        productId: item.productId || item._id || `prod_${Math.random().toString(36).substring(2, 10)}`,
        name: item.name || "Product",
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1,
        total: parseFloat(item.total) || parseFloat(item.price * item.quantity) || 0
      }));
    }
    
    // Ensure proper types for numeric fields
    newOrder.total = parseFloat(newOrder.total) || 0;
    newOrder.subtotal = parseFloat(newOrder.subtotal) || 0;
    newOrder.tax = parseFloat(newOrder.tax) || 0;
    newOrder.shipping = parseFloat(newOrder.shipping) || 0;
    
    // Try to insert without validation first to see if it works
    try {
      // Insert the new order
      const result = await db.collection("orders").insertOne(newOrder);
      console.log(`POST /api/orders - Order inserted with ID: ${result.insertedId}`);
      
      return NextResponse.json({ 
        success: true, 
        insertedId: result.insertedId,
        order: newOrder
      }, { status: 201 });
    } catch (insertError) {
      console.error("POST /api/orders - Insert error:", insertError);

      // Add more diagnostic info to the error message
      return NextResponse.json(
        { 
          success: false, 
          message: 'Document failed validation',
          details: insertError.message,
          errorCode: insertError.code,
          document: newOrder 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("POST /api/orders - Database error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 