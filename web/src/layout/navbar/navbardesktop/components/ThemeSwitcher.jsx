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
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";

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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-700`}
        aria-label="Theme switcher"
      >
        <Icon className={`w-5 h-5 ${currentTheme.color}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
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
                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <ThemeIcon className={`w-4 h-4 ${theme.color}`} />
                <span>{theme.name}</span>
                {isActive && <span className="ml-auto text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
