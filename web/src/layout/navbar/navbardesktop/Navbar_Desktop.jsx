// src/layout/navbar/navbardesktop/NavbarDesktop.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome, // Home icon
  FaBook, // Poems/Books
  FaUser, // User/Poets
  FaInfoCircle, // About/Info
  FaPenFancy, // Writing
  FaHeart, // Favorites/Likes
  FaFeatherAlt, // Contributors
  FaFeather, // Logo/Main icon
  FaHistory, // Classics/History
  FaAward, // Featured/Awards
  FaBlog, // Blog/Articles
  FaQuestionCircle, // Interviews/Questions
  FaPenNib, // Prose/Writing
  FaSearch, // Search
  FaRobot, // AI Assistant
  FaCog, // Settings
  FaBell, // Notifications
  FaSignInAlt, // Login
  FaUserPlus, // Sign Up
  FaSignOutAlt, // Logout
  FaChevronDown, // Dropdown arrow
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import ThemeSwitcher from "../components/ThemeSwitcher"; // ✅ Import ThemeSwitcher
import LanguageSwitcher from "../components/LanguageSwitcher"; // ✅ Import LanguageSwitcher

const NavbarDesktop = () => {
  const pathname = usePathname();
  const { theme, themeName } = useTheme();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Navigation items (will use translations later)
  const navItems = [
    { label: "Home", to: "/", icon: FaHome },
    {
      label: "Poems",
      to: "/poems",
      icon: FaBook,
      dropdown: [
        { label: "All Poems", to: "/poems" },
        { label: "Popular", to: "/poems/popular" },
        { label: "New", to: "/poems/new" },
        { label: "Classics", to: "/poems/classics" },
      ],
    },
    { label: "Prose", to: "/prose", icon: FaPenNib },
    { label: "Poets", to: "/poets", icon: FaUser },
    { label: "Contributors", to: "/contributors", icon: FaFeatherAlt },
    { label: "About", to: "/about", icon: FaInfoCircle },
  ];

  const isActive = (path) => {
    if (path === "/") return pathname === path;
    return pathname?.startsWith(path);
  };

  const handleDropdownEnter = (index) => setOpenDropdown(index);
  const handleDropdownLeave = () => setOpenDropdown(null);

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

  const accentBg = getAccentBg();
  const hoverBg = getHoverBg();
  const textColor = getTextColor();

  return (
    <nav className="hidden lg:block">
      {/* Main Navbar */}
      <div className="bg-white dark:bg-gray-900 shadow-lg">
        {/* Top Row: Logo, Search, Icons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <FaFeather
                className={`text-2xl ${textColor} group-hover:scale-110 transition-transform`}
              />
              <span className="font-bold text-xl bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent">
                Prasang
              </span>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search poems, poets..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Right Icons - ✅ Added ThemeSwitcher and LanguageSwitcher */}
            <div className="flex items-center gap-2">
              {/* AI Assistant */}
              <Link
                href="/ai-assistant"
                className={`p-2 ${textColor} ${hoverBg} rounded-full transition-all relative group`}
              >
                <FaRobot size={18} />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  AI Assistant
                </span>
              </Link>

              {/* ✅ Theme Switcher */}
              <ThemeSwitcher />

              {/* ✅ Language Switcher */}
              <LanguageSwitcher />

              {/* Auth Buttons */}
              <Link
                href="/login"
                className="border-2 border-amber-500 text-amber-600 px-4 py-1.5 rounded-full text-sm font-medium hover:shadow-md transition-all flex items-center gap-1"
              >
                <FaSignInAlt size={14} />
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-1"
              >
                <FaUserPlus size={14} />
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Row: Navigation */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center justify-center space-x-1">
              {navItems.map((item, index) => (
                <li
                  key={item.to}
                  className="relative flex items-stretch"
                  onMouseEnter={() =>
                    item.dropdown && handleDropdownEnter(index)
                  }
                  onMouseLeave={handleDropdownLeave}
                >
                  {item.dropdown ? (
                    <>
                      <Link
                        href={item.to}
                        className={`flex items-center gap-2 px-4 py-3 rounded-l-lg transition-all duration-200 ${
                          isActive(item.to)
                            ? `${accentBg} ${textColor} font-medium`
                            : `text-gray-600 dark:text-gray-300 ${hoverBg}`
                        }`}
                      >
                        <item.icon size={16} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === index ? null : index)
                        }
                        className={`px-2 py-3 rounded-r-lg transition-all duration-200 ${
                          openDropdown === index
                            ? `${accentBg} ${textColor}`
                            : `text-gray-600 dark:text-gray-300 ${hoverBg}`
                        }`}
                      >
                        <FaChevronDown
                          size={12}
                          className={`transition-transform duration-200 ${openDropdown === index ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openDropdown === index && (
                        <div className="absolute left-0 top-full mt-0 w-56 bg-white dark:bg-gray-800 rounded-b-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.to}
                              href={subItem.to}
                              className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                                isActive(subItem.to)
                                  ? `${accentBg} ${textColor} font-medium`
                                  : `text-gray-600 dark:text-gray-300 ${hoverBg}`
                              }`}
                              onClick={() => setOpenDropdown(null)}
                            >
                              <span>{subItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.to}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive(item.to)
                          ? `${accentBg} ${textColor} font-medium`
                          : `text-gray-600 dark:text-gray-300 ${hoverBg}`
                      }`}
                    >
                      <item.icon size={16} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarDesktop;
