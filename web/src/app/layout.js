// src/app/layout.js
"use client";

import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/layout/navbar/Navbar';
import Footer from '@/layout/footer/Footer';
import { ThemeProvider } from '@/themes/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <div className="flex flex-col min-h-screen">
            <div className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
            <main className="flex-1">
              <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                  <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </main>
            <div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}