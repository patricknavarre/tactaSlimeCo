import { MongoClient } from 'mongodb';

// Skip MongoDB connection during Next.js build process
const MONGODB_URI = process.env.MONGODB_URI;
const isConnectingToMongoDB = 
  process.env.MONGODB_URI && 
  !process.env.NEXT_PHASE;  // NEXT_PHASE is set during build

let client;
let clientPromise;

// During build, return a placeholder Promise to avoid errors
if (!isConnectingToMongoDB) {
  console.log('Build mode detected, skipping MongoDB connection');
  // Return a placeholder promise that will never resolve
  clientPromise = Promise.resolve(null);
} else {
  console.log('Attempting to connect to MongoDB...');
  
  const options = {
    useUnifiedTopology: true,
  };
  
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(MONGODB_URI, options);
      global._mongoClientPromise = client.connect()
        .catch(err => {
          console.error('Failed to connect to MongoDB:', err);
          throw err;
        });
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(MONGODB_URI, options);
    clientPromise = client.connect()
      .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
      });
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Add the connectToDatabase function for the API routes
export async function connectToDatabase() {
  // Skip during build time
  if (!isConnectingToMongoDB) {
    console.log('Build phase detected, skipping database connection');
    return { client: null, db: null };
  }
  
  const client = await clientPromise;
  const db = client?.db(process.env.MONGODB_DB || 'tactaSlime');
  return { client, db };
} 