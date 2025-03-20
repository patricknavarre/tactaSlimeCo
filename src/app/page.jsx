'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
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

  // Debug log to confirm cart context is available
  useEffect(() => {
    console.log("Cart context in Home:", cart);
  }, [cart]);

  // Fetch featured products from API
  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        // Filter for featured products only
        const featured = Array.isArray(data) ? data.filter(product => product.featured) : [];
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    }
    
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        console.log('Starting to fetch content...');
        const response = await fetch('/api/content');
        console.log('Response status:', response.status);
        const data = await response.json();
        
        console.log('Raw API Response:', data);
        console.log('Hero Image Path:', data?.content?.home?.heroImagePath);
        
        if (data.success && data.content) {
          console.log('Setting content with hero image:', data.content.home.heroImagePath);
          setContent(data.content);
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
    if (!cart || !cart.addToCart) {
      console.error("Cart context is not available or missing addToCart function");
      return;
    }

    setQuickAddProduct(product);
    
    // Create a complete product object
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      quantity: 1
    };
    
    // Add to cart with explicit logging
    console.log("Adding to cart from homepage:", productToAdd);
    cart.addToCart(productToAdd, 1);
    
    // Reset animation after a delay
    setTimeout(() => {
      setQuickAddProduct(null);
    }, 1500);
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-tacta-pink via-tacta-peach to-[#FFB6C1]">
        <div className="absolute inset-0 bg-[url('/images/bubble-pattern.png')] opacity-10 animate-float"></div>
        <div className="container-custom relative z-10">
          <motion.div
            className="flex flex-col md:flex-row items-center gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="md:w-1/2">
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 text-white text-shadow-lg"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {content?.home?.heroTitle}
              </motion.h1>
              <motion.p 
                className="text-xl mb-8 text-white text-shadow-sm"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {content?.home?.heroSubtitle}
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link href="/products" className="btn-primary cartoon-btn text-lg px-8 py-4 hover:scale-110 transition-transform">
                  {content?.home?.heroButtonText}
                </Link>
                <Link href="/about" className="btn-secondary cartoon-btn text-lg px-8 py-4 hover:scale-110 transition-transform">
                  Learn More
                </Link>
              </motion.div>
            </div>
            <motion.div 
              className="md:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            >
              <div className="relative w-full max-w-lg aspect-square rounded-full bg-white/20 backdrop-blur-lg p-8 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                {content?.home?.heroImagePath && content.home.heroImagePath !== '' ? (
                  <>
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-tacta-pink/40 to-tacta-peach/40 animate-pulse"></div>
                    <div className="absolute inset-4 rounded-full overflow-hidden">
                      <Image
                        src={content.home.heroImagePath}
                        alt="Tacta Slime Hero"
                        fill
                        className="object-cover"
                        priority
                        quality={100}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-tacta-pink/40 to-tacta-peach/40 animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-6xl mb-4 block">✨</span>
                        <span className="text-xl text-white font-medium">
                          Discover Our Magical Slimes
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gradient-to-b from-white to-tacta-cream">
        <motion.div 
          className="container-custom"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-tacta-pink to-tacta-peach bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Our Featured Slimes
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-7xl mx-auto">
            {featuredProducts.map((product) => (
              <motion.div 
                key={product._id}
                variants={itemVariants}
                className="group relative"
              >
                <div className="card bg-white rounded-2xl border-2 border-gray-100 hover:border-tacta-pink overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-gradient-to-r from-tacta-pink to-tacta-peach text-white text-sm px-4 py-1 rounded-full uppercase tracking-wider font-semibold shadow-lg">
                      Featured
                    </span>
                  </div>
                  <div className="relative h-72 bg-gradient-to-br from-tacta-cream to-white overflow-hidden">
                    {product.imagePath ? (
                      <Image
                        src={product.imagePath}
                        alt={product.name}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg text-gray-500">{product.name} Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-tacta-pink transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-tacta-pink">${product.price.toFixed(2)}</span>
                      <motion.button 
                        onClick={() => handleQuickAdd(product)}
                        className="btn-primary cartoon-btn px-6 py-3 font-bold text-white"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={product.inventory <= 0}
                      >
                        {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </motion.button>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {quickAddProduct && quickAddProduct._id === product._id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center"
                      >
                        <motion.div
                          animate={{ 
                            rotate: [0, 10, -10, 10, 0],
                            scale: [1, 1.2, 1.2, 1.2, 1]
                          }}
                          transition={{ duration: 0.5 }}
                          className="text-6xl mb-4"
                        >
                          🎉
                        </motion.div>
                        <motion.p 
                          initial={{ y: 20 }}
                          animate={{ y: 0 }}
                          className="font-bold text-xl text-tacta-pink"
                        >
                          Added to Cart!
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="text-center mt-16"
            variants={itemVariants}
          >
            <Link href="/products" className="btn-secondary cartoon-btn text-lg px-8 py-4 hover:scale-110 transition-transform inline-block">
              View All Products
            </Link>
          </motion.div>
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