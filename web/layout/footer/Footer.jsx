// src/layout/footer/Footer.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHeart,
  FaFeather,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBookOpen,
  FaUserFriends,
  FaInfoCircle,
  FaPenFancy,
  FaGlobe,
  FaRss,
  FaYoutube,
  FaArrowUp,
  FaCheckCircle,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useLoalization";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { theme, themeName } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Get current language for paths
  const getLocalizedPath = (path) => {
    if (path === "/") return `/${language}`;
    return `/${language}${path}`;
  };

  const quickLinks = [
    { name: t("home"), path: "/", icon: FaFeather },
    { name: t("poems"), path: "/poems", icon: FaBookOpen },
    { name: t("poets"), path: "/poets", icon: FaUserFriends },
    { name: t("poetryForms"), path: "/poems-types", icon: FaPenFancy },
    { name: t("about"), path: "/about", icon: FaInfoCircle },
  ];

  const resources = [
    { name: t("writingTips"), path: "/blog/writing-tips" },
    { name: t("poetryGlossary"), path: "/resources/glossary" },
    { name: t("famousPoets"), path: "/poets/featured" },
    { name: t("contests"), path: "/contests" },
    { name: t("workshops"), path: "/workshops" },
  ];

  const socialLinks = [
    {
      icon: FaTwitter,
      href: "https://twitter.com/prasang_poetry",
      label: "Twitter",
      color: "hover:text-blue-400",
    },
    {
      icon: FaInstagram,
      href: "https://instagram.com/prasang.poetry",
      label: "Instagram",
      color: "hover:text-pink-500",
    },
    {
      icon: FaFacebook,
      href: "https://facebook.com/prasangpoetry",
      label: "Facebook",
      color: "hover:text-blue-600",
    },
    {
      icon: FaYoutube,
      href: "https://youtube.com/@prasangpoetry",
      label: "YouTube",
      color: "hover:text-red-500",
    },
    {
      icon: FaRss,
      href: "/rss",
      label: "RSS Feed",
      color: "hover:text-orange-500",
    },
  ];

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError(t("emailRequired") || "Please enter your email");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError(t("invalidEmail") || "Please enter a valid email");
      return;
    }
    setEmailError("");
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  // Theme-based helper functions
  const getFooterGradient = () => {
    switch (themeName) {
      case "forest":
        return "from-green-50 to-white dark:from-gray-800 dark:to-gray-900";
      case "lavender":
        return "from-purple-50 to-white dark:from-gray-800 dark:to-gray-900";
      case "rose":
        return "from-rose-50 to-white dark:from-gray-800 dark:to-gray-900";
      case "sepia":
        return "from-amber-100 to-amber-50 dark:from-gray-800 dark:to-gray-900";
      case "dark":
        return "from-gray-800 to-gray-900";
      default:
        return "from-gray-50 to-white dark:from-gray-800 dark:to-gray-900";
    }
  };

  const footerGradient = getFooterGradient();

  // Check if current language is RTL (Urdu)
  const isRTL = language === "ur";

  // Get theme colors with fallbacks
  const getThemeColor = (type) => {
    const colors = {
      textPrimary: theme?.text?.primary || "text-gray-900 dark:text-white",
      textSecondary:
        theme?.text?.secondary || "text-gray-600 dark:text-gray-300",
      textTertiary: theme?.text?.tertiary || "text-gray-500 dark:text-gray-400",
      iconPrimary: theme?.icon?.primary || "text-amber-500 dark:text-amber-400",
      borderAccent:
        theme?.border?.accent || "border-amber-200 dark:border-amber-800",
      borderLight:
        theme?.border?.light || "border-gray-200 dark:border-gray-700",
      linkPrimary:
        theme?.link?.primary ||
        "text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300",
      linkSecondary:
        theme?.link?.secondary ||
        "hover:text-amber-600 dark:hover:text-amber-400",
      buttonPrimary:
        theme?.button?.primary ||
        "bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:shadow-lg",
      inputDefault:
        theme?.input?.default ||
        "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white",
      ringFocus: theme?.ring?.focus || "focus:ring-amber-500",
      backgroundSecondary:
        theme?.background?.secondary || "bg-gray-50 dark:bg-gray-900/50",
    };
    return colors[type] || "";
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show scroll to top button after scrolling
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      className={`bg-gradient-to-b ${footerGradient} border-t ${getThemeColor("borderAccent")} mt-16 relative`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 p-3 rounded-full ${getThemeColor("buttonPrimary")} shadow-lg hover:shadow-xl transition-all hover:scale-110`}
          aria-label={t("backToTop") || "Back to Top"}
        >
          <FaArrowUp size={20} />
        </button>
      )}

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href={getLocalizedPath("/")}
              className="flex items-center gap-2 group"
            >
              <div className="relative">
                <FaFeather
                  className={`text-2xl ${getThemeColor("iconPrimary")} group-hover:scale-110 transition-transform`}
                />
                <FaHeart className="absolute -top-1 -right-2 text-xs text-rose-400 animate-pulse" />
              </div>
              <span
                className={`text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent ${getThemeColor("textPrimary")}`}
              >
                Prasang
              </span>
            </Link>

            <p
              className={`${getThemeColor("textSecondary")} text-sm leading-relaxed`}
            >
              {t("brandDescription")}
            </p>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 dark:text-gray-500 ${social.color} transition-all hover:scale-110`}
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className={`text-sm font-semibold ${getThemeColor("textPrimary")} uppercase tracking-wider mb-4`}
            >
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={getLocalizedPath(link.path)}
                    className={`${getThemeColor("textSecondary")} ${getThemeColor("linkSecondary")} text-sm flex items-center gap-2 group transition-colors`}
                  >
                    <link.icon
                      className={`text-xs text-gray-400 dark:text-gray-500 group-hover:${getThemeColor("iconPrimary")}`}
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3
              className={`text-sm font-semibold ${getThemeColor("textPrimary")} uppercase tracking-wider mb-4`}
            >
              {t("resources")}
            </h3>
            <ul className="space-y-2">
              {resources.map((resource, idx) => (
                <li key={idx}>
                  <Link
                    href={getLocalizedPath(resource.path)}
                    className={`${getThemeColor("textSecondary")} ${getThemeColor("linkSecondary")} text-sm transition-colors`}
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3
              className={`text-sm font-semibold ${getThemeColor("textPrimary")} uppercase tracking-wider mb-4`}
            >
              {t("getInTouch")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FaEnvelope
                  className={`${getThemeColor("iconPrimary")} mt-1 flex-shrink-0`}
                />
                <a
                  href="mailto:hello@prasang.com"
                  className={`${getThemeColor("textSecondary")} ${getThemeColor("linkSecondary")} text-sm break-all`}
                >
                  hello@prasang.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaPhone
                  className={`${getThemeColor("iconPrimary")} mt-1 flex-shrink-0`}
                />
                <a
                  href="tel:+1234567890"
                  className={`${getThemeColor("textSecondary")} ${getThemeColor("linkSecondary")} text-sm`}
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt
                  className={`${getThemeColor("iconPrimary")} mt-1 flex-shrink-0`}
                />
                <address
                  className={`${getThemeColor("textSecondary")} text-sm not-italic`}
                >
                  123 Poetry Lane
                  <br />
                  Creative City, PC 12345
                </address>
              </li>
            </ul>

            {/* Newsletter Signup */}
            <div className="mt-4">
              <h4
                className={`text-sm font-medium ${getThemeColor("textPrimary")} mb-2`}
              >
                {t("subscribe")}
              </h4>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder={t("yourEmail")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`flex-1 px-3 py-2 text-sm ${getThemeColor("inputDefault")} rounded-lg focus:outline-none focus:ring-2 ${getThemeColor("ringFocus")}`}
                  />
                  <button
                    type="submit"
                    className={`px-4 py-2 ${getThemeColor("buttonPrimary")} text-sm rounded-lg transition whitespace-nowrap`}
                  >
                    {subscribed ? (
                      <FaCheckCircle className="inline mr-1" />
                    ) : (
                      t("subscribeBtn")
                    )}
                  </button>
                </div>
                {emailError && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {emailError}
                  </p>
                )}
                {subscribed && (
                  <p className="text-xs text-green-500 dark:text-green-400">
                    {t("subscribedSuccess") || "Subscribed successfully! 🎉"}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className={`border-t ${getThemeColor("borderLight")} ${getThemeColor("backgroundSecondary")}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p
              className={`text-xs ${getThemeColor("textTertiary")} text-center md:text-left`}
            >
              © {currentYear} Prasang. {t("allRightsReserved")} |
              <Link
                href={getLocalizedPath("/privacy")}
                className={`${getThemeColor("linkSecondary")} ml-1`}
              >
                {t("privacy")}
              </Link>
              <span className="mx-2">•</span>
              <Link
                href={getLocalizedPath("/terms")}
                className={getThemeColor("linkSecondary")}
              >
                {t("terms")}
              </Link>
              <span className="mx-2">•</span>
              <Link
                href={getLocalizedPath("/sitemap")}
                className={getThemeColor("linkSecondary")}
              >
                {t("sitemap")}
              </Link>
            </p>

            {/* Made with love */}
            <p
              className={`text-xs ${getThemeColor("textTertiary")} flex items-center gap-1`}
            >
              {t("madeWith")}{" "}
              <FaHeart className="text-rose-400 text-xs animate-pulse" />{" "}
              {t("for")} {t("poetryLovers")}
              <span className="mx-1">•</span>
              <FaGlobe
                className={getThemeColor("iconPrimary")}
                size={12}
              />{" "}
              {t("languages") || "Languages"}
            </p>

            {/* Back to top button (inline) */}
            <button
              onClick={scrollToTop}
              className={`text-xs ${getThemeColor("linkPrimary")} flex items-center gap-1 transition-colors`}
            >
              {t("backToTop")} <FaArrowUp size={10} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
