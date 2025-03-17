import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET handler to fetch a single customer by ID
export async function GET(request, { params }) {
  try {
    const id = params.id;
    
    const client = await clientPromise;
    const db = client.db("tactaSlime");
    
    // Determine if we're looking up by MongoDB ID or customerId
    let customer;
    if (ObjectId.isValid(id)) {
      customer = await db.collection("customers").findOne({
        _id: new ObjectId(id)
      });
    }
    
    if (!customer) {
      // Try looking up by customerId if not found by _id
      customer = await db.collection("customers").findOne({
        customerId: id
      });
    }
    
    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      customer 
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PATCH handler to update a customer by ID
export async function PATCH(request, { params }) {
  try {
    const id = params.id;
    
    // Parse the update data from the request
    const updateData = await request.json();
    
    // Validate and prepare update data
    const cleanedData = { ...updateData };
    delete cleanedData._id; // Prevent attempts to modify the immutable _id field
    
    // Add updatedAt timestamp
    cleanedData.updatedAt = new Date();
    
    const client = await clientPromise;
    const db = client.db("tactaSlime");
    
    // Find and update the customer
    let filter;
    if (ObjectId.isValid(id)) {
      filter = { _id: new ObjectId(id) };
    } else {
      filter = { customerId: id };
    }
    
    const result = await db.collection("customers").updateOne(
      filter,
      { $set: cleanedData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }
    
    // Get the updated customer
    const updatedCustomer = await db.collection("customers").findOne(filter);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Customer updated successfully',
      customer: updatedCustomer
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a customer by ID
export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    
    const client = await clientPromise;
    const db = client.db("tactaSlime");
    
    // Determine if we're deleting by MongoDB ID or customerId
    let filter;
    if (ObjectId.isValid(id)) {
      filter = { _id: new ObjectId(id) };
    } else {
      filter = { customerId: id };
    }
    
    // Delete the customer
    const result = await db.collection("customers").deleteOne(filter);
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Customer not found or already deleted' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 