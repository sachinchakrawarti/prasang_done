// src/context/LanguageContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Import translations from separate files
import { englishLocalization } from "@/localization/english_localization";
import { hindiLocalization } from "@/localization/hindi_localization";
import { urduLocalization } from "@/localization/urdu_localization";
import { arabicLocalization } from "@/localization/arabic_localization";

// ==================== TRANSLATIONS OBJECT ====================
export const translations = {
  en: englishLocalization,
  hi: hindiLocalization,
  ur: urduLocalization,
  ar: arabicLocalization,
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
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
];

// ==================== LANGUAGE CONTEXT ====================
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language") || "en";
      if (translations[savedLanguage]) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error("Error reading language:", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
  }, [language]);

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
      return key;
    }
  };

  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setLanguage(langCode);
      return true;
    }
    return false;
  };

  const value = {
    language,
    setLanguage: changeLanguage,
    changeLanguage,
    t,
    isRTL,
    availableLanguages,
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

export default {
  LanguageProvider,
  useLanguage,
};
