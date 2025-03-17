// This file defines the structure of documents in your MongoDB collections
// You can import these in your API routes to validate data

export const productSchema = {
  name: String,
  description: String,
  price: Number,
  inventory: Number,
  category: String,
  featured: Boolean,
  imagePath: String,
  sold_out: Boolean
};

export const orderSchema = {
  orderId: String,
  customer: {
    name: String,
    email: String,
    phone: String
  },
  createdAt: Date,
  updatedAt: Date,
  total: Number,
  subtotal: Number,
  tax: Number,
  shipping: Number,
  status: String, // "Pending", "Processing", "Shipped", "Delivered", "Cancelled"
  items: Array, // Array of product objects with quantity, price
  paymentInfo: {
    method: String,
    transactionId: String,
    status: String
  },
  shippingAddress: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  notes: String
};

export const customerSchema = {
  customerId: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  createdAt: Date,
  updatedAt: Date,
  status: String, // "Active", "Inactive", etc.
  orderCount: Number,
  totalSpent: Number,
  lastPurchaseDate: Date,
  addresses: Array, // Array of address objects
  notes: String,
  tags: Array, // Array of tags/labels
  marketingConsent: Boolean
};

// Settings Schema
export const settingsSchema = {
  storeInfo: {
    name: String,
    email: String,
    phone: String,
    address: String,
    logo: String,
  },
  generalSettings: {
    currency: {
      type: String,
      default: 'USD'
    },
    language: {
      type: String,
      default: 'en'
    },
    timeZone: String,
    taxRate: Number,
  },
  paymentMethods: [{
    name: String,
    enabled: Boolean,
    config: Object
  }],
  shippingOptions: [{
    name: String,
    description: String,
    price: Number,
    estimatedDays: String,
    enabled: Boolean
  }],
  notificationSettings: {
    newOrder: {
      enabled: Boolean,
      recipients: [String]
    },
    lowStock: {
      enabled: Boolean,
      threshold: Number,
      recipients: [String]
    },
    customerSignup: {
      enabled: Boolean,
      recipients: [String]
    }
  },
  appearanceSettings: {
    colors: {
      primary: String,
      secondary: String,
      accent: String,
      background: String,
      text: String
    },
    typography: {
      headingFont: String,
      bodyFont: String,
      headingSize: String,
      bodySize: String
    },
    layout: {
      containerWidth: String,
      borderRadius: String,
      cardShadow: String,
      buttonStyle: String
    }
  },
  users: [{
    name: String,
    email: String,
    role: String,
    lastLogin: Date
  }],
  updatedAt: {
    type: Date,
    default: () => new Date()
  }
};

// These functions help create new documents with the right structure
export function createProductDocument(productData) {
  return {
    name: productData.name || '',
    description: productData.description || '',
    price: parseFloat(productData.price) || 0,
    inventory: parseInt(productData.inventory) || 0,
    category: productData.category || 'Uncategorized',
    featured: productData.featured || false,
    imagePath: productData.imagePath || '/images/products/default.jpg',
    sold_out: productData.inventory <= 0,
    createdAt: productData.createdAt || new Date(),
    updatedAt: productData.updatedAt || new Date()
  };
}

export function createOrderDocument(orderData) {
  const now = new Date();
  const orderId = orderData.orderId || `ORD-${Math.floor(Math.random() * 100000)}`;
  
  return {
    orderId,
    customer: {
      name: orderData.customer?.name || orderData.customer || '',
      email: orderData.customer?.email || orderData.email || '',
      phone: orderData.customer?.phone || orderData.phone || ''
    },
    createdAt: orderData.createdAt || now,
    updatedAt: orderData.updatedAt || now,
    total: parseFloat(orderData.total) || 0,
    subtotal: parseFloat(orderData.subtotal) || parseFloat(orderData.total) || 0,
    tax: parseFloat(orderData.tax) || 0,
    shipping: parseFloat(orderData.shipping) || 0,
    status: orderData.status || 'Pending',
    items: Array.isArray(orderData.items) ? orderData.items.map(item => ({
      productId: item.productId || item._id || '',
      name: item.name || '',
      price: parseFloat(item.price) || 0,
      quantity: parseInt(item.quantity) || 1,
      total: parseFloat(item.total) || parseFloat(item.price) * (parseInt(item.quantity) || 1)
    })) : [],
    paymentInfo: {
      method: orderData.paymentInfo?.method || orderData.paymentMethod || 'None',
      transactionId: orderData.paymentInfo?.transactionId || '',
      status: orderData.paymentInfo?.status || 'Pending'
    },
    shippingAddress: typeof orderData.shippingAddress === 'string' 
      ? { line1: orderData.shippingAddress } 
      : {
          line1: orderData.shippingAddress?.line1 || '',
          line2: orderData.shippingAddress?.line2 || '',
          city: orderData.shippingAddress?.city || '',
          state: orderData.shippingAddress?.state || '',
          postalCode: orderData.shippingAddress?.postalCode || '',
          country: orderData.shippingAddress?.country || 'US'
        },
    notes: orderData.notes || ''
  };
}

