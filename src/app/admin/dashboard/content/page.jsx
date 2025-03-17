'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock content data - in a real app, this would be fetched from the database
  const [homeContent, setHomeContent] = useState({
    heroTitle: 'Discover the Magic of Tacta Slime',
    heroSubtitle: 'Handcrafted with love, designed to bring joy',
    heroButtonText: 'Shop Now',
    featuredTitle: 'Our Popular Collections',
    featuredSubtitle: 'Explore our most loved slimes',
  });

  const [aboutContent, setAboutContent] = useState({
    heading: 'About Tacta Slime',
    story: 'Founded in 2020, Tacta Slime started as a passion project and quickly grew into a beloved brand...',
    missionTitle: 'Our Mission',
    missionText: 'To create the highest quality slime products that bring joy and sensory satisfaction to people of all ages.',
  });

  // Mock FAQs
  const [faqs, setFaqs] = useState([
    { 
      id: 1, 
      question: 'How long does slime last?', 
      answer: 'When stored properly in an airtight container, our slime can last for several months. Keep it away from heat and direct sunlight.' 
    },
    { 
      id: 2, 
      question: 'Are your slimes scented?', 
      answer: 'Yes! Most of our slimes have coordinating scents that match their theme. You can find scent details in each product description.' 
    },
    { 
      id: 3, 
      question: 'Is your slime safe for children?', 
      answer: 'Our slimes are made with non-toxic ingredients, but they are not edible. We recommend adult supervision for children under 8 years old.' 
    },
  ]);

  // Mock testimonials
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: 'Emma S.',
      content: 'The cloud slime is absolutely amazing! So fluffy and satisfying to play with.',
      rating: 5,
      featured: true,
    },
    {
      id: 2,
      name: 'Michael J.',
      content: 'My daughter loves the butter slime. Great texture and holds up well with frequent use.',
      rating: 5,
      featured: true,
    },
    {
      id: 3,
      name: 'Sophia L.',
      content: 'The glitter galaxy slime is stunning! Beautiful colors and the perfect consistency.',
      rating: 4,
      featured: false,
    },
  ]);

  // Handle form input changes for different content sections
  const handleHomeContentChange = (e) => {
    const { name, value } = e.target;
    setHomeContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAboutContentChange = (e) => {
    const { name, value } = e.target;
    setAboutContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new FAQ
  const handleAddFaq = () => {
    const newId = faqs.length ? Math.max(...faqs.map(faq => faq.id)) + 1 : 1;
    setFaqs([...faqs, { id: newId, question: '', answer: '' }]);
  };

  // Update FAQ
  const handleFaqChange = (id, field, value) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    ));
  };

  // Delete FAQ
  const handleDeleteFaq = (id) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(faqs.filter(faq => faq.id !== id));
    }
  };

  // Toggle testimonial featured status
  const handleToggleFeatured = (id) => {
    setTestimonials(testimonials.map(testimonial => 
      testimonial.id === id ? { ...testimonial, featured: !testimonial.featured } : testimonial
    ));
  };

  // Delete testimonial
  const handleDeleteTestimonial = (id) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
    }
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to save content
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Content updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 1000);
  };
  
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
                <Link href="/admin/dashboard/customers" className="block p-2 text-gray-700 hover:bg-tacta-pink-light hover:text-tacta-pink rounded-md">
                  Customers
                </Link>
                <Link href="/admin/dashboard/content" className="block p-2 bg-tacta-pink-light text-tacta-pink rounded-md font-medium">
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
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Website Content</h2>
                <p className="text-sm text-gray-600 mt-1">Manage website content and static pages</p>
              </div>
              
              {/* Content Tabs */}
              <div className="px-6 pt-4 border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  <button 
                    onClick={() => setActiveTab('home')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg mr-2 ${
                      activeTab === 'home' 
                        ? 'bg-tacta-pink-light text-tacta-pink border-b-2 border-tacta-pink' 
                        : 'text-gray-600 hover:text-tacta-pink'
                    }`}
                  >
                    Home Page
                  </button>
                  <button 
                    onClick={() => setActiveTab('about')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg mr-2 ${
                      activeTab === 'about' 
                        ? 'bg-tacta-pink-light text-tacta-pink border-b-2 border-tacta-pink' 
                        : 'text-gray-600 hover:text-tacta-pink'
                    }`}
                  >
                    About Us
                  </button>
                  <button 
                    onClick={() => setActiveTab('faqs')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg mr-2 ${
                      activeTab === 'faqs' 
                        ? 'bg-tacta-pink-light text-tacta-pink border-b-2 border-tacta-pink' 
                        : 'text-gray-600 hover:text-tacta-pink'
                    }`}
                  >
                    FAQs
                  </button>
                  <button 
                    onClick={() => setActiveTab('testimonials')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg mr-2 ${
                      activeTab === 'testimonials' 
                        ? 'bg-tacta-pink-light text-tacta-pink border-b-2 border-tacta-pink' 
                        : 'text-gray-600 hover:text-tacta-pink'
                    }`}
                  >
                    Testimonials
                  </button>
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="p-6">
                {/* Success message */}
                {successMessage && (
                  <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                    {successMessage}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  {/* Home Page Content */}
                  {activeTab === 'home' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Hero Section</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            Hero Title
                          </label>
                          <input
                            type="text"
                            id="heroTitle"
                            name="heroTitle"
                            value={homeContent.heroTitle}
                            onChange={handleHomeContentChange}
                            className="input-field"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700 mb-1">
                            Hero Subtitle
                          </label>
                          <input
                            type="text"
                            id="heroSubtitle"
                            name="heroSubtitle"
                            value={homeContent.heroSubtitle}
                            onChange={handleHomeContentChange}
                            className="input-field"
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
                          name="heroButtonText"
                          value={homeContent.heroButtonText}
                          onChange={handleHomeContentChange}
                          className="input-field w-1/3"
                        />
                      </div>
                      
                      <hr className="my-6" />
                      
                      <h3 className="text-lg font-medium text-gray-900">Featured Products Section</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="featuredTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            Section Title
                          </label>
                          <input
                            type="text"
                            id="featuredTitle"
                            name="featuredTitle"
                            value={homeContent.featuredTitle}
                            onChange={handleHomeContentChange}
                            className="input-field"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="featuredSubtitle" className="block text-sm font-medium text-gray-700 mb-1">
                            Section Subtitle
                          </label>
                          <input
                            type="text"
                            id="featuredSubtitle"
                            name="featuredSubtitle"
                            value={homeContent.featuredSubtitle}
                            onChange={handleHomeContentChange}
                            className="input-field"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <button 
                          type="submit" 
                          className="btn-primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* About Us Content */}
                  {activeTab === 'about' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">About Us Page</h3>
                      
                      <div>
                        <label htmlFor="heading" className="block text-sm font-medium text-gray-700 mb-1">
                          Page Heading
                        </label>
                        <input
                          type="text"
                          id="heading"
                          name="heading"
                          value={aboutContent.heading}
                          onChange={handleAboutContentChange}
                          className="input-field"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="story" className="block text-sm font-medium text-gray-700 mb-1">
                          Our Story
                        </label>
                        <textarea
                          id="story"
                          name="story"
                          value={aboutContent.story}
                          onChange={handleAboutContentChange}
                          rows={4}
                          className="input-field"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="missionTitle" className="block text-sm font-medium text-gray-700 mb-1">
                          Mission Title
                        </label>
                        <input
                          type="text"
                          id="missionTitle"
                          name="missionTitle"
                          value={aboutContent.missionTitle}
                          onChange={handleAboutContentChange}
                          className="input-field"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="missionText" className="block text-sm font-medium text-gray-700 mb-1">
                          Mission Text
                        </label>
                        <textarea
                          id="missionText"
                          name="missionText"
                          value={aboutContent.missionText}
                          onChange={handleAboutContentChange}
                          rows={3}
                          className="input-field"
                        />
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <button 
                          type="submit" 
                          className="btn-primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* FAQs Content */}
                  {activeTab === 'faqs' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h3>
                        <button 
                          type="button" 
                          onClick={handleAddFaq}
                          className="btn-secondary text-sm"
                        >
                          Add New FAQ
                        </button>
                      </div>
                      
                      {faqs.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No FAQs added yet. Click "Add New FAQ" to create one.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {faqs.map((faq) => (
                            <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-sm font-medium text-gray-900">FAQ #{faq.id}</h4>
                                <button 
                                  type="button" 
                                  onClick={() => handleDeleteFaq(faq.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Question
                                  </label>
                                  <input
                                    type="text"
                                    value={faq.question}
                                    onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)}
                                    className="input-field"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Answer
                                  </label>
                                  <textarea
                                    value={faq.answer}
                                    onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)}
                                    rows={3}
                                    className="input-field"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-end mt-4">
                        <button 
                          type="submit" 
                          className="btn-primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Testimonials Content */}
                  {activeTab === 'testimonials' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Customer Testimonials</h3>
                        <button 
                          type="button" 
                          className="btn-secondary text-sm"
                        >
                          Add New Testimonial
                        </button>
                      </div>
                      
                      {testimonials.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No testimonials added yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                  <h4 className="text-sm font-medium text-gray-900 mr-2">{testimonial.name}</h4>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <svg 
                                        key={i} 
                                        className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button 
                                    type="button" 
                                    onClick={() => handleToggleFeatured(testimonial.id)}
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      testimonial.featured 
                                        ? 'bg-tacta-pink-light text-tacta-pink' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                  >
                                    {testimonial.featured ? 'Featured' : 'Make Featured'}
                                  </button>
                                  <button 
                                    type="button" 
                                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                              
                              <div className="mt-2">
                                <p className="text-sm text-gray-700">"{testimonial.content}"</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-end mt-4">
                        <button 
                          type="submit" 
                          className="btn-primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 