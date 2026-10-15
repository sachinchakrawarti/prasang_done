export const TRANSLATION_LANGUAGES = [
  { code: 'hi', name: 'Hindi',     native: 'हिन्दी',     rtl: false },
  { code: 'ur', name: 'Urdu',      native: 'اردو',        rtl: true  },
  { code: 'ar', name: 'Arabic',    native: 'العربية',    rtl: true  },
  { code: 'fa', name: 'Persian',   native: 'فارسی',       rtl: true  },
  { code: 'ps', name: 'Pashto',    native: 'پښتو',       rtl: true  },
  { code: 'bn', name: 'Bengali',   native: 'বাংলা',       rtl: false },
  { code: 'pa', name: 'Punjabi',   native: 'ਪੰਜਾਬੀ',      rtl: false },
  { code: 'gu', name: 'Gujarati',  native: 'ગુજરાતી',     rtl: false },
  { code: 'ta', name: 'Tamil',     native: 'தமிழ்',       rtl: false },
  { code: 'te', name: 'Telugu',    native: 'తెలుగు',      rtl: false },
  { code: 'kn', name: 'Kannada',   native: 'ಕನ್ನಡ',       rtl: false },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം',      rtl: false },
  { code: 'or', name: 'Odia',      native: 'ଓଡ଼ିଆ',       rtl: false },
  { code: 'en', name: 'English',   native: 'English',    rtl: false },
  { code: 'fr', name: 'French',    native: 'Français',   rtl: false },
  { code: 'de', name: 'German',    native: 'Deutsch',    rtl: false },
  { code: 'es', name: 'Spanish',   native: 'Español',    rtl: false },
  { code: 'tr', name: 'Turkish',   native: 'Türkçe',     rtl: false },
  { code: 'ru', name: 'Russian',   native: 'Русский',    rtl: false },
  { code: 'zh', name: 'Chinese',   native: '中文',       rtl: false },
  { code: 'ja', name: 'Japanese',  native: '日本語',      rtl: false },
  { code: 'ko', name: 'Korean',    native: '한국어',      rtl: false },
];

export const LANG_MAP = Object.fromEntries(
  TRANSLATION_LANGUAGES.map((l) => [l.code, l]),
);
