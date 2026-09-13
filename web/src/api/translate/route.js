// src/app/api/translate/route.js

import { NextResponse } from 'next/server';

// Mock translation function - replace with actual translation API
function mockTranslate(text, fromLang, toLang) {
  // This is a mock - replace with actual translation service
  const translations = {
    'hi': {
      'en': {
        'पंछी उड़ते हैं': 'Birds fly',
        'आसमान में': 'in the sky',
        'पर हम उड़ते हैं': 'But we fly',
        'अरमानों में': 'in our dreams',
        // Add more translations as needed
      }
    },
    'ur': {
      'en': {
        'پرندے آسمان میں اڑتے ہیں': 'Birds fly in the sky',
        'لیکن ہم اپنے خوابوں میں اڑتے ہیں': 'But we fly in our dreams',
      }
    }
  };

  // Simple word-by-word translation (mock)
  const words = text.split(' ');
  const translatedWords = words.map(word => {
    // Check if word exists in translation map
    for (const [key, value] of Object.entries(translations[fromLang]?.[toLang] || {})) {
      if (text.includes(key)) {
        return value;
      }
    }
    return word;
  });

  return translatedWords.join(' ');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, from, to } = body;

    if (!text || !from || !to) {
      return NextResponse.json(
        { error: 'Missing required fields: text, from, to' },
        { status: 400 }
      );
    }

    // If source and target are the same, return original
    if (from === to) {
      return NextResponse.json({
        success: true,
        data: {
          original: text,
          translated: text,
          from,
          to
        }
      });
    }

    // For production, use a translation API like Google Translate, DeepL, etc.
    // For now, use mock translation
    const translated = mockTranslate(text, from, to);

    return NextResponse.json({
      success: true,
      data: {
        original: text,
        translated: translated,
        from,
        to
      }
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}

// Optional: GET route for supported languages
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      supportedLanguages: [
        { code: 'hi', name: 'Hindi' },
        { code: 'ur', name: 'Urdu' },
        { code: 'en', name: 'English' },
        { code: 'ar', name: 'Arabic' },
        { code: 'fr', name: 'French' },
        { code: 'es', name: 'Spanish' },
        { code: 'de', name: 'German' },
        { code: 'ru', name: 'Russian' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ja', name: 'Japanese' },
      ]
    }
  });
}