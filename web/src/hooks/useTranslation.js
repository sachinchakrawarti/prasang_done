// src/hooks/useTranslation.js
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { navbarLocalization } from "@/localization/navbar_localization";

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key) => {
    const translations = navbarLocalization[language] || navbarLocalization.en;
    return translations[key] || key;
  };

  return { t, language };
}