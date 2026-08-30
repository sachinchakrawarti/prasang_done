// src/app/(main)/[lang]/(public)/poems/page.jsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FaSearch,
  FaFilter,
  FaHeart,
  FaBookOpen,
  FaUser,
  FaClock,
  FaStar,
  FaFeather,
  FaChevronDown,
  FaTh,
  FaList,
  FaEye,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import PoemsCard from "@/components/poems/poemscard";
import poemsData from "@/data/poems_data";

export default function PoemsPage() {
  const params = useParams();
  const lang = params?.lang || "en";
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [poems, setPoems] = useState([]);
  const [filteredPoems, setFilteredPoems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);

  // Load poems data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPoems(poemsData);
      setFilteredPoems(poemsData);
      setIsLoading(false);
    }, 500);
  }, []);

  // Get unique types and languages for filters
  const types = useMemo(
    () => ["all", ...new Set(poems.map((p) => p.type))],
    [poems],
  );
  const languages = useMemo(
    () => ["all", ...new Set(poems.map((p) => p.language))],
    [poems],
  );

  // Filter poems based on search, type, language
  useEffect(() => {
    let filtered = poems;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (poem) =>
          poem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          poem.poet.toLowerCase().includes(searchTerm.toLowerCase()) ||
          poem.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          poem.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((poem) => poem.type === selectedType);
    }

    // Language filter
    if (selectedLanguage !== "all") {
      filtered = filtered.filter((poem) => poem.language === selectedLanguage);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "popular":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case "views":
        filtered.sort((a, b) => b.views - a.views);
        break;
      default:
        break;
    }

    setFilteredPoems(filtered);
  }, [searchTerm, selectedType, selectedLanguage, sortBy, poems]);

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

  // Handle like
  const handleLike = (poemId, liked) => {
    setPoems((prev) =>
      prev.map((p) =>
        p.id === poemId ? { ...p, likes: p.likes + (liked ? 1 : -1) } : p,
      ),
    );
  };

  // Handle bookmark
  const handleBookmark = (poemId, bookmarked) => {
    // Implement bookmark logic
    console.log(`Poem ${poemId} ${bookmarked ? "bookmarked" : "unbookmarked"}`);
  };

  // Handle share
  const handleShare = (poemId) => {
    // Implement share logic
    console.log(`Sharing poem ${poemId}`);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <FaFeather className={`text-3xl ${textColor}`} />
            <h1
              className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
            >
              {t("poems") || "Poems"}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2 ml-11">
            {t("poemsDescription") || "Discover poems from around the world"}
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t("searchPoems") || "Search poems, poets..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${borderColor} bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
                aria-label="Search poems"
              />
            </div>

            <div className="flex gap-2">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg border ${borderColor} ${hoverBg} flex items-center gap-2 transition whitespace-nowrap`}
                aria-label="Toggle filters"
              >
                <FaFilter className={textColor} />
                <span>{t("filter") || "Filter"}</span>
                <FaChevronDown
                  className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </button>

              {/* View Toggle */}
              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className={`px-4 py-2 rounded-lg border ${borderColor} ${hoverBg} transition`}
                aria-label="Toggle view mode"
              >
                {viewMode === "grid" ? <FaList /> : <FaTh />}
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div
              className={`p-4 rounded-lg border ${borderColor} bg-white dark:bg-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn`}
            >
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("type") || "Type"}
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type === "all" ? t("allTypes") || "All Types" : type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("language") || "Language"}
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang === "all"
                        ? t("allLanguages") || "All Languages"
                        : lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("sortBy") || "Sort By"}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="newest">{t("newest") || "Newest"}</option>
                  <option value="oldest">{t("oldest") || "Oldest"}</option>
                  <option value="popular">
                    {t("mostLiked") || "Most Liked"}
                  </option>
                  <option value="views">
                    {t("mostViewed") || "Most Viewed"}
                  </option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Poems Grid/List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : filteredPoems.length === 0 ? (
          <div
            className={`text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border ${borderColor}`}
          >
            <FaBookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
              {t("noPoemsFound") || "No poems found"}
            </h3>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              {t("tryDifferentSearch") ||
                "Try adjusting your search or filters"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPoems.map((poem) => (
              <PoemsCard
                key={poem.id}
                poem={poem}
                lang={lang}
                variant="grid"
                showActions={true}
                showTags={true}
                showExcerpt={true}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onShare={handleShare}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPoems.map((poem) => (
              <PoemsCard
                key={poem.id}
                poem={poem}
                lang={lang}
                variant="list"
                showActions={true}
                showTags={true}
                showExcerpt={true}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onShare={handleShare}
              />
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredPoems.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {t("showing") || "Showing"} {filteredPoems.length}{" "}
            {t("poems") || "poems"}
          </div>
        )}
      </div>
    </div>
  );
}
