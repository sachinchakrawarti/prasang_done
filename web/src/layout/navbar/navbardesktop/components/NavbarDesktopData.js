// src/components/layout/navbar/navbardesktop/components/NavbarDesktopData.js

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
  FaMoon,
  FaSun,
  FaTree,
  FaSeedling,
  FaScroll,
} from "react-icons/fa";

// Translation keys mapping for navbar items
export const NAVBAR_KEYS = {
  home: "home",
  poems: "poems",
  prose: "prose",
  poets: "poets",
  contributors: "contributors",
  about: "about",
  testPage: "testPage",
  allPoems: "allPoems",
  popular: "popular",
  new: "new",
  classics: "classics",
  categories: "categories",
  poemTypes: "poemTypes",
  allProse: "allProse",
  shortStories: "shortStories",
  essays: "essays",
  articles: "articles",
  memoirs: "memoirs",
  literaryCriticism: "literaryCriticism",
  allPoets: "allPoets",
  featured: "featured",
  newPoets: "newPoets",
  interviews: "interviews",
  allContributors: "allContributors",
  translators: "translators",
  scholars: "scholars",
  editors: "editors",
  commentators: "commentators",
};

// Desktop navigation items with translation keys
export const desktopNavItems = [
  {
    labelKey: NAVBAR_KEYS.home,
    to: "/",
    icon: FaHome,
  },
  {
    labelKey: NAVBAR_KEYS.poems,
    to: "/poems",
    icon: FaBook,
    dropdown: [
      { labelKey: NAVBAR_KEYS.allPoems, to: "/poems", icon: FaBook },
      { labelKey: NAVBAR_KEYS.popular, to: "/poems/popular", icon: FaHeart },
      { labelKey: NAVBAR_KEYS.new, to: "/poems/new", icon: FaPenFancy },
      { labelKey: NAVBAR_KEYS.classics, to: "/poems/classics", icon: FaHistory },
      { labelKey: NAVBAR_KEYS.categories, to: "/poems/categories", icon: FaBook },
      { labelKey: NAVBAR_KEYS.poemTypes, to: "/poemstypes", icon: FaPenNib },
    ],
  },
  {
    labelKey: NAVBAR_KEYS.prose,
    to: "/prose",
    icon: FaPenNib,
    dropdown: [
      { labelKey: NAVBAR_KEYS.allProse, to: "/prose", icon: FaPenNib },
      { labelKey: NAVBAR_KEYS.shortStories, to: "/prose/stories", icon: FaBook },
      { labelKey: NAVBAR_KEYS.essays, to: "/prose/essays", icon: FaPenFancy },
      { labelKey: NAVBAR_KEYS.articles, to: "/prose/articles", icon: FaBlog },
      { labelKey: NAVBAR_KEYS.memoirs, to: "/prose/memoirs", icon: FaHistory },
      { labelKey: NAVBAR_KEYS.literaryCriticism, to: "/prose/criticism", icon: FaAward },
    ],
  },
  {
    labelKey: NAVBAR_KEYS.poets,
    to: "/poets",
    icon: FaUser,
    dropdown: [
      { labelKey: NAVBAR_KEYS.allPoets, to: "/poets", icon: FaUser },
      { labelKey: NAVBAR_KEYS.featured, to: "/poets/featured", icon: FaAward },
      { labelKey: NAVBAR_KEYS.newPoets, to: "/poets/new", icon: FaPenFancy },
      { labelKey: NAVBAR_KEYS.interviews, to: "/poets/interviews", icon: FaQuestionCircle },
    ],
  },
  {
    labelKey: NAVBAR_KEYS.contributors,
    to: "/contributors",
    icon: FaFeatherAlt,
    dropdown: [
      { labelKey: NAVBAR_KEYS.allContributors, to: "/contributors", icon: FaFeatherAlt },
      { labelKey: NAVBAR_KEYS.translators, to: "/translators", icon: FaBook },
      { labelKey: NAVBAR_KEYS.scholars, to: "/scholars", icon: FaAward },
      { labelKey: NAVBAR_KEYS.editors, to: "/editors", icon: FaPenFancy },
      { labelKey: NAVBAR_KEYS.commentators, to: "/commentators", icon: FaHeart },
    ],
  },
  {
    labelKey: NAVBAR_KEYS.about,
    to: "/about",
    icon: FaInfoCircle,
  },
  {
    labelKey: NAVBAR_KEYS.testPage,
    to: "/testpage",
    icon: FaInfoCircle,
  },
];

// Theme icons configuration
export const desktopThemeIcons = {
  light: { icon: FaSun, color: "text-amber-500" },
  dark: { icon: FaMoon, color: "text-indigo-400" },
  forest: { icon: FaTree, color: "text-green-500" },
  lavender: { icon: FaSeedling, color: "text-purple-500" },
  rose: { icon: FaHeart, color: "text-pink-500" },
  sepia: { icon: FaScroll, color: "text-amber-700" },
};

// Helper function to get theme-based icon color
export const getDesktopThemeIconColor = (themeName) => {
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
export const getDesktopThemeGradient = (themeName) => {
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
export const getDesktopThemeHoverClass = (themeName) => {
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
export const getDesktopThemeBorderColor = (themeName) => {
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
export const getDesktopThemeAccentBg = (themeName) => {
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
export const getDesktopThemeHoverBg = (themeName) => {
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
export const getDesktopThemeTextColor = (themeName) => {
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
export const getDesktopThemeSecondaryText = (themeName) => {
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

// Helper function to get theme-based dropdown background
export const getDesktopThemeDropdownBg = (themeName) => {
  const dropdownBgs = {
    light: "bg-white dark:bg-gray-800",
    dark: "bg-gray-900 dark:bg-gray-800",
    forest: "bg-white dark:bg-gray-800",
    lavender: "bg-white dark:bg-gray-800",
    rose: "bg-white dark:bg-gray-800",
    sepia: "bg-amber-50 dark:bg-gray-800",
  };
  return dropdownBgs[themeName] || "bg-white dark:bg-gray-800";
};

// Helper function to get theme-based active link color
export const getDesktopThemeActiveLink = (themeName) => {
  const activeColors = {
    light: "text-amber-600 border-amber-500",
    dark: "text-amber-400 border-amber-400",
    forest: "text-green-600 border-green-500",
    lavender: "text-purple-600 border-purple-500",
    rose: "text-pink-600 border-pink-500",
    sepia: "text-amber-700 border-amber-600",
  };
  return activeColors[themeName] || "text-amber-600 border-amber-500";
};

// Helper function to get theme-based dropdown item hover
export const getDesktopThemeDropdownHover = (themeName) => {
  const hoverColors = {
    light: "hover:bg-amber-50 hover:text-amber-700",
    dark: "hover:bg-gray-700 hover:text-amber-400",
    forest: "hover:bg-green-50 hover:text-green-700",
    lavender: "hover:bg-purple-50 hover:text-purple-700",
    rose: "hover:bg-pink-50 hover:text-pink-700",
    sepia: "hover:bg-amber-100 hover:text-amber-800",
  };
  return hoverColors[themeName] || "hover:bg-amber-50 hover:text-amber-700";
};

// Default export
export default desktopNavItems;