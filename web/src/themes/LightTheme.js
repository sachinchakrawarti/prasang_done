// src/theme/LightTheme.js

const LightTheme = {
  name: "light",
  // Background Colors
  background: {
    primary: "bg-white",
    secondary: "bg-amber-50",
    tertiary: "bg-yellow-50",
    gradient: "bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50",
    card: "bg-white",
    cardHover: "hover:bg-amber-50",
    section: "bg-gradient-to-br from-amber-50 via-yellow-50 to-white",
    highlight: "bg-amber-100",
    overlay: "bg-white/80 backdrop-blur-sm",
    navbar: "bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50",
    footer: "bg-gradient-to-b from-gray-50 to-white",
  },

  // Text Colors
  text: {
    primary: "text-gray-900",
    secondary: "text-gray-700",
    tertiary: "text-gray-500",
    accent: "text-amber-600",
    accentHover: "hover:text-amber-700",
    light: "text-gray-400",
    white: "text-white",
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  },

  // Border Colors
  border: {
    default: "border-gray-200",
    light: "border-gray-100",
    accent: "border-amber-200",
    accentHover: "hover:border-amber-300",
    focus: "focus:border-amber-400",
    card: "border-amber-100",
    input: "border-gray-300",
  },

  // Button Styles
  button: {
    primary: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600",
    secondary: "border-2 border-amber-500 text-amber-600 hover:bg-amber-50",
    outline: "border border-amber-200 text-amber-600 hover:bg-amber-50",
    ghost: "text-amber-600 hover:bg-amber-50",
    disabled: "bg-gray-100 text-gray-400 cursor-not-allowed",
  },

  // Ring Effects
  ring: {
    focus: "focus:ring-2 focus:ring-amber-400 focus:ring-offset-2",
    accent: "ring-1 ring-amber-200",
  },

  // Shadow Effects
  shadow: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    card: "shadow-lg hover:shadow-xl",
    dropdown: "shadow-xl",
  },

  // Gradient Backgrounds
  gradients: {
    primary: "bg-gradient-to-r from-amber-500 to-yellow-500",
    secondary: "bg-gradient-to-r from-amber-400 to-yellow-400",
    accent: "bg-gradient-to-r from-amber-600 to-yellow-600",
    soft: "bg-gradient-to-r from-amber-50 to-yellow-50",
    card: "bg-gradient-to-br from-amber-50 to-white",
    sunset: "bg-gradient-to-r from-rose-500 to-amber-500",
    ocean: "bg-gradient-to-r from-cyan-500 to-blue-500",
    forest: "bg-gradient-to-r from-green-500 to-emerald-500",
  },

  // Badge Styles
  badge: {
    primary: "bg-amber-100 text-amber-700",
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-700",
    info: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    pink: "bg-pink-100 text-pink-700",
  },

  // Icon Colors
  icon: {
    primary: "text-amber-500",
    secondary: "text-gray-400",
    accent: "text-amber-600",
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  },

  // Link Styles
  link: {
    primary: "text-amber-600 hover:text-amber-700 underline-offset-2 hover:underline",
    secondary: "text-gray-600 hover:text-amber-600",
  },

  // Form Input Styles
  input: {
    default: "border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent",
    error: "border-red-300 focus:ring-red-400",
    success: "border-green-300 focus:ring-green-400",
    disabled: "bg-gray-100 cursor-not-allowed",
  },

  // Card Styles
  card: {
    default: "bg-white rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-all",
    hover: "hover:-translate-y-1",
    gradient: "bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-lg border border-amber-100",
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

export default LightTheme;