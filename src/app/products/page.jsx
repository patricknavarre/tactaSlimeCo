"use client";

import React, { Suspense } from 'react';
import Layout from '@/components/layout/Layout';
import { ProductsContent } from './original-page';

// We're now using the original products functionality by default
export default function ProductsPage() {
  return (
    <Layout>
      <Suspense fallback={
        <div className="container-custom py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tacta-pink mb-4"></div>
          <p className="text-lg text-gray-600">Loading products...</p>
        </div>
      }>
        <ProductsContent />
      </Suspense>
    </Layout>
  );
} 