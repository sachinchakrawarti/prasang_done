// src/public_app/layout/navbar/navbarmobile/components/LanguageSwitcherMobile.jsx
import { useState, useRef, useEffect } from "react";
import { FaGlobe, FaCheck } from "react-icons/fa";
import { useLanguage } from "../../../../../context/LanguageContext";
import { useTheme } from "../../../../../theme";

// Language configuration - without flags
const languageConfig = {
  en: {
    name: "English",
    nativeName: "English",
    description: "English language",
  },
  hi: {
    name: "Hindi",
    nativeName: "हिन्दी",
    description: "हिन्दी भाषा",
  },
  ur: {
    name: "Urdu",
    nativeName: "اردو",
    description: "اردو زبان",
    rtl: true, // Mark as RTL
  },
};

const LanguageSwitcherMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, changeLanguage, languages } = useLanguage();
  const { theme } = useTheme();
  const dropdownRef = useRef(null);

  const currentLang =
    languages.find((l) => l.code === language) || languages[0];
  const isRTL = languageConfig[language]?.rtl || false;

  // Display native name with English in parentheses for non-English
  const getDisplayName = (lang) => {
    if (lang.code === "en") return lang.nativeName;
    return `${lang.nativeName} (${lang.englishName})`;
  };

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

  const handleLanguageSelect = (langCode) => {
    console.log("Language selected:", langCode);
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 ${theme.text.accent} ${theme.background.cardHover} rounded-full transition-all group`}
        aria-label="Switch language"
      >
        <FaGlobe
          size={18}
          className="group-hover:rotate-12 transition-transform"
        />
      </button>

      {/* Dropdown menu - positioned based on RTL/LTR */}
      {isOpen && (
        <div
          className={`absolute mt-2 w-56 ${theme.background.card} rounded-2xl shadow-xl border ${theme.border.accent} py-2 z-50`}
          style={{
            [isRTL ? "left" : "right"]: 0, // For RTL (Urdu), position to left; for LTR, position to right
            maxWidth: "calc(100vw - 20px)",
          }}
        >
          {/* Header */}
          <div
            className={`px-4 py-2 text-sm font-semibold ${theme.text.accent} border-b ${theme.border.light} flex items-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <FaGlobe className={theme.icon.primary} size={14} />
            <span>Select Language</span>
          </div>

          {/* Language list - Single column */}
          <div className="py-1 max-h-80 overflow-y-auto">
            {languages.map((lang) => {
              const isActive = language === lang.code;
              const langConfig = languageConfig[lang.code];
              const isLangRTL = langConfig?.rtl || false;

              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full px-4 py-2 flex items-center gap-3 transition-colors ${
                    isActive
                      ? `${theme.background.accent} ${theme.text.accent}`
                      : `${theme.text.secondary} ${theme.background.cardHover}`
                  } ${isLangRTL ? "flex-row-reverse" : ""}`}
                >
                  {/* Language info - without flag */}
                  <div
                    className={`flex-1 ${isLangRTL ? "text-right" : "text-left"}`}
                  >
                    <div
                      className={`flex items-center gap-1 ${isLangRTL ? "flex-row-reverse" : ""}`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          isActive ? theme.text.accent : theme.text.primary
                        }`}
                      >
                        {getDisplayName(lang)}
                      </span>
                      {isActive && (
                        <FaCheck className={theme.icon.primary} size={12} />
                      )}
                    </div>
                    <p className={`text-xs ${theme.text.tertiary}`}>
                      {langConfig?.description || lang.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Current language indicator */}
          <div
            className={`px-4 py-2 text-xs ${theme.text.tertiary} border-t ${theme.border.light} flex items-center justify-between ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <span>Current:</span>
            <span
              className={`font-medium ${theme.text.accent} flex items-center gap-1`}
            >
              {currentLang.nativeName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcherMobile;
