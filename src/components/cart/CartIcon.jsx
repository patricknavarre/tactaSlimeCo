"use client";

import React, { useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartIcon() {
  const { cartCount, toggleCart, showAnimation, animatingProduct } = useCart();
  const iconRef = useRef(null);
  
  // Get position of the cart icon for animation
  const getCartPosition = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      return {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2
      };
    }
    return { x: 0, y: 0 };
  };

  return (
    <div className="relative">
      <motion.button 
        ref={iconRef}
        onClick={toggleCart}
        className="relative p-3 rounded-full bg-tacta-pink text-white hover:bg-tacta-peach transition-colors shadow-md hover:shadow-lg"
        aria-label="Shopping Cart"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ rotate: 0 }}
        animate={{ 
          rotate: cartCount > 0 ? [0, -5, 5, -5, 5, 0] : 0
        }}
        transition={{ 
          duration: 0.5, 
          repeat: cartCount > 0 ? 1 : 0,
          repeatDelay: 3
        }}
        style={{
          boxShadow: "0 4px 0 rgba(0, 0, 0, 0.15), 0 2px 10px rgba(0, 0, 0, 0.1)",
          border: "2px solid #e75c9d"
        }}
      >
        <svg 
          className="w-7 h-7" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2.5" 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        
        {/* Cart counter bubble */}
        <AnimatePresence>
          {cartCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, y: [0, -5, 0] }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.3, y: { repeat: Infinity, repeatDelay: 2, duration: 0.5 } }}
              className="absolute -top-2 -right-2 bg-tacta-peach text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md"
              style={{ border: "1px solid #ff9966" }}
            >
              {cartCount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Product animation when added to cart */}
      <AnimatePresence>
        {showAnimation && animatingProduct && (
          <motion.div
            initial={{ 
              opacity: 1, 
              scale: 1,
              x: -100, 
              y: 100 
            }}
            animate={{ 
              opacity: 0,
              scale: 0.5, 
              x: 0,
              y: 0,
              rotate: 360
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "backInOut" }}
            className="fixed z-50 bg-white rounded-full shadow-lg p-2"
            style={{ 
              pointerEvents: 'none',
            }}
          >
            <div className="w-12 h-12 bg-tacta-pink-light rounded-full flex items-center justify-center">
              <span className="text-tacta-pink font-bold">+1</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 