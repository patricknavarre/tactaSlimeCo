import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('API: GET /api/diagnostics called');
  
  // Collect diagnostic information
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV || 'Not in Vercel',
      VERCEL_REGION: process.env.VERCEL_REGION || 'Unknown',
      MONGODB_URI_EXISTS: !!process.env.MONGODB_URI,
      MONGODB_URI_FORMAT: process.env.MONGODB_URI ? 
        (process.env.MONGODB_URI.startsWith('mongodb+srv://') || process.env.MONGODB_URI.startsWith('mongodb://') ? 'Valid format' : 'Invalid format') : 'N/A',
      MONGODB_DB: process.env.MONGODB_DB || 'tactaSlime (default)'
    },
    connectionTest: null
  };
  
  // Test MongoDB connection
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      diagnostics.connectionTest = {
        success: false,
        error: 'MONGODB_URI environment variable is not defined'
      };
    } else {
      console.log('Diagnostic: Testing MongoDB connection...');
      
      const options = {
        useUnifiedTopology: true,
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000
      };
      
      const client = new MongoClient(MONGODB_URI, options);
      
      try {
        await client.connect();
        
        // Test database connection
        const db = client.db(process.env.MONGODB_DB || 'tactaSlime');
        const collections = await db.listCollections().toArray();
        
        diagnostics.connectionTest = {
          success: true,
          message: 'Successfully connected to MongoDB',
          collections: collections.map(c => c.name)
        };
        
        await client.close();
      } catch (error) {
        diagnostics.connectionTest = {
          success: false,
          error: error.message,
          errorName: error.name,
          errorCode: error.code,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
      } finally {
        try {
          await client.close();
        } catch (e) {
          // Ignore close errors
        }
      }
    }
  } catch (error) {
    diagnostics.connectionTest = {
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }
  
  // Add troubleshooting information
  diagnostics.troubleshooting = {
    possibleIssues: [
      "MongoDB_URI environment variable not set or incorrect",
      "MongoDB Atlas IP access restrictions",
      "Database credentials invalid or expired",
      "Network connectivity issues between Vercel and MongoDB Atlas",
      "Database name incorrect in connection string"
    ],
    recommendations: [
      "Double-check the MONGODB_URI value in Vercel environment variables",
      "Ensure MongoDB Atlas IP access list includes 0.0.0.0/0 (allow all)",
      "Try creating a new database user with a simple password",
      "Check that your MongoDB cluster is active and running"
    ]
  };
  
  // Return diagnostic information
  return NextResponse.json(diagnostics);
} 