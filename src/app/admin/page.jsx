'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Check if already authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (isAuthenticated === 'true') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get admin credentials from environment variables
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@tactaslime.com';
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'secure-password-here';
    
    if (email === adminEmail && password === adminPassword) {
      // Set authentication in localStorage
      localStorage.setItem('adminAuthenticated', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-tacta-cream flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <div className="relative h-24 w-72 mx-auto mb-4">
              <Image
                src="/images/TactaLogo_image001.png"
                alt="Tacta Slime Company Logo"
                fill
                className="object-contain"
                priority
                quality={100}
              />
            </div>
          </Link>
          <h1 className="text-2xl font-bold mt-6">Admin Login</h1>
          <p className="text-gray-600 mt-2">Please sign in to access the admin dashboard</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="input-field mt-1"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="input-field mt-1"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-tacta-pink focus:ring-tacta-pink-light border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
          </div>

          <div>
            <button type="submit" className="w-full flex justify-center btn-primary">
              Sign in
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-tacta-pink hover:text-tacta-pink-light">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 