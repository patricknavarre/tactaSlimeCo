# Shopify Integration Guide for TactaSlime

This guide explains how to set up and configure the Shopify integration for the TactaSlime website, specifically for the "Best Sellers," "New Arrivals," and "Sale Items" collections.

## Prerequisites

1. A Shopify store (Basic plan or higher)
2. Access to Shopify Admin
3. Ability to create private apps and access tokens

## Step 1: Create Collections in Shopify

First, set up the three collections in your Shopify Admin:

1. **Log in to Shopify Admin** at yourstorename.myshopify.com/admin
2. **Navigate to Products → Collections**
3. **Create three automated collections**:
   
   a. **Best Sellers Collection**:
   - Title: "Best Sellers"
   - Collection type: Automated
   - Conditions: "Product popularity" is "Top Products for any time period"
   - Ordering: "Bestsellers" (highest to lowest)

   b. **New Arrivals Collection**:
   - Title: "New Arrivals"
   - Collection type: Automated
   - Conditions: "Product created date" is "within last 30 days"
   - Ordering: "Product created date" (newest first)

   c. **Sale Items Collection**:
   - Title: "Sale Items" 
   - Collection type: Automated
   - Conditions: "Compare at price" is "is not empty"
   - Ordering: "Discount" (highest to lowest)

4. **Add products** to each collection or wait for the automated rules to populate them

## Step 2: Create a Storefront API Access Token

1. Go to Shopify Admin → Apps → App and sales channel settings
2. Click "Develop apps for your store" or "Develop apps"
3. Click "Create an app" and name it (e.g., "TactaSlime Website")
4. Go to "API credentials" and select "Configure Storefront API scopes"
5. Enable the following scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_read_collection_listings`
6. Click "Save" and then "Install app"
7. Note the "Storefront API access token" - you'll need this later

## Step 3: Get Collection IDs

For each collection, you need to find its ID:

1. Go to Shopify Admin → Products → Collections
2. Click on a collection (e.g., "Best Sellers")
3. In the URL, look for the ID number: `https://your-store.myshopify.com/admin/collections/1234567890`
4. Note this number for each of your three collections

## Step 4: Configure Environment Variables

1. Open your `.env.local` file (create it from `.env.local.example` if it doesn't exist)
2. Add the following variables:

```
# Shopify Integration
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token-from-step-2

# Shopify Collection IDs
SHOPIFY_COLLECTION_BEST_SELLERS=gid://shopify/Collection/1234567890
SHOPIFY_COLLECTION_NEW_ARRIVALS=gid://shopify/Collection/0987654321
SHOPIFY_COLLECTION_SALE_ITEMS=gid://shopify/Collection/1122334455
```

Replace the placeholder values with your actual Shopify store domain, Storefront API access token, and collection IDs.

Note: For the collection IDs, you need to format them as `gid://shopify/Collection/YOUR_COLLECTION_ID` where `YOUR_COLLECTION_ID` is the number you found in Step 3.

## Step 5: Deploy Your Changes

1. Commit your changes
2. Push to your deployment platform
3. Verify that your environment variables are set correctly in your deployment platform

## Testing the Integration

After deploying, test each of the collection pages:

1. Visit `/products/best-sellers` and verify that products appear
2. Visit `/products/new-arrivals` and verify that products appear
3. Visit `/products/sale-items` and verify that products appear

If products don't appear, check the browser console for error messages and verify your environment variables.

## Troubleshooting

- **No products appear**: Check that your collections have products assigned in Shopify
- **API errors**: Verify your Storefront API access token has the correct permissions
- **Collection not found**: Double-check the collection IDs are formatted correctly

## Making Changes to Shopify Products

When you make changes in Shopify:

1. Add/remove products from collections in Shopify
2. Set sale prices by setting the "Compare at price" field
3. Changes will appear on your website after the API cache refreshes (10 minutes max)

## Advanced: MongoDB Caching

The integration includes optional MongoDB caching to reduce API calls to Shopify. To enable:

1. Uncomment the line `await syncToMongoDB(products, 'collection-name')` in each collection API route
2. This will cache the Shopify data in your MongoDB database
3. You can add a daily/hourly cron job to refresh this cache if desired

## Need Help?

If you encounter issues with the Shopify integration, please contact the development team for assistance. 