"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ProductDetail({ params }) {
  // Use React.use() to unwrap params
  const productId = React.use(params).id;
  const cart = useCart();
  const router = useRouter();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Update useEffect to use productId instead of id
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Product not found');
          } else {
            setError('Failed to fetch product');
          }
          return;
        }
        
        const data = await response.json();
        
        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          setError(data.message || 'Failed to load product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('An error occurred while loading the product');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [productId]);  // Update dependency array to use productId
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.inventory || 10)) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    const productToAdd = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image || (product.images && product.images[0] ? product.images[0].url : ''),
      description: product.description,
      inventory: product.inventory,
      quantity: quantity
    };
    
    cart.addToCart(productToAdd, quantity);
    setAddedToCart(true);
    
    // Reset after animation
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };
  
  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tacta-pink mb-4"></div>
          <p className="text-lg text-gray-600">Loading product...</p>
        </div>
      </Layout>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Layout>
        <div className="container-custom py-12">
          <div className="bg-red-100 p-6 rounded-lg text-center">
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={() => router.push('/products')} 
              className="px-4 py-2 bg-tacta-pink text-white rounded-md hover:bg-tacta-pink-dark"
            >
              Back to Products
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  // If product doesn't exist
  if (!product) {
    return (
      <Layout>
        <div className="container-custom py-12 text-center">
          <p className="text-lg text-gray-600">Product not found</p>
          <Link href="/products" className="mt-4 inline-block px-4 py-2 bg-tacta-pink text-white rounded-md hover:bg-tacta-pink-dark">
            Back to Products
          </Link>
        </div>
      </Layout>
    );
  }
  
  // Product display with real data
  const productImage = product.imagePath || (product.images && product.images[0] ? product.images[0].url : '/images/placeholder.jpg');
  
  return (
    <Layout>
      <div className="container-custom py-12">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-tacta-pink">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link href="/products" className="ml-1 text-gray-700 hover:text-tacta-pink md:ml-2">
                  Products
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-tacta-pink font-medium md:ml-2">
                  {product.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <motion.div 
            className="bg-tacta-cream rounded-lg overflow-hidden shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative pt-[100%]">
              {productImage ? (
                <img
                  src={productImage}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-500">{product.name} Image Placeholder</span>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Product Video */}
            {product.video && product.video.url && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Product Video</h2>
                <div className="relative pt-[56.25%] bg-gray-100 rounded-lg overflow-hidden">
                  {product.video.type === 'youtube' ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(product.video.url)}`}
                      title={product.video.title || 'Product Video'}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : product.video.type === 'vimeo' ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${getVimeoVideoId(product.video.url)}`}
                      title={product.video.title || 'Product Video'}
                      className="absolute inset-0 w-full h-full"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={product.video.url}
                      controls
                      className="absolute inset-0 w-full h-full"
                      title={product.video.title || 'Product Video'}
                    />
                  )}
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-tacta-pink-light text-tacta-pink">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-tacta-peach-light text-tacta-peach">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
              
              <div className="mt-1 text-sm">
                <span className={product.inventory > 10 ? 'text-green-600' : 'text-orange-500'}>
                  {product.inventory > 0 
                    ? `In Stock (${product.inventory} available)` 
                    : 'Out of Stock'}
                </span>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            {product.specifications && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Specifications</h2>
                <div className="bg-gray-50 rounded-md p-4">
                  <ul className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <li key={key} className="flex">
                        <span className="font-medium w-1/3 text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                        <span className="text-gray-600">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-24">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    name="quantity"
                    className="input-field mt-1 py-1 block w-full"
                    value={quantity}
                    onChange={handleQuantityChange}
                  >
                    {[...Array(Math.min(10, product.inventory)).keys()].map(i => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <motion.button
                disabled={product.inventory === 0 || addedToCart || !cart?.addToCart}
                className={`w-full blob-btn ${product.inventory === 0 || !cart?.addToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleAddToCart}
                whileTap={{ scale: 0.95 }}
                whileHover={product.inventory > 0 ? { scale: 1.02 } : {}}
              >
                {product.inventory === 0 
                  ? 'Out of Stock' 
                  : addedToCart 
                    ? 'Added to Cart' 
                    : !cart?.addToCart 
                      ? 'Cart Unavailable' 
                      : 'Add to Cart'
                }
              </motion.button>
              
              <motion.button
                className="w-full cartoon-btn btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                Buy Now with Shopify
              </motion.button>
            </div>
            
            <div className="mt-8 text-sm text-gray-500">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-1 text-tacta-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Orders ship within 1-2 business days
              </p>
              <p className="flex items-center mt-2">
                <svg className="w-5 h-5 mr-1 text-tacta-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Satisfaction guaranteed or your money back
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Related Products Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-8 text-center">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* This would be dynamically generated in production */}
            <div className="card group">
              <div className="relative h-64 bg-tacta-cream">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-gray-500">Related Product Image</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Related Product</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  Description of the related product that might interest the customer.
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">$12.99</span>
                  <button className="btn-primary cartoon-btn text-sm">View</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Add these helper functions at the top of the file, after the imports
function getYouTubeVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function getVimeoVideoId(url) {
  const regExp = /^.*(vimeo.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
  const match = url.match(regExp);
  return match ? match[5] : null;
} 