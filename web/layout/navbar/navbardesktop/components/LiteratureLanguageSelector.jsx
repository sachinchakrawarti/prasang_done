// src/components/layout/navbar/navbardesktop/components/LiteratureLanguageSelector.jsx
"use client";

import { useState } from "react";
import { FaCheck, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

const LiteratureLanguageSelector = ({
  themeName,
  buttonBg,
  iconColor,
  checkboxColor,
}) => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const literatureLanguages = [
    { code: "en", name: "English", flag: "🇬🇧", litCount: 12453 },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳", litCount: 8765 },
    { code: "ur", name: "اردو", flag: "🇵🇰", litCount: 6543 },
    { code: "bn", name: "বাংলা", flag: "🇧🇩", litCount: 4321 },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳", litCount: 3987 },
    { code: "te", name: "తెలుగు", flag: "🇮🇳", litCount: 3123 },
    { code: "ml", name: "മലയാളം", flag: "🇮🇳", litCount: 2876 },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳", litCount: 2543 },
    { code: "mr", name: "मराठी", flag: "🇮🇳", litCount: 2234 },
    { code: "gu", name: "ગુજરાતી", flag: "🇮🇳", litCount: 1987 },
    { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳", litCount: 1765 },
    { code: "fa", name: "فارسی", flag: "🇮🇷", litCount: 1543 },
    { code: "ar", name: "العربية", flag: "🇸🇦", litCount: 1432 },
    { code: "es", name: "Español", flag: "🇪🇸", litCount: 1321 },
    { code: "fr", name: "Français", flag: "🇫🇷", litCount: 1234 },
    { code: "de", name: "Deutsch", flag: "🇩🇪", litCount: 1123 },
    { code: "ru", name: "Русский", flag: "🇷🇺", litCount: 1098 },
    { code: "zh", name: "中文", flag: "🇨🇳", litCount: 987 },
    { code: "ja", name: "日本語", flag: "🇯🇵", litCount: 876 },
    { code: "ko", name: "한국어", flag: "🇰🇷", litCount: 765 },
  ];

  // Filter languages based on search
  const filteredLanguages = literatureLanguages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get display languages (first 10 or all based on showAll)
  const displayLanguages = showAll
    ? filteredLanguages
    : filteredLanguages.slice(0, 10);

  // Get selected language
  const selectedLanguage = literatureLanguages.find((l) => l.code === language);

  // Theme-based styling
  const getSearchBg = () => {
    switch (themeName) {
      case "forest":
        return "bg-green-50 dark:bg-green-900/30 focus:ring-green-500";
      case "lavender":
        return "bg-purple-50 dark:bg-purple-900/30 focus:ring-purple-500";
      case "rose":
        return "bg-rose-50 dark:bg-rose-900/30 focus:ring-rose-500";
      case "sepia":
        return "bg-amber-50 dark:bg-amber-900/30 focus:ring-amber-500";
      case "dark":
        return "bg-gray-700/50 focus:ring-gray-500";
      default:
        return "bg-gray-50 dark:bg-gray-700/50 focus:ring-amber-500";
    }
  };

  const getShowMoreColor = () => {
    switch (themeName) {
      case "forest":
        return "text-green-600 hover:text-green-700";
      case "lavender":
        return "text-purple-600 hover:text-purple-700";
      case "rose":
        return "text-rose-600 hover:text-rose-700";
      case "sepia":
        return "text-amber-600 hover:text-amber-700";
      case "dark":
        return "text-gray-400 hover:text-gray-300";
      default:
        return "text-amber-600 hover:text-amber-700";
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
      case "dark":
        return "border-gray-700";
      default:
        return "border-gray-200 dark:border-gray-700";
    }
  };

  const searchBg = getSearchBg();
  const showMoreColor = getShowMoreColor();
  const borderColor = getBorderColor();

  return (
    <div className="space-y-3">
      {/* Header with selected language */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("selectLiteratureLanguage") || "Select Literature Language"}
        </label>
        {selectedLanguage && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {t("selected") || "Selected"}: {selectedLanguage.flag}{" "}
            {selectedLanguage.name}
          </span>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder={t("searchLanguages") || "Search languages..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-lg border ${borderColor} ${searchBg} text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all`}
        />
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
        {displayLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-2 p-2 rounded-lg text-left transition ${
              language === lang.code
                ? `${buttonBg} ${iconColor} font-medium border-2 ${borderColor}`
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent"
            }`}
            aria-label={`${t("select") || "Select"} ${lang.name}`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="flex-1 text-sm truncate font-medium">
              {lang.name}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {lang.litCount}
            </span>
            {language === lang.code && (
              <FaCheck className={checkboxColor} size={12} />
            )}
          </button>
        ))}
      </div>

      {/* Show More / Show Less Button */}
      {filteredLanguages.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className={`flex items-center justify-center gap-2 w-full py-2 text-sm font-medium ${showMoreColor} transition-colors`}
        >
          {showAll ? (
            <>
              <FaChevronUp size={12} />
              {t("showLess") || "Show Less"}
            </>
          ) : (
            <>
              <FaChevronDown size={12} />
              {t("showMore") || "Show More"} ({filteredLanguages.length - 10}{" "}
              {t("more") || "more"})
            </>
          )}
        </button>
      )}

      {/* Language Count */}
      <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
        {filteredLanguages.length}{" "}
        {t("languagesAvailable") || "languages available"}
      </div>
    </div>
  );
};

export default LiteratureLanguageSelector;
