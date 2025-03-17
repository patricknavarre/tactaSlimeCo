import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

// GET handler to fetch all products
export async function GET() {
  console.log('API: GET /api/products called');
  
  try {
    // Connect to the database
    const { db, error } = await connectToDatabase();
    
    // Check if we have a connection
    if (!db) {
      console.error('API: Database connection failed in /api/products:', error?.message || 'Unknown reason');
      return NextResponse.json(
        { error: 'Database connection failed', details: error?.message || 'Unknown error' },
        { status: 500 }
      );
    }
    
    // Get all products from the database
    const products = await db.collection('products').find({}).toArray();
    console.log(`API: Successfully fetched ${products.length} products`);
    
    // Return the products as JSON
    return NextResponse.json(products);
  } catch (error) {
    console.error('API: Error in /api/products:', error.message);
    // Ensure we return a proper JSON response even in error cases
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    );
  }
}

// POST handler to add a new product
export async function POST(request) {
  console.log('API: POST /api/products called');
  
  try {
    const { db, error } = await connectToDatabase();
    
    if (!db) {
      console.error('API: Database connection failed in POST /api/products:', error?.message || 'Unknown reason');
      return NextResponse.json(
        { error: 'Database connection failed', details: error?.message || 'Unknown error' },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    console.log('API: Product data received:', body);
    
    const result = await db.collection('products').insertOne(body);
    console.log('API: Product created with ID:', result.insertedId);
    
    return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('API: Error in POST /api/products:', error.message);
    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    );
  }
} 