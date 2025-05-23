"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

// Define available categories
const categories = [
  'All Categories',
  'Cloud Slime',
  'Butter Slime',
  'Clear Slime',
  'Butter & Clear Mix',
  'Glitter Slime',
  'Crunchy Slime',
  'Foam Slime',
  'Video Game Slime',
  'Taba Squishy',
  'Floam'
];

// Create a client component that uses useSearchParams and wrap it in Suspense
export function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const cart = useCart();
  
  // State for products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        console.log('Attempting to fetch products from API...');
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API response received:', data);
        
        // Our updated API now returns products directly as an array
        if (Array.isArray(data)) {
          console.log(`Successfully loaded ${data.length} products`);
          setProducts(data);
        } 
        // Handle legacy format or error response format
        else if (data.products) {
          console.log(`Successfully loaded ${data.products.length} products (legacy format)`);
          setProducts(data.products);
        } 
        // Handle error format
        else if (data.error) {
          console.error('Server returned error:', data.error, data.details);
          setError(`Server error: ${data.error}. ${data.details || ''}`);
        }
        else {
          console.error('Unexpected data format:', data);
          setError('Received unexpected data format from server.');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(`Failed to load products: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);
  
  // Debug the cart context
  useEffect(() => {
    console.log("Cart context in ProductsPage:", cart);
  }, [cart]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [quickAddProduct, setQuickAddProduct] = useState(null);
  
  // Filter products based on search query and selected category
  useEffect(() => {
    if (!products.length) {
      setFilteredProducts([]);
      return;
    }
    
    let result = [...products];
    
    // Apply category filter if not "All Categories"
    if (categoryParam && categoryParam !== 'All Categories') {
      result = result.filter(product => product.category === categoryParam);
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory('All Categories');
    }
    
    // Apply search query filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        (product.description && product.description.toLowerCase().includes(query))
      );
    }
    
    setFilteredProducts(result);
  }, [searchQuery, categoryParam, products]);
  
  const handleCategoryClick = (category) => {
    setSearchQuery(''); // Reset search when changing categories
    
    if (category === 'All Categories') {
      // Remove category from URL if "All Categories"
      router.push('/products');
    } else {
      router.push(`/products?category=${encodeURIComponent(category)}`);
    }
  };

  const handleQuickAdd = (product) => {
    setQuickAddProduct(product);
    
    // Create a complete product object to ensure all necessary data is included
    const productToAdd = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      imagePath: product.imagePath || '/images/products/default.jpg',
      description: product.description,
      inventory: product.inventory,
      quantity: 1
    };
    
    // We now know that cart should be available from the root provider
    // If it's not available, this is an error we should log
    if (!cart) {
      console.error("Cart context is not available");
      return;
    }
    
    if (!cart.addToCart) {
      console.error("addToCart function is not available in cart context");
      return;
    }
    
    // If we've reached here, both cart and addToCart exist
    console.log("Adding to cart:", productToAdd);
    cart.addToCart(productToAdd, 1);
    
    // Reset animation after a delay
    setTimeout(() => {
      setQuickAddProduct(null);
    }, 1500);
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tacta-pink mb-4"></div>
        <p className="text-lg text-gray-600">Loading products...</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="bg-red-100 p-6 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-tacta-pink text-white rounded-md hover:bg-tacta-pink-dark"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-12">
      {/* Modern Page Header */}
      <motion.div 
        className="text-center mb-8 bg-gradient-to-br from-white to-tacta-cream py-12 rounded-xl shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Slime Products</h1>
          <p className="text-lg text-gray-700 mx-auto">
            Discover our collection of handcrafted slimes, made with premium ingredients for the ultimate sensory experience.
          </p>
        </div>
      </motion.div>
      
      {/* Improved Search Box */}
      <div className="mt-6 max-w-md mx-auto px-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for slimes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tacta-pink focus:border-transparent shadow-sm"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-tacta-pink"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Improved Category Filter */}
      <div className="mt-8 px-4">
        <div className="bg-white shadow-md rounded-xl p-4 max-w-3xl mx-auto">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3 text-center font-medium">Filter by Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categories.map((category, index) => (
              <motion.button
                key={index} 
                onClick={() => handleCategoryClick(category)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all 
                  ${category === activeCategory 
                    ? 'bg-tacta-pink text-white shadow-md' 
                    : 'bg-gray-50 text-gray-700 hover:bg-tacta-pink/10 hover:text-tacta-pink'}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Search Results Summary */}
      {searchQuery && (
        <p className="text-sm text-gray-600 mt-4">
          {filteredProducts.length === 0 
            ? 'No products found matching your search.' 
            : `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} matching "${searchQuery}"`}
        </p>
      )}
      
      {/* Products Grid - Brightened Up */}
      {filteredProducts.length === 0 ? (
        <motion.div 
          className="text-center py-16 bg-white rounded-lg shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="w-20 h-20 text-tacta-pink-light mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500">
            Try adjusting your search or category filters to find what you're looking for.
          </p>
          <motion.button 
            onClick={() => {
              setSearchQuery('');
              router.push('/products');
            }}
            className="mt-6 btn-primary cartoon-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset Filters
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product._id || product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="card group transition duration-300 bg-white rounded-lg border-2 border-gray-200 hover:border-tacta-pink hover:shadow-xl shadow-md relative overflow-hidden transform hover:-translate-y-1"
              >
                <Link 
                  href={`/products/${product._id || product.id}`}
                  className="block"
                >
                  <div className="relative h-64 bg-gradient-to-br from-white to-tacta-cream">
                    {product.imagePath ? (
                      <img
                        src={product.imagePath}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm text-gray-500">{product.name} Image</span>
                      </div>
                    )}
                    
                    {product.featured && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-tacta-peach text-white text-xs px-2 py-1 rounded-full uppercase tracking-wide">
                          Featured
                        </span>
                      </div>
                    )}
                    
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
                      <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
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
      
      {/* Pagination - Only show if we have results */}
      {filteredProducts.length > 0 && (
        <div className="mt-12 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm">
            <motion.button 
              className="px-4 py-2 text-sm font-medium text-tacta-pink bg-white border border-tacta-pink-light rounded-l-md hover:bg-tacta-pink-light"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Previous
            </motion.button>
            <motion.button 
              className="px-4 py-2 text-sm font-medium text-white bg-tacta-pink border border-tacta-pink rounded-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              1
            </motion.button>
            <motion.button 
              className="px-4 py-2 text-sm font-medium text-tacta-pink bg-white border border-tacta-pink-light rounded-r-md hover:bg-tacta-pink-light"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
} 