'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { CartProvider } from '@/context/CartContext';

const ThemeContext = createContext({});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTheme() {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        
        if (data.appearanceSettings) {
          setTheme(data.appearanceSettings);
        }
      } catch (error) {
        console.error('Failed to load theme settings:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadTheme();
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!theme) return;
    
    // Apply CSS variables to the :root element
    const root = document.documentElement;
    
    // Apply colors
    if (theme.colors) {
      root.style.setProperty('--color-primary', theme.colors.primary);
      root.style.setProperty('--color-secondary', theme.colors.secondary);
      root.style.setProperty('--color-accent', theme.colors.accent);
      root.style.setProperty('--color-background', theme.colors.background);
      root.style.setProperty('--color-text', theme.colors.text);
    }
    
    // Apply typography
    if (theme.typography) {
      root.style.setProperty('--font-heading', theme.typography.headingFont);
      root.style.setProperty('--font-body', theme.typography.bodyFont);
      
      // Font sizes
      const headingSizes = {
        small: '1.5rem',
        medium: '1.875rem',
        large: '2.25rem'
      };
      
      const bodySizes = {
        small: '0.875rem',
        medium: '1rem',
        large: '1.125rem'
      };
      
      root.style.setProperty('--heading-size', headingSizes[theme.typography.headingSize] || '1.875rem');
      root.style.setProperty('--body-size', bodySizes[theme.typography.bodySize] || '1rem');
    }
    
    // Apply layout
    if (theme.layout) {
      const containerSizes = {
        narrow: '85%',
        medium: '90%',
        wide: '95%'
      };
      
      const radiusSizes = {
        none: '0',
        small: '0.25rem',
        medium: '0.5rem',
        large: '1rem',
        pill: '9999px'
      };
      
      const shadowSizes = {
        none: 'none',
        small: '0 1px 3px rgba(0,0,0,0.1)',
        medium: '0 4px 6px rgba(0,0,0,0.1)',
        large: '0 10px 15px rgba(0,0,0,0.1)'
      };
      
      const buttonStyles = {
        square: '0',
        rounded: '0.375rem',
        pill: '9999px'
      };
      
      root.style.setProperty('--container-width', containerSizes[theme.layout.containerWidth] || '90%');
      root.style.setProperty('--border-radius', radiusSizes[theme.layout.borderRadius] || '0.5rem');
      root.style.setProperty('--card-shadow', shadowSizes[theme.layout.cardShadow] || '0 4px 6px rgba(0,0,0,0.1)');
      root.style.setProperty('--button-radius', buttonStyles[theme.layout.buttonStyle] || '0.375rem');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, loading }}>
      <CartProvider>
        {children}
      </CartProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext); 