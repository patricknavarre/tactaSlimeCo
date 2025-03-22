'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AdminProtection from '@/components/AdminProtection';

export default function AdminDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    ordersToday: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Fetch products count
        const productsRes = await fetch('/api/products');
        const productsData = await productsRes.json();
        
        // Fetch orders
        const ordersRes = await fetch('/api/orders');
        const ordersData = await ordersRes.json();
        
        // Fetch customers
        const customersRes = await fetch('/api/customers');
        const customersData = await customersRes.json();
        
        // Calculate metrics
        const totalProducts = Array.isArray(productsData) ? productsData.length : 0;
        
        // Calculate orders today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const ordersToday = ordersData.orders?.filter(order => 
          new Date(order.createdAt) >= today
        ).length || 0;
        
        // Calculate total customers
        const totalCustomers = customersData.customers?.length || 0;
        
        // Calculate monthly revenue
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        firstDayOfMonth.setHours(0, 0, 0, 0);
        
        const monthlyOrders = ordersData.orders?.filter(order => 
          new Date(order.createdAt) >= firstDayOfMonth
        ) || [];
        
        const monthlyRevenue = monthlyOrders.reduce((sum, order) => 
          sum + (order.total || 0), 0);
        
        // Get recent products (up to 3)
        const recentProducts = productsData.products ? 
          [...productsData.products].sort((a, b) => 
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          ).slice(0, 3) : [];
        
        setDashboardData({
          totalProducts,
          ordersToday,
          totalCustomers,
          monthlyRevenue,
          recentProducts
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/admin');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <AdminProtection>
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
              <span className="ml-4 text-xl font-semibold text-gray-900">Admin Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin User</span>
              <Link href="/" className="btn-secondary text-sm">
                View Site
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-700 hover:text-tacta-pink cursor-pointer"
              >
                Logout
              </button>
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
                  <Link href="/admin/dashboard" className="block p-2 bg-tacta-pink-light text-tacta-pink rounded-md font-medium">
                    Dashboard
                  </Link>
                  <Link href="/admin/dashboard/products" className="block p-2 text-gray-700 hover:bg-tacta-pink-light hover:text-tacta-pink rounded-md">
                    Products
                  </Link>
                  <Link href="/admin/dashboard/orders" className="block p-2 text-gray-700 hover:bg-tacta-pink-light hover:text-tacta-pink rounded-md">
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
              {/* Loading state */}
              {loading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tacta-pink"></div>
                  <p className="mt-2 text-gray-500">Loading dashboard data...</p>
                </div>
              ) : (
                <>
                  {/* Overview Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-tacta-pink-light text-tacta-pink">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-500 font-medium">Total Products</p>
                          <p className="text-2xl font-semibold text-gray-900">{dashboardData.totalProducts}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-tacta-peach-light text-tacta-peach">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-500 font-medium">Orders (Today)</p>
                          <p className="text-2xl font-semibold text-gray-900">{dashboardData.ordersToday}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-tacta-pink-light text-tacta-pink">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-500 font-medium">Customers</p>
                          <p className="text-2xl font-semibold text-gray-900">{dashboardData.totalCustomers}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-tacta-peach-light text-tacta-peach">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-500 font-medium">Revenue (Month)</p>
                          <p className="text-2xl font-semibold text-gray-900">{formatCurrency(dashboardData.monthlyRevenue)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow mb-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Link href="/admin/dashboard/products/new" className="btn-primary text-center">
                        Add New Product
                      </Link>
                      <Link href="/admin/dashboard/orders" className="btn-secondary text-center">
                        View Recent Orders
                      </Link>
                      <Link href="/admin/dashboard/content" className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors text-center">
                        Update Content
                      </Link>
                    </div>
                  </div>
                  
                  {/* Recent Products */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
                      <Link href="/admin/dashboard/products" className="text-sm text-tacta-pink hover:text-tacta-pink-light font-medium">
                        View All
                      </Link>
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
                              Inventory
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {dashboardData.recentProducts.length > 0 ? (
                            dashboardData.recentProducts.map((product) => (
                              <tr key={product._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 bg-tacta-cream rounded-md flex items-center justify-center text-xs text-gray-500">
                                      {product.imagePath ? (
                                        <div className="relative h-10 w-10">
                                          <Image
                                            src={product.imagePath}
                                            alt={product.name}
                                            fill
                                            className="object-cover rounded-md"
                                          />
                                        </div>
                                      ) : (
                                        "Image"
                                      )}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">${product.price?.toFixed(2)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{product.inventory}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-tacta-pink-light text-tacta-pink">
                                    {product.category}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex justify-end space-x-2">
                                    <Link href={`/admin/dashboard/products/${product._id}/edit`} className="text-tacta-pink hover:text-tacta-pink-light">
                                      Edit
                                    </Link>
                                    <Link href={`/products/${product._id}`} className="text-gray-500 hover:text-gray-700">
                                      View
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                No products found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminProtection>
  );
} 