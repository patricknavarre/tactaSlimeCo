import './globals.css';
import { Inter } from 'next/font/google';
import { Fredoka } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import Providers from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const fredoka = Fredoka({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-fredoka',
});

export const metadata = {
  title: 'Tacta Slime Company | Premium Handmade Slime',
  description: 'Tacta Slime Company offers high-quality, handmade slimes in a variety of textures, colors, and scents. Shop our premium slime collection today!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${fredoka.variable}`}>
      <ThemeProvider>
        <Providers>
          <body>
            {children}
          </body>
        </Providers>
      </ThemeProvider>
    </html>
  );
} 