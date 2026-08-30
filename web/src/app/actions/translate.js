// src/app/actions/translate.js
'use server';

import translate from 'google-translate-api';

export async function translateText(text, targetLang, sourceLang = 'en') {
  try {
    const result = await translate(text, {
      from: sourceLang,
      to: targetLang,
    });
    return { success: true, translation: result.text };
  } catch (error) {
    console.error('Translation error:', error);
    return { success: false, error: error.message };
  }
}