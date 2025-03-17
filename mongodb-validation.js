// MongoDB Validation Schema for TactaSlime CMS
// Run this script with: mongosh "your_connection_string" --file mongodb-validation.js

// Use the tactaSlime database
db = db.getSiblingDB('tactaSlime');

// Product validation schema
db.runCommand({
  collMod: "products",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "description", "price", "inventory", "category"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        description: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        price: {
          bsonType: "number",
          minimum: 0,
          description: "must be a non-negative number and is required"
        },
        inventory: {
          bsonType: "number",
          minimum: 0,
          description: "must be a non-negative number and is required"
        },
        category: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        featured: {
          bsonType: "bool",
          description: "must be a boolean if provided"
        },
        imagePath: {
          bsonType: "string",
          description: "must be a string if provided"
        },
        images: {
          bsonType: "array",
          description: "must be an array of image objects if provided",
          items: {
            bsonType: "object",
            required: ["url"],
            properties: {
              url: {
                bsonType: "string",
                description: "must be a string and is required"
              },
              alt: {
                bsonType: "string",
                description: "must be a string if provided"
              }
            }
          }
        },
        createdAt: {
          bsonType: "date",
          description: "must be a date if provided"
        },
        updatedAt: {
          bsonType: "date",
          description: "must be a date if provided"
        }
      }
    }
  },
  validationLevel: "moderate"
});

// Order validation schema
db.runCommand({
  collMod: "orders",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["customer", "email", "date", "total", "status", "items"],
      properties: {
        id: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        customer: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        email: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        phone: {
          bsonType: "string",
          description: "must be a string if provided"
        },
        date: {
          bsonType: "date",
          description: "must be a date and is required"
        },
        total: {
          bsonType: "number",
          minimum: 0,
          description: "must be a positive number and is required"
        },
        status: {
          bsonType: "string",
          enum: ["Pending", "Processing", "Shipped", "Delivered", "Canceled"],
          description: "must be one of the predefined statuses and is required"
        },
        items: {
          bsonType: "array",
          description: "must be an array and is required",
          items: {
            bsonType: "object",
            required: ["name", "price", "quantity"],
            properties: {
              name: {
                bsonType: "string",
                description: "must be a string and is required"
              },
              price: {
                bsonType: "number",
                description: "must be a number and is required"
              },
              quantity: {
                bsonType: "number",
                minimum: 1,
                description: "must be a positive integer and is required"
              },
              productId: {
                bsonType: "string",
                description: "must be a string if provided"
              }
            }
          }
        },
        paymentMethod: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        shippingAddress: {
          bsonType: "string",
          description: "must be a string if provided"
        }
      }
    }
  },
  validationLevel: "moderate"
});

print("MongoDB validation schemas applied successfully for TactaSlime CMS!"); 