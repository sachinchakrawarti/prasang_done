// src/public_app/layout/navbar/navbarmobile/components/ThemeSwitcherMobile.jsx
import { useState, useRef, useEffect } from "react";
import { FaPalette, FaCheck } from "react-icons/fa";
import { useTheme } from "../../../../../theme";

const themeConfig = {
  light: {
    name: "Light",
    icon: "☀️",
    gradient: "from-amber-400 to-yellow-400",
    bg: "bg-amber-50",
    border: "border-amber-200",
    accent: "text-amber-600",
    description: "Bright and warm",
  },
  dark: {
    name: "Dark",
    icon: "🌙",
    gradient: "from-gray-700 to-gray-900",
    bg: "bg-gray-800",
    border: "border-gray-700",
    accent: "text-amber-400",
    description: "Easy on eyes",
  },
  forest: {
    name: "Forest",
    icon: "🌲",
    gradient: "from-green-500 to-emerald-600",
    bg: "bg-green-50",
    border: "border-green-200",
    accent: "text-green-600",
    description: "Natural and calm",
  },
  lavender: {
    name: "Lavender",
    icon: "🌸",
    gradient: "from-purple-400 to-pink-400",
    bg: "bg-purple-50",
    border: "border-purple-200",
    accent: "text-purple-600",
    description: "Soft and elegant",
  },
  rose: {
    name: "Rose",
    icon: "🌹",
    gradient: "from-rose-400 to-pink-500",
    bg: "bg-rose-50",
    border: "border-rose-200",
    accent: "text-rose-600",
    description: "Romantic and warm",
  },
  sepia: {
    name: "Sepia",
    icon: "📜",
    gradient: "from-amber-600 to-yellow-700",
    bg: "bg-amber-100",
    border: "border-amber-300",
    accent: "text-amber-700",
    description: "Vintage charm",
  },
};

const ThemeSwitcherMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { themeName, setTheme, theme } = useTheme();
  const dropdownRef = useRef(null);

  const currentTheme = themeConfig[themeName];

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

  const handleThemeSelect = (themeKey) => {
    console.log("Theme selected:", themeKey);
    setTheme(themeKey);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Theme toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 ${theme.text.accent} ${theme.background.cardHover} rounded-full transition-all group`}
        aria-label="Switch theme"
      >
        <FaPalette
          size={18}
          className="group-hover:rotate-12 transition-transform"
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-56 ${theme.background.card} rounded-2xl shadow-xl border ${theme.border.accent} py-2 z-50`}
        >
          {/* Header */}
          <div
            className={`px-4 py-2 text-sm font-semibold ${theme.text.accent} border-b ${theme.border.light} flex items-center gap-2`}
          >
            <FaPalette className={theme.icon.primary} size={14} />
            <span>Select Theme</span>
          </div>

          {/* Theme list - Single column */}
          <div className="py-1 max-h-80 overflow-y-auto">
            {Object.entries(themeConfig).map(([key, themeOption]) => {
              const isActive = themeName === key;

              return (
                <button
                  key={key}
                  onClick={() => handleThemeSelect(key)}
                  className={`w-full px-4 py-2 flex items-center gap-3 transition-colors ${
                    isActive
                      ? `${themeOption.bg} ${themeOption.accent}`
                      : `${theme.text.secondary} ${theme.background.cardHover}`
                  }`}
                >
                  {/* Theme preview - small circle */}
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${themeOption.gradient} flex items-center justify-center text-white text-sm shadow-sm flex-shrink-0`}
                  >
                    {themeOption.icon}
                  </div>

                  {/* Theme info */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-sm font-medium ${
                          isActive ? themeOption.accent : theme.text.primary
                        }`}
                      >
                        {themeOption.name}
                      </span>
                      {isActive && (
                        <FaCheck className={theme.icon.primary} size={12} />
                      )}
                    </div>
                    <p className={`text-xs ${theme.text.tertiary}`}>
                      {themeOption.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Current theme indicator */}
          <div
            className={`px-4 py-2 text-xs ${theme.text.tertiary} border-t ${theme.border.light} flex items-center justify-between`}
          >
            <span>Current:</span>
            <span
              className={`font-medium ${theme.text.accent} flex items-center gap-1`}
            >
              <span>{currentTheme.icon}</span>
              {currentTheme.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcherMobile;
