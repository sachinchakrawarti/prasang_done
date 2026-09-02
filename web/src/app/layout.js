// src/app/layout.js
"use client";

import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/layout/navbar/Navbar';
import Footer from '@/layout/footer/Footer';
import { ThemeProvider } from '@/themes/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if current route is admin
  const isAdminRoute = pathname?.includes('/admin-dashboard') || 
                        pathname?.includes('/admin-login') ||
                        pathname?.includes('/admin-');

  // Check if current route is public (with language)
  const isPublicRoute = pathname?.match(/^\/[a-z]{2}\//) && !isAdminRoute;

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
              {isAdminRoute ? (
                // Admin routes - no Navbar/Footer
                <main className="flex-1">
                  {children}
                </main>
              ) : isPublicRoute ? (
                // Public routes - with Navbar/Footer
                <>
                  <Navbar />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </>
              ) : (
                // Other routes (like landing page without language)
                <>
                  <Navbar />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </>
              )}
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}