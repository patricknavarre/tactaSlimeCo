'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';
import { fetchProductById, updateProduct } from '@/lib/api';

export default function EditProductPage({ params }) {
  // Get id from params (using useId when it becomes required in future Next.js versions)
  const router = useRouter();
  const id = params.id; // For future: const id = React.use(params).id;
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch product data on component mount
  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        const productData = await fetchProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error('Error loading product:', error);
        setError('Failed to load product. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (id) {
      loadProduct();
    }
  }, [id]);

  async function handleUpdateProduct(data) {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Debug: Log data before processing
      console.log('Raw form data:', data);
      
      // Create a clean object with only the fields we want to update
      const productData = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price || 0),
        inventory: parseInt(data.inventory || 0, 10),
        category: data.category,
        featured: Boolean(data.featured), // Ensure featured is a boolean
        updatedAt: new Date()
      };
      
      // Handle image path if present
      if (data.image) {
        productData.imagePath = data.image;
      }
      
      // Add shopify ID only if it exists and isn't empty
      if (data.shopifyProductId && data.shopifyProductId.trim() !== '') {
        productData.shopifyProductId = data.shopifyProductId;
      }
      
      // Debug: Log data after processing
      console.log('Cleaned data to send:', productData);
      
      // Submit to API
      const result = await updateProduct(id, productData);
      
      if (result.success) {
        // Redirect to product list on success
        router.push('/admin/dashboard/products');
      } else {
        setError(result.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      // More detailed error message
      setError(`An error occurred while updating the product: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tacta-pink"></div>
          <p className="mt-2 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-3 text-lg font-medium text-gray-900">Product Not Found</h3>
          <p className="mt-2 text-gray-600">
            The product you're trying to edit doesn't exist or has been deleted.
          </p>
          <div className="mt-4">
            <Link href="/admin/dashboard/products" className="btn-primary">
              Back to Products
            </Link>
          </div>
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
              <svg 
                className="w-36 h-12" 
                viewBox="0 0 600 300" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Pink tacta logo - simplified for brevity */}
                <g>
                  <path d="M18.5,90.7c7.3,0,19.3,1.3,27.3,5.3c8,4,13.3,12,13.3,21.3c0,10-4.7,18-12.7,22c-8,4-17.3,5.3-24.7,5.3h-6.7v23.3h-14v-77.3H18.5z" fill="#FF1493"/>
                  <path d="M126.2,90.7c10,0,20,1.3,30,5.3c10,4,18,12,18,27.3c0,15.3-8,23.3-18,27.3c-10,4-20,5.3-30,5.3h-10v12h-14v-77.3H126.2z" fill="#FF1493"/>
                  <path d="M233.8,90.7c10,0,20,1.3,30,5.3c10,4,18,12,18,27.3c0,15.3-8,23.3-18,27.3c-10,4-20,5.3-30,5.3h-10v12h-14v-77.3H233.8z" fill="#FF1493"/>
                  <path d="M341.5,90.7c7.3,0,19.3,1.3,27.3,5.3c8,4,13.3,12,13.3,21.3c0,10-4.7,18-12.7,22c-8,4-17.3,5.3-24.7,5.3h-6.7v23.3h-14v-77.3H341.5z" fill="#FF1493"/>
                  <path d="M449.2,90.7c10,0,20,1.3,30,5.3c10,4,18,12,18,27.3c0,15.3-8,23.3-18,27.3c-10,4-20,5.3-30,5.3h-10v12h-14v-77.3H449.2z" fill="#FF1493"/>
                </g>
              </svg>
            </Link>
            <span className="ml-4 text-xl font-semibold text-gray-900">Edit Product</span>
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
                <h2 className="text-lg font-semibold text-gray-900">
                  Edit Product: {product?.name}
                </h2>
                <Link href="/admin/dashboard/products" className="btn-secondary text-sm">
                  Back to Products
                </Link>
              </div>
              
              <div className="p-6">
                {error && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                  </div>
                )}
                
                <ProductForm 
                  product={product} 
                  onSubmit={handleUpdateProduct} 
                  isSubmitting={isSubmitting} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 