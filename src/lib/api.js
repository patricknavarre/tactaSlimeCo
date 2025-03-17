/**
 * API utility for communicating with the backend server
 */

// Get the backend URL from environment variables, or default to localhost:5051
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5051';

/**
 * Fetch data from the API with error handling
 * @param {string} endpoint - The API endpoint to call (without leading slash)
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - The response data
 */
export async function fetchFromAPI(endpoint, options = {}) {
  const url = `${BACKEND_URL}/api/${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * GET request to the API
 * @param {string} endpoint - The API endpoint
 * @param {Object} queryParams - Query parameters
 * @returns {Promise<Object>} - The response data
 */
export const get = async (endpoint, queryParams = {}) => {
  const params = new URLSearchParams(queryParams).toString();
  const url = params ? `${endpoint}?${params}` : endpoint;
  return fetchFromAPI(url, { method: 'GET' });
};

/**
 * POST request to the API
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - The data to send
 * @returns {Promise<Object>} - The response data
 */
export const post = async (endpoint, data) => {
  return fetchFromAPI(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * PUT request to the API
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - The data to send
 * @returns {Promise<Object>} - The response data
 */
export const put = async (endpoint, data) => {
  return fetchFromAPI(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request to the API
 * @param {string} endpoint - The API endpoint
 * @returns {Promise<Object>} - The response data
 */
export const del = async (endpoint) => {
  return fetchFromAPI(endpoint, { method: 'DELETE' });
};

// API client utilities for interacting with backend

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5053';

/**
 * Fetches all products from the API
 */
export async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.status}`);
    }
    
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}

/**
 * Fetches a single product by ID
 */
export async function fetchProductById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching product: ${response.status}`);
    }
    
    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    throw error;
  }
}

/**
 * Creates a new product
 */
export async function createProduct(productData) {
  try {
    // Ensure numeric fields are properly typed
    const cleanData = {
      name: productData.name || '',
      description: productData.description || '',
      category: productData.category || 'Uncategorized',
      featured: !!productData.featured,
      imagePath: productData.imagePath || '/images/products/default.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Ensure inventory is an integer
    cleanData.inventory = parseInt(productData.inventory || 0, 10);
    if (isNaN(cleanData.inventory)) cleanData.inventory = 0;
    
    // Ensure price is a float
    cleanData.price = parseFloat(productData.price || 0);
    if (isNaN(cleanData.price)) cleanData.price = 0;
    
    // Add sold_out property
    cleanData.sold_out = cleanData.inventory <= 0;

    console.log(`Creating product with data: ${JSON.stringify(cleanData)}`);
    
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.message || `Error creating product: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
}

/**
 * Updates an existing product
 */
export async function updateProduct(id, productData) {
  try {
    // Create a clean update object with only valid fields
    const cleanData = {
      updatedAt: new Date()
    };
    
    // Only include fields that are actually defined in the update
    if (productData.name !== undefined) cleanData.name = productData.name;
    if (productData.description !== undefined) cleanData.description = productData.description;
    if (productData.category !== undefined) cleanData.category = productData.category;
    if (productData.featured !== undefined) cleanData.featured = !!productData.featured;
    if (productData.imagePath !== undefined) cleanData.imagePath = productData.imagePath;

    // Carefully handle numeric fields
    if (productData.inventory !== undefined) {
      cleanData.inventory = parseInt(productData.inventory, 10);
      if (isNaN(cleanData.inventory)) cleanData.inventory = 0;
    }

    if (productData.price !== undefined) {
      cleanData.price = parseFloat(productData.price);
      if (isNaN(cleanData.price)) cleanData.price = 0;
    }

    console.log(`Updating product with data: ${JSON.stringify(cleanData)}`);
    
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.message || `Error updating product: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Failed to update product ${id}:`, error);
    throw error;
  }
}

/**
 * Deletes a product by ID
 */
export async function deleteProduct(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting product: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to delete product ${id}:`, error);
    throw error;
  }
} 