'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function OrderDetail() {
  const params = useParams();
  const orderId = params.orderId;
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    try {
      // Fetch all orders (since we don't have a dedicated endpoint for a single order)
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (data.success && data.orders) {
        // Find the specific order by ID
        const foundOrder = data.orders.find(order => order._id === orderId);
        
        if (foundOrder) {
          console.log('Found order:', foundOrder);
          setOrder(foundOrder);
        } else {
          setError('Order not found');
        }
      } else {
        console.error('Failed to fetch order:', data.message);
        setError(data.message || 'Failed to fetch order');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('An error occurred while fetching order details');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status class for styling
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tacta-pink"></div>
          <p className="mt-2 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold mt-2">Error</h2>
          </div>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="text-center">
            <Link href="/admin/dashboard/orders" className="btn-primary">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow">
        <div className="container-custom flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="flex-shrink-0">
              <div className="relative h-12 w-48">
                <Image
                  src="/images/TactaLogo_image002.png"
                  alt="Tacta Slime Company Logo"
                  fill
                  className="object-contain"
                  priority
                  quality={100}
                />
              </div>
            </Link>
            <span className="ml-4 text-xl font-semibold text-gray-900">Order Details</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="btn-secondary text-sm">
              View Site
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-tacta-pink">
              Logout
            </Link>
          </div>
        </div>
      </header>
      
      {/* Admin Content */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-4">
              <nav className="space-y-2">
                <Link href="/admin/dashboard" className="block p-2 text-gray-700 hover:bg-tacta-pink-light hover:text-tacta-pink rounded-md">
                  Dashboard
                </Link>
                <Link href="/admin/dashboard/products" className="block p-2 text-gray-700 hover:bg-tacta-pink-light hover:text-tacta-pink rounded-md">
                  Products
                </Link>
                <Link href="/admin/dashboard/orders" className="block p-2 bg-tacta-pink-light text-tacta-pink rounded-md font-medium">
                  Orders
                </Link>
                <Link href="/admin/dashboard/customers" className="block p-2 text-gray-700 hover:bg-tacta-pink-light hover:text-tacta-pink rounded-md">
                  Customers
                </Link>
                <Link href="/admin/dashboard/content" className="block p-2 text-gray-700 hover:bg-tacta-pink-light hover:text-tacta-pink rounded-md">
                  Content
                </Link>
                <Link href="/admin/dashboard/appearance" className="block p-2 text-gray-700 hover:bg-tacta-pink-light hover:text-tacta-pink rounded-md">
                  Appearance
                </Link>
                <Link href="/admin/dashboard/settings" className="block p-2 text-gray-700 hover:bg-tacta-pink-light hover:text-tacta-pink rounded-md">
                  Settings
                </Link>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            {order ? (
              <>
                {/* Order Header */}
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Order #{order.orderId || order._id}</h2>
                      <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt || order.timestamp || order.date)}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-secondary text-sm">
                        Print Order
                      </button>
                      <Link href="/admin/dashboard/orders" className="btn-outline text-sm">
                        Back to Orders
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-wrap gap-6">
                      <div className="flex-1 min-w-[250px]">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Order Information</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="mb-3">
                            <span className="text-xs text-gray-500 block">Order ID</span>
                            <span className="text-sm font-medium">{order.orderId || order._id}</span>
                          </div>
                          <div className="mb-3">
                            <span className="text-xs text-gray-500 block">Date Placed</span>
                            <span className="text-sm">{formatDate(order.createdAt || order.timestamp || order.date)}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Status</span>
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status || 'pending')}`}>
                              {order.status || 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-[250px]">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Customer Information</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="mb-3">
                            <span className="text-xs text-gray-500 block">Name</span>
                            <span className="text-sm font-medium">{order.customer?.name || order.name || 'N/A'}</span>
                          </div>
                          <div className="mb-3">
                            <span className="text-xs text-gray-500 block">Email</span>
                            <span className="text-sm">{order.customer?.email || order.email || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Phone</span>
                            <span className="text-sm">{order.customer?.phone || order.phone || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-[250px]">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Shipping Address</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm">
                            {order.shippingAddress?.street || order.address || 'N/A'}<br />
                            {order.shippingAddress?.city || order.city || ''} {order.shippingAddress?.state || order.state || ''} {order.shippingAddress?.zip || order.zip || ''}
                            <br />
                            {order.shippingAddress?.country || order.country || ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(order.items) && order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.name || 'Product'}</div>
                                <div className="text-xs text-gray-500">{item.productId}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">${Number(item.price).toFixed(2)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{item.quantity}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="text-sm font-medium text-gray-900">
                                  ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 text-center">
                              <div className="text-sm text-gray-500">No items found in this order</div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex justify-end">
                      <div className="w-full max-w-xs">
                        <div className="flex justify-between py-2">
                          <span className="text-sm text-gray-600">Subtotal</span>
                          <span className="text-sm font-medium">${Number(order.subtotal || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-sm text-gray-600">Shipping</span>
                          <span className="text-sm font-medium">${Number(order.shipping || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-sm text-gray-600">Tax</span>
                          <span className="text-sm font-medium">${Number(order.tax || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-t border-gray-200">
                          <span className="text-base font-medium text-gray-900">Total</span>
                          <span className="text-base font-bold text-tacta-pink">${Number(order.total || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order Notes & Status */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Order Management</h3>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Update Status</h4>
                      <div className="flex gap-2">
                        <select className="input-field flex-1">
                          <option value="">Select Status</option>
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button className="btn-primary">Update</button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Add Note</h4>
                      <div className="flex flex-col gap-2">
                        <textarea 
                          className="input-field" 
                          rows="3" 
                          placeholder="Enter notes about this order..."
                        ></textarea>
                        <div className="flex justify-end">
                          <button className="btn-primary">Add Note</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="mt-4 text-lg font-medium text-gray-900">Order not found</h2>
                <p className="mt-2 text-sm text-gray-500">
                  The order you're looking for doesn't exist or has been removed.
                </p>
                <div className="mt-6">
                  <Link href="/admin/dashboard/orders" className="btn-primary">
                    Back to Orders
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 