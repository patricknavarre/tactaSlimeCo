'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/components/ThemeProvider';

export default function AppearanceManagement() {
  const [activeTab, setActiveTab] = useState('colors');
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [error, setError] = useState(null);
  
  // Local state for appearance settings
  const [colors, setColors] = useState({
    primary: '#0f766e',
    secondary: '#ec4899',
    accent: '#8b5cf6',
    background: '#f9fafb',
    text: '#111827'
  });
  
  const [typography, setTypography] = useState({
    headingFont: 'Inter',
    bodyFont: 'Inter',
    headingSize: 'large',
    bodySize: 'medium'
  });
  
  const [layout, setLayout] = useState({
    containerWidth: 'medium',
    borderRadius: 'medium',
    cardShadow: 'medium',
    buttonStyle: 'rounded'
  });
  
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
        
        if (data.appearanceSettings) {
          const { colors: themeColors, typography: themeTypography, layout: themeLayout } = data.appearanceSettings;
          
          if (themeColors) setColors(themeColors);
          if (themeTypography) setTypography(themeTypography);
          if (themeLayout) setLayout(themeLayout);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching appearance settings:', err);
        setError('Failed to load appearance settings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  // Save settings to database
  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          appearanceSettings: {
            colors,
            typography,
            layout
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save appearance settings');
      }
      
      // Reload the page to apply the theme changes
      setSaveStatus('saved');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('Error saving appearance settings:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };
  
  // Reset to defaults
  const handleReset = () => {
    setColors({
      primary: '#0f766e',
      secondary: '#ec4899',
      accent: '#8b5cf6',
      background: '#f9fafb',
      text: '#111827'
    });
    
    setTypography({
      headingFont: 'Inter',
      bodyFont: 'Inter',
      headingSize: 'large',
      bodySize: 'medium'
    });
    
    setLayout({
      containerWidth: 'medium',
      borderRadius: 'medium',
      cardShadow: 'medium',
      buttonStyle: 'rounded'
    });
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading appearance settings...</p>
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
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <nav>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveTab('colors')}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === 'colors' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Colors
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('typography')}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === 'typography' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Typography
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('layout')}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === 'layout' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Layout
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === 'preview' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Preview
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">
              {activeTab === 'colors' && 'Color Settings'}
              {activeTab === 'typography' && 'Typography Settings'}
              {activeTab === 'layout' && 'Layout Settings'}
              {activeTab === 'preview' && 'Preview Theme'}
            </h1>

            {/* Tab Content */}
            <div className="mt-6">
              {/* Colors Tab */}
              {activeTab === 'colors' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Color
                      </label>
                      <div className="flex rounded-md overflow-hidden border border-gray-300">
                        <div className="w-10 h-10" style={{ backgroundColor: colors.primary }}></div>
                        <input
                          type="text"
                          value={colors.primary}
                          onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                          className="flex-1 border-0 focus:ring-0"
                        />
                        <input
                          type="color"
                          value={colors.primary}
                          onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                          className="h-10 p-1 border-0"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Used for buttons, links, and accents</p>
                    </div>

                    {/* Secondary Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secondary Color
                      </label>
                      <div className="flex rounded-md overflow-hidden border border-gray-300">
                        <div className="w-10 h-10" style={{ backgroundColor: colors.secondary }}></div>
                        <input
                          type="text"
                          value={colors.secondary}
                          onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                          className="flex-1 border-0 focus:ring-0"
                        />
                        <input
                          type="color"
                          value={colors.secondary}
                          onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                          className="h-10 p-1 border-0"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Used for secondary buttons and elements</p>
                    </div>

                    {/* Accent Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Accent Color
                      </label>
                      <div className="flex rounded-md overflow-hidden border border-gray-300">
                        <div className="w-10 h-10" style={{ backgroundColor: colors.accent }}></div>
                        <input
                          type="text"
                          value={colors.accent}
                          onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                          className="flex-1 border-0 focus:ring-0"
                        />
                        <input
                          type="color"
                          value={colors.accent}
                          onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                          className="h-10 p-1 border-0"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Used for highlights and accents</p>
                    </div>

                    {/* Background Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Background Color
                      </label>
                      <div className="flex rounded-md overflow-hidden border border-gray-300">
                        <div className="w-10 h-10" style={{ backgroundColor: colors.background }}></div>
                        <input
                          type="text"
                          value={colors.background}
                          onChange={(e) => setColors({ ...colors, background: e.target.value })}
                          className="flex-1 border-0 focus:ring-0"
                        />
                        <input
                          type="color"
                          value={colors.background}
                          onChange={(e) => setColors({ ...colors, background: e.target.value })}
                          className="h-10 p-1 border-0"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Used for page backgrounds</p>
                    </div>

                    {/* Text Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Text Color
                      </label>
                      <div className="flex rounded-md overflow-hidden border border-gray-300">
                        <div className="w-10 h-10" style={{ backgroundColor: colors.text }}></div>
                        <input
                          type="text"
                          value={colors.text}
                          onChange={(e) => setColors({ ...colors, text: e.target.value })}
                          className="flex-1 border-0 focus:ring-0"
                        />
                        <input
                          type="color"
                          value={colors.text}
                          onChange={(e) => setColors({ ...colors, text: e.target.value })}
                          className="h-10 p-1 border-0"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Used for main text content</p>
                    </div>
                  </div>

                  {/* Color Preview */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Color Preview</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {['primary', 'secondary', 'accent', 'background', 'text'].map((colorKey) => (
                        <div key={colorKey} className="flex flex-col items-center">
                          <div 
                            className="w-16 h-16 rounded-md border border-gray-200" 
                            style={{ backgroundColor: colors[colorKey] }}
                          ></div>
                          <span className="mt-2 text-xs text-gray-500 capitalize">{colorKey}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Typography Tab */}
              {activeTab === 'typography' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Heading Font */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Heading Font
                      </label>
                      <select
                        value={typography.headingFont}
                        onChange={(e) => setTypography({ ...typography, headingFont: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Lato">Lato</option>
                      </select>
                      <p className="mt-1 text-sm text-gray-500">Font used for headings and titles</p>
                    </div>

                    {/* Body Font */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Body Font
                      </label>
                      <select
                        value={typography.bodyFont}
                        onChange={(e) => setTypography({ ...typography, bodyFont: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Lato">Lato</option>
                      </select>
                      <p className="mt-1 text-sm text-gray-500">Font used for main content</p>
                    </div>

                    {/* Heading Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Heading Size
                      </label>
                      <select
                        value={typography.headingSize}
                        onChange={(e) => setTypography({ ...typography, headingSize: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>

                    {/* Body Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Body Size
                      </label>
                      <select
                        value={typography.bodySize}
                        onChange={(e) => setTypography({ ...typography, bodySize: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>

                  {/* Typography Preview */}
                  <div className="mt-8 p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Typography Preview</h3>
                    <div className="space-y-4">
                      <div>
                        <h1 style={{ 
                          fontFamily: typography.headingFont,
                          fontSize: typography.headingSize === 'small' ? '1.5rem' : 
                                    typography.headingSize === 'medium' ? '1.875rem' : '2.25rem'
                        }}>
                          Heading 1 Text
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">This is how your main headings will look</p>
                      </div>
                      <div>
                        <h2 style={{ 
                          fontFamily: typography.headingFont,
                          fontSize: typography.headingSize === 'small' ? '1.25rem' : 
                                    typography.headingSize === 'medium' ? '1.5rem' : '1.875rem'
                        }}>
                          Heading 2 Text
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">This is how your secondary headings will look</p>
                      </div>
                      <div>
                        <p style={{ 
                          fontFamily: typography.bodyFont,
                          fontSize: typography.bodySize === 'small' ? '0.875rem' : 
                                    typography.bodySize === 'medium' ? '1rem' : '1.125rem'
                        }}>
                          This is how your body text will look. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Layout Tab */}
              {activeTab === 'layout' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Container Width */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Container Width
                      </label>
                      <select
                        value={layout.containerWidth}
                        onChange={(e) => setLayout({ ...layout, containerWidth: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="narrow">Narrow (85%)</option>
                        <option value="medium">Medium (90%)</option>
                        <option value="wide">Wide (95%)</option>
                      </select>
                      <p className="mt-1 text-sm text-gray-500">Controls how wide your content appears</p>
                    </div>

                    {/* Border Radius */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Border Radius
                      </label>
                      <select
                        value={layout.borderRadius}
                        onChange={(e) => setLayout({ ...layout, borderRadius: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="none">None (Square Corners)</option>
                        <option value="small">Small (0.25rem)</option>
                        <option value="medium">Medium (0.5rem)</option>
                        <option value="large">Large (1rem)</option>
                        <option value="pill">Pill (Full Rounded)</option>
                      </select>
                      <p className="mt-1 text-sm text-gray-500">Controls how rounded corners appear</p>
                    </div>

                    {/* Card Shadow */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Card Shadow
                      </label>
                      <select
                        value={layout.cardShadow}
                        onChange={(e) => setLayout({ ...layout, cardShadow: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="none">None</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                      <p className="mt-1 text-sm text-gray-500">Controls shadow depth on cards and panels</p>
                    </div>

                    {/* Button Style */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Button Style
                      </label>
                      <select
                        value={layout.buttonStyle}
                        onChange={(e) => setLayout({ ...layout, buttonStyle: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="square">Square</option>
                        <option value="rounded">Rounded</option>
                        <option value="pill">Pill</option>
                      </select>
                      <p className="mt-1 text-sm text-gray-500">Controls button corner style</p>
                    </div>
                  </div>

                  {/* Layout Preview */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Layout Preview</h3>
                    <div 
                      className="border border-gray-200 rounded-lg p-6"
                      style={{ 
                        width: layout.containerWidth === 'narrow' ? '85%' : 
                               layout.containerWidth === 'medium' ? '90%' : '95%',
                        margin: '0 auto',
                        borderRadius: layout.borderRadius === 'none' ? '0' :
                                      layout.borderRadius === 'small' ? '0.25rem' :
                                      layout.borderRadius === 'medium' ? '0.5rem' :
                                      layout.borderRadius === 'large' ? '1rem' : '9999px',
                        boxShadow: layout.cardShadow === 'none' ? 'none' :
                                   layout.cardShadow === 'small' ? '0 1px 3px rgba(0,0,0,0.1)' :
                                   layout.cardShadow === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)' : 
                                   '0 10px 15px rgba(0,0,0,0.1)'
                      }}
                    >
                      <h4 className="text-base font-medium mb-4">Sample Card</h4>
                      <p className="text-sm text-gray-600 mb-4">This is how your cards and containers will appear with the selected settings.</p>
                      <button
                        className="px-4 py-2 text-white text-sm"
                        style={{
                          backgroundColor: colors.primary,
                          borderRadius: layout.buttonStyle === 'square' ? '0' :
                                        layout.buttonStyle === 'rounded' ? '0.375rem' : '9999px'
                        }}
                      >
                        Sample Button
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Tab */}
              {activeTab === 'preview' && (
                <div className="space-y-8">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-100 p-4 border-b border-gray-200" style={{ backgroundColor: colors.background }}>
                      <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-full mr-2"></div>
                            <span style={{ 
                              fontFamily: typography.headingFont, 
                              color: colors.text,
                              fontWeight: 'bold'
                            }}>
                              Tacta Slime
                            </span>
                          </div>
                          <div>
                            <div className="flex space-x-4">
                              <span style={{ color: colors.text, fontFamily: typography.bodyFont }}>Home</span>
                              <span style={{ color: colors.primary, fontFamily: typography.bodyFont }}>Products</span>
                              <span style={{ color: colors.text, fontFamily: typography.bodyFont }}>About</span>
                              <span style={{ color: colors.text, fontFamily: typography.bodyFont }}>Contact</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6" style={{ backgroundColor: colors.background }}>
                      <div style={{ 
                        width: layout.containerWidth === 'narrow' ? '85%' : 
                               layout.containerWidth === 'medium' ? '90%' : '95%',
                        margin: '0 auto',
                      }}>
                        {/* Hero Section */}
                        <div className="text-center py-8">
                          <h1 style={{ 
                            fontFamily: typography.headingFont,
                            fontSize: typography.headingSize === 'small' ? '1.5rem' : 
                                      typography.headingSize === 'medium' ? '1.875rem' : '2.25rem',
                            color: colors.text
                          }}>
                            Welcome to Tacta Slime
                          </h1>
                          <p style={{ 
                            fontFamily: typography.bodyFont,
                            fontSize: typography.bodySize === 'small' ? '0.875rem' : 
                                      typography.bodySize === 'medium' ? '1rem' : '1.125rem',
                            color: colors.text,
                            maxWidth: '600px',
                            margin: '1rem auto'
                          }}>
                            Discover our amazing collection of handcrafted slimes in various colors, textures, and scents.
                          </p>
                          <button
                            className="px-4 py-2 text-white text-sm mt-4"
                            style={{
                              backgroundColor: colors.primary,
                              borderRadius: layout.buttonStyle === 'square' ? '0' :
                                            layout.buttonStyle === 'rounded' ? '0.375rem' : '9999px'
                            }}
                          >
                            Shop Now
                          </button>
                        </div>
                        
                        {/* Product Grid */}
                        <div className="mt-8">
                          <h2 style={{ 
                            fontFamily: typography.headingFont,
                            fontSize: typography.headingSize === 'small' ? '1.25rem' : 
                                      typography.headingSize === 'medium' ? '1.5rem' : '1.875rem',
                            color: colors.text,
                            marginBottom: '1rem'
                          }}>
                            Featured Products
                          </h2>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((item) => (
                              <div 
                                key={item}
                                style={{ 
                                  backgroundColor: 'white',
                                  borderRadius: layout.borderRadius === 'none' ? '0' :
                                                layout.borderRadius === 'small' ? '0.25rem' :
                                                layout.borderRadius === 'medium' ? '0.5rem' :
                                                layout.borderRadius === 'large' ? '1rem' : '9999px',
                                  boxShadow: layout.cardShadow === 'none' ? 'none' :
                                             layout.cardShadow === 'small' ? '0 1px 3px rgba(0,0,0,0.1)' :
                                             layout.cardShadow === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)' : 
                                             '0 10px 15px rgba(0,0,0,0.1)',
                                  overflow: 'hidden'
                                }}
                              >
                                <div className="h-40 bg-gray-200"></div>
                                <div className="p-4">
                                  <h3 style={{ 
                                    fontFamily: typography.headingFont,
                                    color: colors.text,
                                    fontWeight: 'bold'
                                  }}>
                                    Product {item}
                                  </h3>
                                  <p style={{ 
                                    fontFamily: typography.bodyFont,
                                    color: colors.text,
                                    fontSize: '0.875rem',
                                    marginTop: '0.5rem'
                                  }}>
                                    A beautiful slime product with amazing texture.
                                  </p>
                                  <div className="flex justify-between items-center mt-4">
                                    <span style={{ 
                                      fontFamily: typography.bodyFont,
                                      fontWeight: 'bold',
                                      color: colors.text
                                    }}>
                                      $12.99
                                    </span>
                                    <button
                                      className="px-3 py-1 text-white text-xs"
                                      style={{
                                        backgroundColor: colors.secondary,
                                        borderRadius: layout.buttonStyle === 'square' ? '0' :
                                                      layout.buttonStyle === 'rounded' ? '0.375rem' : '9999px'
                                      }}
                                    >
                                      Add to Cart
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Footer */}
                        <div className="mt-12 pt-6 border-t border-gray-200">
                          <p style={{ 
                            fontFamily: typography.bodyFont,
                            fontSize: '0.875rem',
                            color: colors.text,
                            opacity: 0.8,
                            textAlign: 'center'
                          }}>
                            © 2023 Tacta Slime. All rights reserved.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Reset to Defaults
              </button>
              
              <div className="flex items-center">
                {saveStatus === 'error' && (
                  <div className="mr-4 text-red-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Failed to save
                  </div>
                )}
                
                {saveStatus === 'saved' && (
                  <div className="mr-4 text-green-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Changes saved!
                  </div>
                )}
                
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={saveStatus === 'saving'}
                >
                  {saveStatus === 'saving' ? 'Saving...' : 'Apply Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 