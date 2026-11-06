// src/layout/navbar/NavbarData.js

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
  FaSearch,
  FaRobot,
  FaCog,
  FaBell,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaChevronDown,
  FaMoon,
  FaSun,
  FaTree,
  FaSeedling,
  FaScroll,
  FaTheaterMasks,   // ─── ADDED ───
  FaBookOpen,       // ─── ADDED ───
  FaFeather,        // ─── ADDED ───
  FaMusic,          // ─── ADDED ───
  FaLandmark,       // ─── ADDED ───
  FaLeaf,           // ─── ADDED ───
  FaPrayingHands,   // ─── ADDED ───
  FaStar,           // ─── ADDED ───
} from "react-icons/fa";

// Navigation items with translation keys
export const navItems = [
  {
    labelKey: "home",
    path: "/",
    icon: FaHome,
    themeAware: true,
  },
  {
    labelKey: "poems",
    path: "/poems",
    icon: FaBook,
    themeAware: true,
    dropdown: [
      { labelKey: "allPoems", path: "/poems", icon: FaBook },
      { labelKey: "popular", path: "/poems/popular", icon: FaHeart },
      { labelKey: "new", path: "/poems/new", icon: FaPenFancy },
      { labelKey: "classics", path: "/poems/classics", icon: FaHistory },
      { labelKey: "categories", path: "/poems/categories", icon: FaBook },
      { labelKey: "poemTypes", path: "/poemstypes", icon: FaPenNib },
    ],
  },

  // ─── ADDED: Literary Genres ─────────────────────────────
  {
    labelKey: "genres",
    path: "/genres",
    icon: FaTheaterMasks,
    themeAware: true,
    dropdown: [
      { labelKey: "allGenres",   path: "/genres",              icon: FaBookOpen },
      { labelKey: "epic",        path: "/genres/epic",         icon: FaScroll },
      { labelKey: "lyric",       path: "/genres/lyric",        icon: FaMusic },
      { labelKey: "sonnet",      path: "/genres/sonnet",       icon: FaPenNib },
      { labelKey: "ghazal",      path: "/genres/ghazal",       icon: FaHeart },
      { labelKey: "haiku",       path: "/genres/haiku",        icon: FaLeaf },
      { labelKey: "ode",         path: "/genres/ode",          icon: FaAward },
      { labelKey: "elegy",       path: "/genres/elegy",        icon: FaPrayingHands },
      { labelKey: "ballad",      path: "/genres/ballad",       icon: FaFeather },
      { labelKey: "freeVerse",   path: "/genres/free-verse",   icon: FaPenNib },
      { labelKey: "blankVerse",  path: "/genres/blank-verse",  icon: FaPenFancy },
      { labelKey: "prosePoem",   path: "/genres/prose-poem",   icon: FaPenFancy },
      { labelKey: "folk",        path: "/genres/folk",         icon: FaFeatherAlt },
      { labelKey: "classical",   path: "/genres/classical",    icon: FaLandmark },
      { labelKey: "modern",      path: "/genres/modern",       icon: FaStar },
    ],
  },
  // ────────────────────────────────────────────────────────

  {
    labelKey: "prose",
    path: "/prose",
    icon: FaPenNib,
    themeAware: true,
    dropdown: [
      { labelKey: "allProse", path: "/prose", icon: FaPenNib },
      { labelKey: "shortStories", path: "/prose/stories", icon: FaBook },
      { labelKey: "essays", path: "/prose/essays", icon: FaPenFancy },
      { labelKey: "articles", path: "/prose/articles", icon: FaBlog },
      { labelKey: "memoirs", path: "/prose/memoirs", icon: FaHistory },
      { labelKey: "literaryCriticism", path: "/prose/criticism", icon: FaAward },
    ],
  },
  {
    labelKey: "poets",
    path: "/poets",
    icon: FaUser,
    themeAware: true,
    dropdown: [
      { labelKey: "allPoets", path: "/poets", icon: FaUser },
      { labelKey: "featured", path: "/poets/featured", icon: FaAward },
      { labelKey: "newPoets", path: "/poets/new", icon: FaPenFancy },
      { labelKey: "interviews", path: "/poets/interviews", icon: FaQuestionCircle },
    ],
  },
  {
    labelKey: "contributors",
    path: "/contributors",
    icon: FaFeatherAlt,
    themeAware: true,
    dropdown: [
      { labelKey: "allContributors", path: "/contributors", icon: FaFeatherAlt },
      { labelKey: "translators", path: "/translators", icon: FaBook },
      { labelKey: "scholars", path: "/scholars", icon: FaAward },
      { labelKey: "editors", path: "/editors", icon: FaPenFancy },
      { labelKey: "commentators", path: "/commentators", icon: FaHeart },
    ],
  },
  {
    labelKey: "about",
    path: "/about",
    icon: FaInfoCircle,
    themeAware: true,
  },
  {
    labelKey: "testPage",
    path: "/testpage",
    icon: FaInfoCircle,
    themeAware: true,
  },
];

