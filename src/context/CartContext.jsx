"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context with default values to avoid "undefined" errors
const CartContext = createContext({
  cartItems: [],
  cartCount: 0,
  isCartOpen: false,
  showAnimation: false,
  animatingProduct: null,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  toggleCart: () => {},
  setIsCartOpen: () => {}
});

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animatingProduct, setAnimatingProduct] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on initial render (client-side only)
  useEffect(() => {
    console.log("CartProvider mounted");
    
    // This will only run on the client
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('tactaSlimeCart');
        console.log("Loading cart from localStorage:", savedCart);
        
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          console.log("Parsed cart:", parsedCart);
          setCartItems(parsedCart);
          updateCartCount(parsedCart);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage', error);
      }
      
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    // Only save after the component has initialized
    // and only on the client side
    if (isInitialized && typeof window !== 'undefined') {
      console.log("Saving cart to localStorage:", cartItems);
      localStorage.setItem('tactaSlimeCart', JSON.stringify(cartItems));
      updateCartCount(cartItems);
    }
  }, [cartItems, isInitialized]);

  const updateCartCount = (items) => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    console.log("Updating cart count to:", count);
    setCartCount(count);
  };

  const addToCart = (product, quantity = 1) => {
    console.log("Adding to cart - Product:", product, "Quantity:", quantity);
    
    setCartItems(prevItems => {
      // Check if the product is already in the cart
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      let newItems;
      if (existingItemIndex >= 0) {
        // Product exists in cart, update quantity
        newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Product is not in cart, add new item
        newItems = [...prevItems, { ...product, quantity }];
      }
      
      console.log("New cart items:", newItems);
      return newItems;
    });

    // Trigger animation
    setAnimatingProduct(product);
    setShowAnimation(true);
    
    // Open cart after animation
    setTimeout(() => {
      setIsCartOpen(true);
      setShowAnimation(false);
    }, 800);
  };

  const removeFromCart = (productId) => {
    console.log("Removing product from cart:", productId);
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    console.log("Updating quantity - Product ID:", productId, "New quantity:", quantity);
    
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    console.log("Clearing cart");
    setCartItems([]);
  };

  const toggleCart = () => {
    console.log("Toggling cart visibility");
    setIsCartOpen(prev => !prev);
  };

  const value = {
    cartItems,
    cartCount,
    isCartOpen,
    showAnimation,
    animatingProduct,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
} 