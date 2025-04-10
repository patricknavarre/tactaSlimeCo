'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';

export default function MenuPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState({
    menu: {
      title: 'Tacta Slime Menu',
      subtitle: 'Discover our handcrafted slimes available at today\'s market!'
    }
  });

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch('/api/content');
        if (!response.ok) {
          throw new Error(`Content API responded with status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && data.content) {
          setContent(data.content);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    }

    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        const data = await response.json();
        
        // Group products by category
        const productsByCategory = data.products.reduce((acc, product) => {
          if (!acc[product.category]) {
            acc[product.category] = [];
          }
          acc[product.category].push(product);
          return acc;
        }, {});

        // Sort categories and set state
        const sortedCategories = Object.keys(productsByCategory).sort();
        setCategories(sortedCategories);
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    
    fetchContent();
    fetchProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <section className="py-16 bg-gradient-to-r from-tacta-pink-light to-tacta-peach-light relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/bubble-pattern.png')] opacity-10 animate-float"></div>
        <div className="container-custom relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 text-tacta-pink font-display"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {content?.menu?.title || 'Tacta Slime Menu'}
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-700"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {content?.menu?.subtitle || 'Discover our handcrafted slimes available at today\'s market!'}
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white relative">
        <div className="absolute inset-0 bg-[url('/images/confetti-pattern.png')] opacity-5"></div>
        <motion.div 
          className="container-custom relative"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {categories.map((category) => (
            <motion.div 
              key={category}
              variants={itemVariants}
              className="mb-16"
            >
              <div className="flex items-center mb-8">
                <motion.h2 
                  className="text-3xl font-bold text-tacta-pink font-display relative inline-block"
                  whileHover={{ scale: 1.05 }}
                >
                  {category}
                  <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-tacta-pink to-tacta-peach rounded-full transform -skew-x-12"></div>
                </motion.h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products
                  .filter(product => product.category === category)
                  .map(product => (
                    <motion.div 
                      key={product._id}
                      variants={itemVariants}
                      whileHover={{ 
                        scale: 1.03,
                        transition: { duration: 0.2 }
                      }}
                      className="bg-gradient-to-br from-white to-tacta-pink-light rounded-2xl shadow-lg overflow-hidden border-2 border-tacta-pink border-opacity-20 group"
                    >
                      <div className="relative h-56 overflow-hidden">
                        {product.imagePath && (
                          <Image
                            src={product.imagePath}
                            alt={product.name}
                            fill
                            className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                      <div className="p-6 relative">
                        <motion.h3 
                          className="text-2xl font-bold mb-3 text-tacta-pink font-display"
                          whileHover={{ scale: 1.02 }}
                        >
                          {product.name}
                        </motion.h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .font-display {
          font-family: var(--font-fredoka), system-ui, sans-serif;
        }
      `}</style>
    </Layout>
  );
} 