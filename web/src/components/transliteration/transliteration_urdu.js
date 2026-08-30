// src/components/transliteration/transliteration_urdu.js

// Urdu to various languages transliteration
export const transliterateUrdu = (text, targetLang) => {
  if (!text) return text;

  // Urdu to English
  if (targetLang === 'en') {
    return urduToEnglish(text);
  }

  // Urdu to Hindi
  if (targetLang === 'hi') {
    return urduToHindi(text);
  }

  // Urdu to Arabic
  if (targetLang === 'ar') {
    return urduToArabic(text);
  }

  return text;
};

// Urdu to English transliteration
const urduToEnglish = (text) => {
  const map = {
    'ا': 'a', 'آ': 'aa', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ٹ': 't',
    'ث': 's', 'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd',
    'ڈ': 'd', 'ذ': 'z', 'ر': 'r', 'ڑ': 'r', 'ز': 'z', 'ژ': 'zh',
    'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z',
    'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ک': 'k', 'گ': 'g',
    'ل': 'l', 'م': 'm', 'ن': 'n', 'و': 'v', 'ہ': 'h', 'ھ': 'h',
    'ی': 'y', 'ے': 'e', 'ء': "'",
  };
  return transliterateWithMap(text, map);
};

// Urdu to Hindi transliteration
const urduToHindi = (text) => {
  const map = {
    'ا': 'अ', 'آ': 'आ', 'ب': 'ब', 'پ': 'प', 'ت': 'त', 'ٹ': 'ट',
    'ث': 'स', 'ج': 'ज', 'چ': 'च', 'ح': 'ह', 'خ': 'ख', 'د': 'द',
    'ڈ': 'ड', 'ذ': 'ज़', 'ر': 'र', 'ڑ': 'ड़', 'ز': 'ज़', 'ژ': 'झ',
    'س': 'स', 'ش': 'श', 'ص': 'स', 'ض': 'ज़', 'ط': 'त', 'ظ': 'ज़',
    'ع': 'अ', 'غ': 'ग़', 'ف': 'फ', 'ق': 'क़', 'ک': 'क', 'گ': 'ग',
    'ل': 'ल', 'م': 'م', 'ن': 'न', 'و': 'व', 'ہ': 'ह', 'ھ': 'ह',
    'ی': 'य', 'ے': 'ए', 'ء': "'",
  };
  return transliterateWithMap(text, map);
};

// Urdu to Arabic transliteration
const urduToArabic = (text) => {
  const map = {
    'ا': 'ا', 'آ': 'آ', 'ب': 'ب', 'پ': 'پ', 'ت': 'ت', 'ٹ': 'ت',
    'ث': 'ث', 'ج': 'ج', 'چ': 'چ', 'ح': 'ح', 'خ': 'خ', 'د': 'د',
    'ڈ': 'د', 'ذ': 'ذ', 'ر': 'ر', 'ڑ': 'ر', 'ز': 'ز', 'ژ': 'ز',
    'س': 'س', 'ش': 'ش', 'ص': 'ص', 'ض': 'ض', 'ط': 'ط', 'ظ': 'ظ',
    'ع': 'ع', 'غ': 'غ', 'ف': 'ف', 'ق': 'ق', 'ک': 'ك', 'گ': 'ك',
    'ل': 'ل', 'م': 'م', 'ن': 'ن', 'و': 'و', 'ہ': 'ه', 'ھ': 'ه',
    'ی': 'ي', 'ے': 'ي',
  };
  return transliterateWithMap(text, map);
};

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