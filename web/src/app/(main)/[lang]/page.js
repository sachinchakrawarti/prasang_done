// src/app/(main)/[lang]/page.js
"use client";

import { useParams } from "next/navigation";

export default function LangHomePage() {
  const params = useParams();
  const lang = params?.lang || 'en';
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#fafafa'
    }}>
      <h1 style={{ fontSize: '3rem', color: '#d97706', marginBottom: '0.5rem' }}>
        🪶 Prasang
      </h1>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        Current language: <span style={{ color: '#d97706' }}>{lang.toUpperCase()}</span>
      </p>
      <p style={{ fontSize: '1.1rem', color: '#4b5563' }}>
        {lang === 'en' && 'Welcome to Prasang - A sanctuary for poetry and prose'}
        {lang === 'hi' && 'प्रसंग में आपका स्वागत है - कविता और गद्य का अभयारण्य'}
        {lang === 'ur' && 'پراسنگ میں خوش آمدید - شاعری اور نثر کی پناہ گاہ'}
        {!['en', 'hi', 'ur'].includes(lang) && `Welcome in ${lang}`}
      </p>
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <a href={`/${lang}/poems`} style={{
          padding: '0.75rem 2rem',
          backgroundColor: '#d97706',
          color: 'white',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          Explore Poems
        </a>
        <a href={`/${lang}/about`} style={{
          padding: '0.75rem 2rem',
          border: '2px solid #d97706',
          color: '#d97706',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          Learn More
        </a>
      </div>
    </div>
  );
}