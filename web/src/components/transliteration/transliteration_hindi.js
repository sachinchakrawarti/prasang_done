// src/components/transliteration/transliteration_hindi.js

// Hindi to various languages transliteration
export const transliterateHindi = (text, targetLang) => {
  if (!text) return text;

  // Hindi to English
  if (targetLang === 'en') {
    return hindiToEnglish(text);
  }

  // Hindi to Urdu
  if (targetLang === 'ur') {
    return hindiToUrdu(text);
  }

  // Hindi to Arabic
  if (targetLang === 'ar') {
    return hindiToArabic(text);
  }

  // Default: return as is
  return text;
};

// Hindi to English transliteration
const hindiToEnglish = (text) => {
  const map = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'an', 'अः': 'ah',
    'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
    'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
    'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
    'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
    'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
    'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va', 'श': 'sha',
    'ष': 'sha', 'स': 'sa', 'ह': 'ha', 'क्ष': 'ksha', 'त्र': 'tra',
    'ज्ञ': 'gya', '़': '', '्': '',
    'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ः': 'h',
  };
  return transliterateWithMap(text, map);
};

// Hindi to Urdu transliteration
const hindiToUrdu = (text) => {
  const map = {
    'अ': 'ا', 'आ': 'آ', 'इ': 'اِ', 'ई': 'اِی', 'उ': 'اُ', 'ऊ': 'اُو',
    'ए': 'اے', 'ऐ': 'اَے', 'ओ': 'او', 'औ': 'اَو', 'अं': 'اں', 'अः': 'اہ',
    'क': 'ک', 'ख': 'کھ', 'ग': 'گ', 'घ': 'گھ', 'ङ': 'ںگ',
    'च': 'چ', 'छ': 'چھ', 'ज': 'ج', 'झ': 'جھ', 'ञ': 'نج',
    'ट': 'ٹ', 'ठ': 'ٹھ', 'ड': 'ڈ', 'ढ': 'ڈھ', 'ण': 'ن',
    'त': 'ت', 'थ': 'تھ', 'द': 'د', 'ध': 'دھ', 'न': 'ن',
    'प': 'پ', 'फ': 'پھ', 'ब': 'ب', 'भ': 'بھ', 'म': 'م',
    'य': 'ی', 'र': 'ر', 'ल': 'ل', 'व': 'و', 'श': 'ش',
    'ष': 'ش', 'स': 'س', 'ह': 'ہ', 'क्ष': 'کش', 'त्र': 'تر',
    'ज्ञ': 'گیا', 'ा': 'ا', 'ि': 'ِ', 'ी': 'ِی', 'ु': 'ُ',
    'ू': 'ُو', 'े': 'ے', 'ै': 'َے', 'ो': 'و', 'ौ': 'َو',
    'ं': 'ں', 'ः': 'ہ', '़': '', '्': '',
  };
  return transliterateWithMap(text, map);
};

// Hindi to Arabic transliteration
const hindiToArabic = (text) => {
  const map = {
    'अ': 'ا', 'आ': 'آ', 'इ': 'اِ', 'ई': 'اِی', 'उ': 'اُ', 'ऊ': 'اُو',
    'ए': 'اے', 'ऐ': 'اَے', 'ओ': 'او', 'औ': 'اَو', 'अं': 'اں', 'अः': 'اہ',
    'क': 'ک', 'ख': 'کھ', 'ग': 'گ', 'घ': 'گھ',
    'च': 'چ', 'छ': 'چھ', 'ज': 'ج', 'झ': 'جھ',
    'ट': 'ٹ', 'ठ': 'ٹھ', 'ड': 'ڈ', 'ढ': 'ڈھ',
    'त': 'ت', 'थ': 'تھ', 'द': 'د', 'ध': 'دھ', 'न': 'ن',
    'प': 'پ', 'फ': 'پھ', 'ब': 'ب', 'भ': 'بھ', 'म': 'م',
    'य': 'ی', 'ر': 'ر', 'ल': 'ل', 'व': 'و', 'श': 'ش',
    'ष': 'ش', 'स': 'س', 'ह': 'ہ',
    'ा': 'ا', 'ि': 'ِ', 'ी': 'ِی', 'ु': 'ُ', 'ू': 'ُو',
    'े': 'ے', 'ै': 'َے', 'ो': 'و', 'ौ': 'َو', 'ं': 'ں', 'ः': 'ہ',
  };
  return transliterateWithMap(text, map);
};

// Generic transliteration function
const transliterateWithMap = (text, map) => {
  let result = '';
  let i = 0;
  while (i < text.length) {
    const char = text[i];
    const nextChar = text[i + 1] || '';
    const combined = char + nextChar;
    if (map[combined]) {
      result += map[combined];
      i += 2;
    } else if (map[char]) {
      result += map[char];
      i++;
    } else {
      result += char;
      i++;
    }
  }
  return result;
};