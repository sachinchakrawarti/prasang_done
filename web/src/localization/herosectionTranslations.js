// src/locales/herosectionTranslations.js

export const heroTranslations = {
  en: {
    "welcome": "Welcome to {name}",
    "subtitle": "Where words dance on paper and emotions find their voice",
    "goToPoem": "Go to poem",
  },
  hi: {
    "welcome": "{name} में आपका स्वागत है",
    "subtitle": "जहाँ शब्द कागज पर नाचते हैं और भावनाएँ अपनी आवाज़ पाती हैं",
    "goToPoem": "कविता पर जाएँ",
  },
  ur: {
    "welcome": "{name} میں خوش آمدید",
    "subtitle": "جہاں الفاظ کاغذ پر رقص کرتے ہیں اور جذبات اپنی آواز پاتے ہیں",
    "goToPoem": "نظم پر جائیں",
  },
};

// Enhanced translation function with variable replacement
export const translateHero = (text, language, params = {}) => {
  const lang = language && heroTranslations[language] ? language : 'en';
  let translated = heroTranslations[lang]?.[text] || text;
  
  // Replace placeholders like {name}
  if (params) {
    Object.keys(params).forEach(key => {
      translated = translated.replace(new RegExp(`\\{${key}\\}`, 'g'), params[key]);
    });
  }
  
  return translated;
};

// Hook-like function for convenience
export const useHeroTranslation = (language) => {
  const t = (text, params = {}) => translateHero(text, language, params);
  return { t };
};