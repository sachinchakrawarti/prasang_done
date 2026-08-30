// src/components/poems/poemscard.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaHeart,
  FaUser,
  FaClock,
  FaStar,
  FaEye,
  FaBookmark,
  FaRegBookmark,
  FaShare,
  FaQuoteLeft,
  FaLanguage,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

const PoemsCard = ({
  poem,
  lang,
  variant = "grid", // "grid" | "list" | "compact"
  showActions = true,
  showTags = true,
  showExcerpt = true,
  showLanguageBadge = true,
  className = "",
  onLike,
  onBookmark,
  onShare,
}) => {
  const { themeName } = useTheme();
  const { t } = useTranslation();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

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

  // Language names and colors
  const languageInfo = {
    en: {
      name: "English",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    hi: {
      name: "हिन्दी",
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
    ur: {
      name: "اردو",
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    ar: {
      name: "العربية",
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    bn: {
      name: "বাংলা",
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
    te: {
      name: "తెలుగు",
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    ta: {
      name: "தமிழ்",
      color: "text-yellow-500",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    ml: {
      name: "മലയാളം",
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    kn: {
      name: "ಕನ್ನಡ",
      color: "text-pink-500",
      bg: "bg-pink-50 dark:bg-pink-900/20",
    },
    mr: {
      name: "मराठी",
      color: "text-teal-500",
      bg: "bg-teal-50 dark:bg-teal-900/20",
    },
    gu: {
      name: "ગુજરાતી",
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    pa: {
      name: "ਪੰਜਾਬੀ",
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-900/20",
    },
  };

  // Handle like
  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    if (onLike) onLike(poem.id, !isLiked);
  };

  // Handle bookmark
  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    if (onBookmark) onBookmark(poem.id, !isBookmarked);
  };

  // Handle share
  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/${lang}/poems/${poem.slug}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
    if (onShare) onShare(poem.id);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(
      lang === "en" ? "en-US" : lang === "hi" ? "hi-IN" : "ur-PK",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  };

  // Get language info
  const langInfo = languageInfo[poem.language] || languageInfo.en;

  // Grid View
  if (variant === "grid") {
    return (
      <div
        className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/${lang}/poems/${poem.slug}`} className="block p-6">
          {/* Badges */}
          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Type Badge */}
              <span
                className={`px-2 py-1 text-xs rounded-full ${hoverBg} ${textColor}`}
              >
                {poem.type}
              </span>
              {/* Language Badge */}
              {showLanguageBadge && (
                <span
                  className={`px-2 py-1 text-xs rounded-full ${langInfo.bg} ${langInfo.color}`}
                >
                  {langInfo.name}
                </span>
              )}
            </div>
            {poem.featured && (
              <span
                className={`px-2 py-1 text-xs font-medium text-white bg-gradient-to-r ${gradient} rounded-full`}
              >
                <FaStar className="inline mr-1" size={10} />
                {t("featured") || "Featured"}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
            {poem.title}
          </h3>

          {/* Poet */}
          <span
            className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/${lang}/poets/${poem.poetSlug}`;
            }}
          >
            <FaUser size={12} />
            <span>{poem.poet}</span>
          </span>

          {/* Excerpt */}
          {showExcerpt && (
            <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
              {poem.excerpt}
            </p>
          )}

          {/* Tags */}
          {showTags && poem.tags && poem.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {poem.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs rounded-full ${hoverBg} ${textColor}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <FaHeart className={textColor} size={14} />
                {poem.likes}
              </span>
              <span className="flex items-center gap-1">
                <FaEye size={14} />
                {poem.views}
              </span>
              <span className="flex items-center gap-1">
                <FaClock size={14} />
                {formatDate(poem.createdAt)}
              </span>
            </div>
            <span
              className={`${textColor} font-medium group-hover:translate-x-1 transition-transform`}
            >
              {t("read") || "Read"} →
            </span>
          </div>
        </Link>

        {/* Actions Overlay */}
        {showActions && isHovered && (
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full ${hoverBg} transition-all hover:scale-110`}
              aria-label={t("like") || "Like"}
            >
              <FaHeart
                className={`text-lg transition-all ${isLiked ? "text-red-500 scale-110" : textColor}`}
              />
            </button>
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full ${hoverBg} transition-all hover:scale-110`}
              aria-label={t("bookmark") || "Bookmark"}
            >
              {isBookmarked ? (
                <FaBookmark className={`text-lg ${textColor}`} />
              ) : (
                <FaRegBookmark className="text-lg text-gray-400" />
              )}
            </button>
            <button
              onClick={handleShare}
              className={`p-2 rounded-full ${hoverBg} transition-all hover:scale-110 relative`}
              aria-label={t("share") || "Share"}
            >
              {copied ? (
                <FaCheck className="text-lg text-green-500" />
              ) : (
                <FaShare className={`text-lg ${textColor}`} />
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  // List View
  if (variant === "list") {
    return (
      <div
        className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${borderColor} hover:shadow-xl transition-all duration-300 ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/${lang}/poems/${poem.slug}`} className="block p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                {poem.featured && (
                  <span
                    className={`px-2 py-1 text-xs font-medium text-white bg-gradient-to-r ${gradient} rounded-full`}
                  >
                    <FaStar className="inline mr-1" size={10} />
                    {t("featured") || "Featured"}
                  </span>
                )}
                <span
                  className={`px-2 py-1 text-xs rounded-full ${hoverBg} ${textColor}`}
                >
                  {poem.type}
                </span>
                {showLanguageBadge && (
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${langInfo.bg} ${langInfo.color}`}
                  >
                    {langInfo.name}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {poem.title}
              </h3>

              <span
                className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/${lang}/poets/${poem.poetSlug}`;
                }}
              >
                <FaUser size={12} />
                <span>{poem.poet}</span>
              </span>

              {showExcerpt && (
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
                  {poem.excerpt}
                </p>
              )}

              {showTags && poem.tags && poem.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {poem.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-0.5 text-xs rounded-full ${hoverBg} ${textColor}`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <FaHeart className={textColor} size={14} />
                {poem.likes}
              </span>
              <span className="flex items-center gap-1">
                <FaEye size={14} />
                {poem.views}
              </span>
              <span className="flex items-center gap-1">
                <FaClock size={14} />
                {formatDate(poem.createdAt)}
              </span>
              <span
                className={`${textColor} font-medium group-hover:translate-x-1 transition-transform`}
              >
                {t("read") || "Read"} →
              </span>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Compact View
  if (variant === "compact") {
    return (
      <div
        className={`group bg-white dark:bg-gray-800 rounded-xl shadow-md border ${borderColor} hover:shadow-lg transition-all duration-300 ${className}`}
      >
        <Link href={`/${lang}/poems/${poem.slug}`} className="block p-4">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className={`p-2 rounded-lg ${hoverBg} flex-shrink-0`}>
              <FaQuoteLeft className={`text-sm ${textColor}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                  {poem.title}
                </h4>
                {poem.featured && <FaStar className={`text-xs ${textColor}`} />}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {poem.poet}
                </span>
                {showLanguageBadge && (
                  <span className={`text-xs ${langInfo.color}`}>
                    ({langInfo.name})
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
              <span className="flex items-center gap-1">
                <FaHeart size={10} />
                {poem.likes}
              </span>
              <span className="flex items-center gap-1">
                <FaEye size={10} />
                {poem.views}
              </span>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return null;
};

export default PoemsCard;
