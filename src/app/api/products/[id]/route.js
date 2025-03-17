import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET handler to fetch a single product by ID
export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    const client = await clientPromise;
    const db = client.db("tactaSlime");
    
    let product;
    
    // Try to find by MongoDB ObjectId first
    if (ObjectId.isValid(id)) {
      product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    }
    
    // If not found by ObjectId, try to find by a custom id field (if you're using one)
    if (!product) {
      product = await db.collection("products").findOne({ id: id });
    }
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        message: "Product not found" 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      product 
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a product
export async function DELETE(request, { params }) {
  const { id } = params;
  
  try {
    const client = await clientPromise;
    const db = client.db("tactaSlime");
    
    let result;
    if (ObjectId.isValid(id)) {
      result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });
    } else {
      result = await db.collection("products").deleteOne({ id: id });
    }
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Product not found or already deleted" 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Product deleted successfully" 
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PATCH handler to update a product
export async function PATCH(request, { params }) {
  const { id } = params;
  
  try {
    const client = await clientPromise;
    const db = client.db("tactaSlime");
    const updateData = await request.json();
    
    // Debug the incoming data
    console.log("Received update data:", JSON.stringify(updateData));
    
    // Create a basic structure of a product with only the required fields
    const safeUpdate = {
      updatedAt: new Date()
    };
    
    // Add fields only if they are provided in the update
    if (updateData.name !== undefined) safeUpdate.name = updateData.name;
    if (updateData.description !== undefined) safeUpdate.description = updateData.description;
    if (updateData.category !== undefined) safeUpdate.category = updateData.category;
    if (updateData.featured !== undefined) safeUpdate.featured = !!updateData.featured;
    if (updateData.imagePath !== undefined) safeUpdate.imagePath = updateData.imagePath;
    
    // Handle numeric fields carefully
    if (updateData.inventory !== undefined) {
      safeUpdate.inventory = parseInt(updateData.inventory, 10);
      if (isNaN(safeUpdate.inventory)) safeUpdate.inventory = 0;
      safeUpdate.sold_out = safeUpdate.inventory <= 0;
    }
    
    if (updateData.price !== undefined) {
      safeUpdate.price = parseFloat(updateData.price);
      if (isNaN(safeUpdate.price)) safeUpdate.price = 0;
    }
    
    console.log("Safe data for update:", JSON.stringify(safeUpdate));
    
    // Try to update by MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid product ID format" 
      }, { status: 400 });
    }
    
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: safeUpdate }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Product not found" 
      }, { status: 404 });
    }
    
    // Fetch and return the updated product
    const updatedProduct = await db.collection("products").findOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ 
      success: true, 
      product: updatedProduct
    });
  } catch (error) {
    console.error("Database error:", error);
    // Return more detailed error information
    return NextResponse.json(
      { 
        success: false, 
        message: error.message,
        details: error.code ? `MongoDB error code: ${error.code}` : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 