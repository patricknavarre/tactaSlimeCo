'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';
import { createProduct } from '@/lib/api';
import Image from 'next/image';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleCreateProduct(data) {
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Raw form data:', data);
      
      // Create a clean object with only the fields we want to create
      const productData = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price || 0),
        inventory: parseInt(data.inventory || 0, 10),
        category: data.category,
        featured: Boolean(data.featured), // Ensure featured is a boolean
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Handle image path if present
      if (data.imagePath) {
        productData.imagePath = data.imagePath;
      } else {
        productData.imagePath = '/images/products/default.jpg';
      }
      
      // Add shopify ID only if it exists and isn't empty
      if (data.shopifyProductId && data.shopifyProductId.trim() !== '') {
        productData.shopifyProductId = data.shopifyProductId;
      }
      
      console.log('Cleaned data to send:', productData);
      
      // Submit to API
      const result = await createProduct(productData);
      
      if (result.success) {
        // Redirect to product list on success
        router.push('/admin/dashboard/products');
      } else {
        setError(result.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setError(`An error occurred while creating the product: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
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
            <span className="ml-4 text-xl font-semibold text-gray-900">Add New Product</span>
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
                <h2 className="text-lg font-semibold text-gray-900">Add New Product</h2>
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
                  onSubmit={handleCreateProduct} 
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