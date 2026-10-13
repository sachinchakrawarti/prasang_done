export const LANGUAGES = {
  hi: { code:'hi', name:'Hindi',    native:'हिन्दी',   script:'Devanagari', googleLang:'hi', dir:'ltr' },
  ur: { code:'ur', name:'Urdu',     native:'اردو',      script:'Arabic',     googleLang:'ur', dir:'rtl' },
  ar: { code:'ar', name:'Arabic',   native:'العربية',   script:'Arabic',     googleLang:'ar', dir:'rtl' },
  fa: { code:'fa', name:'Persian',  native:'فارسی',     script:'Arabic',     googleLang:'fa', dir:'rtl' },
  ps: { code:'ps', name:'Pashto',   native:'پښتو',     script:'Arabic',     googleLang:'ps', dir:'rtl' },
  bn: { code:'bn', name:'Bengali',  native:'বাংলা',     script:'Bengali',    googleLang:'bn', dir:'ltr' },
  pa: { code:'pa', name:'Punjabi',  native:'ਪੰਜਾਬੀ',    script:'Gurmukhi',   googleLang:'pa', dir:'ltr' },
  gu: { code:'gu', name:'Gujarati', native:'ગુજરાતી',   script:'Gujarati',   googleLang:'gu', dir:'ltr' },
  ta: { code:'ta', name:'Tamil',    native:'தமிழ்',     script:'Tamil',      googleLang:'ta', dir:'ltr' },
  te: { code:'te', name:'Telugu',   native:'తెలుగు',    script:'Telugu',     googleLang:'te', dir:'ltr' },
  kn: { code:'kn', name:'Kannada',  native:'ಕನ್ನಡ',     script:'Kannada',    googleLang:'kn', dir:'ltr' },
  ml: { code:'ml', name:'Malayalam',native:'മലയാളം',    script:'Malayalam',  googleLang:'ml', dir:'ltr' },
  or: { code:'or', name:'Odia',     native:'ଓଡ଼ିଆ',     script:'Odia',       googleLang:'or', dir:'ltr' },
  en: { code:'en', name:'English',  native:'English',  script:'Latin',      googleLang:'en', dir:'ltr' },
  fr: { code:'fr', name:'French',   native:'Français', script:'Latin',      googleLang:'fr', dir:'ltr' },
  de: { code:'de', name:'German',   native:'Deutsch',  script:'Latin',      googleLang:'de', dir:'ltr' },
  es: { code:'es', name:'Spanish',  native:'Español',  script:'Latin',      googleLang:'es', dir:'ltr' },
  tr: { code:'tr', name:'Turkish',  native:'Türkçe',   script:'Latin',      googleLang:'tr', dir:'ltr' },
  ru: { code:'ru', name:'Russian',  native:'Русский',  script:'Cyrillic',   googleLang:'ru', dir:'ltr' },
  zh: { code:'zh', name:'Chinese',  native:'中文',     script:'Han',        googleLang:'zh', dir:'ltr' },
  ja: { code:'ja', name:'Japanese', native:'日本語',    script:'Kana',       googleLang:'ja', dir:'ltr' },
  ko: { code:'ko', name:'Korean',   native:'한국어',    script:'Hangul',     googleLang:'ko', dir:'ltr' },
};

export const LANGUAGE_CODES = Object.keys(LANGUAGES);
export const SCRIPT_TO_LANGUAGES = Object.values(LANGUAGES).reduce((acc, l) => {
  (acc[l.script] ??= []).push(l);
  return acc;
}, {});
export function getLanguage(code) { return LANGUAGES[code] ?? LANGUAGES.en; }
