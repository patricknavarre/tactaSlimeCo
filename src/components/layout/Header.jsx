"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CartIcon from '@/components/cart/CartIcon';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Function to check if a link is active
  const isActive = (path) => pathname === path;
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close menu when a link is clicked
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  return (
    <header className="bg-white shadow-sm relative">
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
          
          <div className="hidden md:flex space-x-4">
            <Link 
              href="/products" 
              className={`nav-link ${isActive('/products') ? 'nav-link-active' : ''}`}
            >
              <span className="nav-bubble">Products</span>
            </Link>
            <Link 
              href="/about" 
              className={`nav-link ${isActive('/about') ? 'nav-link-active' : ''}`}
            >
              <span className="nav-bubble">About Us</span>
            </Link>
            <Link 
              href="/contact" 
              className={`nav-link ${isActive('/contact') ? 'nav-link-active' : ''}`}
            >
              <span className="nav-bubble">Contact</span>
            </Link>
          </div>
          
          <div className="flex space-x-4 items-center">
            <CartIcon />
            
            <button 
              className="md:hidden mobile-menu-btn"
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
              className={`nav-link-mobile ${isActive('/products') ? 'nav-link-mobile-active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-bubble-mobile">Products</span>
            </Link>
            <Link 
              href="/about" 
              className={`nav-link-mobile ${isActive('/about') ? 'nav-link-mobile-active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-bubble-mobile">About Us</span>
            </Link>
            <Link 
              href="/contact" 
              className={`nav-link-mobile ${isActive('/contact') ? 'nav-link-mobile-active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-bubble-mobile">Contact</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="menu-overlay" 
          onClick={closeMenu}
          aria-hidden="true"
        ></div>
      )}
      
      <style jsx>{`
        .nav-link {
          position: relative;
          transform: translateY(0);
          transition: all 0.2s ease;
        }
        
        .nav-link:hover {
          transform: translateY(-2px);
        }
        
        .nav-bubble {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-weight: bold;
          font-size: 1rem;
          background-color: #fff6f9;
          color: #ff7bac;
          border: 2px solid #ffc0d9;
          box-shadow: 0 3px 0 rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        
        .nav-link:hover .nav-bubble {
          background-color: #ffebf3;
          box-shadow: 0 5px 0 rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .nav-link-active .nav-bubble {
          background-color: #ffd6e7;
          border-color: #ff7bac;
          box-shadow: 0 3px 0 rgba(0, 0, 0, 0.15);
        }
        
        .mobile-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: #fff6f9;
          color: #ff7bac;
          border: 2px solid #ffc0d9;
          border-radius: 9999px;
          box-shadow: 0 3px 0 rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          z-index: 30;
        }
        
        .mobile-menu-btn:hover {
          background-color: #ffebf3;
          box-shadow: 0 5px 0 rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        
        .mobile-menu-btn:active {
          transform: translateY(1px);
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
        }
        
        /* Mobile Menu Styles */
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
          max-height: 300px;
          opacity: 1;
        }
        
        .nav-link-mobile {
          display: block;
          padding: 0.5rem 0;
          transition: all 0.2s ease;
        }
        
        .nav-bubble-mobile {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-weight: bold;
          font-size: 1rem;
          background-color: #fff6f9;
          color: #ff7bac;
          border: 2px solid #ffc0d9;
          box-shadow: 0 3px 0 rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        
        .nav-link-mobile-active .nav-bubble-mobile {
          background-color: #ffd6e7;
          border-color: #ff7bac;
          box-shadow: 0 3px 0 rgba(0, 0, 0, 0.15);
        }
        
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.3);
          z-index: 10;
          animation: fadeIn 0.2s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </header>
  );
};

export default Header; 