"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CartIcon from '@/components/cart/CartIcon';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Close menu when pathname changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Function to check if a link is active
  const isActive = (path) => pathname === path;

  // Function to check if products nav item should show as active
  const isProductsActive = () => {
    return pathname === '/products' || 
           pathname === '/products/best-sellers' || 
           pathname === '/products/new-arrivals' || 
           pathname === '/products/sale-items' ||
           pathname.startsWith('/products/');
  };
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close menu when a link is clicked
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-[#FF1493] to-[#FF7F50] shadow-md relative">
      <div className="container-custom py-4">
        <nav className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" aria-label="Tacta Slime Company Home">
              <div className="relative h-24 w-24 md:h-32 md:w-32 bg-white rounded-full p-2 shadow-lg transform hover:scale-105 transition-transform duration-300 border-4 border-white overflow-hidden hover:shadow-2xl">
                <Image
                  src="/images/TactaLogo_image002.png"
                  alt="Tacta Slime Company Logo"
                  fill
                  className="object-contain p-1"
                  priority
                  quality={100}
                />
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-4">
            <Link 
              href="/products" 
              className={`
                inline-block px-6 py-2 rounded-full font-bold 
                text-tacta-pink bg-white
                border-2 border-black border-b-4 border-r-4
                shadow-[0_4px_0_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.1)]
                hover:shadow-[0_6px_0_rgba(0,0,0,0.15),0_3px_8px_rgba(0,0,0,0.1)]
                active:shadow-[0_2px_0_rgba(0,0,0,0.1),0_1px_4px_rgba(0,0,0,0.1)]
                active:border-b-2 active:border-r-2
                transition-all duration-200 ease-in-out transform hover:-translate-y-1 active:translate-y-1
                ${isActive('/products') ? 'text-[#FF1493] border-[#FF1493] border-b-black border-r-black' : ''}
              `}
            >
              Shop
            </Link>
            
            <Link 
              href="/about" 
              className={`
                inline-block px-6 py-2 rounded-full font-bold 
                text-tacta-pink bg-white
                border-2 border-black border-b-4 border-r-4
                shadow-[0_4px_0_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.1)]
                hover:shadow-[0_6px_0_rgba(0,0,0,0.15),0_3px_8px_rgba(0,0,0,0.1)]
                active:shadow-[0_2px_0_rgba(0,0,0,0.1),0_1px_4px_rgba(0,0,0,0.1)]
                active:border-b-2 active:border-r-2
                transition-all duration-200 ease-in-out transform hover:-translate-y-1 active:translate-y-1
                ${isActive('/about') ? 'text-[#FF1493] border-[#FF1493] border-b-black border-r-black' : ''}
              `}
            >
              About Us
            </Link>
            <Link 
              href="/faq" 
              className={`
                inline-block px-6 py-2 rounded-full font-bold 
                text-tacta-pink bg-white
                border-2 border-black border-b-4 border-r-4
                shadow-[0_4px_0_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.1)]
                hover:shadow-[0_6px_0_rgba(0,0,0,0.15),0_3px_8px_rgba(0,0,0,0.1)]
                active:shadow-[0_2px_0_rgba(0,0,0,0.1),0_1px_4px_rgba(0,0,0,0.1)]
                active:border-b-2 active:border-r-2
                transition-all duration-200 ease-in-out transform hover:-translate-y-1 active:translate-y-1
                ${isActive('/faq') ? 'text-[#FF1493] border-[#FF1493] border-b-black border-r-black' : ''}
              `}
            >
              FAQ
            </Link>
            <Link 
              href="/contact" 
              className={`
                inline-block px-6 py-2 rounded-full font-bold 
                text-tacta-pink bg-white
                border-2 border-black border-b-4 border-r-4
                shadow-[0_4px_0_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.1)]
                hover:shadow-[0_6px_0_rgba(0,0,0,0.15),0_3px_8px_rgba(0,0,0,0.1)]
                active:shadow-[0_2px_0_rgba(0,0,0,0.1),0_1px_4px_rgba(0,0,0,0.1)]
                active:border-b-2 active:border-r-2
                transition-all duration-200 ease-in-out transform hover:-translate-y-1 active:translate-y-1
                ${isActive('/contact') ? 'text-[#FF1493] border-[#FF1493] border-b-black border-r-black' : ''}
              `}
            >
              Contact
            </Link>
          </div>
          
          <div className="flex space-x-4 items-center">
            <CartIcon />
            
            <button 
              className="md:hidden bg-white rounded-full p-2 shadow-[0_4px_0_rgba(0,0,0,0.1),0_2px_6px_rgba(0,0,0,0.1)] text-tacta-pink transform transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_6px_0_rgba(0,0,0,0.1),0_3px_8px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-[0_2px_0_rgba(0,0,0,0.1),0_1px_4px_rgba(0,0,0,0.1)]"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
      
      {/* Mobile menu dropdown */}
      <div className={`mobile-menu ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="container-custom py-4">
          <div className="flex flex-col space-y-3">
            <Link 
              href="/products" 
              className={`
                inline-block px-6 py-2 rounded-full font-bold 
                text-tacta-pink bg-white
                border-2 border-black border-b-4 border-r-4
                shadow-[0_4px_0_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.1)]
                hover:shadow-[0_6px_0_rgba(0,0,0,0.15),0_3px_8px_rgba(0,0,0,0.1)]
                active:shadow-[0_2px_0_rgba(0,0,0,0.1),0_1px_4px_rgba(0,0,0,0.1)]
                active:border-b-2 active:border-r-2
                transition-all duration-200 ease-in-out transform hover:-translate-y-1 active:translate-y-1
                ${isActive('/products') ? 'text-[#FF1493] border-[#FF1493] border-b-black border-r-black' : ''}
              `}
              onClick={closeMenu}
            >
              Shop
            </Link>
            
            <Link 
              href="/about" 
              className={`
                inline-block px-6 py-2 rounded-full font-bold 
                text-tacta-pink bg-white
                border-2 border-black border-b-4 border-r-4
                shadow-[0_4px_0_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.1)]
                hover:shadow-[0_6px_0_rgba(0,0,0,0.15),0_3px_8px_rgba(0,0,0,0.1)]
                active:shadow-[0_2px_0_rgba(0,0,0,0.1),0_1px_4px_rgba(0,0,0,0.1)]
                active:border-b-2 active:border-r-2
                transition-all duration-200 ease-in-out transform hover:-translate-y-1 active:translate-y-1
                ${isActive('/about') ? 'text-[#FF1493] border-[#FF1493] border-b-black border-r-black' : ''}
              `}
              onClick={closeMenu}
            >
              About Us
            </Link>
            <Link 
              href="/faq" 
              className={`
                inline-block px-6 py-2 rounded-full font-bold 
                text-tacta-pink bg-white
                border-2 border-black border-b-4 border-r-4
                shadow-[0_4px_0_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.1)]
                hover:shadow-[0_6px_0_rgba(0,0,0,0.15),0_3px_8px_rgba(0,0,0,0.1)]
                active:shadow-[0_2px_0_rgba(0,0,0,0.1),0_1px_4px_rgba(0,0,0,0.1)]
                active:border-b-2 active:border-r-2
                transition-all duration-200 ease-in-out transform hover:-translate-y-1 active:translate-y-1
                ${isActive('/faq') ? 'text-[#FF1493] border-[#FF1493] border-b-black border-r-black' : ''}
              `}
              onClick={closeMenu}
            >
              FAQ
            </Link>
            <Link 
              href="/contact" 
              className={`
                inline-block px-6 py-2 rounded-full font-bold 
                text-tacta-pink bg-white
                border-2 border-black border-b-4 border-r-4
                shadow-[0_4px_0_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.1)]
                hover:shadow-[0_6px_0_rgba(0,0,0,0.15),0_3px_8px_rgba(0,0,0,0.1)]
                active:shadow-[0_2px_0_rgba(0,0,0,0.1),0_1px_4px_rgba(0,0,0,0.1)]
                active:border-b-2 active:border-r-2
                transition-all duration-200 ease-in-out transform hover:-translate-y-1 active:translate-y-1
                ${isActive('/contact') ? 'text-[#FF1493] border-[#FF1493] border-b-black border-r-black' : ''}
              `}
              onClick={closeMenu}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-10 animation-fadeIn"
          onClick={closeMenu}
          aria-hidden="true"
        ></div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animation-fadeIn {
          animation: fadeIn 0.2s ease;
        }
        
        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: white;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          z-index: 20;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.3s ease;
          opacity: 0;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
        }
        
        .mobile-menu-open {
          max-height: 500px;
          opacity: 1;
        }
      `}</style>
    </header>
  );
};

export default Header; 