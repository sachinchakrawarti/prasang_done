// src/layout/navbar/navbardesktop/NavbarDesktop.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaHome,
  FaBook,
  FaUser,
  FaInfoCircle,
  FaPenFancy,
  FaHeart,
  FaFeatherAlt,
  FaFeather,
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
  FaTimes,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useLoalization";
import ThemeSwitcher from "../components/ThemeSwitcher";
import LanguageSwitcher from "../components/LanguageSwitcher";

// Import nav items and helper functions
import { navItems, getThemeActiveLink } from "../NavbarData";

const NavbarDesktop = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, themeName } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef(null);

  // Get the current language from pathname
  const getCurrentLang = () => {
    const pathSegments = pathname?.split("/") || [];
    const lang = pathSegments[1];
    return ["en", "hi", "ur"].includes(lang) ? lang : "en";
  };

  const currentLang = getCurrentLang();

  // Handle escape key to close dropdowns
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setShowUserMenu(false);
        setShowSearch(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Check if a path is active
  const isActive = (path) => {
    if (!pathname) return false;
    if (path === "/") {
      return pathname === `/${currentLang}` || pathname === "/";
    }
    const localizedPath = `/${currentLang}${path}`;
    return pathname?.startsWith(localizedPath) || pathname?.startsWith(path);
  };

  const handleDropdownEnter = (index) => setOpenDropdown(index);
  const handleDropdownLeave = () => setOpenDropdown(null);
  const handleUserMenuToggle = () => setShowUserMenu(!showUserMenu);
  const handleUserMenuClose = () => setShowUserMenu(false);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/${currentLang}/search?q=${encodeURIComponent(searchQuery.trim())}`,
      );
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  // Theme-aware styles
  const getAccentBg = () => {
    switch (themeName) {
      case "forest":
        return "bg-green-100 dark:bg-green-900/30";
      case "lavender":
        return "bg-purple-100 dark:bg-purple-900/30";
      case "rose":
        return "bg-rose-100 dark:bg-rose-900/30";
      case "sepia":
        return "bg-amber-200 dark:bg-amber-900/30";
      default:
        return "bg-amber-100 dark:bg-amber-900/30";
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
        return "hover:bg-amber-100 dark:hover:bg-amber-900/20";
      default:
        return "hover:bg-amber-50 dark:hover:bg-amber-900/20";
    }
  };

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

  const accentBg = getAccentBg();
  const hoverBg = getHoverBg();
  const textColor = getTextColor();
  const borderColor = getBorderColor();
  const activeLinkClass = getThemeActiveLink(themeName);

  // Get localized path for a nav item
  const getLocalizedHref = (path) => {
    if (path === "/") return `/${currentLang}`;
    return `/${currentLang}${path}`;
  };

  return (
    <nav
      className="hidden lg:block"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Main Navbar */}
      <div className="bg-white dark:bg-gray-900 shadow-lg">
        {/* Top Row: Logo, Search, Icons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href={`/${currentLang}`}
              className="flex items-center gap-2 group"
              aria-label="Home"
            >
              <FaFeather
                className={`text-2xl ${textColor} group-hover:scale-110 transition-transform`}
              />
              <span className="font-bold text-xl bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent">
                Prasang
              </span>
            </Link>

            {/* Search - Desktop */}
            <div className="flex-1 max-w-md mx-4">
              {showSearch ? (
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={t("search") || "Search poems, poets..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2 rounded-full border ${borderColor} bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
                    aria-label="Search"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowSearch(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label="Close search"
                  >
                    <FaTimes size={16} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-full border ${borderColor} bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all`}
                  aria-label="Open search"
                >
                  <FaSearch size={16} />
                  <span className="text-sm">
                    {t("search") || "Search poems, poets..."}
                  </span>
                </button>
              )}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              {/* AI Assistant */}
              <Link
                href={`/${currentLang}/ai-assistant`}
                className={`p-2 ${textColor} ${hoverBg} rounded-full transition-all relative group`}
                aria-label="AI Assistant"
              >
                <FaRobot size={18} />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {t("aiAssistant") || "AI Assistant"}
                </span>
              </Link>

              {/* Theme Switcher */}
              <ThemeSwitcher />

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Auth Buttons */}
              <Link
                href={`/${currentLang}/login`}
                className="border-2 border-amber-500 text-amber-600 px-4 py-1.5 rounded-full text-sm font-medium hover:shadow-md transition-all flex items-center gap-1 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                <FaSignInAlt size={14} />
                {t("login") || "Login"}
              </Link>
              <Link
                href={`/${currentLang}/signup`}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-1 hover:scale-105"
              >
                <FaUserPlus size={14} />
                {t("signUp") || "Sign Up"}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Row: Navigation */}
        <div className={`border-t ${borderColor}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center justify-center space-x-1">
              {navItems.map((item, index) => {
                const localizedPath = getLocalizedHref(item.path);
                const isItemActive = isActive(item.path);

                return (
                  <li
                    key={item.path}
                    className="relative flex items-stretch"
                    onMouseEnter={() =>
                      item.dropdown && handleDropdownEnter(index)
                    }
                    onMouseLeave={handleDropdownLeave}
                  >
                    {item.dropdown ? (
                      <>
                        <Link
                          href={localizedPath}
                          className={`flex items-center gap-2 px-4 py-3 rounded-l-lg transition-all duration-200 ${
                            isItemActive
                              ? `${accentBg} ${activeLinkClass} font-medium`
                              : `text-gray-600 dark:text-gray-300 ${hoverBg}`
                          }`}
                        >
                          <item.icon size={16} />
                          <span className="font-medium">
                            {t(item.labelKey)}
                          </span>
                        </Link>
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === index ? null : index,
                            )
                          }
                          className={`px-2 py-3 rounded-r-lg transition-all duration-200 ${
                            openDropdown === index
                              ? `${accentBg} ${activeLinkClass}`
                              : `text-gray-600 dark:text-gray-300 ${hoverBg}`
                          }`}
                          aria-label="Toggle dropdown"
                        >
                          <FaChevronDown
                            size={12}
                            className={`transition-transform duration-200 ${openDropdown === index ? "rotate-180" : ""}`}
                          />
                        </button>
                        {openDropdown === index && (
                          <div
                            className={`absolute left-0 top-full mt-0 w-56 bg-white dark:bg-gray-800 rounded-b-2xl shadow-xl border ${borderColor} py-2 z-50`}
                          >
                            {item.dropdown.map((subItem) => {
                              const subLocalizedPath = getLocalizedHref(
                                subItem.path,
                              );
                              const isSubActive = isActive(subItem.path);
                              return (
                                <Link
                                  key={subItem.path}
                                  href={subLocalizedPath}
                                  className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                                    isSubActive
                                      ? `${accentBg} ${activeLinkClass} font-medium`
                                      : `text-gray-600 dark:text-gray-300 ${hoverBg}`
                                  }`}
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  {subItem.icon && <subItem.icon size={14} />}
                                  <span>{t(subItem.labelKey)}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={localizedPath}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isItemActive
                            ? `${accentBg} ${activeLinkClass} font-medium`
                            : `text-gray-600 dark:text-gray-300 ${hoverBg}`
                        }`}
                      >
                        <item.icon size={16} />
                        <span className="font-medium">{t(item.labelKey)}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarDesktop;
