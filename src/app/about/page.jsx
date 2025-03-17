import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tacta-pink-light to-tacta-peach-light py-16">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              About Tacta Slime
            </h1>
            <p className="text-lg mb-8 text-gray-700">
              The story of passion, creativity, and a love for all things slimy!
            </p>
          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-6 text-tacta-pink">Meet Our Founder</h2>
              <p className="text-gray-700 mb-4">
                Tacta Slime was founded by a young entrepreneur with a passion for creating unique sensory experiences. 
                What started as a fun hobby making slime for friends and family quickly grew into something much bigger.
              </p>
              <p className="text-gray-700 mb-4">
                At just 9 years old, our founder discovered the joy of slime-making and began experimenting with 
                different textures, colors, and scents. Using her allowance to buy supplies, she perfected her recipes 
                through countless hours of testing and refinement.
              </p>
              <p className="text-gray-700 mb-6">
                "I wanted to create slimes that weren't just fun to play with, but also looked beautiful, smelled amazing, 
                and lasted longer than store-bought options. Each slime is a little piece of art made with love."
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-tacta-pink rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-900">Young Entrepreneur with Big Dreams</span>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative w-full h-96 bg-tacta-cream rounded-lg shadow-lg overflow-hidden">
                {/* In production, replace with actual founder image */}
                <div className="absolute inset-0 bg-gradient-to-br from-tacta-pink to-tacta-peach opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center text-center p-6">
                  <span className="text-2xl font-bold text-tacta-pink">
                    Founder Image<br />
                    <span className="text-base font-normal text-gray-700">
                      (Add founder image to public/images folder)
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Handmade Process Section */}
      <section className="py-16 bg-tacta-cream">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Handmade Process</h2>
            <p className="text-lg text-gray-700">
              Every Tacta Slime is lovingly handcrafted in small batches to ensure the highest quality and most satisfying experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-tacta-pink rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">Premium Ingredients</h3>
              <p className="text-gray-700 text-center">
                We start with high-quality ingredients sourced for their purity and consistency. Each component is carefully measured to follow our secret recipes.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-tacta-pink rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">Handcrafted Creation</h3>
              <p className="text-gray-700 text-center">
                Every slime is mixed by hand with care and attention to detail. We take our time to achieve the perfect texture, incorporating unique additives for special effects.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-tacta-pink rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">Quality Testing</h3>
              <p className="text-gray-700 text-center">
                Each batch is thoroughly tested to ensure it meets our high standards for stretch, texture, and durability. Only slimes that pass this test make it to our customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative w-full h-96 bg-white rounded-lg shadow-lg overflow-hidden">
                {/* In production, replace with image of slime making */}
                <div className="absolute inset-0 bg-gradient-to-br from-tacta-peach to-tacta-pink opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center text-center p-6">
                  <span className="text-2xl font-bold text-tacta-peach">
                    Slime Making<br />
                    <span className="text-base font-normal text-gray-700">
                      (Add slime-making image to public/images folder)
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-tacta-peach">Our Values</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-tacta-pink-light rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                    <svg className="h-5 w-5 text-tacta-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Quality First</h3>
                    <p className="text-gray-700">
                      We never compromise on quality. From ingredients to packaging, we ensure every aspect of our slimes meets the highest standards.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-tacta-pink-light rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                    <svg className="h-5 w-5 text-tacta-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Creativity</h3>
                    <p className="text-gray-700">
                      We're constantly innovating and experimenting with new textures, colors, and scents to create unique slime experiences.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-tacta-pink-light rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                    <svg className="h-5 w-5 text-tacta-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
                    <p className="text-gray-700">
                      We're committed to using environmentally friendly packaging and sustainable practices wherever possible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-tacta-pink to-tacta-peach text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Experience Tacta Slime</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Ready to experience the magic of handcrafted slime? Explore our collection and find your perfect slime match!
          </p>
          <Link href="/products" className="inline-block bg-white text-tacta-pink font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300">
            Shop Now
          </Link>
        </div>
      </section>
    </Layout>
  );
} 