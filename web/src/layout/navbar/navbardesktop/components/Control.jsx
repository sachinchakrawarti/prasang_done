// src/components/layout/navbar/navbardesktop/components/Control.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FaGlobe,
  FaRobot,
  FaChevronDown,
  FaTimes,
  FaBookOpen,
  FaPalette,
  FaMoon,
  FaLeaf,
  FaFeather,
  FaStar,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { AiFillControl } from "react-icons/ai";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAiLangSelector } from "@/context/AiLangSelectorContext";
import LiteratureLanguageSelector from "./LiteratureLanguageSelector";
import AITranslationSelector from "./AITranslationSelector";
import RomanizationToggle from "./RomanizationToggle";
import { useTranslation } from "@/hooks/useTranslation";

const Control = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("language");
  const dropdownRef = useRef(null);

  const { theme, themeName, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  // Use AI Language Selector context
  const {
    aiLanguages,
    aiTranslationEnabled,
    audioEnabled,
    toggleAiTranslation,
    toggleAudio,
    toggleLanguage,
  } = useAiLangSelector();

  // State for various options
  const [romanzation, setRomanzation] = useState(false);
  const [darkMode, setDarkMode] = useState(themeName === "dark");
  const [selectedTheme, setSelectedTheme] = useState(themeName);

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
      id: "default",
      name: t("defaultTheme") || "Default Amber",
      icon: <FaStar />,
      color: "amber",
    },
    {
      id: "forest",
      name: t("forestTheme") || "Forest Green",
      icon: <FaLeaf />,
      color: "green",
    },
    {
      id: "lavender",
      name: t("lavenderTheme") || "Lavender Purple",
      icon: <FaFeather />,
      color: "purple",
    },
    {
      id: "rose",
      name: t("roseTheme") || "Rose Pink",
      icon: <FaStar />,
      color: "rose",
    },
    {
      id: "sepia",
      name: t("sepiaTheme") || "Sepia Vintage",
      icon: <FaBookOpen />,
      color: "amber",
    },
    {
      id: "dark",
      name: t("darkTheme") || "Dark Mode",
      icon: <FaMoon />,
      color: "gray",
    },
  ];

  // Theme-based styling functions
  const getDropdownBg = () => {
    switch (themeName) {
      case "forest":
        return "bg-green-50 dark:bg-green-900/90";
      case "lavender":
        return "bg-purple-50 dark:bg-purple-900/90";
      case "rose":
        return "bg-rose-50 dark:bg-rose-900/90";
      case "sepia":
        return "bg-amber-50 dark:bg-amber-900/90";
      case "dark":
        return "bg-gray-800";
      default:
        return "bg-white dark:bg-gray-800";
    }
  };

  const getButtonBg = () => {
    switch (themeName) {
      case "forest":
        return "hover:bg-green-100 dark:hover:bg-green-800";
      case "lavender":
        return "hover:bg-purple-100 dark:hover:bg-purple-800";
      case "rose":
        return "hover:bg-rose-100 dark:hover:bg-rose-800";
      case "sepia":
        return "hover:bg-amber-100 dark:hover:bg-amber-800";
      case "dark":
        return "hover:bg-gray-700";
      default:
        return "hover:bg-gray-100 dark:hover:bg-gray-700";
    }
  };

  const getTabActiveColor = () => {
    switch (themeName) {
      case "forest":
        return "text-green-600 dark:text-green-400 border-green-600";
      case "lavender":
        return "text-purple-600 dark:text-purple-400 border-purple-600";
      case "rose":
        return "text-rose-600 dark:text-rose-400 border-rose-600";
      case "sepia":
        return "text-amber-600 dark:text-amber-400 border-amber-600";
      case "dark":
        return "text-gray-300 border-gray-300";
      default:
        return "text-amber-600 dark:text-amber-400 border-amber-600";
    }
  };

  const getCheckboxColor = () => {
    switch (themeName) {
      case "forest":
        return "text-green-600";
      case "lavender":
        return "text-purple-600";
      case "rose":
        return "text-rose-600";
      case "sepia":
        return "text-amber-600";
      case "dark":
        return "text-gray-400";
      default:
        return "text-amber-600";
    }
  };

  const getIconColor = () => {
    switch (themeName) {
      case "forest":
        return "text-green-600 dark:text-green-400";
      case "lavender":
        return "text-purple-600 dark:text-purple-400";
      case "rose":
        return "text-rose-600 dark:text-rose-400";
      case "sepia":
        return "text-amber-600 dark:text-amber-400";
      case "dark":
        return "text-gray-400";
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
      case "dark":
        return "border-gray-700";
      default:
        return "border-gray-200 dark:border-gray-700";
    }
  };

  const dropdownBg = getDropdownBg();
  const buttonBg = getButtonBg();
  const tabActiveColor = getTabActiveColor();
  const checkboxColor = getCheckboxColor();
  const iconColor = getIconColor();
  const borderColor = getBorderColor();

  // Handle navigation to full preferences
  const handleNavigateToPreferences = () => {
    setIsOpen(false);
    router.push("/controls-preferences");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Control Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-all duration-200 ${buttonBg} flex items-center gap-1`}
        aria-label={t("controls") || "Controls"}
      >
        <AiFillControl
          className={`text-lg ${iconColor} ${isOpen ? "rotate-90" : ""} transition-transform duration-300`}
        />
        <FaChevronDown
          className={`text-xs ${iconColor} transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-96 ${dropdownBg} rounded-2xl shadow-2xl border ${borderColor} overflow-hidden z-50 max-h-[90vh] overflow-y-auto`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3
              className={`font-semibold flex items-center gap-2 ${iconColor}`}
            >
              <AiFillControl />{" "}
              {t("controlsPreferences") || "Controls & Preferences"}
            </h3>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              {
                id: "language",
                label: t("literature") || "Literature",
                icon: <FaGlobe />,
              },
              {
                id: "ai",
                label: t("aiTranslation") || "AI Translation",
                icon: <FaRobot />,
              },
              {
                id: "theme",
                label: t("theme") || "Theme",
                icon: <FaPalette />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? `${tabActiveColor} border-b-2`
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {/* Literature Language Tab */}
            {activeTab === "language" && (
              <div className="space-y-4">
                <RomanizationToggle
                  themeName={themeName}
                  iconColor={iconColor}
                  romanzation={romanzation}
                  setRomanzation={setRomanzation}
                />
                <LiteratureLanguageSelector
                  themeName={themeName}
                  buttonBg={buttonBg}
                  iconColor={iconColor}
                  checkboxColor={checkboxColor}
                />
              </div>
            )}

            {/* AI Translation Tab */}
            {activeTab === "ai" && (
              <AITranslationSelector
                themeName={themeName}
                buttonBg={buttonBg}
                iconColor={iconColor}
                checkboxColor={checkboxColor}
                aiTranslation={aiTranslationEnabled}
                setAiTranslation={toggleAiTranslation}
                audioEnabled={audioEnabled}
                setAudioEnabled={toggleAudio}
                aiLanguages={aiLanguages}
                toggleAiLanguage={toggleLanguage}
              />
            )}

            {/* Theme Tab */}
            {activeTab === "theme" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {themes.map((th) => (
                    <button
                      key={th.id}
                      onClick={() => {
                        setTheme(th.id);
                        setSelectedTheme(th.id);
                      }}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        themeName === th.id
                          ? `border-${th.color}-500 bg-${th.color}-50 dark:bg-${th.color}-900/20`
                          : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                      }`}
                    >
                      <div className={`text-2xl mb-2 text-${th.color}-500`}>
                        {th.icon}
                      </div>
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
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t("quickSettings") || "Quick settings"}
              </span>
              <button
                onClick={handleNavigateToPreferences}
                className={`flex items-center gap-2 px-3 py-2 ${buttonBg} rounded-lg text-sm ${iconColor} transition-all group`}
              >
                <span>{t("fullPreferences") || "Full Preferences"}</span>
                <FaExternalLinkAlt
                  size={12}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>
                {t("preferencesSaved") || "Preferences saved locally"}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                aria-label={t("close") || "Close"}
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Control;