export function createCustomerDocument(customerData) {
  const now = new Date();
  const customerId = customerData.customerId || `CUST-${Math.floor(Math.random() * 100000)}`;
  
  // Extract or combine first and last name if full name is provided
  let firstName = customerData.firstName || '';
  let lastName = customerData.lastName || '';
  
  if (customerData.name && (!firstName || !lastName)) {
    const nameParts = customerData.name.trim().split(/\s+/);
    if (nameParts.length >= 2) {
      if (!firstName) firstName = nameParts[0];
      if (!lastName) lastName = nameParts.slice(1).join(' ');
    } else if (nameParts.length === 1) {
      if (!firstName) firstName = nameParts[0];
    }
  }
  
  return {
    customerId,
    firstName,
    lastName,
    email: customerData.email || '',
    phone: customerData.phone || '',
    createdAt: customerData.createdAt || now,
    updatedAt: customerData.updatedAt || now,
    status: customerData.status || 'Active',
    orderCount: parseInt(customerData.orderCount) || 0,
    totalSpent: parseFloat(customerData.totalSpent) || 0,
    lastPurchaseDate: customerData.lastPurchaseDate || null,
    addresses: Array.isArray(customerData.addresses) ? customerData.addresses : [],
    notes: customerData.notes || '',
    tags: Array.isArray(customerData.tags) ? customerData.tags : [],
    marketingConsent: customerData.marketingConsent || false
  };
}

export function createDefaultSettings() {
  return {
    storeInfo: {
      name: "Tacta Slime",
      email: "contact@tactaslime.com",
      phone: "",
      address: "",
      logo: "/images/TactaLogo_image002.png"
    },
    generalSettings: {
      currency: "USD",
      language: "en",
      timeZone: "UTC",
      taxRate: 0
    },
    paymentMethods: [
      {
        name: "Stripe",
        enabled: true,
        config: {}
      },
      {
        name: "PayPal",
        enabled: true,
        config: {}
      }
    ],
    shippingOptions: [
      {
        name: "Standard Shipping",
        description: "3-5 business days",
        price: 5.99,
        estimatedDays: "3-5",
        enabled: true
      },
      {
        name: "Express Shipping",
        description: "1-2 business days",
        price: 14.99,
        estimatedDays: "1-2",
        enabled: true
      }
    ],
    notificationSettings: {
      newOrder: {
        enabled: true,
        recipients: []
      },
      lowStock: {
        enabled: true,
        threshold: 5,
        recipients: []
      },
      customerSignup: {
        enabled: false,
        recipients: []
      }
    },
    appearanceSettings: {
      colors: {
        primary: "#0f766e",  // Teal
        secondary: "#ec4899", // Pink
        accent: "#8b5cf6",    // Purple
        background: "#f9fafb", // Light gray
        text: "#111827"       // Dark gray
      },
      typography: {
        headingFont: "Inter",
        bodyFont: "Inter",
        headingSize: "large",
        bodySize: "medium"
      },
      layout: {
        containerWidth: "medium",
        borderRadius: "medium",
        cardShadow: "medium",
        buttonStyle: "rounded"
      }
    },
    users: [],
    updatedAt: new Date()
  };
} 