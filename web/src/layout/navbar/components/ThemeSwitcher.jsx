// src/layout/navbar/components/ThemeSwitcher.jsx
"use client";

import { useState } from "react";
import {
  FaPalette,
  FaSun,
  FaMoon,
  FaLeaf,
  FaFeather,
  FaStar,
  FaBookOpen,
  FaCheck,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext"; // ✅ Fixed import

const ThemeSwitcher = () => {
  const { themeName, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: "light", name: "Light", icon: FaSun, color: "text-amber-500" },
    { id: "dark", name: "Dark", icon: FaMoon, color: "text-indigo-400" },
    { id: "forest", name: "Forest", icon: FaLeaf, color: "text-green-500" },
    {
      id: "lavender",
      name: "Lavender",
      icon: FaFeather,
      color: "text-purple-500",
    },
    { id: "rose", name: "Rose", icon: FaStar, color: "text-pink-500" },
    { id: "sepia", name: "Sepia", icon: FaBookOpen, color: "text-amber-700" },
  ];

  const currentTheme = themes.find((t) => t.id === themeName) || themes[0];
  const Icon = currentTheme.icon;

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

  const getActiveBg = () => {
    switch (themeName) {
      case "forest":
        return "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400";
      case "lavender":
        return "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
      case "rose":
        return "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400";
      case "sepia":
        return "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400";
      default:
        return "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400";
    }
  };

  const hoverBg = getHoverBg();
  const activeBg = getActiveBg();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-all ${hoverBg}`}
        aria-label="Theme switcher"
      >
        <Icon className={`w-5 h-5 ${currentTheme.color}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
            <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Select Theme
              </span>
            </div>

            {themes.map((theme) => {
              const ThemeIcon = theme.icon;
              const isActive = themeName === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                    isActive
                      ? activeBg
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <ThemeIcon className={`w-4 h-4 ${theme.color}`} />
                  <span className="flex-1 text-left">{theme.name}</span>
                  {isActive && <FaCheck className={`w-3 h-3 ${theme.color}`} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;
