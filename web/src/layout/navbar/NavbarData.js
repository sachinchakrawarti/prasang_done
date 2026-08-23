// src/public_app/layout/navbar/NavbarData.js
import {
  FaHome,
  FaBook,
  FaUser,
  FaInfoCircle,
  FaPenFancy,
  FaHeart,
  FaFeatherAlt,
  FaHistory,
  FaAward,
  FaBlog,
  FaQuestionCircle,
  FaPenNib,
  FaLeaf,
  FaMoon,
  FaSun,
  FaTree,
  FaSeedling,
  FaPalette,
  FaScroll,
  FaPaintBrush,
  FaFlask,
  FaCrown,
} from "react-icons/fa";

// Theme-based icons mapping - using only valid Fa icons
export const themeIcons = {
  light: { icon: FaSun, color: "text-amber-500" },
  dark: { icon: FaMoon, color: "text-indigo-400" },
  forest: { icon: FaTree, color: "text-green-500" },
  lavender: { icon: FaSeedling, color: "text-purple-500" },
  rose: { icon: FaHeart, color: "text-pink-500" }, // Changed from FaRose to FaHeart
  sepia: { icon: FaScroll, color: "text-amber-700" },
};

export const navItems = [
  {
    label: "Home",
    to: "/",
    icon: FaHome,
    themeAware: true,
  },
  {
    label: "Poems",
    to: "/poems",
    icon: FaBook,
    themeAware: true,
    dropdown: [
      { label: "All Poems", to: "/poems", icon: FaBook },
      { label: "Popular", to: "/poems/popular", icon: FaHeart },
      { label: "New", to: "/poems/new", icon: FaPenFancy },
      { label: "Classics", to: "/poems/classics", icon: FaHistory },
      { label: "Categories", to: "/poems/categories", icon: FaBook },
      { label: "Poem Types", to: "/poemstypes", icon: FaPenNib },
    ],
  },

  {
    label: "Prose",
    to: "/prose",
    icon: FaPenNib,
    themeAware: true,
    dropdown: [
      { label: "All Prose", to: "/prose", icon: FaPenNib },
      { label: "Short Stories", to: "/prose/stories", icon: FaBook },
      { label: "Essays", to: "/prose/essays", icon: FaPenFancy },
      { label: "Articles", to: "/prose/articles", icon: FaBlog },
      { label: "Memoirs", to: "/prose/memoirs", icon: FaHistory },
      { label: "Literary Criticism", to: "/prose/criticism", icon: FaAward },
    ],
  },

  {
    label: "Poets",
    to: "/poets",
    icon: FaUser,
    themeAware: true,
    dropdown: [
      { label: "All Poets", to: "/poets", icon: FaUser },
      { label: "Featured", to: "/poets/featured", icon: FaAward },
      { label: "New Poets", to: "/poets/new", icon: FaPenFancy },
      { label: "Interviews", to: "/poets/interviews", icon: FaQuestionCircle },
    ],
  },

  // Contributors Section
  {
    label: "Contributors",
    to: "/contributors",
    icon: FaFeatherAlt,
    themeAware: true,
    dropdown: [
      { label: "All Contributors", to: "/contributors", icon: FaFeatherAlt },
      { label: "Translators", to: "/translators", icon: FaBook },
      { label: "Scholars", to: "/scholars", icon: FaAward },
      { label: "Editors", to: "/editors", icon: FaPenFancy },
      { label: "Commentators", to: "/commentators", icon: FaHeart },
    ],
  },

  {
    label: "About",
    to: "/about",
    icon: FaInfoCircle,
    themeAware: true,
  },

  {
    label: "Test Page",
    to: "/testpage",
    icon: FaInfoCircle,
    themeAware: true,
  },
];

// Helper function to get theme-based icon color
export const getThemeIconColor = (themeName) => {
  const themeColors = {
    light: "text-amber-600",
    dark: "text-amber-400",
    forest: "text-green-600",
    lavender: "text-purple-600",
    rose: "text-pink-600",
    sepia: "text-amber-700",
  };
  return themeColors[themeName] || "text-amber-600";
};

