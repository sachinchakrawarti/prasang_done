// src/app/api/translate/route.js
import { NextResponse } from 'next/server';
import translate from '@vitalets/google-translate-api';

export async function POST(request) {
  try {
    const { text, targetLang, sourceLang } = await request.json();
    
    if (!text || !targetLang) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use Google Translate API
    const result = await translate(text, {
      from: sourceLang || 'en',
      to: targetLang,
    });

    return NextResponse.json({ 
      success: true, 
      translation: result.text 
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}