import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    console.log("API route: Testing MongoDB connection...");
    
    // Try to connect to the client
    const client = await clientPromise;
    console.log("Connection to client successful");
    
    // Connect to the test database
    const db = client.db("test");
    console.log("Connected to 'test' database");
    
    // Simple query to verify connection
    const testCollection = await db.collection("test").findOne({});
    console.log("Query executed successfully");
    
    // Connection successful
    return NextResponse.json({ 
      success: true, 
      message: "Successfully connected to MongoDB!", 
      data: testCollection || null
    });
  } catch (error) {
    console.error("Database connection error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    // Suggest solutions based on error type
    let suggestion = "";
    if (error.message.includes("querySrv")) {
      suggestion = "DNS resolution failed. Check your network connection and ensure your MongoDB URI is correct. Try using a direct connection string without SRV.";
    } else if (error.message.includes("authentication failed")) {
      suggestion = "Authentication failed. Check your username and password in the MongoDB URI.";
    } else if (error.message.includes("ENOTFOUND")) {
      suggestion = "Host not found. Check your cluster name and ensure you have internet connectivity.";
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message,
        code: error.code || "UNKNOWN_ERROR",
        suggestion: suggestion 
      },
      { status: 500 }
    );
  }
} 