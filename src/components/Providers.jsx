'use client';

import React from 'react';
import { CartProvider } from '@/context/CartContext';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }) {
  return (
    <SessionProvider
      session={{
        refetchInterval: 0,
        refetchOnWindowFocus: false
      }}
    >
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  );
} 