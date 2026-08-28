// src/layout/navbar/navbardesktop/components/Language_Switcher_Desktop.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { FaGlobe, FaChevronDown, FaCheck } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/themes/ThemeContext";

const LanguageSwitcherDesktop = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { language, changeLanguage, availableLanguages } = useLanguage();
  const { themeName } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get current language info
  const currentLanguage = availableLanguages?.find(
    (l) => l.code === language,
  ) ||
    availableLanguages?.[0] || { code: "en", name: "English", flag: "🇬🇧" };

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
        return "hover:bg-amber-50 dark:hover:bg-amber-900/20";
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

  // Show placeholder during SSR
  if (!isMounted) {
    return (
      <div className="relative">
        <button
          className={`p-2 rounded-lg ${hoverBg} flex items-center gap-1 animate-pulse`}
          aria-label="Language switcher"
        >
          <FaGlobe className={`w-5 h-5 ${textColor}`} />
          <span className="text-sm font-medium hidden sm:inline">🌐</span>
          <FaChevronDown className={`text-xs ${textColor}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg ${hoverBg} flex items-center gap-1 transition-all`}
        aria-label="Language switcher"
      >
        <FaGlobe className={`w-5 h-5 ${textColor}`} />
        <span className="text-sm font-medium hidden sm:inline">
          {currentLanguage?.flag || "🌐"}
        </span>
        <FaChevronDown
          className={`text-xs ${textColor} transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Select Language
            </span>
          </div>

          {availableLanguages?.map((lang) => {
            const isActive = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? `${hoverBg} ${textColor} font-medium`
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="flex-1 text-left">{lang.nativeName}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {lang.code.toUpperCase()}
                </span>
                {isActive && <FaCheck className={`text-xs ${textColor}`} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcherDesktop;
