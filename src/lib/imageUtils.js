/**
 * Utility functions for handling image paths across environments
 */

// Function to get the absolute URL for an image path
export function getImageUrl(imagePath) {
  // If it's already an absolute URL, return it as is
  if (imagePath?.startsWith('http')) {
    return imagePath;
  }
  
  // If path is empty or undefined, return default image
  if (!imagePath) {
    return '/images/default.jpg';
  }
  
  // For local paths, check if we're in production
  if (typeof window !== 'undefined') {
    // Client-side: use the current origin
    return `${window.location.origin}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  } else {
    // Server-side: use the environment variable if available
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    return `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  }
} 