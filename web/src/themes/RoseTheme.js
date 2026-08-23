// src/theme/RoseTheme.js

const RoseTheme = {
  name: "rose",
  // Background Colors
  background: {
    primary: "bg-white",
    secondary: "bg-rose-50",
    tertiary: "bg-pink-50",
    gradient: "bg-gradient-to-br from-rose-50 via-pink-50 to-rose-50",
    card: "bg-white",
    cardHover: "hover:bg-rose-50",
    section: "bg-gradient-to-br from-rose-50 via-pink-50 to-white",
    highlight: "bg-rose-100",
    overlay: "bg-white/80 backdrop-blur-sm",
    navbar: "bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50",
    footer: "bg-gradient-to-b from-gray-50 to-white",
  },

  // Text Colors
  text: {
    primary: "text-gray-900",
    secondary: "text-gray-700",
    tertiary: "text-gray-500",
    accent: "text-rose-600",
    accentHover: "hover:text-rose-700",
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
    accent: "border-rose-200",
    accentHover: "hover:border-rose-300",
    focus: "focus:border-rose-400",
    card: "border-rose-100",
    input: "border-gray-300",
  },

  // Button Styles
  button: {
    primary: "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600",
    secondary: "border-2 border-rose-500 text-rose-600 hover:bg-rose-50",
    outline: "border border-rose-200 text-rose-600 hover:bg-rose-50",
    ghost: "text-rose-600 hover:bg-rose-50",
    disabled: "bg-gray-100 text-gray-400 cursor-not-allowed",
  },

  // Ring Effects
  ring: {
    focus: "focus:ring-2 focus:ring-rose-400 focus:ring-offset-2",
    accent: "ring-1 ring-rose-200",
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
    primary: "bg-gradient-to-r from-rose-500 to-pink-500",
    secondary: "bg-gradient-to-r from-rose-400 to-pink-400",
    accent: "bg-gradient-to-r from-rose-600 to-pink-600",
    soft: "bg-gradient-to-r from-rose-50 to-pink-50",
    card: "bg-gradient-to-br from-rose-50 to-white",
    sunset: "bg-gradient-to-r from-rose-500 to-amber-500",
    ocean: "bg-gradient-to-r from-cyan-500 to-blue-500",
    forest: "bg-gradient-to-r from-green-500 to-emerald-500",
  },

  // Badge Styles
  badge: {
    primary: "bg-rose-100 text-rose-700",
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-700",
    info: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    pink: "bg-pink-100 text-pink-700",
  },

  // Icon Colors
  icon: {
    primary: "text-rose-500",
    secondary: "text-gray-400",
    accent: "text-rose-600",
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  },

  // Link Styles
  link: {
    primary: "text-rose-600 hover:text-rose-700 underline-offset-2 hover:underline",
    secondary: "text-gray-600 hover:text-rose-600",
  },

  // Form Input Styles
  input: {
    default: "border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent",
    error: "border-red-300 focus:ring-red-400",
    success: "border-green-300 focus:ring-green-400",
    disabled: "bg-gray-100 cursor-not-allowed",
  },

  // Card Styles
  card: {
    default: "bg-white rounded-2xl shadow-lg border border-rose-100 hover:shadow-xl transition-all",
    hover: "hover:-translate-y-1",
    gradient: "bg-gradient-to-br from-rose-50 to-white rounded-2xl shadow-lg border border-rose-100",
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

export default RoseTheme;