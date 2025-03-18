"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

// New Arrivals page content
function NewArrivalsContent() {
  const router = useRouter();
  const cart = useCart();
  
  // State for products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickAddProduct, setQuickAddProduct] = useState(null);
  
  // Fetch new arrivals from API
  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        setLoading(true);
        console.log('Fetching new arrivals from Shopify...');
        const response = await fetch('/api/shopify/collections/new-arrivals');
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('New arrivals data received:', data);
        
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data.error) {
          console.error('Server returned error:', data.error);
          setError(`Server error: ${data.error}`);
        } else {
          console.error('Unexpected data format:', data);
          setError('Received unexpected data format from server.');
        }
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
        setError(`Failed to load new arrivals: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchNewArrivals();
  }, []);
  
  // Function to handle adding a product to cart
  const handleQuickAdd = (product) => {
    if (!cart || !cart.addToCart) {
      console.error("Cart context is not available or missing addToCart function");
      return;
    }
    
    setQuickAddProduct(product);
    
    // Create a complete product object
    const productToAdd = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0].url : null,
      description: product.description,
      quantity: 1
    };
    
    console.log("Adding to cart from new arrivals:", productToAdd);
    cart.addToCart(productToAdd, 1);
    
    // Reset animation after a delay
    setTimeout(() => {
      setQuickAddProduct(null);
    }, 1500);
  };
  
  return (
    <div className="container-custom py-8">
      <motion.div 
        className="text-center max-w-4xl mx-auto mb-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">New Arrivals</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto px-4">
          Discover our newest slime creations! These fresh additions to our collection feature our latest textures, scents, and designs.
        </p>
      </motion.div>
      
      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tacta-pink mb-4"></div>
          <p className="text-lg text-gray-600">Loading new arrivals...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <svg className="w-20 h-20 text-tacta-pink-light mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Products</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <motion.button 
            onClick={() => window.location.reload()}
            className="btn-primary cartoon-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <svg className="w-20 h-20 text-tacta-pink-light mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No new arrivals found</h3>
          <p className="text-gray-500">
            Check back soon! We're always working on exciting new slime creations.
          </p>
          <Link href="/products">
            <motion.span 
              className="inline-block mt-6 btn-primary cartoon-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Products
            </motion.span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          <AnimatePresence>
            {products.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="card group transition duration-300 bg-white rounded-lg border-2 border-gray-200 hover:border-tacta-pink hover:shadow-xl shadow-md relative overflow-hidden transform hover:-translate-y-1"
              >
                <Link 
                  href={`/products/${product._id}`}
                  className="block"
                > 
                  <div className="relative h-64 bg-gradient-to-br from-white to-tacta-cream">
                    {product.images && product.images.length > 0 ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img 
                          src={product.images[0].url} 
                          alt={product.images[0].alt || product.name} 
                          className="object-cover h-full w-full"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm text-gray-500">{product.name} Image</span>
                      </div>
                    )}
                    
                    <div className="absolute top-2 left-2">
                      <span className="bg-tacta-pink text-white text-xs px-2 py-1 rounded-full uppercase tracking-wide">
                        New
                      </span>
                    </div>
                    
                    {product.inventory < 10 && product.inventory > 0 && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full uppercase tracking-wide">
                          Low Stock
                        </span>
                      </div>
                    )}
                    
                    {product.inventory === 0 && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full uppercase tracking-wide">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white">
                    <div className="mb-1">
                      <span className="text-xs font-medium text-tacta-pink">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-tacta-pink transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
                      <div>
                        {product.onSale && product.salePrice ? (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
                            <span className="text-gray-500 line-through text-sm">${product.salePrice.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault(); // Prevent navigation to detail page
                          handleQuickAdd(product);
                        }}
                        disabled={product.inventory === 0}
                        className={`btn-primary cartoon-btn text-sm px-4 py-2 font-bold text-white w-full sm:w-auto ${
                          product.inventory === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {product.inventory === 0 ? 'Sold Out' : 'Add to Cart'}
                      </motion.button>
                    </div>
                  </div>
                </Link>
                
                {/* Added to Cart Animation */}
                <AnimatePresence>
                  {quickAddProduct && quickAddProduct._id === product._id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: -20 }}
                      className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center"
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                        className="text-tacta-pink text-4xl mb-2"
                      >
                        🎉
                      </motion.div>
                      <p className="font-bold text-tacta-pink">Added to Cart!</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Back to all products */}
      <div className="mt-12 text-center">
        <Link href="/products">
          <motion.span 
            className="btn-secondary cartoon-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Products
          </motion.span>
        </Link>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function NewArrivalsPage() {
  return (
    <Layout>
      <Suspense fallback={
        <div className="container-custom py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tacta-pink mb-4"></div>
          <p className="text-lg text-gray-600">Loading new arrivals...</p>
        </div>
      }>
        <NewArrivalsContent />
      </Suspense>
    </Layout>
  );
} 