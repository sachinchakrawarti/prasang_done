// src/hooks/useLoalization.js
"use client";

import { useLanguage } from "@/localization/localization";

/**
 * Custom hook for accessing localization functions
 * Provides translation, language switching, and RTL support
 * 
 * @returns {Object} Localization utilities
 * @returns {string} language - Current language code (en, hi, ur)
 * @returns {Function} t - Translation function: t(key, params)
 * @returns {Function} changeLanguage - Change language: changeLanguage('en')
 * @returns {boolean} isRTL - Whether current language is RTL
 * @returns {Object} currentLanguage - Current language info object
 * @returns {Array} availableLanguages - Array of supported languages
 * @returns {Function} isLanguageRTL - Check if a language is RTL
 * @returns {boolean} isLoading - Whether language is loading
 */
export function useLoalization() {
  const {
    language,
    setLanguage,
    changeLanguage,
    t,
    isRTL,
    currentLanguage,
    getLanguages,
    isLanguageRTL,
    availableLanguages,
    isLoading,
  } = useLanguage();

  return {
    // Current language
    language,
    
    // Translation function
    t,
    
    // Language management
    changeLanguage,
    setLanguage,
    
    // RTL support
    isRTL,
    isLanguageRTL,
    
    // Language info
    currentLanguage,
    availableLanguages,
    getLanguages,
    
    // Loading state
    isLoading,
  };
}

/**
 * Alternative hook name for backward compatibility
 */
export const useLocalization = useLoalization;

/**
 * Hook for getting translation only (lighter version)
 * Use this if you only need translations without other features
 */
export function useTranslation() {
  const { t, language } = useLanguage();
  return { t, language };
}

/**
 * Hook for RTL detection only
 */
export function useRTL() {
  const { isRTL, language } = useLanguage();
  return { isRTL, language };
}

/**
 * Hook for language switching only
 */
export function useLanguageSwitcher() {
  const { language, changeLanguage, availableLanguages, currentLanguage } = useLanguage();
  return {
    language,
    changeLanguage,
    availableLanguages,
    currentLanguage,
  };
}

/**
 * Higher-order component for adding translation to components
 * 
 * @param {Function} Component - The component to wrap
 * @returns {Function} Wrapped component with translation props
 */
export function withTranslation(Component) {
  return function WrappedComponent(props) {
    const { t, language, changeLanguage } = useLanguage();
    return (
      <Component
        {...props}
        t={t}
        language={language}
        changeLanguage={changeLanguage}
      />
    );
  };
}

export default useLoalization;