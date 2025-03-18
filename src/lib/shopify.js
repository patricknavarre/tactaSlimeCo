/**
 * Shopify API utilities
 */

// Get Shopify credentials from environment variables
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

/**
 * Make a request to the Shopify Storefront API
 * @param {string} query - GraphQL query
 * @param {Object} variables - Query variables
 * @returns {Promise<Object>} Shopify API response
 */
export async function storefront(query, variables = {}) {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    console.error("Shopify API credentials are missing");
    throw new Error("Shopify API credentials are missing");
  }

  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2023-07/graphql.json`;
  
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 * 10 }, // Cache for 10 minutes
    });

    if (!result.ok) {
      const errorText = await result.text();
      console.error("Shopify API error:", errorText);
      throw new Error(`Shopify API error: ${result.status} ${result.statusText}`);
    }

    return await result.json();
  } catch (error) {
    console.error("Error calling Shopify Storefront API:", error);
    throw error;
  }
}

/**
 * Optional: Sync Shopify data to MongoDB for caching
 * @param {Array} products - Products from Shopify
 * @param {string} collectionType - Collection type (best-sellers, new-arrivals, sale-items)
 */
export async function syncToMongoDB(products, collectionType) {
  try {
    const { db } = await import('./mongodb').then(mod => mod.connectToDatabase());
    
    if (!db) {
      console.error('Cannot connect to MongoDB for syncing');
      return;
    }
    
    // Create a unique index for shopify products
    await db.collection('shopify_products').createIndex(
      { _id: 1, collection: 1 },
      { unique: true }
    );
    
    // Using bulk operations for efficiency
    const operations = products.map(product => ({
      updateOne: {
        filter: { _id: product._id, collection: collectionType },
        update: { 
          $set: { 
            ...product, 
            collection: collectionType,
            lastSynced: new Date()
          } 
        },
        upsert: true
      }
    }));
    
    if (operations.length > 0) {
      const result = await db.collection('shopify_products').bulkWrite(operations);
      console.log(`Synced ${result.upsertedCount} new and updated ${result.modifiedCount} existing products for ${collectionType}`);
    }
  } catch (error) {
    console.error(`Error syncing ${collectionType} to MongoDB:`, error);
  }
} 