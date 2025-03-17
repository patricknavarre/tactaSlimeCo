"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

// Initialize EmailJS with public key
emailjs.init("FsKNSDRtYP7OliZQs");

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartCount, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: ''
  });
  
  // Calculate order total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items to your cart before checking out.');
      router.push('/products');
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare the order details for EmailJS
    const orderDetails = cartItems.map(item => `${item.name} - Quantity: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n');
    
    // Format the full address
    const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
    
    // Updated template parameters to match the email template variables
    const templateParams = {
      to_name: 'Tacta Slime',
      from_name: formData.name,
      // Changed parameter names to match the email template
      from_email: formData.email,
      phone: formData.phone,
      address: fullAddress,
      order_details: orderDetails,
      total_amount: `$${calculateTotal().toFixed(2)}`,
      to_email: 'tactaslime@gmail.com', // Updated with correct email
      message: formData.notes || 'No additional notes',
    };
    
    try {
      // Send email notification to business
      const businessResponse = await emailjs.send(
        'service_r7jexv9',
        'template_1y7hvfk',
        templateParams
      );
      
      console.log('Business notification email sent successfully:', businessResponse);
      
      // Send confirmation email to customer
      const customerTemplateParams = {
        to_name: formData.name,
        to_email: formData.email,
        from_name: 'Tacta Slime',
        order_details: orderDetails,
        total_amount: `$${calculateTotal().toFixed(2)}`,
        customer_address: fullAddress,
        business_email: 'tactaslime@gmail.com',
      };
      
      // Using the correct template ID for customer confirmation
      const customerResponse = await emailjs.send(
        'service_r7jexv9',
        'template_rgiuw7b', // Updated with the correct template ID
        customerTemplateParams
      );
      
      console.log('Customer confirmation email sent successfully:', customerResponse);
      
      // Save order to database
      try {
        // Prepare order data for MongoDB - simplified structure to avoid validation issues
        const orderData = {
          orderId: `ORD-${Math.floor(Math.random() * 1000000)}`,
          customer: formData.name,
          email: formData.email,
          phone: formData.phone,
          items: cartItems.map(item => ({
            productId: item.id || item._id,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity)
          })),
          total: Number(calculateTotal()),
          subtotal: Number(calculateTotal()),
          status: 'Pending',
          address: fullAddress,
          paymentMethod: 'Venmo/Cash',
          notes: formData.notes || '',
          createdAt: new Date()
        };
        
        console.log('Saving order to database:', orderData);
        
        // Save to MongoDB via API
        const saveResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });
        
        if (!saveResponse.ok) {
          const errorData = await saveResponse.json();
          console.error('Failed to save order to database:', errorData);
          // Continue with checkout process even if saving to DB fails
        } else {
          const result = await saveResponse.json();
          console.log('Order saved to database successfully:', result);
        }
      } catch (dbError) {
        console.error('Error saving order to database:', dbError);
        // Continue with checkout process even if saving to DB fails
      }
      
      // Show success modal
      setShowModal(true);
      
      // Clear cart
      clearCart();
      
    } catch (error) {
      console.error('Error sending email:', error);
      alert('There was an error processing your order. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Redirect if cart is empty (when page loads)
  useEffect(() => {
    // Add a small delay to ensure cart state is loaded
    const timer = setTimeout(() => {
      setIsLoadingCart(false);
      if (cartItems.length === 0 && !showModal) {
        console.log('Cart is empty, redirecting to products');
        router.push('/products');
      }
    }, 500); // 500ms delay should be enough for cart state to load
    
    return () => clearTimeout(timer);
  }, [cartItems, router, showModal]);
  
  // Show loading state while cart is being checked
  if (isLoadingCart) {
    return (
      <Layout>
        <div className="container-custom py-12 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tacta-pink"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Information Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="name">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`input-field ${formErrors.name ? 'border-red-500' : ''}`}
                      placeholder="Enter your full name"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1 error-message">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-field ${formErrors.email ? 'border-red-500' : ''}`}
                      placeholder="Enter your email address"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1 error-message">{formErrors.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1" htmlFor="phone">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`input-field ${formErrors.phone ? 'border-red-500' : ''}`}
                    placeholder="Enter your phone number"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1 error-message">{formErrors.phone}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1" htmlFor="address">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`input-field ${formErrors.address ? 'border-red-500' : ''}`}
                    placeholder="Enter your street address"
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-sm mt-1 error-message">{formErrors.address}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="city">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`input-field ${formErrors.city ? 'border-red-500' : ''}`}
                      placeholder="City"
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-sm mt-1 error-message">{formErrors.city}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="state">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`input-field ${formErrors.state ? 'border-red-500' : ''}`}
                      placeholder="State"
                    />
                    {formErrors.state && (
                      <p className="text-red-500 text-sm mt-1 error-message">{formErrors.state}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="zipCode">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`input-field ${formErrors.zipCode ? 'border-red-500' : ''}`}
                      placeholder="ZIP Code"
                    />
                    {formErrors.zipCode && (
                      <p className="text-red-500 text-sm mt-1 error-message">{formErrors.zipCode}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-1" htmlFor="notes">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="input-field h-32"
                    placeholder="Any special requests or notes for your order?"
                  />
                </div>
                
                {/* Shopify Integration - Commented out for future use */}
                {/*
                <div className="mb-6 border-t border-dashed border-gray-300 pt-6">
                  <h3 className="text-lg font-semibold mb-3">Shopify Integration</h3>
                  <p className="text-gray-600 mb-4">
                    Connect with Shopify to use their payment and fulfillment services.
                  </p>
                  <button 
                    type="button"
                    className="btn-secondary cartoon-btn"
                    disabled
                  >
                    Connect with Shopify (Coming Soon)
                  </button>
                </div>
                */}
                
                <div className="mt-8">
                  <button
                    type="submit"
                    className="btn-primary cartoon-btn w-full py-3 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {cartItems.length === 0 ? (
                <p className="text-gray-500 italic">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-start border-b border-gray-100 pb-3">
                        <div className="w-16 h-16 bg-tacta-cream flex items-center justify-center rounded-md mr-3">
                          <span className="text-xs text-gray-500">{item.name}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <p className="text-tacta-pink text-xs">{item.category}</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm">${item.price.toFixed(2)} × {item.quantity}</span>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>To be determined</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxes</span>
                      <span>Calculated at delivery</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-3 border-t border-dashed border-gray-200 mt-3">
                      <span>Total</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Payment:</span> Venmo or Cash on Delivery
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">Delivery:</span> Hand delivered locally
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Thank You Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => router.push('/')}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-tacta-pink-light rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You for Your Order!</h2>
                  <div className="text-gray-600 mb-6">
                    <p className="mb-3">
                      Your slimes will be hand delivered with extra smiles! 
                    </p>
                    <p className="font-medium text-tacta-pink">
                      Venmo or Cash on Delivery
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary cartoon-btn"
                      onClick={() => router.push('/')}
                    >
                      Return to Home
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
} 