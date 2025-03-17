'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CustomersManagement() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  // Fetch customers on component mount and when search or pagination changes
  useEffect(() => {
    fetchCustomers();
  }, [currentPage, search]);

  // Function to fetch customers from the API
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams();
      if (search) searchParams.append('search', search);
      searchParams.append('page', currentPage);
      searchParams.append('limit', 10);
      
      const response = await fetch(`/api/customers?${searchParams.toString()}`);
      const data = await response.json();
      
      if (data.success && data.customers) {
        setCustomers(data.customers);
        setTotalPages(data.pagination?.pages || 1);
      } else {
        console.error('Failed to fetch customers:', data.message);
        setError(data.message || 'Failed to fetch customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('An error occurred while fetching customers');
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
      day: 'numeric'
    });
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchCustomers();
  };

  // Handle bulk customer selection
  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers(prev => {
      if (prev.includes(customerId)) {
        return prev.filter(id => id !== customerId);
      } else {
        return [...prev, customerId];
      }
    });
  };

  // Handle select/deselect all customers
  const handleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map(customer => customer._id));
    }
  };

  // Delete a customer
  const handleDeleteCustomer = async (customerId) => {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove from state to avoid refetching
        setCustomers(customers.filter(customer => customer._id !== customerId));
        setSelectedCustomers(prev => prev.filter(id => id !== customerId));
      } else {
        alert(`Failed to delete customer: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('An error occurred while trying to delete the customer.');
    }
  };

  // Show loading state
  if (isLoading && customers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tacta-pink"></div>
          <p className="mt-2 text-gray-600">Loading customers...</p>
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
            <span className="ml-4 text-xl font-semibold text-gray-900">Customers Management</span>
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
                <Link href="/admin/dashboard/orders" className="block p-2 text-gray-700 hover:bg-tacta-pink-light hover:text-tacta-pink rounded-md">
                  Orders
                </Link>
                <Link href="/admin/dashboard/customers" className="block p-2 bg-tacta-pink-light text-tacta-pink rounded-md font-medium">
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
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Customers</h2>
                <div className="flex space-x-2">
                  <Link href="/admin/dashboard/customers/new" className="btn-primary text-sm">
                    Add New Customer
                  </Link>
                  <button className="btn-secondary text-sm">
                    Export Customers
                  </button>
                </div>
              </div>
              
              {/* Filters and Search */}
              <div className="p-6 border-b border-gray-200">
                <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Search customers by name, email..."
                      className="input-field"
                      value={search}
                      onChange={handleSearchChange}
                    />
                    <button type="submit" className="btn-primary ml-2">
                      Search
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <select className="input-field py-1.5 text-sm w-40">
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    
                    <select className="input-field py-1.5 text-sm w-52">
                      <option value="">Sort By</option>
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                      <option value="date-newest">Date Added (Newest)</option>
                      <option value="date-oldest">Date Added (Oldest)</option>
                      <option value="orders-most">Most Orders</option>
                      <option value="spent-most">Highest Spend</option>
                    </select>
                  </div>
                </form>
              </div>
              
              {/* Customer Stats */}
              <div className="p-6 border-b border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <p className="text-2xl font-bold">{customers.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Active Customers</p>
                  <p className="text-2xl font-bold text-green-600">
                    {customers.filter(customer => customer.status?.toLowerCase() === 'active').length}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Customer Spend</p>
                  <p className="text-2xl font-bold">
                    ${customers.reduce((total, customer) => total + (customer.totalSpent || 0), 0).toFixed(2)}
                  </p>
                </div>
              </div>
              
              {/* Customers Table */}
              <div className="overflow-x-auto">
                {error && (
                  <div className="p-6 text-center text-red-600">
                    <p>{error}</p>
                  </div>
                )}
                
                {!error && customers.length === 0 ? (
                  <div className="py-12 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No customers yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start adding customers or they'll appear here once they make purchases.
                    </p>
                    <div className="mt-6">
                      <Link href="/admin/dashboard/customers/new" className="btn-primary text-sm">
                        Add New Customer
                      </Link>
                    </div>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-tacta-pink focus:ring-tacta-pink-light border-gray-300 rounded"
                              checked={selectedCustomers.length === customers.length && customers.length > 0}
                              onChange={handleSelectAll}
                            />
                          </div>
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact Info
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Orders
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Spent
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers.map((customer) => (
                        <tr key={customer._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-tacta-pink focus:ring-tacta-pink-light border-gray-300 rounded"
                                checked={selectedCustomers.includes(customer._id)}
                                onChange={() => handleSelectCustomer(customer._id)}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-tacta-pink-light rounded-full flex items-center justify-center text-tacta-pink font-bold">
                                {customer.firstName?.charAt(0) || ''}{customer.lastName?.charAt(0) || ''}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {customer.firstName} {customer.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {customer.customerId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{customer.email}</div>
                            <div className="text-sm text-gray-500">{customer.phone || 'No phone'}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              customer.status?.toLowerCase() === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {customer.status || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {customer.orderCount || 0}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              ${(customer.totalSpent || 0).toFixed(2)}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(customer.createdAt)}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link 
                                href={`/admin/dashboard/customers/edit/${customer._id}`} 
                                className="text-tacta-pink hover:text-tacta-pink-light"
                              >
                                Edit
                              </Link>
                              <button 
                                onClick={() => handleDeleteCustomer(customer._id)} 
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              
              {/* Pagination */}
              {customers.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{customers.length}</span> results
                        {totalPages > 1 && (
                          <span> (Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>)</span>
                        )}
                      </p>
                    </div>
                    {totalPages > 1 && (
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          {/* Page buttons would go here - simplified for now */}
                          <button 
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-tacta-pink-light text-sm font-medium text-tacta-pink"
                          >
                            {currentPage}
                          </button>
                          <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Bulk Actions */}
              {selectedCustomers.length > 0 && (
                <div className="fixed bottom-4 inset-x-0 flex justify-center">
                  <div className="bg-white rounded-lg shadow-lg px-4 py-3 flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-900">
                      {selectedCustomers.length} {selectedCustomers.length === 1 ? 'customer' : 'customers'} selected
                    </span>
                    <button className="btn-secondary text-sm">
                      Export Selected
                    </button>
                    <button 
                      className="btn-danger text-sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${selectedCustomers.length} customers? This action cannot be undone.`)) {
                          // Implement bulk delete functionality here
                          alert('Bulk delete not implemented yet');
                        }
                      }}
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 