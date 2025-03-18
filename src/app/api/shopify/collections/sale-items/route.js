import { NextResponse } from 'next/server';
import { storefront } from '@/lib/shopify';

export async function GET() {
  try {
    // Get collection ID from environment variables
    const COLLECTION_ID = process.env.SHOPIFY_COLLECTION_SALE_ITEMS;
    
    if (!COLLECTION_ID) {
      console.error('SHOPIFY_COLLECTION_SALE_ITEMS is not defined in environment variables');
      return NextResponse.json({ error: 'Collection ID is not configured' }, { status: 500 });
    }
    
    const query = `
      query CollectionProducts($id: ID!, $first: Int!) {
        collection(id: $id) {
          title
          products(first: $first) {
            edges {
              node {
                id
                title
                description
                handle
                featuredImage {
                  url
                  altText
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                compareAtPriceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                totalInventory
                createdAt
                tags
              }
            }
          }
        }
      }
    `;

    const variables = {
      id: COLLECTION_ID,
      first: 12 // Number of products to fetch
    };

    const response = await storefront(query, variables);
    
    if (!response.data || !response.data.collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    // Transform data to match your frontend expectations
    const products = response.data.collection.products.edges.map(({ node }) => ({
      _id: node.id,
      name: node.title,
      description: node.description,
      slug: node.handle,
      price: parseFloat(node.priceRange.minVariantPrice.amount),
      salePrice: node.compareAtPriceRange.minVariantPrice.amount 
        ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount) 
        : null,
      onSale: true, // This is the sale collection, so all products are on sale
      inventory: node.totalInventory,
      category: node.tags[0] || 'Uncategorized',
      createdAt: node.createdAt,
      images: node.featuredImage ? [{ 
        url: node.featuredImage.url, 
        alt: node.featuredImage.altText || node.title 
      }] : []
    }));

    // Save to MongoDB for caching if desired
    // await syncToMongoDB(products, 'sale-items');

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching Sale Items collection:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collection', details: error.message },
      { status: 500 }
    );
  }
} 