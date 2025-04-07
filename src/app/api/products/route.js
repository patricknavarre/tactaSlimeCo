import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

// GET handler to fetch all products
export async function GET() {
  console.log('API: GET /api/products called');
  
  try {
    // Connect to the database
    const { db, error, fallbackData } = await connectToDatabase();
    
    // Check if we have a connection
    if (!db) {
      console.error('API: Database connection failed in /api/products:', error?.message || 'Unknown reason');
      
      // If we have fallback data, return it
      if (fallbackData && fallbackData.products) {
        console.log('API: Returning fallback products data');
        return NextResponse.json({ products: fallbackData.products });
      }
      
      return NextResponse.json(
        { error: 'Database connection failed', details: error?.message || 'Unknown error' },
        { status: 500 }
      );
    }
    
    // Get all products from the database
    const products = await db.collection('products').find({}).toArray();
    console.log(`API: Successfully fetched ${products.length} products`);
    console.log('API: Product image paths:', products.map(p => p.imagePath)); // Debug log
    
    // If no products found, provide fallback for testing
    if (!products || products.length === 0) {
      console.log('API: No products found in database, returning demo product');
      return NextResponse.json({
        products: [{
          _id: 'demo1',
          name: 'Demo Slime Product',
          description: 'This is a demo product when no products are in the database',
          price: 9.99,
          inventory: 10,
          imagePath: '/images/products/default-slime.jpg'
        }]
      });
    }
    
    // Return the products as JSON with the expected format
    return NextResponse.json({ products: products });
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
    
    // Convert date strings to Date objects
    const cleanData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Ensure numeric fields are properly typed
      price: parseFloat(body.price || 0),
      inventory: parseInt(body.inventory || 0, 10),
      featured: !!body.featured,
      sold_out: parseInt(body.inventory || 0, 10) <= 0
    };
    
    // Ensure both image fields are set
    if (cleanData.imagePath) {
      cleanData.image = cleanData.imagePath; // Keep both fields in sync
    } else {
      cleanData.imagePath = '/images/products/default.jpg';
      cleanData.image = '/images/products/default.jpg';
    }
    
    console.log('API: Cleaned product data:', cleanData);
    
    const result = await db.collection('products').insertOne(cleanData);
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