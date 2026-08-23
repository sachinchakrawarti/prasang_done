// src/themes/ThemeContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import LightTheme from "./LightTheme";
import DarkTheme from "./DarkTheme";
import ForestTheme from "./ForestTheme";
import LavenderTheme from "./LavenderTheme";
import RoseTheme from "./RoseTheme";
import SepiaTheme from "./SepiaTheme";

// Create Theme Context
const ThemeContext = createContext();

// Available themes
const themes = {
  light: LightTheme,
  dark: DarkTheme,
  forest: ForestTheme,
  lavender: LavenderTheme,
  rose: RoseTheme,
  sepia: SepiaTheme,
};

export const ThemeProvider = ({ children }) => {
  // ✅ Safe initialization - no localStorage access during SSR
  const [themeName, setThemeName] = useState("light");

  // ✅ Load theme from localStorage after mount (client-side only)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && themes[savedTheme]) {
      setThemeName(savedTheme);
    }
  }, []);

  // Current theme object
  const theme = themes[themeName];

  // Set specific theme
  const setTheme = (name) => {
    if (themes[name]) {
      setThemeName(name);
      localStorage.setItem("theme", name);
      document.documentElement.setAttribute("data-theme", name);
      document.documentElement.classList.remove(...Object.keys(themes));
      document.documentElement.classList.add(name);
    }
  };

  // Toggle between light and dark (for backward compatibility)
  const toggleTheme = () => {
    setThemeName((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      document.documentElement.classList.remove(...Object.keys(themes));
      document.documentElement.classList.add(newTheme);
      return newTheme;
    });
  };

  // Cycle through all themes
  const cycleTheme = () => {
    const themeList = Object.keys(themes);
    const currentIndex = themeList.indexOf(themeName);
    const nextIndex = (currentIndex + 1) % themeList.length;
    const newTheme = themeList[nextIndex];
    setThemeName(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    document.documentElement.classList.remove(...Object.keys(themes));
    document.documentElement.classList.add(newTheme);
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeName);
    document.documentElement.classList.remove(...Object.keys(themes));
    document.documentElement.classList.add(themeName);
  }, [themeName]);

  // Context value
  const value = {
    theme,
    themeName,
    setTheme,
    toggleTheme,
    cycleTheme,
    isDark: themeName === "dark",
    isLight: themeName === "light",
    themes: Object.keys(themes),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Custom hook for using theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
