# MongoDB Atlas Setup for TactaSlime CMS

This guide explains how to set up your MongoDB Atlas database to correctly handle the TactaSlime CMS.

## Prerequisites

- MongoDB Atlas account (Sign up at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
- MongoDB Shell installed (`npm install -g mongodb-shell`)

## Database Structure

The TactaSlime CMS uses the following collections:

1. **products** - Stores product information
2. **orders** - Stores customer orders
3. **users** - Stores admin user accounts
4. **categories** - Stores product categories

## Setup Steps

### 1. Create a MongoDB Atlas Cluster

1. Log in to your MongoDB Atlas account
2. Create a new project (if needed)
3. Create a new cluster (Use the M0 free tier for development)
4. Configure your IP whitelist (Add your IP address or 0.0.0.0/0 for development)
5. Create a database user with read/write privileges

### 2. Get Your Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user's password

### 3. Run the Setup Scripts

Two scripts are provided to set up your database:

- `setup-mongodb.js` - Creates collections and indexes
- `mongodb-validation.js` - Adds validation schemas

Run these scripts using MongoDB Shell:

```bash
# Run the setup script
mongosh "your_connection_string" --file setup-mongodb.js

# Run the validation schema script
mongosh "your_connection_string" --file mongodb-validation.js
```

### 4. Update Your Environment Variables

Make sure your `.env.local` file has the correct MongoDB URI:

```
MONGODB_URI=mongodb+srv://username:password@clustername.mongodb.net/tactaSlime?retryWrites=true&w=majority
```

## Data Models

### Product Schema

```javascript
{
  name: String,           // Required
  description: String,    // Required
  price: Number,          // Required, min: 0
  inventory: Number,      // Required, min: 0
  category: String,       // Required
  featured: Boolean,      // Optional
  imagePath: String,      // Optional
  images: [{              // Optional
    url: String,
    alt: String
  }],
  createdAt: Date,        // Optional
  updatedAt: Date         // Optional
}
```

### Order Schema

```javascript
{
  id: String,             // Required
  customer: String,       // Required
  email: String,          // Required
  phone: String,          // Optional
  date: Date,             // Required
  total: Number,          // Required, min: 0
  status: String,         // Required (Pending, Processing, Shipped, Delivered, Canceled)
  items: [{               // Required
    name: String,
    price: Number,
    quantity: Number,
    productId: String
  }],
  paymentMethod: String,  // Required
  shippingAddress: String // Optional
}
```

## Indexing Strategy

The setup script creates the following indexes:

### Products Collection
- `name`: For text search and sorting
- `category`: For filtering by category
- `featured`: For featured products queries
- `inventory`: For inventory tracking/filtering

### Orders Collection
- `date`: For sorting by newest first
- `status`: For filtering by order status
- `customer`: For customer lookup
- `email`: For email lookup

## Recommended MongoDB Atlas Features

For production use, consider enabling:

1. **Atlas Search**: For full-text search capabilities
2. **Data Explorer**: For visual data management
3. **Performance Advisor**: For index recommendations
4. **Backup**: For automatic backups
5. **Charts**: For sales analytics

## Troubleshooting

If you encounter any issues:

1. Check your connection string
2. Verify IP whitelist settings
3. Ensure database user has correct permissions
4. Check for MongoDB validation errors in your application logs 