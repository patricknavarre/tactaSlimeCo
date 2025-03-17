'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminProtection({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Check authentication on page load
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (isAuthenticated !== 'true') {
      router.push('/admin');
    }
  }, [router]);

  return children;
} 