'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { deleteProduct } from '@/lib/api';

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch products from the API
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      console.log('Admin: Fetching products from API...');
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Admin: API response received:', data);
      
      // Handle different response formats
      let processedProducts = [];
      
      if (Array.isArray(data)) {
        // Array format
        processedProducts = data;
      } else if (data.products && Array.isArray(data.products)) {
        // New format with nested products array
        processedProducts = data.products;
      } else if (data.success && data.products) {
        // Legacy format with success flag
        processedProducts = data.products;
      } else if (data.error) {
        // Error format
        console.error('Admin: Server returned error:', data.error, data.details);
        alert(`Error loading products: ${data.error}. ${data.details || ''}`);
        return;
      } else {
        console.error('Admin: Unexpected data format:', data);
        alert('Received unexpected data format from server.');
        return;
      }
      
      // Inspect the products array structure
      console.log('Admin: Products array structure:', processedProducts);
      console.log('Admin: First product (if exists):', processedProducts[0]);
      console.log('Admin: Product array length:', processedProducts.length);
      
      // Ensure all products have an _id property
      const productsWithId = processedProducts.map(product => {
        if (!product._id && product.id) {
          return { ...product, _id: product.id };
        }
        return product;
      });
      
      setProducts(productsWithId);
    } catch (error) {
      console.error('Admin: Error fetching products:', error);
      alert(`Failed to load products: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setDeletingProductId(productId);
    try {
      const result = await deleteProduct(productId);
      
      if (result.success) {
        // Remove the product from the state if deletion was successful
        setProducts(products.filter(product => product._id !== productId));
      } else {
        alert(`Failed to delete product: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('An error occurred while trying to delete the product. Please try again.');
    } finally {
      setDeletingProductId(null);
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tacta-pink"></div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow">
        <div className="container-custom flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="flex-shrink-0">
              <div className="relative h-12 w-48">
                <Image
                  src="/images/TactaLogo_image002.png"
                  alt="Tacta Slime Company Logo"
                  fill
                  className="object-contain"
                  priority
                  quality={100}
                />
              </div>
            </Link>
            <span className="ml-4 text-xl font-semibold text-gray-900">Products Management</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="btn-secondary text-sm">
              View Site
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-tacta-pink">
              Logout
            </Link>
          </div>
        </div>
      </header>
      
      {/* Admin Content */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-4">
              <nav className="space-y-2">
                <Link href="/admin/dashboard" className="block p-2 text-gray-700 hover:bg-tacta-pink-light hover:text-tacta-pink rounded-md">
                  Dashboard
                </Link>
                <Link href="/admin/dashboard/products" className="block p-2 bg-tacta-pink-light text-tacta-pink rounded-md font-medium">
                  Products
                </Link>
                <Link href="/admin/dashboard/orders" className="block p-2 text-gray-700 hover:bg-tacta-pink-light hover:text-tacta-pink rounded-md">
                  Orders
                </Link>
                <Link href="/admin/dashboard/customers" className="block p-2 text-gray-700 hover:bg-tacta-pink-light hover:text-tacta-pink rounded-md">
                  Customers
                </Link>
                <Link href="/admin/dashboard/content" className="block p-2 text-gray-700 hover:bg-tacta-pink-light hover:text-tacta-pink rounded-md">
                  Content
                </Link>
                <Link href="/admin/dashboard/appearance" className="block p-2 text-gray-700 hover:bg-tacta-pink-light hover:text-tacta-pink rounded-md">
                  Appearance
                </Link>
                <Link href="/admin/dashboard/settings" className="block p-2 text-gray-700 hover:bg-tacta-pink-light hover:text-tacta-pink rounded-md">
                  Settings
                </Link>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Products</h2>
                <Link href="/admin/dashboard/products/new" className="btn-primary text-sm">
                  Add New Product
                </Link>
              </div>
              
              {/* Filters and Search */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="input-field"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <select className="input-field py-1.5 text-sm w-40">
                      <option value="">All Categories</option>
                      <option value="cloud-slime">Cloud Slime</option>
                      <option value="butter-slime">Butter Slime</option>
                      <option value="clear-slime">Clear Slime</option>
                      <option value="butter-and-clear-mix">Butter & Clear Mix</option>
                      <option value="glitter-slime">Glitter Slime</option>
                      <option value="crunchy-slime">Crunchy Slime</option>
                      <option value="foam-slime">Foam Slime</option>
                      <option value="floam">Floam</option>
                    </select>
                    
                    <select className="input-field py-1.5 text-sm w-40">
                      <option value="">Sort By</option>
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                      <option value="price-low">Price (Low to High)</option>
                      <option value="price-high">Price (High to Low)</option>
                      <option value="inventory-low">Inventory (Low to High)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inventory
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Featured
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {console.log('Rendering products table, products.length:', products.length)}
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          No products found. Click "Add New Product" to create one.
                        </td>
                      </tr>
                    ) : (
                      products.map((product, index) => {
                        console.log(`Rendering product ${index}:`, product);
                        return (
                          <tr key={product._id || `product-${index}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-tacta-cream rounded-md flex items-center justify-center text-xs text-gray-500 overflow-hidden">
                                  {product.imagePath ? (
                                    <img 
                                      src={product.imagePath} 
                                      alt={product.name || 'Product'} 
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    'Image'
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{product.name || 'Unnamed Product'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{product.inventory || 0}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                product.category?.includes('Cloud') || product.category?.includes('Glitter') 
                                  ? 'bg-tacta-pink-light text-tacta-pink' 
                                  : 'bg-tacta-peach-light text-tacta-peach'
                              }`}>
                                {product.category || 'Uncategorized'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {product.featured ? (
                                  <span className="inline-flex items-center text-green-600">
                                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Yes
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center text-gray-500">
                                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    No
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <Link href={`/admin/dashboard/products/edit/${product._id || index}`} className="text-tacta-pink hover:text-tacta-pink-light">
                                  Edit
                                </Link>
                                <Link href={`/products/${product._id || index}`} className="text-gray-500 hover:text-gray-700">
                                  View
                                </Link>
                                <button 
                                  className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={() => handleDeleteProduct(product._id)}
                                  disabled={deletingProductId === product._id}
                                >
                                  {deletingProductId === product._id ? 'Deleting...' : 'Delete'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button 
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    disabled={products.length === 0}
                  >
                    Previous
                  </button>
                  <button 
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    disabled={products.length === 0}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    {products.length > 0 ? (
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{products.length}</span> of <span className="font-medium">{products.length}</span> results
                      </p>
                    ) : (
                      <p className="text-sm text-gray-700">No products found</p>
                    )}
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button 
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        disabled={products.length === 0}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {products.length > 0 ? (
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-tacta-pink-light text-sm font-medium text-tacta-pink">
                          1
                        </button>
                      ) : null}
                      <button 
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        disabled={products.length === 0}
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 