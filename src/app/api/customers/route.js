import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { createCustomerDocument } from '@/models/schemas';

// GET handler to fetch all customers
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 50;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')) : 1;
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    
    const client = await clientPromise;
    const db = client.db("tactaSlime");
    
    // Build filter based on search parameter
    const filter = {};
    if (search) {
      filter['$or'] = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { customerId: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get total count for pagination
    const totalCount = await db.collection("customers").countDocuments(filter);
    
    // Build sort object
    const sortObject = {};
    sortObject[sort] = order === 'asc' ? 1 : -1;
    
    // Fetch customers with pagination, filtering and sorting
    const customers = await db.collection("customers")
      .find(filter)
      .sort(sortObject)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    
    return NextResponse.json({ 
      success: true, 
      customers,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST handler to create a new customer
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("tactaSlime");
    
    // Parse the JSON body from the request
    const customerData = await request.json();
    
    // Check if email already exists
    if (customerData.email) {
      const existingCustomer = await db.collection("customers").findOne({ 
        email: customerData.email 
      });
      
      if (existingCustomer) {
        return NextResponse.json(
          { success: false, message: 'A customer with this email already exists' },
          { status: 400 }
        );
      }
    }
    
    // Format the data using our schema helper
    const newCustomer = createCustomerDocument(customerData);
    
    // Insert the new customer
    const result = await db.collection("customers").insertOne(newCustomer);
    
    return NextResponse.json({ 
      success: true, 
      insertedId: result.insertedId,
      customer: newCustomer
    }, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 