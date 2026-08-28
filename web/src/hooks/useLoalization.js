// src/hooks/useLoalization.js
"use client";

import { useLanguage } from "@/context/LanguageContext";

export function useTranslation() {
  const { t, language, isRTL, changeLanguage, availableLanguages } = useLanguage();
  return { t, language, isRTL, changeLanguage, availableLanguages };
}

export const useLocalization = useTranslation;

export default useTranslation;