// src/public_app/layout/navbar/navbarmobile/Navbar_Mobile.jsx
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FaUserCircle,
  FaSearch,
  FaFeather,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaBell,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useTheme } from "../../../../theme";
import { useLanguage } from "../../../../context/LanguageContext";
import { useAuth } from "../../../../context/AuthContext";
import { translateMobile } from "../../../../locales/mobileNavbarTranslations";
import DrawerSlider from "./DrawerSlider";
import LanguageSwitcherMobile from "./components/LanguageSwitcherMobile";
import ControlMobile from "./components/controlmobile/ControlMobile";
import { mobileNavItemsConfig } from "./components/NavbarMobileData";

const NavbarMobile = ({ isOpen, onClose, onOpen }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();

  // Translation helper
  const t = (text) => translateMobile(text, language);

  // Translate navigation items
  const translatedNavItems = mobileNavItemsConfig.map((item) => ({
    ...item,
    label: t(item.labelKey),
  }));

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-40 ${theme.background.navbar} ${theme.shadow.sm}`}
      >
        <div className="h-16 px-3 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpen}
              className={`p-2 ${theme.text.accent} ${theme.background.cardHover} rounded-full transition`}
            >
              <FaBars size={22} />
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <FaFeather
                className={`text-xl ${theme.icon.primary} group-hover:scale-110 transition-transform`}
              />
              <span className={`font-bold text-lg ${theme.text.primary}`}>
                Prasang
              </span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1">
            <Link
              to="/search"
              className={`p-2 ${theme.text.accent} ${theme.background.cardHover} rounded-full transition`}
              aria-label={t("search")}
            >
              <FaSearch size={16} />
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcherMobile />

            {/* Control Component */}
            <ControlMobile />

            {/* Show notification bell only when logged in */}
            {isAuthenticated && (
              <Link
                to="/notifications"
                className={`p-2 ${theme.text.accent} ${theme.background.cardHover} rounded-full transition relative`}
                aria-label={t("notifications")}
              >
                <FaBell size={16} />
                {/* Notification badge */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
            )}

            {/* Login Button or User Icon */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className={`${theme.button.primary} px-4 py-1.5 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all whitespace-nowrap`}
              >
                {t("login")}
              </Link>
            ) : (
              <Link
                to="/profile"
                className={`p-2 ${theme.text.accent} ${theme.background.cardHover} rounded-full transition`}
                aria-label={t("profile")}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <FaUser size={16} />
                )}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="lg:hidden h-16"></div>

      {/* Drawer */}
      <DrawerSlider isOpen={isOpen} onClose={onClose} title={t("menu")}>
        {/* User Info - Show when logged in */}
        {isAuthenticated && user && (
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700 rounded-xl">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-500"
              />
              <div className="flex-1">
                <h4 className={`font-semibold ${theme.text.primary}`}>
                  {user.name}
                </h4>
                <p className={`text-xs ${theme.text.secondary}`}>
                  @{user.username}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div>
                <p className={`font-bold ${theme.text.primary}`}>
                  {user.stats?.poems || 0}
                </p>
                <p className={`text-xs ${theme.text.tertiary}`}>Poems</p>
              </div>
              <div>
                <p className={`font-bold ${theme.text.primary}`}>
                  {user.stats?.followers || 0}
                </p>
                <p className={`text-xs ${theme.text.tertiary}`}>Followers</p>
              </div>
              <div>
                <p className={`font-bold ${theme.text.primary}`}>
                  {user.stats?.following || 0}
                </p>
                <p className={`text-xs ${theme.text.tertiary}`}>Following</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation - Mobile flat list */}
        <div className="space-y-2">
          {translatedNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition ${
                  isActive
                    ? `${theme.background.accent} ${theme.text.accent} font-medium`
                    : `${theme.text.secondary} ${theme.background.cardHover}`
                }`
              }
            >
              <item.icon size={16} className={theme.icon.primary} />
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Account Section */}
        <div className={`mt-6 pt-4 border-t ${theme.border.accent}`}>
          <div
            className={`text-xs font-semibold ${theme.text.tertiary} uppercase mb-2`}
          >
            {t("account")}
          </div>

          <Link
            to="/profile"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2 ${theme.text.primary} ${theme.background.cardHover} rounded-xl text-sm transition`}
          >
            <FaUserCircle size={16} className={theme.icon.primary} />
            {t("profile")}
          </Link>
        </div>

        {/* Footer Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          {!isAuthenticated ? (
            <div className="flex gap-3">
              <Link
                to="/login"
                onClick={onClose}
                className={`flex-1 flex items-center justify-center gap-2 border-2 ${theme.button.secondary} px-4 py-3 rounded-xl text-sm font-medium transition`}
              >
                <FaSignInAlt size={14} />
                {t("login")}
              </Link>

              <Link
                to="/signup"
                onClick={onClose}
                className={`flex-1 flex items-center justify-center gap-2 ${theme.button.primary} px-4 py-3 rounded-xl text-sm font-medium transition`}
              >
                <FaUserPlus size={14} />
                {t("signUp")}
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center gap-2 ${theme.button.secondary} px-4 py-3 rounded-xl text-sm font-medium transition`}
            >
              <FaSignOutAlt size={14} />
              Logout
            </button>
          )}
        </div>
      </DrawerSlider>
    </>
  );
};

export default NavbarMobile;
