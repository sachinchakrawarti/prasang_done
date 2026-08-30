// src/components/transliteration/transliteration_arabic.js

// Arabic to various languages transliteration
export const transliterateArabic = (text, targetLang) => {
  if (!text) return text;

  // Arabic to English
  if (targetLang === 'en') {
    return arabicToEnglish(text);
  }

  // Arabic to Hindi
  if (targetLang === 'hi') {
    return arabicToHindi(text);
  }

  // Arabic to Urdu
  if (targetLang === 'ur') {
    return arabicToUrdu(text);
  }

  return text;
};

// Arabic to English transliteration
const arabicToEnglish = (text) => {
  const map = {
    'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h',
    'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's',
    'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
    'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm',
    'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ء': "'",
    'َ': 'a', 'ُ': 'u', 'ِ': 'i', 'ّ': 'shaddah',
    'ْ': 'sukoon', 'ً': 'an', 'ٍ': 'in', 'ٌ': 'un',
  };
  return transliterateWithMap(text, map);
};

// Arabic to Hindi transliteration
const arabicToHindi = (text) => {
  const map = {
    'ا': 'अ', 'ب': 'ब', 'ت': 'त', 'ث': 'स', 'ج': 'ज', 'ح': 'ह',
    'خ': 'ख', 'د': 'द', 'ذ': 'ज़', 'ر': 'र', 'ز': 'ज़', 'س': 'स',
    'ش': 'श', 'ص': 'स', 'ض': 'ज़', 'ط': 'त', 'ظ': 'ज़', 'ع': 'अ',
    'غ': 'ग़', 'ف': 'फ', 'ق': 'क़', 'ك': 'क', 'ل': 'ल', 'م': 'م',
    'ن': 'न', 'ه': 'ह', 'و': 'व', 'ي': 'य', 'ء': "'",
  };
  return transliterateWithMap(text, map);
};

// Arabic to Urdu transliteration
const arabicToUrdu = (text) => {
  const map = {
    'ا': 'ا', 'ب': 'ب', 'ت': 'ت', 'ث': 'ث', 'ج': 'ج', 'ح': 'ح',
    'خ': 'خ', 'د': 'د', 'ذ': 'ذ', 'ر': 'ر', 'ز': 'ز', 'س': 'س',
    'ش': 'ش', 'ص': 'ص', 'ض': 'ض', 'ط': 'ط', 'ظ': 'ظ', 'ع': 'ع',
    'غ': 'غ', 'ف': 'ف', 'ق': 'ق', 'ك': 'ک', 'ل': 'ل', 'م': 'م',
    'ن': 'ن', 'ه': 'ہ', 'و': 'و', 'ي': 'ی', 'ء': "'",
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