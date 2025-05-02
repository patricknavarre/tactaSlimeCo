import React from 'react';
import Image from 'next/image';

/**
 * ProductImage component that handles different image path formats
 * Works with both local paths and Blob Storage URLs
 */
const ProductImage = ({ src, alt, className, width = 500, height = 500, ...props }) => {
  // Check if the image source is a full URL or a local path
  const isFullUrl = src?.startsWith('http');
  
  // If it's a local path, make sure it has the correct structure
  const imageSrc = isFullUrl 
    ? src 
    : (src?.startsWith('/') ? src : `/${src}`);
  
  // For development, we need placeholder for broken images
  const onError = (e) => {
    console.warn('Image failed to load:', src);
    e.target.src = '/images/placeholder.jpg'; // Default placeholder
    e.target.onerror = null; // Prevent infinite loop
  };

  return (
    <div className={`relative overflow-hidden ${className || ''}`} {...props}>
      {/* Use Next Image for optimized images when possible */}
      {isFullUrl ? (
        <img
          src={imageSrc}
          alt={alt || 'Product'}
          className="w-full h-full object-cover"
          width={width}
          height={height}
          onError={onError}
        />
      ) : (
        <Image
          src={imageSrc}
          alt={alt || 'Product'}
          width={width}
          height={height}
          className="w-full h-full object-cover"
          onError={onError}
        />
      )}
    </div>
  );
};

export default ProductImage; 