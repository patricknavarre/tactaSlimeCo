import { MongoClient } from 'mongodb';

// Check for MongoDB URI - more detailed logging
const MONGODB_URI = process.env.MONGODB_URI;
console.log('============= MONGODB CONNECTION DIAGNOSTICS =============');
console.log('MONGODB_URI exists:', !!MONGODB_URI);
console.log('MONGODB_URI format check:', MONGODB_URI ? 
  (MONGODB_URI.startsWith('mongodb+srv://') || MONGODB_URI.startsWith('mongodb://') ? 'Valid' : 'Invalid format') : 'N/A');
console.log('MONGODB_DB:', process.env.MONGODB_DB || 'tactaSlime (default)');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VERCEL_ENV:', process.env.VERCEL_ENV || 'Not in Vercel');
console.log('==========================================================');

// Better build phase detection
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
console.log('Build phase detected:', isBuildPhase);

let client;
let clientPromise;

// Handle potential connection scenarios
if (!MONGODB_URI) {
  console.error('⚠️ MONGODB_URI is not defined in environment variables');
  clientPromise = Promise.resolve(null);
} else if (isBuildPhase) {
  console.log('🔄 Build phase detected, providing mock MongoDB client');
  clientPromise = Promise.resolve(null);
} else {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    
    // Add shorter timeout settings to prevent 504 errors
    const options = {
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,  // 10 seconds (increased from 5)
      socketTimeoutMS: 45000,   // 45 seconds (increased from 30)
      serverSelectionTimeoutMS: 10000, // 10 seconds (increased from 5)
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };
    
    console.log('MongoDB connection options:', JSON.stringify(options));
    
    // Create a test client that we'll use just to verify the connection
    try {
      const testClient = new MongoClient(MONGODB_URI, options);
      console.log('Testing connection before proceeding...');
      
      testClient.connect()
        .then(() => {
          console.log('✅ Test connection successful! Proceeding with actual connection.');
          testClient.close().catch(e => console.log('Error closing test connection:', e));
        })
        .catch(err => {
          console.error('❌ Test connection failed:', err.message);
          console.error('Connection error code:', err.code);
          console.error('Connection error name:', err.name);
          
          // Log additional details for connection failures
          if (err.name === 'MongoServerSelectionError') {
            console.error('Server selection timed out - check network access and firewall settings');
          } else if (err.name === 'MongoNetworkError') {
            console.error('Network error - check if MongoDB URI is correct and if IP is whitelisted');
          }
        });
    } catch (testErr) {
      console.error('❌ Error creating test client:', testErr);
    }
    
    if (process.env.NODE_ENV === 'development') {
      // In development mode, use a global variable
      if (!global._mongoClientPromise) {
        client = new MongoClient(MONGODB_URI, options);
        global._mongoClientPromise = client.connect()
          .then(client => {
            console.log('✅ Successfully connected to MongoDB in development mode');
            return client;
          })
          .catch(err => {
            console.error('❌ Failed to connect to MongoDB:', err.message);
            console.error('Error type:', err.name);
            console.error('Error code:', err.code);
            return null;
          });
      }
      clientPromise = global._mongoClientPromise;
    } else {
      // In production mode
      client = new MongoClient(MONGODB_URI, options);
      clientPromise = client.connect()
        .then(client => {
          console.log('✅ Successfully connected to MongoDB in production mode');
          return client;
        })
        .catch(err => {
          console.error('❌ Failed to connect to MongoDB:', err.message);
          console.error('Error type:', err.name);
          console.error('Error code:', err.code);
          return null;
        });
    }
  } catch (err) {
    console.error('❌ Error setting up MongoDB connection:', err);
    clientPromise = Promise.resolve(null);
  }
}

// Export the clientPromise
export default clientPromise;

// Helper function to connect to the database
export async function connectToDatabase() {
  try {
    if (isBuildPhase) {
      console.log('🔄 Build phase, skipping database connection');
      return { client: null, db: null };
    }
    
    if (!MONGODB_URI) {
      console.error('⚠️ Cannot connect to database: MONGODB_URI is not defined');
      return { client: null, db: null };
    }
    
    console.log('📊 Attempting to get database connection...');
    
    // Add a timeout for the client promise
    const clientWithTimeout = Promise.race([
      clientPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB connection timeout')), 10000)
      )
    ]);
    
    const client = await clientWithTimeout;
    
    if (!client) {
      console.error('⚠️ Failed to get MongoDB client, returning fallback data');
      
      // Emergency fallback for API endpoints
      return { 
        client: null, 
        db: null, 
        // Fallback data for essential operations
        fallbackData: {
          products: [
            {
              _id: 'fallback1',
              name: 'Cloud Slime',
              description: 'A fallback product when database is unavailable',
              price: 9.99,
              inventory: 10,
              imagePath: '/images/products/cloud-slime.jpg'
            }
          ],
          settings: {
            primaryColor: '#ff407d',
            secondaryColor: '#6c48c9',
            type: 'theme'
          }
        }
      };
    }
    
    const db = client.db(process.env.MONGODB_DB || 'tactaSlime');
    console.log('✅ Successfully connected to database:', process.env.MONGODB_DB || 'tactaSlime');
    
    // Verify collections exist
    try {
      const collections = await db.listCollections().toArray();
      console.log('✅ Available collections:', collections.map(c => c.name).join(', '));
    } catch (e) {
      console.error('❌ Error listing collections:', e.message);
    }
    
    return { client, db };
  } catch (error) {
    console.error('❌ Error in connectToDatabase:', error.message);
    console.error('Error type:', error.name);
    console.error('Error stack:', error.stack);
    
    // Return fallback data in case of connection failure
    return { 
      client: null, 
      db: null, 
      error,
      // Fallback data for essential operations
      fallbackData: {
        products: [
          {
            _id: 'fallback1',
            name: 'Cloud Slime',
            description: 'A fallback product when database is unavailable',
            price: 9.99,
            inventory: 10,
            imagePath: '/images/products/cloud-slime.jpg'
          }
        ],
        settings: {
          primaryColor: '#ff407d',
          secondaryColor: '#6c48c9',
          type: 'theme'
        }
      }
    };
  }
} 