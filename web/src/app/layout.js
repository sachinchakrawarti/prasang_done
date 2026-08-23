// src/app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/layout/navbar/Navbar';
import Footer from '@/layout/footer/Footer';  // ✅ Import Footer
import { ThemeProvider } from '@/themes/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Prasang - Poetry & Literature',
  description: 'A platform for poetry, prose, and literary expression',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />  {/* ✅ Add Footer here */}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}