// ─── ADDED: Genre metadata (used by /genres pages) ────────
// Each genre has a display name, description, and a native-script
// name for the languages that use it.

export const literaryGenres = [
  {
    slug: "epic",
    nameKey: "epic",
    descKey: "epicDesc",
    icon: FaScroll,
    examples: ["Iliad", "Mahabharata", "Shahnameh", "Ramayana"],
    languages: ["grc", "sa", "fa", "hi"],
  },
  {
    slug: "lyric",
    nameKey: "lyric",
    descKey: "lyricDesc",
    icon: FaMusic,
    examples: ["Sappho's Odes", "Meghaduta", "Divan-e-Hafez"],
    languages: ["grc", "sa", "fa"],
  },
  {
    slug: "sonnet",
    nameKey: "sonnet",
    descKey: "sonnetDesc",
    icon: FaPenNib,
    examples: ["Sonnet 18", "Astrophil and Stella"],
    languages: ["en", "it", "fr"],
  },
  {
    slug: "ghazal",
    nameKey: "ghazal",
    descKey: "ghazalDesc",
    icon: FaHeart,
    examples: ["Divan-e-Ghalib", "Rumi's Ghazals"],
    languages: ["ur", "fa", "hi", "tr"],
  },
  {
    slug: "haiku",
    nameKey: "haiku",
    descKey: "haikuDesc",
    icon: FaLeaf,
    examples: ["Bashō's Frog", "Issa's Sparrow"],
    languages: ["ja"],
  },
  {
    slug: "ode",
    nameKey: "ode",
    descKey: "odeDesc",
    icon: FaAward,
    examples: ["Ode to a Nightingale", "Ode to the West Wind"],
    languages: ["en", "grc"],
  },
  {
    slug: "elegy",
    nameKey: "elegy",
    descKey: "elegyDesc",
    icon: FaPrayingHands,
    examples: ["Lycidas", "In Memoriam", "Elegy Written in a Country Churchyard"],
    languages: ["en", "la"],
  },
  {
    slug: "ballad",
    nameKey: "ballad",
    descKey: "balladDesc",
    icon: FaFeather,
    examples: ["The Rime of the Ancient Mariner", "Barbara Allen"],
    languages: ["en", "gd", "es"],
  },
  {
    slug: "free-verse",
    nameKey: "freeVerse",
    descKey: "freeVerseDesc",
    icon: FaPenNib,
    examples: ["Song of Myself", "The Waste Land"],
    languages: ["en", "fr"],
  },
  {
    slug: "blank-verse",
    nameKey: "blankVerse",
    descKey: "blankVerseDesc",
    icon: FaPenFancy,
    examples: ["Paradise Lost", "Hamlet"],
    languages: ["en"],
  },
  {
    slug: "prose-poem",
    nameKey: "prosePoem",
    descKey: "prosePoemDesc",
    icon: FaPenFancy,
    examples: ["Le Spleen de Paris", "Tender Buttons"],
    languages: ["fr", "en"],
  },
  {
    slug: "folk",
    nameKey: "folk",
    descKey: "folkDesc",
    icon: FaFeatherAlt,
    examples: ["Kajri", "Chaiti", "Baul songs", "Alha"],
    languages: ["hi", "bn", "pa"],
  },
  {
    slug: "classical",
    nameKey: "classical",
    descKey: "classicalDesc",
    icon: FaLandmark,
    examples: ["Vedic hymns", "Sangam poetry", "Greek epics"],
    languages: ["sa", "ta", "grc"],
  },
  {
    slug: "modern",
    nameKey: "modern",
    descKey: "modernDesc",
    icon: FaStar,
    examples: ["The Waste Land", "Howl", "Nirala's poetry"],
    languages: ["en", "hi", "ur"],
  },
];

// ─── ADDED: Genre slug → path helper ──────────────────────
export const getGenrePath = (slug) => `/genres/${slug}`;

// ─── ADDED: Find a genre by slug ──────────────────────────
export const findGenre = (slug) => literaryGenres.find((g) => g.slug === slug);

// Theme icons
export const themeIcons = {
  light: { icon: FaSun, color: "text-amber-500" },
  dark: { icon: FaMoon, color: "text-indigo-400" },
  forest: { icon: FaTree, color: "text-green-500" },
  lavender: { icon: FaSeedling, color: "text-purple-500" },
  rose: { icon: FaHeart, color: "text-pink-500" },
  sepia: { icon: FaScroll, color: "text-amber-700" },
};

// Theme helper functions
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

export const getThemeActiveLink = (themeName) => {
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

// Helper function to get localized path
export const getLocalizedPath = (path, lang) => {
  if (path === "/") return `/${lang}`;
  return `/${lang}${path}`;
};

export default navItems;