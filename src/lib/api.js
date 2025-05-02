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
  // Completely fix URL construction
  // Remove any 'api/' prefix to avoid duplication
  const cleanedEndpoint = endpoint.replace(/^api\/?/, '');
  
  // Construct proper URL
  const url = `${BACKEND_URL}/api/${cleanedEndpoint}`;
  
  console.log(`API Request (${options.method || 'GET'}): ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      let errorMessage = `API request failed with status: ${response.status}`;
      
      try {
        // Clone the response before reading it
        const clonedResponse = response.clone();
        const errorData = await clonedResponse.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        // If we can't parse as JSON, try to get text
        try {
          const errorText = await response.text();
          errorMessage += ` Response: ${errorText.substring(0, 100)}...`;
        } catch (textError) {
          // If we can't read text, just use the status
          console.error('Cannot read error response:', textError);
        }
      }
      
      throw new Error(errorMessage);
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

/**
 * Fetches all products from the API
 */
export async function fetchProducts() {
  try {
    console.log('Fetching all products');
    const data = await get('products');
    console.log('Products data received:', data);
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
    console.log(`Fetching product with ID: ${id}`);
    const data = await get(`products/${id}`);
    
    if (!data.product) {
      console.error('No product data in response:', data);
      throw new Error('No product data returned from API');
    }
    
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
      imagePath: productData.imagePath || '/images/placeholder.jpg', // Use a placeholder that exists
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
    
    // ABSOLUTE DIRECT URL - NO PATH CONSTRUCTION
    const absoluteUrl = 'http://localhost:5051/api/products';
    console.log(`Using direct URL for product creation: ${absoluteUrl}`);
    
    const response = await fetch(absoluteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create product: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Product created successfully:', data);
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
    
    // Use the put helper which uses fetchFromAPI internally for consistent URL handling
    const data = await put(`products/${id}`, cleanData);
    console.log(`Product ${id} updated successfully:`, data);
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
    console.log(`Deleting product with ID: ${id}`);
    
    // Use the del helper which uses fetchFromAPI internally
    // This ensures consistent URL handling
    const data = await del(`products/${id}`);
    console.log(`Product ${id} deleted successfully:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to delete product ${id}:`, error);
    throw error;
  }
} 