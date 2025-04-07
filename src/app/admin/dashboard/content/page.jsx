'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [content, setContent] = useState({
    home: {
      heroTitle: '',
      heroSubtitle: '',
      heroButtonText: '',
      heroImagePath: '',
      featuredTitle: '',
      featuredSubtitle: '',
      video: {
        url: '',
        type: 'youtube',
        title: ''
      }
    },
    menu: {
      title: '',
      subtitle: '',
      products: []
    },
    about: {
      heading: '',
      story: '',
      missionTitle: '',
      missionText: '',
      video: {
        url: '',
        type: 'youtube',
        title: ''
      }
    }
  });

  // Fetch content on component mount
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      console.log('Fetching content...');
      const response = await fetch('/api/content');
      const data = await response.json();
      
      console.log('Content API Response:', data);
      
      if (data.success && data.content) {
        // Ensure all values are strings
        const sanitizedContent = {
          home: {
            heroTitle: data.content.home?.heroTitle || '',
            heroSubtitle: data.content.home?.heroSubtitle || '',
            heroButtonText: data.content.home?.heroButtonText || '',
            heroImagePath: data.content.home?.heroImagePath || '',
            featuredTitle: data.content.home?.featuredTitle || '',
            featuredSubtitle: data.content.home?.featuredSubtitle || '',
            video: data.content.home?.video || {
              url: '',
              type: 'youtube',
              title: ''
            }
          },
          menu: {
            title: data.content.menu?.title || 'Tacta Slime Menu',
            subtitle: data.content.menu?.subtitle || 'Discover our handcrafted slimes available at today\'s market!',
            products: data.content.menu?.products || []
          },
          about: {
            heading: data.content.about?.heading || '',
            story: data.content.about?.story || '',
            missionTitle: data.content.about?.missionTitle || '',
            missionText: data.content.about?.missionText || '',
            video: data.content.about?.video || {
              url: '',
              type: 'youtube',
              title: ''
            }
          }
        };
        
        console.log('Setting content:', sanitizedContent);
        setContent(sanitizedContent);
        setError(''); // Clear any existing error
      } else {
        console.error('API Error Response:', data);
        setError(data.error || data.details || 'Failed to fetch content');
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setError(`Failed to fetch content: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.entries(content).forEach(([section, fields]) => {
        Object.entries(fields).forEach(([key, value]) => {
          if (key === 'products') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value || '');
          }
        });
      });

      // Add hero image if present
      if (content.home.heroImage) {
        formData.append('heroImage', content.home.heroImage);
      }

      const response = await fetch('/api/content', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Content updated successfully!');
        // Update the content with the new hero image path
        if (data.content?.home?.heroImagePath) {
          setContent(prev => ({
            ...prev,
            home: {
              ...prev.home,
              heroImagePath: data.content.home.heroImagePath,
              heroImage: null // Clear the file after successful upload
            }
          }));
        }
      } else {
        setError(data.error || 'Failed to update content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      setError('Failed to update content');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContentChange = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview the image immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setContent(prev => ({
          ...prev,
          home: {
            ...prev.home,
            heroImage: file,
            heroImagePath: reader.result // Set temporary preview
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            <span className="ml-4 text-xl font-semibold text-gray-900">Content Management</span>
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

      {/* Main Content */}
      <main className="container-custom py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {['home', 'menu', 'about'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-tacta-pink text-tacta-pink'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Form */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Home Page Content */}
              {activeTab === 'home' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Hero Section</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hero Title</label>
                      <input
                        type="text"
                        value={content.home.heroTitle}
                        onChange={(e) => handleContentChange('home', 'heroTitle', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tacta-pink focus:ring-tacta-pink sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hero Subtitle</label>
                      <input
                        type="text"
                        value={content.home.heroSubtitle}
                        onChange={(e) => handleContentChange('home', 'heroSubtitle', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tacta-pink focus:ring-tacta-pink sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hero Button Text</label>
                    <input
                      type="text"
                      value={content.home.heroButtonText}
                      onChange={(e) => handleContentChange('home', 'heroButtonText', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tacta-pink focus:ring-tacta-pink sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hero Image</label>
                    <div className="mt-1 flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-tacta-pink-light file:text-tacta-pink hover:file:bg-tacta-pink-dark"
                      />
                      {content.home.heroImagePath && (
                        <div className="relative h-20 w-20">
                          <Image
                            src={content.home.heroImagePath}
                            alt="Hero Preview"
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Page Content */}
              {activeTab === 'menu' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Menu Page Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Menu Title</label>
                      <input
                        type="text"
                        value={content.menu.title}
                        onChange={(e) => handleContentChange('menu', 'title', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tacta-pink focus:ring-tacta-pink sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Menu Subtitle</label>
                      <input
                        type="text"
                        value={content.menu.subtitle}
                        onChange={(e) => handleContentChange('menu', 'subtitle', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tacta-pink focus:ring-tacta-pink sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Products</h4>
                    <div className="flex justify-end mb-4">
                      <Link 
                        href="/admin/dashboard/products"
                        className="btn-primary text-sm"
                      >
                        Manage Products
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* About Page Content */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">About Page Content</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Page Heading</label>
                    <input
                      type="text"
                      value={content.about.heading}
                      onChange={(e) => handleContentChange('about', 'heading', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tacta-pink focus:ring-tacta-pink sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Our Story</label>
                    <textarea
                      rows={4}
                      value={content.about.story}
                      onChange={(e) => handleContentChange('about', 'story', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tacta-pink focus:ring-tacta-pink sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mission Title</label>
                    <input
                      type="text"
                      value={content.about.missionTitle}
                      onChange={(e) => handleContentChange('about', 'missionTitle', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tacta-pink focus:ring-tacta-pink sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mission Text</label>
                    <textarea
                      rows={4}
                      value={content.about.missionText}
                      onChange={(e) => handleContentChange('about', 'missionText', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tacta-pink focus:ring-tacta-pink sm:text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 