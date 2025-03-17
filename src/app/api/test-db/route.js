import { NextResponse } from 'next/server';
import clientPromise, { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  // Skip execution during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('Build phase detected, skipping database operations in /api/test-db');
    return NextResponse.json({ 
      success: true, 
      message: `Build phase - test DB API skipped`,
    });
  }
  
  try {
    console.log("API route: Testing MongoDB connection...");
    
    // Use the connectToDatabase function which handles build-time scenarios
    const { client, db } = await connectToDatabase();
    
    // Handle null client gracefully
    if (!client || !db) {
      console.log('Database connection not available during build');
      return NextResponse.json({ 
        success: false, 
        message: "Database connection not available during build",
      }, { status: 503 });
    }
    
    console.log("Connection to client successful");
    
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