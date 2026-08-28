// src/localization/localization.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Import translations directly
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
  const [isMounted, setIsMounted] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isRTL, setIsRTL] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get language from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedLanguage = localStorage.getItem("language") || "en";
      if (translations[savedLanguage]) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error("Error reading language from localStorage:", error);
    }
    setIsLoading(false);
  }, []);

  // Update document when language changes
  useEffect(() => {
    if (typeof window !== "undefined" && isMounted) {
      try {
        localStorage.setItem("language", language);
        document.documentElement.lang = language;
        const langInfo = availableLanguages.find((l) => l.code === language);
        if (langInfo) {
          setIsRTL(langInfo.dir === "rtl");
          document.documentElement.dir = langInfo.dir;
          document.documentElement.setAttribute("dir", langInfo.dir);
        }
      } catch (error) {
        console.error("Error updating language:", error);
      }
    }
  }, [language, isMounted]);

  // Translation function
  const t = (key, params = {}) => {
    try {
      const langData = translations[language] || translations.en;
      let text = langData[key] || key || "";

      if (params && typeof params === "object") {
        Object.keys(params).forEach((param) => {
          text = text.replace(new RegExp(`{{${param}}}`, "g"), params[param]);
        });
      }

      return text;
    } catch (error) {
      console.error("Translation error for key:", key, error);
      return key;
    }
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

// ==================== SAFE TRANSLATION HOOK ====================
export const useSafeTranslation = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [translationData, setTranslationData] = useState({
    t: (key) => key,
    language: "en",
    isRTL: false,
    changeLanguage: () => {},
    availableLanguages: [],
  });

  useEffect(() => {
    setIsMounted(true);
    try {
      const context = useLanguage();
      setTranslationData({
        t: context.t,
        language: context.language,
        isRTL: context.isRTL,
        changeLanguage: context.changeLanguage,
        availableLanguages: context.availableLanguages || [],
      });
    } catch (error) {
      // Fallback when LanguageProvider is not available
      setTranslationData({
        t: (key) => key,
        language: "en",
        isRTL: false,
        changeLanguage: () => {},
        availableLanguages: [],
      });
    }
  }, []);

  return translationData;
};

// ==================== TRANSLATION HELPERS ====================
// For use in non-React components
export const getTranslation = (key, language = "en", params = {}) => {
  try {
    const langData = translations[language] || translations.en;
    let text = langData[key] || key || "";

    if (params && typeof params === "object") {
      Object.keys(params).forEach((param) => {
        text = text.replace(new RegExp(`{{${param}}}`, "g"), params[param]);
      });
    }

    return text;
  } catch (error) {
    return key;
  }
};

// Get browser language
export const getBrowserLanguage = () => {
  if (typeof window === "undefined") return "en";
  try {
    const browserLang = navigator.language.split("-")[0];
    return translations[browserLang] ? browserLang : "en";
  } catch (error) {
    return "en";
  }
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
  const [isMounted, setIsMounted] = useState(false);
  const [translatedText, setTranslatedText] = useState("");

  useEffect(() => {
    setIsMounted(true);
    try {
      const context = useLanguage();
      setTranslatedText(context.t(tKey, params));
    } catch (error) {
      setTranslatedText(tKey || children || "");
    }
  }, [tKey, params]);

  if (!isMounted) {
    return (
      <Component className={className} {...props}>
        {children || tKey}
      </Component>
    );
  }

  return (
    <Component className={className} {...props}>
      {translatedText || children}
    </Component>
  );
};

// ==================== RTL WRAPPER ====================
export const RTLWrapper = ({ children, langCode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const context = useLanguage();
      const rtl = langCode
        ? availableLanguages.find((l) => l.code === langCode)?.dir === "rtl"
        : context.isRTL;
      setIsRTL(rtl);
    } catch (error) {
      setIsRTL(false);
    }
  }, [langCode]);

  if (!isMounted) {
    return <div className="ltr-support">{children}</div>;
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={isRTL ? "rtl-support" : "ltr-support"}
    >
      {children}
    </div>
  );
};

// ==================== DEFAULT EXPORT ====================
export default {
  LanguageProvider,
  useLanguage,
  useSafeTranslation,
  translations,
  availableLanguages,
  getTranslation,
  getBrowserLanguage,
  getSupportedLanguages,
  isLanguageSupported,
  Translation,
  RTLWrapper,
};
