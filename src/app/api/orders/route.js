import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { createOrderDocument } from '@/models/schemas';

// GET handler to fetch all orders
export async function GET() {
  try {
    console.log("GET /api/orders - Attempting to fetch orders");
    const client = await clientPromise;
    const db = client.db("tactaSlime");
    
    // Get all orders from both collections
    let orders = [];
    
    try {
      // Try to get orders from the validated collection
      const validatedOrders = await db.collection("orders")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      orders = [...validatedOrders];
    } catch (err) {
      console.log("Could not fetch from orders collection:", err.message);
    }
    
    try {
      // Also get orders from the raw collection
      const rawOrders = await db.collection("orders_raw")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      // Combine both sets of orders
      orders = [...orders, ...rawOrders];
    } catch (err) {
      console.log("Could not fetch from orders_raw collection:", err.message);
    }
    
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
    
    // First, try the simplified approach with minimal processing
    try {
      // Add timestamps
      const rawOrder = {
        ...orderData,
        timestamp: new Date(),
        raw: true // Mark this as a raw order
      };
      
      console.log("POST /api/orders - Trying to insert raw order to orders_raw collection");
      
      // Insert to a collection without validation
      const result = await db.collection("orders_raw").insertOne(rawOrder);
      console.log(`POST /api/orders - Raw order inserted with ID: ${result.insertedId}`);
      
      return NextResponse.json({ 
        success: true, 
        insertedId: result.insertedId,
        order: rawOrder,
        collection: "orders_raw"
      }, { status: 201 });
    } catch (rawError) {
      console.error("POST /api/orders - Raw insert failed:", rawError);
      
      // If the raw insert failed, try the original method with more validation
      try {
        // Check if there's MongoDB validation on the collection
        const collInfo = await db.listCollections({ name: "orders" }).toArray();
        if (collInfo.length > 0) {
          console.log("POST /api/orders - Collection info:", JSON.stringify(collInfo[0], null, 2));
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
        
        // Try to insert with validation
        const result = await db.collection("orders").insertOne(newOrder);
        console.log(`POST /api/orders - Order inserted with ID: ${result.insertedId}`);
        
        return NextResponse.json({ 
          success: true, 
          insertedId: result.insertedId,
          order: newOrder,
          collection: "orders"
        }, { status: 201 });
      } catch (insertError) {
        console.error("POST /api/orders - Both insert methods failed:", insertError);
        
        // Return the original raw error
        return NextResponse.json(
          { 
            success: false, 
            message: 'Both insert methods failed',
            rawError: rawError.message,
            validationError: insertError?.message,
            errorCode: rawError.code || insertError?.code,
            document: orderData
          },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("POST /api/orders - Database error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 