// Helper function to get theme-based gradient
export const getThemeGradient = (themeName) => {
  const gradients = {
    light: "from-amber-500 to-yellow-500",
    dark: "from-amber-500 to-yellow-500",
    forest: "from-green-500 to-emerald-500",
    lavender: "from-purple-500 to-pink-500",
    rose: "from-pink-500 to-rose-500",
    sepia: "from-amber-600 to-yellow-700",
  };
  return gradients[themeName] || "from-amber-500 to-yellow-500";
};

// Helper function to get theme-based hover effects
export const getThemeHoverClass = (themeName) => {
  const hoverClasses = {
    light: "hover:bg-amber-100 hover:text-amber-700",
    dark: "hover:bg-gray-800 hover:text-amber-400",
    forest: "hover:bg-green-100 hover:text-green-700",
    lavender: "hover:bg-purple-100 hover:text-purple-700",
    rose: "hover:bg-pink-100 hover:text-pink-700",
    sepia: "hover:bg-amber-200 hover:text-amber-800",
  };
  return hoverClasses[themeName] || "hover:bg-amber-100 hover:text-amber-700";
};

// Helper function to get theme-based border color
export const getThemeBorderColor = (themeName) => {
  const borderColors = {
    light: "border-amber-200 dark:border-amber-800",
    dark: "border-gray-700 dark:border-gray-600",
    forest: "border-green-200 dark:border-green-800",
    lavender: "border-purple-200 dark:border-purple-800",
    rose: "border-pink-200 dark:border-pink-800",
    sepia: "border-amber-300 dark:border-amber-700",
  };
  return borderColors[themeName] || "border-amber-200 dark:border-amber-800";
};

// Helper function to get theme-based accent background
export const getThemeAccentBg = (themeName) => {
  const accentBgs = {
    light: "bg-amber-100 dark:bg-amber-900/30",
    dark: "bg-gray-800 dark:bg-gray-700",
    forest: "bg-green-100 dark:bg-green-900/30",
    lavender: "bg-purple-100 dark:bg-purple-900/30",
    rose: "bg-pink-100 dark:bg-pink-900/30",
    sepia: "bg-amber-200 dark:bg-amber-900/30",
  };
  return accentBgs[themeName] || "bg-amber-100 dark:bg-amber-900/30";
};

// Helper function to get theme-based hover background
export const getThemeHoverBg = (themeName) => {
  const hoverBgs = {
    light: "hover:bg-amber-50 dark:hover:bg-amber-900/20",
    dark: "hover:bg-gray-700 dark:hover:bg-gray-600",
    forest: "hover:bg-green-50 dark:hover:bg-green-900/20",
    lavender: "hover:bg-purple-50 dark:hover:bg-purple-900/20",
    rose: "hover:bg-pink-50 dark:hover:bg-pink-900/20",
    sepia: "hover:bg-amber-100 dark:hover:bg-amber-900/20",
  };
  return hoverBgs[themeName] || "hover:bg-amber-50 dark:hover:bg-amber-900/20";
};

// Helper function to get theme-based text color
export const getThemeTextColor = (themeName) => {
  const textColors = {
    light: "text-gray-900",
    dark: "text-gray-100",
    forest: "text-gray-900",
    lavender: "text-gray-900",
    rose: "text-gray-900",
    sepia: "text-amber-900",
  };
  return textColors[themeName] || "text-gray-900";
};

// Helper function to get theme-based secondary text color
export const getThemeSecondaryText = (themeName) => {
  const secondaryText = {
    light: "text-gray-700",
    dark: "text-gray-300",
    forest: "text-gray-700",
    lavender: "text-gray-700",
    rose: "text-gray-700",
    sepia: "text-amber-800",
  };
  return secondaryText[themeName] || "text-gray-700";
};

export default navItems;