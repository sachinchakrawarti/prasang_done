// src/layout/navbar/navbardesktop/components/Theme_Switcher_Desktop.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaPalette,
  FaSun,
  FaMoon,
  FaTree,
  FaSeedling,
  FaHeart,
  FaScroll,
  FaChevronDown,
  FaCheck,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

const ThemeSwitcherDesktop = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { themeName, setTheme } = useTheme();
  const { t } = useTranslation();

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

  // Theme options
  const themes = [
    {
      id: "light",
      name: t("defaultTheme") || "Light",
      icon: FaSun,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
    {
      id: "dark",
      name: t("darkTheme") || "Dark",
      icon: FaMoon,
      color: "text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-800",
    },
    {
      id: "forest",
      name: t("forestTheme") || "Forest",
      icon: FaTree,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      id: "lavender",
      name: t("lavenderTheme") || "Lavender",
      icon: FaSeedling,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    {
      id: "rose",
      name: t("roseTheme") || "Rose",
      icon: FaHeart,
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      borderColor: "border-pink-200 dark:border-pink-800",
    },
    {
      id: "sepia",
      name: t("sepiaTheme") || "Sepia",
      icon: FaScroll,
      color: "text-amber-700",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-300 dark:border-amber-800",
    },
  ];

  // Get current theme
  const currentTheme = themes.find((t) => t.id === themeName) || themes[0];
  const ThemeIcon = currentTheme.icon;

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

  const getActiveBg = () => {
    switch (themeName) {
      case "forest":
        return "bg-green-50 dark:bg-green-900/20";
      case "lavender":
        return "bg-purple-50 dark:bg-purple-900/20";
      case "rose":
        return "bg-rose-50 dark:bg-rose-900/20";
      case "sepia":
        return "bg-amber-50 dark:bg-amber-900/20";
      default:
        return "bg-amber-50 dark:bg-amber-900/20";
    }
  };

  const hoverBg = getHoverBg();
  const textColor = getTextColor();
  const borderColor = getBorderColor();
  const activeBg = getActiveBg();

  // Show placeholder during SSR
  if (!isMounted) {
    return (
      <div className="relative">
        <button
          className={`p-2 rounded-lg ${hoverBg} flex items-center gap-1 animate-pulse`}
          aria-label="Theme switcher"
        >
          <FaPalette className={`w-5 h-5 ${textColor}`} />
          <FaChevronDown className={`text-xs ${textColor}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Theme Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg ${hoverBg} flex items-center gap-1 transition-all`}
        aria-label="Theme switcher"
      >
        <ThemeIcon className={`w-5 h-5 ${currentTheme.color}`} />
        <FaChevronDown
          className={`text-xs ${textColor} transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border ${borderColor} py-2 z-50`}
        >
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Select Theme
            </span>
          </div>

          {themes.map((theme) => {
            const isActive = themeName === theme.id;
            const Icon = theme.icon;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  setTheme(theme.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? `${activeBg} ${textColor} font-medium`
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className={`text-base ${theme.color}`} />
                <span className="flex-1 text-left">{theme.name}</span>
                {isActive && <FaCheck className={`text-xs ${textColor}`} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcherDesktop;
