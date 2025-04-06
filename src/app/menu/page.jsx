'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';

export default function MenuPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
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
      <section className="py-16 bg-gradient-to-r from-tacta-pink-light to-tacta-peach-light">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Tacta Slime Menu
            </h1>
            <p className="text-lg mb-8 text-gray-700">
              Discover our handcrafted slimes available at today's market!
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <motion.div 
          className="container-custom"
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
              <h2 className="text-3xl font-bold mb-8 text-tacta-pink border-b-2 border-tacta-pink pb-2">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products
                  .filter(product => product.category === category)
                  .map(product => (
                    <motion.div 
                      key={product._id}
                      variants={itemVariants}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative h-48">
                        {product.imagePath && (
                          <Image
                            src={product.imagePath}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm">
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
    </Layout>
  );
} 