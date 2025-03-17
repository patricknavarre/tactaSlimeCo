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
      },
      width: {
        'container': 'var(--container-width)',
      },
    },
  },
  plugins: [],
}; 