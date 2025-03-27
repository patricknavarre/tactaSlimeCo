import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price must be a positive number']
  },
  inventory: {
    type: Number,
    required: [true, 'Please provide inventory count'],
    min: [0, 'Inventory must be a non-negative number'],
    default: 0
  },
  imagePath: {
    type: String,
    get: function(v) {
      // If the path starts with http or https, it's a Vercel Blob URL
      if (v && (v.startsWith('http://') || v.startsWith('https://'))) {
        return v;
      }
      // If it's a relative path, convert it to a Vercel Blob URL
      if (v && v.startsWith('/images/products/')) {
        return `${process.env.NEXT_PUBLIC_BACKEND_URL}${v}`;
      }
      return v;
    }
  },
  category: {
    type: String,
    required: [true, 'Please provide a product category']
  },
  featured: {
    type: Boolean,
    default: false
  },
  specifications: {
    type: Map,
    of: String
  },
  shopifyProductId: {
    type: String,
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { getters: true }, // Enable getters when converting to JSON
  toObject: { getters: true } // Enable getters when converting to object
});

// Update the updatedAt timestamp before saving
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Avoid duplicating models when Next.js hot reloads in development
export default mongoose.models.Product || mongoose.model('Product', ProductSchema); 