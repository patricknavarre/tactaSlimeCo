// MongoDB Atlas Database Setup Script for TactaSlime CMS
// Run this script with: mongosh "your_connection_string" --file setup-mongodb.js

// Use the tactaSlime database
db = db.getSiblingDB('tactaSlime');

// Create collections
db.createCollection("products");
db.createCollection("orders");
db.createCollection("users");
db.createCollection("categories");

// Create indexes for products collection
db.products.createIndex({ name: 1 });
db.products.createIndex({ category: 1 });
db.products.createIndex({ featured: 1 });
db.products.createIndex({ inventory: 1 }); // For inventory tracking/filtering

// Create indexes for orders collection
db.orders.createIndex({ date: -1 }); // Sort by newest first
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ "customer": 1 });
db.orders.createIndex({ "email": 1 });

// Create indexes for users collection
db.users.createIndex({ email: 1 }, { unique: true });

// Create indexes for categories collection
db.categories.createIndex({ name: 1 }, { unique: true });

// Create sample categories if they don't exist
const categories = [
  "Cloud Slime",
  "Butter Slime",
  "Glitter Slime",
  "Clear Slime",
  "Foam Slime"
];

categories.forEach(category => {
  if (db.categories.countDocuments({ name: category }) === 0) {
    db.categories.insertOne({ 
      name: category,
      description: `${category} products`,
      createdAt: new Date()
    });
  }
});

// Sample admin user if it doesn't exist
if (db.users.countDocuments({ email: "admin@tactaslime.com" }) === 0) {
  db.users.insertOne({
    email: "admin@tactaslime.com",
    // In production, you'd use properly hashed passwords
    // This is just a placeholder that should be changed
    password: "hashed-password-would-go-here",
    role: "admin",
    createdAt: new Date()
  });
}

print("MongoDB Atlas setup completed successfully for TactaSlime CMS!"); 