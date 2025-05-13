import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET handler to fetch orders for the current user
export async function GET() {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    // If not authenticated, return 401
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const userEmail = session.user.email;
    console.log(`GET /api/orders/user - Fetching orders for user: ${userEmail}`);
    
    const client = await clientPromise;
    const db = client.db("tactaSlime");
    
    // Get orders from both collections for this user
    let orders = [];
    
    try {
      // Try to get orders from the validated collection
      const validatedOrders = await db.collection("orders")
        .find({ 
          $or: [
            { "customer.email": userEmail },
            { "email": userEmail }
          ]
        })
        .sort({ createdAt: -1 })
        .toArray();
      
      orders = [...validatedOrders];
      console.log(`Found ${validatedOrders.length} orders in validated collection`);
    } catch (err) {
      console.log("Could not fetch from orders collection:", err.message);
    }
    
    try {
      // Also get orders from the raw collection
      const rawOrders = await db.collection("orders_raw")
        .find({ 
          $or: [
            { "customer.email": userEmail },
            { "email": userEmail }
          ]
        })
        .sort({ createdAt: -1 })
        .toArray();
      
      // Combine both sets of orders
      orders = [...orders, ...rawOrders];
      console.log(`Found ${rawOrders.length} orders in raw collection`);
    } catch (err) {
      console.log("Could not fetch from orders_raw collection:", err.message);
    }
    
    // If no orders found, log but don't create demo orders
    if (orders.length === 0) {
      console.log(`No orders found for user: ${userEmail}`);
    }
    
    console.log(`GET /api/orders/user - Retrieved ${orders.length} orders for user: ${userEmail}`);
    return NextResponse.json({ 
      success: true, 
      orders 
    });
  } catch (error) {
    console.error("GET /api/orders/user - Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 