import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  try {
    console.log("Testing alternative direct MongoDB connection...");
    
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    // Try to convert SRV URL to direct URL if needed
    let directUri = uri;
    if (uri.startsWith('mongodb+srv://')) {
      // This is a very basic transformation and may not work for all clusters
      // It's just for testing purposes
      directUri = uri.replace('mongodb+srv://', 'mongodb://');
      
      // Add a port number if not present
      if (!directUri.includes(':27017') && !directUri.includes(':27018')) {
        directUri = directUri.replace(/@([^\/]+)\//, '@$1:27017/');
      }
      
      console.log('Converted to direct URI format');
    }
    
    // Log sanitized URI for debugging (hide password)
    console.log('Connecting with URI format:', 
      directUri.replace(/mongodb:\/\/[^:]+:([^@]+)@/, 'mongodb://****:****@'));
    
    // Try to connect directly
    const client = new MongoClient(directUri, {
      useUnifiedTopology: true,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000
    });
    
    await client.connect();
    console.log("Direct connection successful");
    
    // Connect to the test database
    const db = client.db("test");
    
    // Simple query to verify connection
    const testResult = await db.command({ ping: 1 });
    console.log("Ping command result:", testResult);
    
    // Close the connection
    await client.close();
    
    // Connection successful
    return NextResponse.json({ 
      success: true, 
      message: "Successfully connected to MongoDB using direct connection!" 
    });
  } catch (error) {
    console.error("Direct connection error details:", {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message,
        code: error.code || "UNKNOWN_ERROR",
        tip: "Check your MongoDB Atlas configuration and network connection. Also verify that your IP is in the Atlas IP Access List."
      },
      { status: 500 }
    );
  }
} 