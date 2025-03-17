"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    toggleCart, 
    cartItems, 
    cartCount, 
    removeFromCart, 
    updateQuantity, 
    clearCart 
  } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <div className="hidden">
            {console.log("CartDrawer rendering with items:", cartItems)}
          </div>
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black z-40"
          />
          
          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            <div className="p-4 bg-gradient-to-r from-tacta-pink-light to-tacta-peach-light flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Your Slime Cart ({cartCount || 0})
              </h2>
              <button 
                onClick={toggleCart}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {!cartItems || cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 mb-4 text-tacta-pink-light">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add some slime to your cart!</p>
                  <button 
                    onClick={toggleCart}
                    className="btn-primary cartoon-btn"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex border border-tacta-pink-light rounded-lg overflow-hidden bg-white"
                      >
                        <div className="w-24 h-24 bg-tacta-cream flex items-center justify-center">
                          <span className="text-xs text-gray-500">{item.name} Image</span>
                        </div>
                        
                        <div className="flex-1 p-3">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-tacta-pink"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="text-tacta-pink text-xs mb-2">{item.category}</div>
                          
                          <div className="flex justify-between items-center">
                            <div className="text-gray-800 font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            
                            <div className="flex items-center border border-gray-200 rounded">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="w-8 h-8 flex items-center justify-center">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={clearCart}
                      className="text-sm text-tacta-pink hover:text-tacta-peach transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">Shipping and taxes calculated at checkout</p>
                <div className="space-y-2">
                  <Link
                    href="/checkout"
                    onClick={toggleCart}
                    className="btn-primary cartoon-btn w-full block text-center"
                  >
                    Checkout
                  </Link>
                  <button
                    onClick={toggleCart}
                    className="btn-secondary cartoon-btn w-full"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 