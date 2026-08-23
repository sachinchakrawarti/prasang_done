// src/locales/mobileNavbarTranslations.js

export const mobileNavbarTranslations = {
  en: {
    // Mobile Navigation
    "home": "Home",
    "poems": "Poems",
    "prose": "Prose",
    "poets": "Poets",
    "contributors": "Contributors",
    "about": "About",
    "testPage": "Test Page",
    
    // Mobile UI Elements
    "menu": "Menu",
    "account": "Account",
    "profile": "Profile",
    "login": "Login",
    "signUp": "Sign Up",
    "settings": "Settings",
    "notifications": "Notifications",
    "theme": "Theme",
    "language": "Language",
    "search": "Search",
  },
  hi: {
    // Mobile Navigation
    "home": "होम",
    "poems": "कविताएँ",
    "prose": "गद्य",
    "poets": "कवि",
    "contributors": "योगदानकर्ता",
    "about": "हमारे बारे में",
    "testPage": "टेस्ट पेज",
    
    // Mobile UI Elements
    "menu": "मेनू",
    "account": "खाता",
    "profile": "प्रोफ़ाइल",
    "login": "लॉग इन",
    "signUp": "साइन अप",
    "settings": "सेटिंग्स",
    "notifications": "सूचनाएँ",
    "theme": "थीम",
    "language": "भाषा",
    "search": "खोजें",
  },
  ur: {
    // Mobile Navigation
    "home": "ہوم",
    "poems": "شعری",
    "prose": "نثر",
    "poets": "شعرا",
    "contributors": "تعاون کنندگان",
    "about": "تعارف",
    "testPage": "ٹیسٹ صفحہ",
    
    // Mobile UI Elements
    "menu": "مینو",
    "account": "اکاؤنٹ",
    "profile": "پروفائل",
    "login": "لاگ ان",
    "signUp": "سائن اپ",
    "settings": "ترتیبات",
    "notifications": "اطلاعات",
    "theme": "تھیم",
    "language": "زبان",
    "search": "تلاش کریں",
  }
};

// Helper function to get translated mobile text
export const translateMobile = (text, language) => {
  const lang = language && mobileNavbarTranslations[language] ? language : 'en';
  return mobileNavbarTranslations[lang]?.[text] || text;
};

// Hook for mobile translations
export const useMobileTranslation = (language) => {
  const t = (text) => translateMobile(text, language);
  return { t };
};

export default mobileNavbarTranslations;