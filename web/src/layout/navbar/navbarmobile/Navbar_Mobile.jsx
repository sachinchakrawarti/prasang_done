// src/layout/navbar/navbarmobile/Navbar_Mobile.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBars,
  FaTimes,
  FaFeather,
  FaHome,
  FaBook,
  FaUser,
  FaInfoCircle,
  FaPenFancy,
  FaHeart,
  FaFeatherAlt,
  FaChevronDown,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaCog,
  FaSearch,
  FaSun,
  FaMoon,
  FaTree,
  FaSeedling,
  FaScroll,
  FaGlobe,
  FaCheck,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useLoalization";
import {
  navItems,
  getLocalizedPath,
  getThemeActiveLink,
  themeIcons,
} from "../NavbarData";

const NavbarMobile = ({ isOpen, onClose, onOpen }) => {
  const pathname = usePathname();
  const { themeName, setTheme } = useTheme();
  const { language, changeLanguage, availableLanguages } = useLanguage();
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get current language from pathname
  const getCurrentLang = () => {
    const pathSegments = pathname?.split("/") || [];
    const lang = pathSegments[1];
    return ["en", "hi", "ur"].includes(lang) ? lang : "en";
  };

  const currentLang = getCurrentLang();

  // Check if a path is active
  const isActive = (path) => {
    if (!pathname) return false;
    if (path === "/") {
      return pathname === `/${currentLang}` || pathname === "/";
    }
    const localizedPath = `/${currentLang}${path}`;
    return pathname?.startsWith(localizedPath) || pathname?.startsWith(path);
  };

  // Get localized href
  const getLocalizedHref = (path) => {
    if (path === "/") return `/${currentLang}`;
    return `/${currentLang}${path}`;
  };

  // Toggle dropdown
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    onClose();
    setOpenDropdown(null);
    setShowThemeMenu(false);
    setShowLanguageMenu(false);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${currentLang}/search?q=${encodeURIComponent(searchQuery.trim())}`;
      onClose();
    }
  };

  // Theme options
  const themes = [
    {
      id: "light",
      name: t("defaultTheme") || "Light",
      icon: FaSun,
      color: "text-amber-500",
    },
    {
      id: "dark",
      name: t("darkTheme") || "Dark",
      icon: FaMoon,
      color: "text-indigo-400",
    },
    {
      id: "forest",
      name: t("forestTheme") || "Forest",
      icon: FaTree,
      color: "text-green-500",
    },
    {
      id: "lavender",
      name: t("lavenderTheme") || "Lavender",
      icon: FaSeedling,
      color: "text-purple-500",
    },
    {
      id: "rose",
      name: t("roseTheme") || "Rose",
      icon: FaHeart,
      color: "text-pink-500",
    },
    {
      id: "sepia",
      name: t("sepiaTheme") || "Sepia",
      icon: FaScroll,
      color: "text-amber-700",
    },
  ];

  // Theme-aware styles
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

  const getGradient = () => {
    switch (themeName) {
      case "forest":
        return "from-green-600 to-emerald-500";
      case "lavender":
        return "from-purple-600 to-pink-500";
      case "rose":
        return "from-rose-600 to-pink-500";
      case "sepia":
        return "from-amber-700 to-yellow-600";
      default:
        return "from-amber-600 to-yellow-500";
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

  const textColor = getTextColor();
  const gradient = getGradient();
  const borderColor = getBorderColor();
  const hoverBg = getHoverBg();
  const activeLinkClass = getThemeActiveLink(themeName);

  // Get current theme icon
  const currentTheme = themes.find((t) => t.id === themeName) || themes[0];
  const ThemeIcon = currentTheme.icon;

  if (!isMounted) {
    return (
      <div className="lg:hidden">
        <div className="flex justify-between items-center px-4 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center px-4 h-16">
          {/* Logo */}
          <Link
            href={getLocalizedHref("/")}
            className="flex items-center gap-2"
            onClick={handleLinkClick}
          >
            <FaFeather className={`text-2xl ${textColor}`} />
            <span className="font-bold text-xl bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent">
              Prasang
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => {
                const searchInput = document.getElementById(
                  "mobile-search-input",
                );
                if (searchInput) {
                  searchInput.focus();
                }
              }}
              className={`p-2 rounded-lg ${hoverBg} transition-colors`}
              aria-label="Search"
            >
              <FaSearch className={textColor} size={18} />
            </button>

            {/* Menu Button */}
            <button
              onClick={onOpen}
              className={`p-2 rounded-lg ${hoverBg} transition-colors`}
              aria-label="Open menu"
            >
              <FaBars size={24} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="px-4 pb-3">
          <div className="relative">
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              id="mobile-search-input"
              type="text"
              placeholder={t("search") || "Search poems, poets..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${borderColor} bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm`}
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <span className={`font-bold text-lg ${textColor}`}>
                {t("menu") || "Menu"}
              </span>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg ${hoverBg} transition-colors`}
                aria-label="Close menu"
              >
                <FaTimes
                  size={24}
                  className="text-gray-700 dark:text-gray-300"
                />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="p-4 space-y-1">
              {navItems.map((item, index) => {
                const localizedPath = getLocalizedHref(item.path);
                const isItemActive = isActive(item.path);

                return (
                  <div key={index} className="space-y-1">
                    {item.dropdown ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(index)}
                          className={`flex items-center justify-between w-full px-3 py-3 rounded-lg text-left transition-colors ${
                            isItemActive
                              ? `${hoverBg} ${activeLinkClass} font-medium`
                              : `text-gray-700 dark:text-gray-300 ${hoverBg}`
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <item.icon
                              size={18}
                              className={isItemActive ? textColor : ""}
                            />
                            {t(item.labelKey)}
                          </span>
                          <FaChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              openDropdown === index ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {openDropdown === index && (
                          <div className="ml-6 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                            {item.dropdown.map((subItem) => {
                              const subLocalizedPath = getLocalizedHref(
                                subItem.path,
                              );
                              const isSubActive = isActive(subItem.path);
                              return (
                                <Link
                                  key={subItem.path}
                                  href={subLocalizedPath}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                    isSubActive
                                      ? `${hoverBg} ${activeLinkClass} font-medium`
                                      : `text-gray-600 dark:text-gray-400 ${hoverBg}`
                                  }`}
                                  onClick={handleLinkClick}
                                >
                                  {subItem.icon && <subItem.icon size={14} />}
                                  {t(subItem.labelKey)}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={localizedPath}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                          isItemActive
                            ? `${hoverBg} ${activeLinkClass} font-medium`
                            : `text-gray-700 dark:text-gray-300 ${hoverBg}`
                        }`}
                        onClick={handleLinkClick}
                      >
                        <item.icon
                          size={18}
                          className={isItemActive ? textColor : ""}
                        />
                        {t(item.labelKey)}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            {/* Theme and Language Switchers */}
            <div className="p-4 space-y-3">
              {/* Theme Switcher */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t("theme") || "Theme"}
                </span>
                <div className="relative">
                  <button
                    onClick={() => setShowThemeMenu(!showThemeMenu)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${hoverBg} ${textColor} text-sm transition-colors`}
                  >
                    <ThemeIcon size={16} />
                    <span>{currentTheme.name}</span>
                    <FaChevronDown
                      size={10}
                      className={`transition-transform ${showThemeMenu ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showThemeMenu && (
                    <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                      {themes.map((theme) => {
                        const Icon = theme.icon;
                        const isActiveTheme = themeName === theme.id;
                        return (
                          <button
                            key={theme.id}
                            onClick={() => {
                              setTheme(theme.id);
                              setShowThemeMenu(false);
                            }}
                            className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${
                              isActiveTheme
                                ? `${hoverBg} ${textColor} font-medium`
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                          >
                            <Icon className={theme.color} size={14} />
                            <span>{theme.name}</span>
                            {isActiveTheme && (
                              <FaCheck className="ml-auto" size={12} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t("language") || "Language"}
                </span>
                <div className="relative">
                  <button
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${hoverBg} ${textColor} text-sm transition-colors`}
                  >
                    <FaGlobe size={16} />
                    <span>
                      {availableLanguages.find((l) => l.code === language)
                        ?.nativeName || "English"}
                    </span>
                    <FaChevronDown
                      size={10}
                      className={`transition-transform ${showLanguageMenu ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showLanguageMenu && (
                    <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                      {availableLanguages.map((lang) => {
                        const isActiveLang = language === lang.code;
                        return (
                          <button
                            key={lang.code}
                            onClick={() => {
                              changeLanguage(lang.code);
                              setShowLanguageMenu(false);
                            }}
                            className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${
                              isActiveLang
                                ? `${hoverBg} ${textColor} font-medium`
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.nativeName}</span>
                            {isActiveLang && (
                              <FaCheck className="ml-auto" size={12} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            {/* Auth Section */}
            <div className="p-4 space-y-2">
              <Link
                href={getLocalizedHref("/login")}
                className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 ${borderColor} ${textColor} rounded-lg font-medium ${hoverBg} transition-all`}
                onClick={handleLinkClick}
              >
                <FaSignInAlt size={16} />
                {t("login") || "Login"}
              </Link>
              <Link
                href={getLocalizedHref("/signup")}
                className={`flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r ${gradient} text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all`}
                onClick={handleLinkClick}
              >
                <FaUserPlus size={16} />
                {t("signUp") || "Sign Up"}
              </Link>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {t("footerNote") || "Made with ❤️ for poetry lovers"}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NavbarMobile;
