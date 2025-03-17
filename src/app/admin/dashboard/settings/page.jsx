'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Simple Settings Page Component
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Settings state
  const [settings, setSettings] = useState(null);
  
  // Fetch settings when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/settings');
        
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        
        const data = await response.json();
        setSettings(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  // Handle input changes
  const handleGeneralChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      storeInfo: {
        ...prev.storeInfo,
        [field]: value
      }
    }));
  };
  
  const handleConfigChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      generalSettings: {
        ...prev.generalSettings,
        [field]: value
      }
    }));
  };
  
  const handlePaymentChange = (index, enabled) => {
    setSettings(prev => {
      const updatedPayments = [...prev.paymentMethods];
      updatedPayments[index] = {
        ...updatedPayments[index],
        enabled
      };
      
      return {
        ...prev,
        paymentMethods: updatedPayments
      };
    });
  };
  
  const handleShippingChange = (index, field, value) => {
    setSettings(prev => {
      const updatedShipping = [...prev.shippingOptions];
      updatedShipping[index] = {
        ...updatedShipping[index],
        [field]: value
      };
      
      return {
        ...prev,
        shippingOptions: updatedShipping
      };
    });
  };
  
  const handleNotificationChange = (type, field, value) => {
    setSettings(prev => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [type]: {
          ...prev.notificationSettings[type],
          [field]: value
        }
      }
    }));
  };
  
  // Save settings to database
  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading settings...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center mb-4">Error Loading Settings</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // No settings found
  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700">No settings found. Please try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="flex items-center">
              <Image 
                src="/images/TactaLogo_image002.png"
                alt="Tacta Slime Logo"
                width={40}
                height={40}
                className="h-10 w-auto mr-2"
              />
              <span className="text-lg font-semibold">Admin Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 mr-4">
              View Site
            </Link>
            <button className="text-sm text-red-600 hover:text-red-800">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow h-[calc(100vh-4rem)] p-4">
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          <nav>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveTab('general')}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === 'general' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  General
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === 'payments' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Payments
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === 'shipping' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Shipping
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === 'notifications' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Notifications
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === 'users' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Users
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">
              {activeTab === 'general' && 'General Settings'}
              {activeTab === 'payments' && 'Payment Settings'}
              {activeTab === 'shipping' && 'Shipping Settings'}
              {activeTab === 'notifications' && 'Notification Settings'}
              {activeTab === 'users' && 'User Settings'}
            </h1>
            
            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Store Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={settings.storeInfo.name}
                      onChange={(e) => handleGeneralChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Store Email</label>
                    <input
                      type="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={settings.storeInfo.email}
                      onChange={(e) => handleGeneralChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={settings.storeInfo.phone}
                      onChange={(e) => handleGeneralChange('phone', e.target.value)}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Store Address</label>
                    <textarea
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={settings.storeInfo.address}
                      onChange={(e) => handleGeneralChange('address', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <select 
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={settings.generalSettings.currency}
                      onChange={(e) => handleConfigChange('currency', e.target.value)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Default Language</label>
                    <select 
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={settings.generalSettings.language}
                      onChange={(e) => handleConfigChange('language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={settings.generalSettings.taxRate || 0}
                      onChange={(e) => handleConfigChange('taxRate', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-4">
                  <p className="text-gray-700">Configure your payment methods and settings</p>
                  {settings.paymentMethods.map((method, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`payment-${method.name}`} 
                            className="h-4 w-4 text-blue-600" 
                            checked={method.enabled}
                            onChange={(e) => handlePaymentChange(index, e.target.checked)}
                          />
                          <label htmlFor={`payment-${method.name}`} className="ml-2 block text-sm font-medium text-gray-700">
                            {method.name}
                          </label>
                        </div>
                        <button className="text-sm text-blue-600">Configure</button>
                      </div>
                    </div>
                  ))}
                  <button className="text-sm text-blue-600">+ Add Payment Method</button>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-4">
                  <p className="text-gray-700">Configure your shipping options</p>
                  {settings.shippingOptions.map((option, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`shipping-${index}`} 
                            className="h-4 w-4 text-blue-600" 
                            checked={option.enabled}
                            onChange={(e) => handleShippingChange(index, 'enabled', e.target.checked)}
                          />
                          <label htmlFor={`shipping-${index}`} className="ml-2 block text-sm font-medium text-gray-700">
                            {option.name}
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">${option.price.toFixed(2)}</span>
                          <button className="text-sm text-blue-600">Edit</button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                  ))}
                  <button className="text-sm text-blue-600">+ Add Shipping Option</button>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <p className="text-gray-700">Configure your email notifications</p>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">New Order Notifications</label>
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input 
                          type="checkbox" 
                          id="new-order" 
                          className="sr-only" 
                          checked={settings.notificationSettings.newOrder.enabled}
                          onChange={(e) => handleNotificationChange('newOrder', 'enabled', e.target.checked)}
                        />
                        <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                        <div className={`dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition-transform ${
                          settings.notificationSettings.newOrder.enabled ? 'transform translate-x-4' : ''
                        }`}></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Receive email notifications when new orders are placed</p>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Low Stock Alerts</label>
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input 
                          type="checkbox" 
                          id="low-stock" 
                          className="sr-only" 
                          checked={settings.notificationSettings.lowStock.enabled}
                          onChange={(e) => handleNotificationChange('lowStock', 'enabled', e.target.checked)}
                        />
                        <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                        <div className={`dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition-transform ${
                          settings.notificationSettings.lowStock.enabled ? 'transform translate-x-4' : ''
                        }`}></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Receive alerts when product stock is low</p>
                    
                    {settings.notificationSettings.lowStock.enabled && (
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-700">Threshold</label>
                        <input
                          type="number"
                          min="1"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={settings.notificationSettings.lowStock.threshold}
                          onChange={(e) => handleNotificationChange('lowStock', 'threshold', parseInt(e.target.value))}
                        />
                        <p className="text-xs text-gray-500 mt-1">Alert when stock falls below this number</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Customer Signup Notifications</label>
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input 
                          type="checkbox" 
                          id="customer-signup" 
                          className="sr-only" 
                          checked={settings.notificationSettings.customerSignup.enabled}
                          onChange={(e) => handleNotificationChange('customerSignup', 'enabled', e.target.checked)}
                        />
                        <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                        <div className={`dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition-transform ${
                          settings.notificationSettings.customerSignup.enabled ? 'transform translate-x-4' : ''
                        }`}></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Receive email notifications when new customers sign up</p>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-4">
                  <p className="text-gray-700">Manage admin users</p>
                  
                  {settings.users.length > 0 ? (
                    settings.users.map((user, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-700">{user.name}</h3>
                            <p className="text-xs text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-500">Role: {user.role}</p>
                          </div>
                          <button className="text-sm text-blue-600">Edit</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">Admin</h3>
                          <p className="text-xs text-gray-500">admin@tactaslime.com</p>
                        </div>
                        <button className="text-sm text-blue-600">Edit</button>
                      </div>
                    </div>
                  )}
                  
                  <button className="text-sm text-blue-600">+ Add User</button>
                </div>
              )}
            </div>

            {/* Save Button and Status */}
            <div className="mt-6 flex justify-end">
              {saveStatus === 'error' && (
                <div className="mr-4 text-red-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Failed to save settings
                </div>
              )}
              
              {saveStatus === 'saved' && (
                <div className="mr-4 text-green-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Settings saved successfully
                </div>
              )}
              
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={saveStatus === 'saving' || isLoading}
              >
                {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 