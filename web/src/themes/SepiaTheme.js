// src/theme/SepiaTheme.js

const SepiaTheme = {
  name: "sepia",
  // Background Colors
  background: {
    primary: "bg-amber-50",
    secondary: "bg-amber-100",
    tertiary: "bg-yellow-100",
    gradient: "bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-100",
    card: "bg-amber-50",
    cardHover: "hover:bg-amber-100",
    section: "bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-50",
    highlight: "bg-amber-200",
    overlay: "bg-amber-50/80 backdrop-blur-sm",
    navbar: "bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100",
    footer: "bg-gradient-to-b from-amber-100 to-amber-50",
  },

  // Text Colors
  text: {
    primary: "text-amber-900",
    secondary: "text-amber-800",
    tertiary: "text-amber-700",
    accent: "text-amber-700",
    accentHover: "hover:text-amber-800",
    light: "text-amber-600",
    white: "text-amber-50",
    success: "text-green-700",
    error: "text-red-700",
    warning: "text-yellow-700",
    info: "text-blue-700",
  },

  // Border Colors
  border: {
    default: "border-amber-300",
    light: "border-amber-200",
    accent: "border-amber-400",
    accentHover: "hover:border-amber-500",
    focus: "focus:border-amber-500",
    card: "border-amber-300",
    input: "border-amber-300",
  },

  // Button Styles
  button: {
    primary: "bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-700 hover:to-amber-600",
    secondary: "border-2 border-amber-600 text-amber-700 hover:bg-amber-100",
    outline: "border border-amber-400 text-amber-700 hover:bg-amber-100",
    ghost: "text-amber-700 hover:bg-amber-100",
    disabled: "bg-amber-200 text-amber-400 cursor-not-allowed",
  },

  // Ring Effects
  ring: {
    focus: "focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
    accent: "ring-1 ring-amber-300",
  },

  // Shadow Effects
  shadow: {
    sm: "shadow-sm shadow-amber-900/10",
    md: "shadow-md shadow-amber-900/20",
    lg: "shadow-lg shadow-amber-900/30",
    xl: "shadow-xl shadow-amber-900/40",
    card: "shadow-lg shadow-amber-900/20 hover:shadow-xl hover:shadow-amber-900/30",
    dropdown: "shadow-xl shadow-amber-900/30",
  },

  // Gradient Backgrounds
  gradients: {
    primary: "bg-gradient-to-r from-amber-600 to-amber-500",
    secondary: "bg-gradient-to-r from-amber-500 to-amber-400",
    accent: "bg-gradient-to-r from-amber-700 to-amber-600",
    soft: "bg-gradient-to-r from-amber-100 to-amber-50",
    card: "bg-gradient-to-br from-amber-50 to-amber-100",
    sunset: "bg-gradient-to-r from-rose-600 to-amber-600",
    ocean: "bg-gradient-to-r from-cyan-600 to-blue-600",
    forest: "bg-gradient-to-r from-green-600 to-emerald-600",
  },

  // Badge Styles
  badge: {
    primary: "bg-amber-200 text-amber-800",
    success: "bg-green-200 text-green-800",
    error: "bg-red-200 text-red-800",
    warning: "bg-yellow-200 text-yellow-800",
    info: "bg-blue-200 text-blue-800",
    purple: "bg-purple-200 text-purple-800",
    pink: "bg-pink-200 text-pink-800",
  },

  // Icon Colors
  icon: {
    primary: "text-amber-600",
    secondary: "text-amber-500",
    accent: "text-amber-700",
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  },

  // Link Styles
  link: {
    primary: "text-amber-700 hover:text-amber-800 underline-offset-2 hover:underline",
    secondary: "text-amber-600 hover:text-amber-700",
  },

  // Form Input Styles
  input: {
    default: "border border-amber-300 bg-amber-50 text-amber-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent",
    error: "border-red-300 focus:ring-red-400",
    success: "border-green-300 focus:ring-green-400",
    disabled: "bg-amber-100 cursor-not-allowed",
  },

  // Card Styles
  card: {
    default: "bg-amber-50 rounded-2xl shadow-lg border border-amber-300 hover:shadow-xl transition-all",
    hover: "hover:-translate-y-1",
    gradient: "bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-lg border border-amber-300",
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

export default SepiaTheme;