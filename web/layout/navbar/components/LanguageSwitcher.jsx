// src/layout/navbar/components/LanguageSwitcher.jsx
"use client";

import { useState } from "react";
import { FaGlobe, FaChevronDown } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext"; // ✅ Absolute path
import { useTheme } from "@/themes/ThemeContext"; // ✅ Absolute path

const LanguageSwitcher = ({ mobile = false, onSelect }) => {
  const { language, setLanguage } = useLanguage();
  const { themeName } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "ur", name: "اردو", flag: "🇵🇰" },
    { code: "bn", name: "বাংলা", flag: "🇧🇩" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
    { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "mr", name: "मराठी", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
    { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
    { code: "fa", name: "فارسی", flag: "🇮🇷" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === language) || languages[0];

  // Theme-aware styles
  const getHoverBg = () => {
    switch (themeName) {
      case "forest":
        return "hover:bg-green-50 dark:hover:bg-green-900/20";
      case "lavender":
        return "hover:bg-purple-50 dark:hover:bg-purple-900/20";
      case "rose":
        return "hover:bg-rose-50 dark:hover:bg-rose-900/20";
      case "sepia":
        return "hover:bg-amber-100 dark:hover:bg-amber-900/20";
      default:
        return "hover:bg-amber-50 dark:hover:bg-amber-900/20";
    }
  };

  const getTextColor = () => {
    switch (themeName) {
      case "forest":
        return "text-green-600 dark:text-green-400";
      case "lavender":
        return "text-purple-600 dark:text-purple-400";
      case "rose":
        return "text-rose-600 dark:text-rose-400";
      case "sepia":
        return "text-amber-600 dark:text-amber-400";
      default:
        return "text-amber-600 dark:text-amber-400";
    }
  };

  const hoverBg = getHoverBg();
  const textColor = getTextColor();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 p-2 rounded-full transition-all ${hoverBg}`}
        aria-label="Language switcher"
      >
        <FaGlobe className={`w-5 h-5 ${textColor}`} />
        <span className="text-sm font-medium hidden sm:inline">
          {currentLanguage.flag}
        </span>
        <FaChevronDown
          className={`text-xs ${textColor} transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 max-h-96 overflow-y-auto">
            <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Select Language
              </span>
            </div>

            {languages.map((lang) => {
              const isActive = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                    if (onSelect) onSelect(lang.code);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                    isActive
                      ? `bg-amber-50 dark:bg-amber-900/20 ${textColor} font-medium`
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="flex-1 text-left">{lang.name}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {lang.code.toUpperCase()}
                  </span>
                  {isActive && (
                    <span className={`text-xs ${textColor}`}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
