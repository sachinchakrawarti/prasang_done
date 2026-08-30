// src/components/poems/translation.jsx
"use client";

import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaCopy,
  FaCheck,
  FaGlobe,
  FaRobot,
  FaDatabase,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

const Translation = ({
  poem,
  availableLanguages = ["hi", "ur", "ar", "fr"],
}) => {
  const { themeName } = useTheme();
  const { t, language: currentLang } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get available translations from poem data
  const getAvailableTranslations = () => {
    if (!poem || !poem.translations) return [];
    // Get all available translation languages
    const available = Object.keys(poem.translations);
    // Filter out current language
    return available.filter((lang) => lang !== currentLang);
  };

  // Get translation text for selected language
  const getTranslationText = () => {
    if (!selectedLang || !poem?.translations?.[selectedLang]) return null;
    return poem.translations[selectedLang];
  };

  const translationText = getTranslationText();
  const availableTranslations = getAvailableTranslations();

  // Handle language selection
  const handleLanguageSelect = (lang) => {
    if (selectedLang === lang) {
      setSelectedLang(null);
      return;
    }
    setSelectedLang(lang);
  };

  // Handle copy
  const handleCopy = async () => {
    if (!translationText) return;
    try {
      const textToCopy = `${translationText.title}\n\n${translationText.content}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Theme-aware styles
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

  const getGradient = () => {
    switch (themeName) {
      case "forest":
        return "from-green-600 to-emerald-500";
      case "lavender":
        return "from-purple-600 to-pink-500";
      case "rose":
        return "from-rose-600 to-pink-500";
      case "sepia":
        return "from-amber-700 to-yellow-600";
      default:
        return "from-amber-600 to-yellow-500";
    }
  };

  const getBorderColor = () => {
    switch (themeName) {
      case "forest":
        return "border-green-200 dark:border-green-800";
      case "lavender":
        return "border-purple-200 dark:border-purple-800";
      case "rose":
        return "border-rose-200 dark:border-rose-800";
      case "sepia":
        return "border-amber-200 dark:border-amber-800";
      default:
        return "border-amber-200 dark:border-amber-800";
    }
  };

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

  const textColor = getTextColor();
  const gradient = getGradient();
  const borderColor = getBorderColor();
  const hoverBg = getHoverBg();

  // Language names and flags
  const languageInfo = {
    hi: { name: "हिन्दी", flag: "🇮🇳", native: "हिन्दी" },
    ur: { name: "اردو", flag: "🇵🇰", native: "اردو" },
    ar: { name: "العربية", flag: "🇸🇦", native: "العربية" },
    en: { name: "English", flag: "🇬🇧", native: "English" },
    fr: { name: "Français", flag: "🇫🇷", native: "Français" },
    es: { name: "Español", flag: "🇪🇸", native: "Español" },
    de: { name: "Deutsch", flag: "🇩🇪", native: "Deutsch" },
    ru: { name: "Русский", flag: "🇷🇺", native: "Русский" },
    zh: { name: "中文", flag: "🇨🇳", native: "中文" },
    ja: { name: "日本語", flag: "🇯🇵", native: "日本語" },
  };

  // If no translations available
  if (availableTranslations.length === 0) {
    return null;
  }

  return (
    <div
      className={`mt-6 rounded-xl border ${borderColor} bg-white dark:bg-gray-800 overflow-hidden transition-all hover:shadow-md`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FaGlobe className={textColor} />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {t("translations") || "Translations"}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            ({availableTranslations.length} {t("available") || "available"})
          </span>
          <span className="text-xs text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-1.5 py-0.5 rounded">
            <FaRobot className="inline mr-1" size={10} />
            AI
          </span>
        </div>
        <div className="flex items-center gap-2">
          {expanded ? (
            <FaChevronUp className="text-gray-400" />
          ) : (
            <FaChevronDown className="text-gray-400" />
          )}
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
          {/* Language Selector */}
          <div className="flex flex-wrap gap-2 mt-4">
            {availableTranslations.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageSelect(lang)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedLang === lang
                    ? `bg-gradient-to-r ${gradient} text-white`
                    : `${hoverBg} ${textColor} border ${borderColor}`
                }`}
              >
                {languageInfo[lang]?.flag || "🌐"}{" "}
                {languageInfo[lang]?.native || lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Translation Content */}
          {selectedLang && translationText && (
            <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {translationText.title}
                </h4>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${hoverBg} ${textColor} transition-colors`}
                  aria-label={t("copy") || "Copy"}
                >
                  {copied ? (
                    <>
                      <FaCheck size={12} />
                      {t("copied") || "Copied"}
                    </>
                  ) : (
                    <>
                      <FaCopy size={12} />
                      {t("copy") || "Copy"}
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {translationText.content}
              </p>
              <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <FaRobot size={12} />
                {t("aiTranslated") || "AI Translated"}
              </div>
            </div>
          )}

          {/* No translation selected */}
          {!selectedLang && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {t("selectLanguage") || "Select a language to see translation"}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Translation;
