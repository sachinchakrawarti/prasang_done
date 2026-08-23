// src/public_app/layout/navbar/navbarmobile/components/ControlMobile.jsx
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../../../../theme";
import { useLanguage } from "../../../../../../context/LanguageContext";
import { useAiLangSelector } from "../../../../../../context/AiLangSelectorContext";
import ControlButton from "./components/ControlButton";
import ControlPanel from "./components/ControlPanel";
import ControlBackdrop from "./components/ControlBackdrop";

const ControlMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("language");
  const dropdownRef = useRef(null);

  const { themeName, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const {
    aiLanguages,
    aiTranslationEnabled,
    audioEnabled,
    toggleAiTranslation,
    toggleAudio,
    toggleLanguage,
    enabledLanguagesCount,
  } = useAiLangSelector();

  // State for various options
  const [romanzation, setRomanzation] = useState(false);

  // Literature languages available
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

  // Theme options
  const themes = [
    { id: "default", name: "Default Amber", icon: "⭐", color: "amber" },
    { id: "forest", name: "Forest Green", icon: "🌿", color: "green" },
    { id: "lavender", name: "Lavender Purple", icon: "🪶", color: "purple" },
    { id: "rose", name: "Rose Pink", icon: "⭐", color: "rose" },
    { id: "sepia", name: "Sepia Vintage", icon: "📖", color: "amber" },
    { id: "dark", name: "Dark Mode", icon: "🌙", color: "gray" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Theme styles
  const getThemeStyles = () => {
    const baseStyles = {
      dropdownBg: "bg-white dark:bg-gray-900",
      headerBg: "bg-amber-100 dark:bg-amber-800",
      tabActiveColor: "text-amber-600 dark:text-amber-400 border-amber-600",
      tabInactiveColor: "text-gray-500 dark:text-gray-400",
      iconColor: "text-amber-600 dark:text-amber-400",
      buttonBg: "hover:bg-amber-100 dark:hover:bg-amber-800",
      checkboxColor: "text-amber-600",
      toggleActiveBg: "bg-amber-500",
      toggleInactiveBg: "bg-gray-300 dark:bg-gray-600",
    };

    switch (themeName) {
      case "forest":
        return {
          ...baseStyles,
          dropdownBg: "bg-green-50 dark:bg-green-900/95",
          headerBg: "bg-green-100 dark:bg-green-800",
          tabActiveColor: "text-green-600 dark:text-green-400 border-green-600",
          iconColor: "text-green-600 dark:text-green-400",
          buttonBg: "hover:bg-green-100 dark:hover:bg-green-800",
          checkboxColor: "text-green-600",
          toggleActiveBg: "bg-green-500",
        };
      case "lavender":
        return {
          ...baseStyles,
          dropdownBg: "bg-purple-50 dark:bg-purple-900/95",
          headerBg: "bg-purple-100 dark:bg-purple-800",
          tabActiveColor:
            "text-purple-600 dark:text-purple-400 border-purple-600",
          iconColor: "text-purple-600 dark:text-purple-400",
          buttonBg: "hover:bg-purple-100 dark:hover:bg-purple-800",
          checkboxColor: "text-purple-600",
          toggleActiveBg: "bg-purple-500",
        };
      case "rose":
        return {
          ...baseStyles,
          dropdownBg: "bg-rose-50 dark:bg-rose-900/95",
          headerBg: "bg-rose-100 dark:bg-rose-800",
          tabActiveColor: "text-rose-600 dark:text-rose-400 border-rose-600",
          iconColor: "text-rose-600 dark:text-rose-400",
          buttonBg: "hover:bg-rose-100 dark:hover:bg-rose-800",
          checkboxColor: "text-rose-600",
          toggleActiveBg: "bg-rose-500",
        };
      case "sepia":
        return {
          ...baseStyles,
          dropdownBg: "bg-amber-50 dark:bg-amber-900/95",
          headerBg: "bg-amber-100 dark:bg-amber-800",
          tabActiveColor: "text-amber-600 dark:text-amber-400 border-amber-600",
          iconColor: "text-amber-600 dark:text-amber-400",
          buttonBg: "hover:bg-amber-100 dark:hover:bg-amber-800",
          checkboxColor: "text-amber-600",
          toggleActiveBg: "bg-amber-500",
        };
      case "dark":
        return {
          ...baseStyles,
          dropdownBg: "bg-gray-900",
          headerBg: "bg-gray-800",
          tabActiveColor: "text-gray-300 border-gray-300",
          tabInactiveColor: "text-gray-500",
          iconColor: "text-gray-400",
          buttonBg: "hover:bg-gray-700",
          checkboxColor: "text-gray-400",
          toggleActiveBg: "bg-gray-500",
          toggleInactiveBg: "bg-gray-700",
        };
      default:
        return baseStyles;
    }
  };

  const themeStyles = getThemeStyles();

  // Language selector component
  const LanguageTab = () => (
    <div className="space-y-4">
      {/* Romanzation Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="flex items-center gap-3">
          <span className={themeStyles.iconColor}>🌐</span>
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              Romanzation
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Convert script to Latin
            </p>
          </div>
        </div>
        <button
          onClick={() => setRomanzation(!romanzation)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            romanzation
              ? themeStyles.toggleActiveBg
              : themeStyles.toggleInactiveBg
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              romanzation ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>

      {/* Literature Language Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Literature Language
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
          {literatureLanguages.slice(0, 10).map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-2 p-2 rounded-lg text-left transition ${
                language === lang.code
                  ? `${themeStyles.buttonBg} ${themeStyles.iconColor} font-medium`
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <span>{lang.flag}</span>
              <span className="flex-1 text-sm truncate">{lang.name}</span>
              {language === lang.code && (
                <span className={themeStyles.checkboxColor}>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // AI Translation tab component
  const AITab = () => (
    <div className="space-y-4">
      {/* AI Translation Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="flex items-center gap-3">
          <span className={themeStyles.iconColor}>🤖</span>
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              AI Translation
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enable real-time translation
            </p>
          </div>
        </div>
        <button
          onClick={toggleAiTranslation}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            aiTranslationEnabled
              ? themeStyles.toggleActiveBg
              : themeStyles.toggleInactiveBg
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              aiTranslationEnabled ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>

      {/* Audio Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="flex items-center gap-3">
          <span className={themeStyles.iconColor}>🔊</span>
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              Audio Playback
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Read poems aloud
            </p>
          </div>
        </div>
        <button
          onClick={toggleAudio}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            audioEnabled
              ? themeStyles.toggleActiveBg
              : themeStyles.toggleInactiveBg
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              audioEnabled ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>

      {/* AI Language Selection (Max 3) */}
      {aiTranslationEnabled && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Select up to 3 languages
            </label>
            <span className="text-xs text-gray-500">
              {enabledLanguagesCount}/3 selected
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {aiLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                disabled={!lang.enabled && enabledLanguagesCount >= 3}
                className={`flex items-center gap-2 p-2 rounded-lg text-left transition ${
                  lang.enabled
                    ? `${themeStyles.buttonBg} ${themeStyles.iconColor} font-medium`
                    : enabledLanguagesCount >= 3
                      ? "opacity-40 cursor-not-allowed text-gray-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className="flex-1 text-sm truncate">{lang.name}</span>
                {lang.enabled && (
                  <span className={themeStyles.checkboxColor}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Theme tab component
  const ThemeTab = () => (
    <div className="grid grid-cols-2 gap-3">
      {themes.map((th) => (
        <button
          key={th.id}
          onClick={() => setTheme(th.id)}
          className={`p-3 rounded-xl border-2 transition-all ${
            themeName === th.id
              ? `border-${th.color}-500 bg-${th.color}-50 dark:bg-${th.color}-900/20`
              : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
          }`}
        >
          <div className={`text-2xl mb-2 text-${th.color}-500`}>{th.icon}</div>
          <p
            className={`text-sm font-medium ${
              themeName === th.id
                ? `text-${th.color}-600`
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {th.name}
          </p>
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <ControlButton
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        iconColor={themeStyles.iconColor}
        buttonBg={themeStyles.buttonBg}
      />

      {isOpen && (
        <>
          <ControlBackdrop onClick={() => setIsOpen(false)} />
          <ControlPanel
            onClose={() => setIsOpen(false)}
            themeStyles={themeStyles}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            LanguageTab={LanguageTab}
            AITab={AITab}
            ThemeTab={ThemeTab}
          />
        </>
      )}
    </div>
  );
};

export default ControlMobile;
