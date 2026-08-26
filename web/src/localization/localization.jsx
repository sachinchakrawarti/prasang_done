// src/localization/localization.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { englishLocalization } from "./english_localization";
import { hindiLocalization } from "./hindi_localization";
import { urduLocalization } from "./urdu_localization";

// ==================== TRANSLATIONS OBJECT ====================
export const translations = {
  en: englishLocalization,
  hi: hindiLocalization,
  ur: urduLocalization,
};

// ==================== AVAILABLE LANGUAGES ====================
export const availableLanguages = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    dir: "ltr",
  },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", dir: "ltr" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰", dir: "rtl" },
];

// ==================== LANGUAGE CONTEXT ====================
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [isRTL, setIsRTL] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    setLanguage(savedLanguage);
    setIsLoading(false);
  }, []);

  // Update document when language changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Save to localStorage
      localStorage.setItem("language", language);

      // Update document language
      document.documentElement.lang = language;

      // Update RTL/LTR
      const langInfo = availableLanguages.find((l) => l.code === language);
      if (langInfo) {
        setIsRTL(langInfo.dir === "rtl");
        document.documentElement.dir = langInfo.dir;
        document.documentElement.setAttribute("dir", langInfo.dir);
      }
    }
  }, [language]);

  // Translation function
  const t = (key, params = {}) => {
    const langData = translations[language] || translations.en;
    let text = langData[key] || key || "";

    // Replace parameters in string (e.g., "Hello {{name}}" -> "Hello John")
    Object.keys(params).forEach((param) => {
      text = text.replace(new RegExp(`{{${param}}}`, "g"), params[param]);
    });

    return text;
  };

  // Get current language info
  const currentLanguage =
    availableLanguages.find((l) => l.code === language) ||
    availableLanguages[0];

  // Change language
  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setLanguage(langCode);
      return true;
    }
    return false;
  };

  // Get all available languages
  const getLanguages = () => availableLanguages;

  // Check if language is RTL
  const isLanguageRTL = (langCode) => {
    const lang = availableLanguages.find((l) => l.code === langCode);
    return lang ? lang.dir === "rtl" : false;
  };

  const value = {
    language,
    setLanguage: changeLanguage,
    changeLanguage,
    t,
    isRTL,
    currentLanguage,
    getLanguages,
    isLanguageRTL,
    availableLanguages,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// ==================== USE LANGUAGE HOOK ====================
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// ==================== TRANSLATION HELPERS ====================
// For use in non-React components
export const getTranslation = (key, language = "en", params = {}) => {
  const langData = translations[language] || translations.en;
  let text = langData[key] || key || "";

  Object.keys(params).forEach((param) => {
    text = text.replace(new RegExp(`{{${param}}}`, "g"), params[param]);
  });

  return text;
};

// Get browser language
export const getBrowserLanguage = () => {
  if (typeof window === "undefined") return "en";
  const browserLang = navigator.language.split("-")[0];
  return translations[browserLang] ? browserLang : "en";
};

// Get supported languages
export const getSupportedLanguages = () => {
  return Object.keys(translations);
};

// Check if language is supported
export const isLanguageSupported = (langCode) => {
  return !!translations[langCode];
};

// ==================== TRANSLATION COMPONENT ====================
export const Translation = ({
  as: Component = "span",
  tKey,
  children,
  params = {},
  className = "",
  ...props
}) => {
  const { t } = useLanguage();
  const translatedText = t(tKey, params);

  return (
    <Component className={className} {...props}>
      {translatedText || children}
    </Component>
  );
};

// ==================== RTL WRAPPER ====================
export const RTLWrapper = ({ children, langCode }) => {
  const { isRTL: contextRTL, currentLanguage } = useLanguage();
  const isRTL = langCode
    ? availableLanguages.find((l) => l.code === langCode)?.dir === "rtl"
    : contextRTL;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={isRTL ? "rtl-support" : "ltr-support"}
    >
      {children}
    </div>
  );
};

export default {
  LanguageProvider,
  useLanguage,
  translations,
  availableLanguages,
  getTranslation,
  getBrowserLanguage,
  getSupportedLanguages,
  isLanguageSupported,
  Translation,
  RTLWrapper,
};
