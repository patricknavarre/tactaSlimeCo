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
  images: [{
    url: String,
    alt: String
  }],
  video: {
    url: String,
    type: {
      type: String,
      enum: ['youtube', 'vimeo', 'other'],
      default: 'youtube'
    },
    title: String
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
});

// Update the updatedAt timestamp before saving
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Avoid duplicating models when Next.js hot reloads in development
export default mongoose.models.Product || mongoose.model('Product', ProductSchema); 