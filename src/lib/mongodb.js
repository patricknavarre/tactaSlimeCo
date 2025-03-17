import { MongoClient } from 'mongodb';

// Check for MongoDB URI - more detailed logging
const MONGODB_URI = process.env.MONGODB_URI;
console.log('MONGODB_URI exists:', !!MONGODB_URI, 
            'URI starts with:', MONGODB_URI ? MONGODB_URI.substring(0, 10) + '...' : 'n/a');

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
    
    const options = {
      useUnifiedTopology: true,
    };
    
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
            console.error('❌ Failed to connect to MongoDB:', err);
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
          console.error('❌ Failed to connect to MongoDB:', err);
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
    
    const client = await clientPromise;
    
    if (!client) {
      console.error('⚠️ Failed to get MongoDB client');
      return { client: null, db: null };
    }
    
    const db = client.db(process.env.MONGODB_DB || 'tactaSlime');
    console.log('✅ Successfully connected to database:', process.env.MONGODB_DB || 'tactaSlime');
    return { client, db };
  } catch (error) {
    console.error('❌ Error in connectToDatabase:', error);
    return { client: null, db: null, error };
  }
} 