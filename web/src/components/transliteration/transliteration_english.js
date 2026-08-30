// src/components/transliteration/transliteration_english.js

// English to various languages transliteration
export const transliterateEnglish = (text, targetLang) => {
  if (!text) return text;

  // English to Hindi
  if (targetLang === 'hi') {
    return englishToHindi(text);
  }

  // English to Urdu
  if (targetLang === 'ur') {
    return englishToUrdu(text);
  }

  // English to Arabic
  if (targetLang === 'ar') {
    return englishToArabic(text);
  }

  return text;
};

// English to Hindi transliteration
const englishToHindi = (text) => {
  const map = {
    'a': 'अ', 'b': 'ब', 'c': 'क', 'd': 'द', 'e': 'ए', 'f': 'फ',
    'g': 'ग', 'h': 'ह', 'i': 'इ', 'j': 'ज', 'k': 'क', 'l': 'ल',
    'm': 'म', 'n': 'न', 'o': 'ओ', 'p': 'प', 'q': 'क', 'r': 'र',
    's': 'स', 't': 'त', 'u': 'उ', 'v': 'व', 'w': 'व', 'x': 'क्ष',
    'y': 'य', 'z': 'ज़',
    'aa': 'आ', 'ee': 'ई', 'oo': 'ऊ', 'ai': 'ऐ', 'au': 'औ',
    'sh': 'श', 'ch': 'च', 'kh': 'ख', 'gh': 'घ', 'th': 'थ',
    'ph': 'फ', 'bh': 'भ', 'dh': 'ध', 'zh': 'झ',
  };
  return transliterateWithMap(text, map);
};

// English to Urdu transliteration
const englishToUrdu = (text) => {
  const map = {
    'a': 'ا', 'b': 'ب', 'p': 'پ', 't': 'ت', 'j': 'ج', 'ch': 'چ',
    'h': 'ح', 'kh': 'خ', 'd': 'د', 'z': 'ز', 'r': 'ر', 's': 'س',
    'sh': 'ش', 'f': 'ف', 'q': 'ق', 'k': 'ک', 'g': 'گ', 'l': 'ل',
    'm': 'م', 'n': 'ن', 'v': 'و', 'y': 'ی', 'e': 'ے',
    'aa': 'آ', 'ee': 'ی', 'oo': 'و', 'ai': 'ے', 'au': 'او',
  };
  return transliterateWithMap(text, map);
};

// English to Arabic transliteration
const englishToArabic = (text) => {
  const map = {
    'a': 'ا', 'b': 'ب', 't': 'ت', 'th': 'ث', 'j': 'ج', 'h': 'ح',
    'kh': 'خ', 'd': 'د', 'dh': 'ذ', 'r': 'ر', 'z': 'ز', 's': 'س',
    'sh': 'ش', 'f': 'ف', 'q': 'ق', 'k': 'ك', 'l': 'ل', 'm': 'م',
    'n': 'ن', 'w': 'و', 'y': 'ي',
    'aa': 'آ', 'ee': 'ي', 'oo': 'و', 'ai': 'ي', 'au': 'او',
  };
  return transliterateWithMap(text, map);
};

const transliterateWithMap = (text, map) => {
  let result = '';
  let i = 0;
  while (i < text.length) {
    const twoChars = text.slice(i, i + 2);
    if (map[twoChars]) {
      result += map[twoChars];
      i += 2;
    } else if (map[text[i]]) {
      result += map[text[i]];
      i++;
    } else {
      result += text[i];
      i++;
    }
  }
  return result;
};