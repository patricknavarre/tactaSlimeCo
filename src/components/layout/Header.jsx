"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CartIcon from '@/components/cart/CartIcon';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container-custom py-4">
        <nav className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" aria-label="Tacta Slime Company Home">
              <div className="relative h-20 w-64 md:h-24 md:w-72">
                {/* Updated to use the new logo */}
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
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-tacta-pink font-medium">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-tacta-pink font-medium">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-tacta-pink font-medium">
              Contact
            </Link>
          </div>
          
          <div className="flex space-x-4 items-center">
            <CartIcon />
            
            <button className="md:hidden text-gray-700 hover:text-tacta-pink">
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 