'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Simple Settings Page Component
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('theme');
  const [saveStatus, setSaveStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Theme settings state 
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#ff407d',
    secondaryColor: '#6c48c9',
    type: 'theme'
  });

  // General store settings (for future use)
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Tacta Slime',
    storeEmail: 'info@tactaslime.com',
    storePhone: '',
    storeAddress: '',
    type: 'store'
  });
  
  // Fetch settings when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching settings...');
        const response = await fetch('/api/settings');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch settings: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Settings fetched:', data);
        
        // Handle the theme settings
        if (data && data.type === 'theme') {
          setThemeSettings({
            primaryColor: data.primaryColor || '#ff407d',
            secondaryColor: data.secondaryColor || '#6c48c9',
            type: 'theme'
          });
        }
        
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
  
  // Handle theme color changes
  const handleThemeChange = (field, value) => {
    setThemeSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle store settings changes
  const handleStoreChange = (field, value) => {
    setStoreSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Save settings to database
  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      console.log('Saving settings:', themeSettings);
      
      const settings = activeTab === 'theme' ? themeSettings : storeSettings;
      
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save settings: ${errorData.error || response.status}`);
      }
      
      const result = await response.json();
      console.log('Settings saved:', result);
      
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tacta-pink mx-auto"></div>
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
            className="w-full bg-tacta-pink text-white py-2 px-4 rounded-md hover:bg-tacta-pink-dark"
          >
            Try Again
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
              <div className="relative h-10 w-20 mr-2">
                <Image 
                  src="/images/TactaLogo_image002.png"
                  alt="Tacta Slime Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-semibold">Admin Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/" className="text-sm text-tacta-pink hover:text-tacta-pink-dark mr-4">
              View Site
            </Link>
            <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-800">
              Logout
            </Link>
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
                  onClick={() => setActiveTab('theme')}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === 'theme' ? 'bg-tacta-pink-light text-tacta-pink' : 'hover:bg-gray-100'
                  }`}
                >
                  Theme Settings
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('store')}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === 'store' ? 'bg-tacta-pink-light text-tacta-pink' : 'hover:bg-gray-100'
                  }`}
                >
                  Store Information
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {/* Theme Settings */}
          {activeTab === 'theme' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Theme Settings</h1>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Primary Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={themeSettings.primaryColor}
                        onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                        className="h-10 w-10 rounded border border-gray-300 mr-2"
                      />
                      <input
                        type="text"
                        value={themeSettings.primaryColor}
                        onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Used for buttons, links, and highlights
                    </p>
                  </div>
                  
                  {/* Secondary Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={themeSettings.secondaryColor}
                        onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                        className="h-10 w-10 rounded border border-gray-300 mr-2"
                      />
                      <input
                        type="text"
                        value={themeSettings.secondaryColor}
                        onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Used for accents and secondary elements
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Preview</h3>
                  <div className="bg-gray-100 p-4 rounded-md">
                    <div className="flex space-x-4 mb-4">
                      <button 
                        className="px-4 py-2 rounded-md text-white" 
                        style={{ backgroundColor: themeSettings.primaryColor }}
                      >
                        Primary Button
                      </button>
                      <button 
                        className="px-4 py-2 rounded-md text-white" 
                        style={{ backgroundColor: themeSettings.secondaryColor }}
                      >
                        Secondary Button
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <h4 
                        className="text-lg font-medium mb-2" 
                        style={{ color: themeSettings.primaryColor }}
                      >
                        Sample Heading
                      </h4>
                      <p className="text-gray-800">
                        Regular text with <a href="#" style={{ color: themeSettings.primaryColor }}>primary links</a> and 
                        <a href="#" style={{ color: themeSettings.secondaryColor }}> secondary links</a>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Store Settings (future implementation) */}
          {activeTab === 'store' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Store Information</h1>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 gap-6">
                  {/* Store Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={storeSettings.storeName}
                      onChange={(e) => handleStoreChange('storeName', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  {/* Store Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={storeSettings.storeEmail}
                      onChange={(e) => handleStoreChange('storeEmail', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  {/* Store Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={storeSettings.storePhone}
                      onChange={(e) => handleStoreChange('storePhone', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  {/* Store Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Store Address
                    </label>
                    <textarea
                      value={storeSettings.storeAddress}
                      onChange={(e) => handleStoreChange('storeAddress', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="123 Slime Street, Tacta City, TS 12345"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`px-4 py-2 rounded-md text-white ${
                saveStatus === 'saving' ? 'bg-gray-400' : 
                saveStatus === 'saved' ? 'bg-green-500' : 
                saveStatus === 'error' ? 'bg-red-500' : 
                'bg-tacta-pink hover:bg-tacta-pink-dark'
              }`}
            >
              {saveStatus === 'saving' ? 'Saving...' : 
               saveStatus === 'saved' ? 'Saved!' : 
               saveStatus === 'error' ? 'Error!' : 
               'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 