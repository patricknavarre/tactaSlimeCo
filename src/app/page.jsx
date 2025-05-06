'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';

export default function Home() {
  const pathname = usePathname();
  const router = useRouter();
  const [content, setContent] = useState({
    home: {
      heroTitle: 'Discover the Magic of Tacta Slime',
      heroSubtitle: 'Handcrafted with love, designed to bring joy',
      heroButtonText: 'Shop Now',
      heroImagePath: '',
    }
  });
  const cart = useCart();
  const [quickAddProduct, setQuickAddProduct] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isForceRefresh, setIsForceRefresh] = useState(0); // Counter to force re-fetching

  // Debug log to confirm cart context is available
  useEffect(() => {
    console.log("Cart context in Home:", cart);
  }, [cart]);

  // Force re-fetch on route change
  useEffect(() => {
    // Increment refresh counter when navigating back to the homepage
    if (pathname === '/') {
      setIsForceRefresh(prev => prev + 1);
    }
  }, [pathname]);

  // Fetch featured products from API
  useEffect(() => {
    console.log('Fetching featured products at pathname:', pathname);
    setIsLoading(true);
    
    async function fetchFeaturedProducts() {
      try {
        // Add a random parameter to prevent caching
        const response = await fetch(`/api/products?nocache=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response received, total products:', data.products?.length);
        
        if (Array.isArray(data.products)) {
          // Filter for featured products
          const featured = data.products.filter(p => p.featured === true);
          console.log('Found featured products:', featured.length);
          
          if (featured.length > 0) {
            // Log the image paths to verify
            featured.forEach(p => console.log(`Featured product: ${p.name}, Image: ${p.imagePath}`));
            setFeaturedProducts(featured);
          } else {
            console.warn('No featured products found');
            setFeaturedProducts([]);
          }
        } else {
          console.error('Invalid API response format');
          setFeaturedProducts([]);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchFeaturedProducts();
  }, [pathname, isForceRefresh]);

  // Add debug log for featuredProducts state
  useEffect(() => {
    console.log('Featured products state updated:', featuredProducts.length, 'products');
  }, [featuredProducts]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        console.log('Starting to fetch content...');
        const response = await fetch('/api/content');
        console.log('Response status:', response.status);
        const data = await response.json();
        
        console.log('Raw API Response:', data);
        
        if (data.success && data.content) {
          // Create a modified version of the content with our custom title
          const modifiedContent = {
            ...data.content,
            home: {
              ...data.content.home,
              // Override the featuredTitle regardless of what's in the database
              featuredTitle: 'Trending Now'
            }
          };
          
          console.log('Setting content with hero image:', modifiedContent.home.heroImagePath);
          setContent(modifiedContent);
        } else {
          console.error('Content API returned unsuccessful response:', data);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, []);

  // Debug log for content updates
  useEffect(() => {
    console.log('Current content state:', content);
    console.log('Current hero image path:', content?.home?.heroImagePath);
  }, [content]);

  // Function to handle adding a product to cart
  const handleQuickAdd = (product) => {
    if (product.inventory <= 0) return;
    
    // Add to cart
    cart.addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imagePath: product.imagePath
    });
    
    // Show success message
    setQuickAddProduct(product);
    setTimeout(() => setQuickAddProduct(null), 2000);
  };

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Function to manually refresh featured products
  const refreshFeaturedProducts = () => {
    setIsForceRefresh(prev => prev + 1);
  };

  return (
    <Layout>
      {/* Hero Section - Reduced height */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-tacta-pink via-tacta-peach to-[#FFB6C1]">
        <div className="absolute inset-0 bg-[url('/images/bubble-pattern.png')] opacity-10 animate-float"></div>
        <div className="container-custom relative z-10">
          <motion.div
            className="flex flex-col items-center gap-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-2xl">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-4 text-white text-shadow-lg"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {content.home.heroTitle}
              </motion.h1>
              <motion.p 
                className="text-lg mb-6 text-white text-shadow-sm"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {content.home.heroSubtitle}
              </motion.p>
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link href="/products" className="btn-primary cartoon-btn text-lg px-8 py-3 hover:scale-110 transition-transform">
                  {content.home.heroButtonText || 'Shop Now'}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products - Reduced padding */}
      <section className="py-12 bg-gradient-to-b from-white to-tacta-cream">
        <motion.div 
          className="container-custom"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-tacta-pink to-tacta-peach bg-clip-text text-transparent relative"
            variants={itemVariants}
          >
            <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-2xl">🔥</span>
            Trending Now
            <div className="w-24 h-1 bg-gradient-to-r from-tacta-pink to-tacta-peach rounded-full mx-auto mt-4"></div>
          </motion.h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-tacta-pink"></div>
              <p className="ml-3 text-tacta-pink font-medium">Loading featured products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">No featured products available right now.</p>
              <Link href="/products" className="mt-4 btn-primary cartoon-btn inline-block">
                View All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
              {featuredProducts.map((product) => (
                <div 
                  key={product._id} 
                  className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-tacta-pink/30 hover:border-tacta-pink hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative"
                >
                  <Link href={`/products/${product._id}`}>
                    <div className="p-3 bg-white relative">
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-gradient-to-r from-tacta-pink to-tacta-peach text-white text-sm px-4 py-1 rounded-full uppercase tracking-wider font-bold shadow-lg animate-pulse">
                          Featured
                        </span>
                      </div>
                      
                      <div className="h-64 rounded-lg flex items-center justify-center overflow-hidden bg-gradient-to-br from-tacta-cream/50 to-white">
                        <img 
                          src={product.imagePath || '/images/products/default.jpg'} 
                          alt={product.name}
                          className="h-full w-auto object-contain mx-auto transform group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-tacta-pink transition-colors">{product.name}</h3>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-2xl font-bold text-tacta-pink drop-shadow-sm">${product.price.toFixed(2)}</span>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              handleQuickAdd(product);
                            }}
                            className="btn-primary cartoon-btn px-4 py-2 text-sm font-bold transform hover:scale-105 active:scale-95 transition-transform">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  {quickAddProduct && quickAddProduct._id === product._id && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-fadeIn">
                      <div className="animate-bounce text-4xl mb-2">🎉</div>
                      <p className="font-bold text-tacta-pink text-lg">Added to Cart!</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-tacta-cream to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/bubble-pattern.png')] opacity-5"></div>
        <motion.div 
          className="container-custom relative z-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-tacta-pink to-tacta-peach bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Why Choose Tacta Slime?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: "✨",
                title: "Premium Quality",
                description: "We use only the finest ingredients to create long-lasting, high-quality slimes that maintain their texture."
              },
              {
                icon: "🛡️",
                title: "Safe Ingredients",
                description: "All our slimes are made with non-toxic ingredients that are safe for children and adults alike."
              },
              {
                icon: "🎨",
                title: "Unique Designs",
                description: "Each slime is handcrafted with unique colors, scents, and textures that you won't find anywhere else."
              }
            ].map((benefit, index) => (
              <motion.div 
                key={index}
                className="text-center"
                variants={itemVariants}
              >
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-tacta-pink to-tacta-peach rounded-2xl rotate-6"></div>
                  <div className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center text-4xl">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-br from-tacta-pink via-tacta-peach to-[#FFB6C1] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/bubble-pattern.png')] opacity-10"></div>
        <motion.div 
          className="container-custom max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white text-shadow-lg">Join Our Slime Club</h2>
          <p className="text-xl mb-12 text-white text-shadow-sm">
            Subscribe to our newsletter for exclusive deals, new releases, and slime tips!
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Your email address"
              className="input-field sm:flex-1 max-w-md text-lg px-6 py-4 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-white/70 focus:outline-none focus:border-white/40 transition-colors"
              required
            />
            <motion.button 
              type="submit" 
              className="btn-primary cartoon-btn text-lg px-8 py-4 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe Now
            </motion.button>
          </form>
        </motion.div>
      </section>
    </Layout>
  );
} 