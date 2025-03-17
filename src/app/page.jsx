import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';

export default function Home() {
  // In a real application, these would come from the database
  const featuredProducts = [
    {
      id: 1,
      name: 'Butter Slime - Strawberry',
      price: 12.99,
      image: '/images/slime-butter.jpg',
      description: 'Smooth butter slime with a delicious strawberry scent.'
    },
    {
      id: 2,
      name: 'Glitter Galaxy Slime',
      price: 15.99,
      image: '/images/slime-galaxy.jpg',
      description: 'Mesmerizing galaxy slime filled with holographic glitter.'
    },
    {
      id: 3,
      name: 'Video Game Slime',
      price: 14.99,
      image: '/images/slime-video-game.jpg',
      description: 'Colorful slime inspired by retro video games with a fun texture.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tacta-pink-light to-tacta-peach-light py-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="relative h-32 w-full max-w-sm mb-6">
                <Image
                  src="/images/TactaLogo_image001.png"
                  alt="Tacta Slime Company Logo"
                  fill
                  className="object-contain object-left"
                  priority
                  quality={100}
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Welcome to Tacta Slime Company
              </h1>
              <p className="text-lg mb-6 text-gray-700">
                Experience the joy of playing with premium handmade slime. Our slimes are made with high-quality ingredients for the most satisfying sensory experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="btn-primary cartoon-btn">
                  Shop Now
                </Link>
                <Link href="/about" className="btn-secondary cartoon-btn">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md h-80 bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Note: In a production environment, replace this with an actual hero image */}
                <div className="absolute inset-0 bg-gradient-to-br from-tacta-pink to-tacta-peach opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                  <span className="text-xl font-bold text-white">
                    Hero Image<br />
                    <span className="text-sm font-normal">(Add product images to public/images folder)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Our Featured Slimes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {featuredProducts.map((product) => (
              <div key={product.id} className="card group relative">
                <div className="absolute top-2 left-2 z-10">
                  <span className="bg-tacta-peach text-white text-xs px-2 py-1 rounded-full uppercase tracking-wide">
                    Featured
                  </span>
                </div>
                <div className="relative h-64 bg-tacta-cream">
                  {/* This would be an actual image in production */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm text-gray-500">{product.name} Image</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-tacta-pink transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-2 text-sm">{product.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
                    <button className="btn-primary cartoon-btn text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/products" className="btn-secondary cartoon-btn">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-tacta-cream py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Why Choose Tacta Slime?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-tacta-pink rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-gray-700">
                We use only the finest ingredients to create long-lasting, high-quality slimes that maintain their texture.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-tacta-peach rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Safe Ingredients</h3>
              <p className="text-gray-700">
                All our slimes are made with non-toxic ingredients that are safe for children and adults alike.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-tacta-pink-light rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-tacta-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Unique Designs</h3>
              <p className="text-gray-700">
                Each slime is handcrafted with unique colors, scents, and textures that you won't find anywhere else.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Slime Club</h2>
          <p className="text-lg mb-8">
            Subscribe to our newsletter for exclusive deals, new releases, and slime tips!
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Your email address"
              className="input-field sm:flex-1 max-w-md"
              required
            />
            <button type="submit" className="btn-primary cartoon-btn whitespace-nowrap">
              Subscribe Now
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
} 