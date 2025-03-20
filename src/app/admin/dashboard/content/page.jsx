'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5051';

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
    },
    about: {
      heading: '',
      story: '',
      missionTitle: '',
      missionText: '',
    }
  });

  // Fetch content on component mount
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      console.log('Fetching content...');
      const response = await fetch(`${API_URL}/api/content`);
      const data = await response.json();
      
      console.log('Content API Response:', data);
      
      if (data.success && data.content) {
        console.log('Setting content:', data.content);
        setContent(data.content);
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
          if (key === 'heroImagePath') {
            formData.append('currentHeroImagePath', value);
          } else {
            formData.append(key, value);
          }
        });
      });

      const response = await fetch(`${API_URL}/api/content`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Content updated successfully!');
        fetchContent(); // Refresh content
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
      setContent(prev => ({
        ...prev,
        home: {
          ...prev.home,
          heroImage: file
        }
      }));
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
              {['home', 'about'].map((tab) => (
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
                      <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Hero Title
                      </label>
                      <input
                        type="text"
                        id="heroTitle"
                        value={content.home.heroTitle}
                        onChange={(e) => handleContentChange('home', 'heroTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-tacta-pink focus:border-tacta-pink"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Hero Subtitle
                      </label>
                      <input
                        type="text"
                        id="heroSubtitle"
                        value={content.home.heroSubtitle}
                        onChange={(e) => handleContentChange('home', 'heroSubtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-tacta-pink focus:border-tacta-pink"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="heroButtonText" className="block text-sm font-medium text-gray-700 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      id="heroButtonText"
                      value={content.home.heroButtonText}
                      onChange={(e) => handleContentChange('home', 'heroButtonText', e.target.value)}
                      className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-tacta-pink focus:border-tacta-pink"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hero Image
                    </label>
                    <div className="flex items-center space-x-4">
                      {content.home.heroImagePath && (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300">
                          <Image
                            src={content.home.heroImagePath}
                            alt="Hero Image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-tacta-pink-light file:text-tacta-pink hover:file:bg-tacta-pink-light/90"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Recommended size: 1200x800px. Max file size: 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <hr className="my-6 border-gray-200" />
                  
                  <h3 className="text-lg font-medium text-gray-900">Featured Products Section</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="featuredTitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Featured Title
                      </label>
                      <input
                        type="text"
                        id="featuredTitle"
                        value={content.home.featuredTitle}
                        onChange={(e) => handleContentChange('home', 'featuredTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-tacta-pink focus:border-tacta-pink"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="featuredSubtitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Featured Subtitle
                      </label>
                      <input
                        type="text"
                        id="featuredSubtitle"
                        value={content.home.featuredSubtitle}
                        onChange={(e) => handleContentChange('home', 'featuredSubtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-tacta-pink focus:border-tacta-pink"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* About Page Content */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">About Section</h3>
                  
                  <div>
                    <label htmlFor="aboutHeading" className="block text-sm font-medium text-gray-700 mb-1">
                      Heading
                    </label>
                    <input
                      type="text"
                      id="aboutHeading"
                      value={content.about.heading}
                      onChange={(e) => handleContentChange('about', 'heading', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-tacta-pink focus:border-tacta-pink"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="aboutStory" className="block text-sm font-medium text-gray-700 mb-1">
                      Story
                    </label>
                    <textarea
                      id="aboutStory"
                      rows={4}
                      value={content.about.story}
                      onChange={(e) => handleContentChange('about', 'story', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-tacta-pink focus:border-tacta-pink"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="missionTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Mission Title
                    </label>
                    <input
                      type="text"
                      id="missionTitle"
                      value={content.about.missionTitle}
                      onChange={(e) => handleContentChange('about', 'missionTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-tacta-pink focus:border-tacta-pink"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="missionText" className="block text-sm font-medium text-gray-700 mb-1">
                      Mission Text
                    </label>
                    <textarea
                      id="missionText"
                      rows={4}
                      value={content.about.missionText}
                      onChange={(e) => handleContentChange('about', 'missionText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-tacta-pink focus:border-tacta-pink"
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-tacta-pink text-white rounded-md hover:bg-tacta-pink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tacta-pink disabled:opacity-50 disabled:cursor-not-allowed"
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