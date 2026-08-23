// src/theme/DarkTheme.js

const DarkTheme = {
  name: "dark",
  // Background Colors
  background: {
    primary: "bg-gray-900",
    secondary: "bg-gray-800",
    tertiary: "bg-gray-700",
    gradient: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
    card: "bg-gray-800",
    cardHover: "hover:bg-gray-700",
    section: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
    highlight: "bg-gray-700",
    overlay: "bg-gray-900/80 backdrop-blur-sm",
    navbar: "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900",
    footer: "bg-gradient-to-b from-gray-900 to-gray-800",
  },

  // Text Colors
  text: {
    primary: "text-gray-100",
    secondary: "text-gray-300",
    tertiary: "text-gray-400",
    accent: "text-amber-400",
    accentHover: "hover:text-amber-300",
    light: "text-gray-500",
    white: "text-white",
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  },

  // Border Colors
  border: {
    default: "border-gray-700",
    light: "border-gray-600",
    accent: "border-amber-800",
    accentHover: "hover:border-amber-700",
    focus: "focus:border-amber-600",
    card: "border-gray-700",
    input: "border-gray-600",
  },

  // Button Styles
  button: {
    primary: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600",
    secondary: "border-2 border-amber-500 text-amber-400 hover:bg-amber-900/20",
    outline: "border border-gray-600 text-gray-300 hover:bg-gray-700",
    ghost: "text-amber-400 hover:bg-gray-800",
    disabled: "bg-gray-800 text-gray-500 cursor-not-allowed",
  },

  // Ring Effects
  ring: {
    focus: "focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-gray-900",
    accent: "ring-1 ring-amber-800",
  },

  // Shadow Effects
  shadow: {
    sm: "shadow-sm shadow-black/20",
    md: "shadow-md shadow-black/30",
    lg: "shadow-lg shadow-black/40",
    xl: "shadow-xl shadow-black/50",
    card: "shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40",
    dropdown: "shadow-xl shadow-black/50",
  },

  // Gradient Backgrounds
  gradients: {
    primary: "bg-gradient-to-r from-amber-500 to-yellow-500",
    secondary: "bg-gradient-to-r from-amber-600 to-yellow-600",
    accent: "bg-gradient-to-r from-amber-400 to-yellow-400",
    soft: "bg-gradient-to-r from-gray-800 to-gray-700",
    card: "bg-gradient-to-br from-gray-800 to-gray-900",
    sunset: "bg-gradient-to-r from-rose-600 to-amber-600",
    ocean: "bg-gradient-to-r from-cyan-600 to-blue-600",
    forest: "bg-gradient-to-r from-green-600 to-emerald-600",
  },

  // Badge Styles
  badge: {
    primary: "bg-amber-900/30 text-amber-400",
    success: "bg-green-900/30 text-green-400",
    error: "bg-red-900/30 text-red-400",
    warning: "bg-yellow-900/30 text-yellow-400",
    info: "bg-blue-900/30 text-blue-400",
    purple: "bg-purple-900/30 text-purple-400",
    pink: "bg-pink-900/30 text-pink-400",
  },

  // Icon Colors
  icon: {
    primary: "text-amber-400",
    secondary: "text-gray-500",
    accent: "text-amber-300",
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  },

  // Link Styles
  link: {
    primary: "text-amber-400 hover:text-amber-300 underline-offset-2 hover:underline",
    secondary: "text-gray-400 hover:text-amber-400",
  },

  // Form Input Styles
  input: {
    default: "border border-gray-600 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent",
    error: "border-red-600 focus:ring-red-500",
    success: "border-green-600 focus:ring-green-500",
    disabled: "bg-gray-900 cursor-not-allowed",
  },

  // Card Styles
  card: {
    default: "bg-gray-800 rounded-2xl shadow-lg border border-gray-700 hover:shadow-xl transition-all",
    hover: "hover:-translate-y-1",
    gradient: "bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg border border-gray-700",
  },

  // Animation Classes
  animation: {
    float: "animate-float",
    pulse: "animate-pulse",
    fadeIn: "animate-fadeIn",
    slideIn: "animate-slideIn",
  },

  // Z-index layers
  zIndex: {
    navbar: "z-50",
    modal: "z-40",
    dropdown: "z-30",
    overlay: "z-20",
    default: "z-0",
  },
};

export default DarkTheme;