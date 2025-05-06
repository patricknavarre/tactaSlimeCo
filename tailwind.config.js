/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
        'accent': 'var(--color-accent)',
        'background': 'var(--color-background)',
        'text': 'var(--color-text)',
        'tacta-pink': '#ff1493',
        'tacta-peach': '#ff9776',
        'tacta-pink-light': '#fff0f5',
        'tacta-cream': '#fff6f9',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      fontSize: {
        'heading': 'var(--heading-size)',
        'body': 'var(--body-size)',
      },
      borderRadius: {
        'theme': 'var(--border-radius)',
        'button': 'var(--button-radius)',
      },
      boxShadow: {
        'theme': 'var(--card-shadow)',
        'lg': '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      width: {
        'container': 'var(--container-width)',
      },
      textShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.1)',
        'DEFAULT': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-25%)' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulse: 'pulse 3s ease-in-out infinite',
        fadeIn: 'fadeIn 0.3s ease-in-out',
        bounce: 'bounce 1s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          textShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}; 