"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import ProductsContent from './original-page';

// Original code is preserved in a separate file: src/app/products/original-page.jsx
// To restore functionality, simply copy the contents of original-page.jsx back here

export default function ProductsPage() {
  const [showOriginal, setShowOriginal] = useState(false);

  // Debug information
  useEffect(() => {
    console.log('Toggle button state:', showOriginal);
    console.log('Environment:', process.env.NODE_ENV);
  }, [showOriginal]);

  return (
    <Layout>
      {/* Toggle Button - Commented out as it's working as intended
      <div className="fixed bottom-4 right-4 z-[9999]">
        <motion.button
          onClick={() => setShowOriginal(!showOriginal)}
          className="px-6 py-3 bg-tacta-pink text-white rounded-lg shadow-lg hover:bg-tacta-pink-dark transition-colors text-lg font-bold border-2 border-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
          }}
        >
          {showOriginal ? 'Show Under Construction' : 'Show Original Page'}
        </motion.button>
      </div>
      */}

      {showOriginal ? (
        <ProductsContent />
      ) : (
        <div className="container-custom py-12">
          <motion.div 
            className="text-center mb-10 bg-gradient-to-r from-tacta-pink-light to-tacta-peach-light py-10 rounded-xl shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Under Construction</h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto px-4 mb-8">
              Our products page is currently being updated. Please check back soon!
            </p>
            <Link href="/menu">
              <motion.button
                className="btn-primary cartoon-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Menu
              </motion.button>
            </Link>
          </motion.div>
        </div>
      )}
    </Layout>
  );
} 