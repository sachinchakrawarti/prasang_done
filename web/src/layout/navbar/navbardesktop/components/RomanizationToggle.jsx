// src/components/layout/navbar/navbardesktop/components/LiteratureLanguageSelector.jsx
"use client";

import { FaCheck } from "react-icons/fa";
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

  // Get theme-based active border color
  const getActiveBorderColor = () => {
    switch (themeName) {
      case "forest":
        return "border-green-500 ring-green-500";
      case "lavender":
        return "border-purple-500 ring-purple-500";
      case "rose":
        return "border-rose-500 ring-rose-500";
      case "sepia":
        return "border-amber-500 ring-amber-500";
      case "dark":
        return "border-gray-500 ring-gray-500";
      default:
        return "border-amber-500 ring-amber-500";
    }
  };

  const activeBorderColor = getActiveBorderColor();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {t("selectLiteratureLanguage") || "Select Literature Language"}
      </label>
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
        {literatureLanguages.slice(0, 10).map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all duration-200 ${
              language === lang.code
                ? `${buttonBg} ${iconColor} font-medium ring-2 ${activeBorderColor}`
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
            aria-label={`${t("select") || "Select"} ${lang.name}`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="flex-1 text-sm truncate">{lang.name}</span>
            {language === lang.code && (
              <FaCheck className={checkboxColor} size={12} />
            )}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        {t("showingTopLanguages") || "Showing top 10 languages"}
      </p>
    </div>
  );
};

export default LiteratureLanguageSelector;
