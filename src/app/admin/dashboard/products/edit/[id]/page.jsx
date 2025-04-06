'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage({ params }) {
  const router = useRouter();
  const id = params?.id;
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  console.log('Edit Product Page - Product ID:', id);

  // Fetch product data on component mount
  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        console.log('Fetching product data for ID:', id);
        
        // Direct API call instead of using the utility function
        const response = await fetch(`/api/products/${id}`);
        console.log('API Response Status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`Failed to load product: API returned ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Product data received:', data);
        
        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          setError('Product data not found in API response');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setError(`Failed to load product: ${error.message}`);
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
      if (data.imagePath) {
        productData.imagePath = data.imagePath;
      }
      
      // Add shopify ID only if it exists and isn't empty
      if (data.shopifyProductId && data.shopifyProductId.trim() !== '') {
        productData.shopifyProductId = data.shopifyProductId;
      }

      // Add video data if present
      if (data.video && data.video.url) {
        productData.video = {
          url: data.video.url,
          type: data.video.type || 'youtube',
          title: data.video.title || ''
        };
      }
      
      // Debug: Log data after processing
      console.log('Cleaned data to send:', productData);
      
      // Direct API call to update product
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      console.log('Update response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Update error response:', errorData);
        throw new Error(`Failed to update product: Server returned ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Update result:', result);
      
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
          {error && (
            <p className="mt-2 text-red-500 text-sm">
              {error}
            </p>
          )}
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