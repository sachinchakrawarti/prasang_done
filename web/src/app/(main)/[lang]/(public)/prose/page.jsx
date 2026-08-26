// src/app/(main)/[lang]/(public)/prose/page.jsx
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
  FaPenNib,
  FaChevronDown,
  FaTh,
  FaList,
  FaTag,
  FaEye,
  FaArrowRight,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

// Sample prose data (replace with actual data from your API)
const sampleProse = [
  {
    id: 1,
    title: "The Art of Storytelling",
    author: "Maya Angelou",
    authorSlug: "maya-angelou",
    excerpt:
      "There is no greater agony than bearing an untold story inside you. Stories have been the way we share our experiences, our dreams, and our fears...",
    content:
      "There is no greater agony than bearing an untold story inside you. Stories have been the way we share our experiences, our dreams, and our fears. Through storytelling, we connect with others across time and space...",
    type: "Essay",
    category: "Literary Criticism",
    language: "en",
    likes: 876,
    views: 3456,
    createdAt: "2024-02-20",
    tags: ["storytelling", "essay", "inspiration"],
    featured: true,
    readTime: "5 min",
  },
  {
    id: 2,
    title: "The Silent Village",
    author: "Rabindranath Tagore",
    authorSlug: "rabindranath-tagore",
    excerpt:
      "The village lay silent under the moonlight, each house holding its own secrets, each heart beating with its own rhythm...",
    content:
      "The village lay silent under the moonlight, each house holding its own secrets, each heart beating with its own rhythm. The old banyan tree stood witness to generations of stories...",
    type: "Short Story",
    category: "Fiction",
    language: "en",
    likes: 654,
    views: 2789,
    createdAt: "2024-02-15",
    tags: ["fiction", "village", "moonlight"],
    featured: false,
    readTime: "8 min",
  },
  {
    id: 3,
    title: "प्रकृति का संदेश",
    author: "महादेवी वर्मा",
    authorSlug: "mahadevi-verma",
    excerpt:
      "प्रकृति हमें हर पल कुछ न कुछ सिखाती है, बस हमें उसकी भाषा समझनी आनी चाहिए...",
    content:
      "प्रकृति हमें हर पल कुछ न कुछ सिखाती है, बस हमें उसकी भाषा समझनी आनी चाहिए। पेड़ों की छाया, नदियों का बहाव, पहाड़ों की ऊँचाई...",
    type: "Essay",
    category: "Nature Writing",
    language: "hi",
    likes: 432,
    views: 1987,
    createdAt: "2024-02-10",
    tags: ["हिंदी", "प्रकृति", "निबंध"],
    featured: false,
    readTime: "4 min",
  },
  {
    id: 4,
    title: "ایک نئی صبح",
    author: "فیض احمد فیض",
    authorSlug: "faiz-ahmed-faiz",
    excerpt:
      "ہر صبح ایک نئی امید لے کر آتی ہے، ہر دن ایک نئی کہانی سناتا ہے...",
    content:
      "ہر صبح ایک نئی امید لے کر آتی ہے، ہر دن ایک نئی کہانی سناتا ہے۔ زندگی کی یہی خوبصورتی ہے کہ ہر لمحہ نیا ہے، ہر پل منفرد ہے...",
    type: "Memoir",
    category: "Personal Narrative",
    language: "ur",
    likes: 321,
    views: 1543,
    createdAt: "2024-02-05",
    tags: ["اردو", "یاداشتیں", "زندگی"],
    featured: false,
    readTime: "6 min",
  },
  {
    id: 5,
    title: "The Power of Words",
    author: "Virginia Woolf",
    authorSlug: "virginia-woolf",
    excerpt:
      "Words are the most powerful tool we possess. They can heal, they can harm, they can inspire, and they can transform...",
    content:
      "Words are the most powerful tool we possess. They can heal, they can harm, they can inspire, and they can transform. The written word has the power to change hearts and minds...",
    type: "Article",
    category: "Literary Criticism",
    language: "en",
    likes: 543,
    views: 2109,
    createdAt: "2024-01-28",
    tags: ["words", "writing", "inspiration"],
    featured: true,
    readTime: "3 min",
  },
  {
    id: 6,
    title: "एक पुरानी डायरी",
    author: "हरिवंश राय बच्चन",
    authorSlug: "harivansh-rai-bachchan",
    excerpt:
      "डायरी के पन्नों में बिखरी हैं कुछ यादें, कुछ ख्वाब, कुछ बिखरे हुए पल...",
    content:
      "डायरी के पन्नों में बिखरी हैं कुछ यादें, कुछ ख्वाब, कुछ बिखरे हुए पल। हर पन्ना एक कहानी कहता है, हर शब्द एक एहसास जगाता है...",
    type: "Memoir",
    category: "Personal Narrative",
    language: "hi",
    likes: 298,
    views: 1234,
    createdAt: "2024-01-20",
    tags: ["हिंदी", "संस्मरण", "डायरी"],
    featured: false,
    readTime: "5 min",
  },
];

export default function ProsePage() {
  const params = useParams();
  const lang = params?.lang || "en";
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [prose, setProse] = useState(sampleProse);
  const [filteredProse, setFilteredProse] = useState(sampleProse);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);

  // Get unique types, categories, and languages for filters
  const types = useMemo(
    () => ["all", ...new Set(prose.map((p) => p.type))],
    [prose],
  );
  const categories = useMemo(
    () => ["all", ...new Set(prose.map((p) => p.category))],
    [prose],
  );
  const languages = useMemo(
    () => ["all", ...new Set(prose.map((p) => p.language))],
    [prose],
  );

  // Filter prose based on search, type, category, language
  useEffect(() => {
    let filtered = prose;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Language filter
    if (selectedLanguage !== "all") {
      filtered = filtered.filter((item) => item.language === selectedLanguage);
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

    setFilteredProse(filtered);
  }, [
    searchTerm,
    selectedType,
    selectedCategory,
    selectedLanguage,
    sortBy,
    prose,
  ]);

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

  // Navigation handlers
  const navigateToProse = useCallback(
    (id) => {
      window.location.href = `/${lang}/prose/${id}`;
    },
    [lang],
  );

  const navigateToAuthor = useCallback(
    (slug, e) => {
      e.stopPropagation();
      window.location.href = `/${lang}/authors/${slug}`;
    },
    [lang],
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <FaPenNib className={`text-3xl ${textColor}`} />
            <h1
              className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
            >
              {t("prose") || "Prose"}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2 ml-11">
            {t("proseDescription") ||
              "Explore essays, short stories, memoirs, and more"}
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
                placeholder={t("searchProse") || "Search prose, authors..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${borderColor} bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
                aria-label="Search prose"
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
              className={`p-4 rounded-lg border ${borderColor} bg-white dark:bg-gray-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn`}
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

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("category") || "Category"}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all"
                        ? t("allCategories") || "All Categories"
                        : category}
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

        {/* Prose Grid/List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : filteredProse.length === 0 ? (
          <div
            className={`text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border ${borderColor}`}
          >
            <FaBookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
              {t("noProseFound") || "No prose found"}
            </h3>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              {t("tryDifferentSearch") ||
                "Try adjusting your search or filters"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProse.map((item) => (
              <ProseCard
                key={item.id}
                item={item}
                lang={lang}
                textColor={textColor}
                gradient={gradient}
                borderColor={borderColor}
                hoverBg={hoverBg}
                onNavigate={navigateToProse}
                onNavigateAuthor={navigateToAuthor}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProse.map((item) => (
              <ProseListItem
                key={item.id}
                item={item}
                lang={lang}
                textColor={textColor}
                gradient={gradient}
                borderColor={borderColor}
                hoverBg={hoverBg}
                onNavigate={navigateToProse}
                onNavigateAuthor={navigateToAuthor}
              />
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredProse.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {t("showing") || "Showing"} {filteredProse.length}{" "}
            {t("proseItems") || "prose items"}
          </div>
        )}
      </div>
    </div>
  );
}

// Prose Card Component (Grid View)
function ProseCard({
  item,
  lang,
  textColor,
  gradient,
  borderColor,
  hoverBg,
  onNavigate,
  onNavigateAuthor,
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
      onClick={() => onNavigate(item.id)}
      role="article"
      aria-label={`Prose: ${item.title}`}
    >
      {/* Featured Badge */}
      {item.featured && (
        <div className="flex justify-end mb-2">
          <span
            className={`px-2 py-1 text-xs font-medium text-white bg-gradient-to-r ${gradient} rounded-full`}
          >
            <FaStar className="inline mr-1" size={10} />
            {t("featured") || "Featured"}
          </span>
        </div>
      )}

      {/* Type Badge */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`px-2 py-1 text-xs rounded-full ${hoverBg} ${textColor}`}
        >
          {item.type}
        </span>
        {item.readTime && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {item.readTime} {t("read") || "read"}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
        {item.title}
      </h3>

      {/* Author */}
      <span
        className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
        onClick={(e) => onNavigateAuthor(item.authorSlug, e)}
      >
        <FaUser size={12} />
        <span>{item.author}</span>
      </span>

      {/* Category */}
      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400 dark:text-gray-500">
        <FaTag size={10} />
        <span>{item.category}</span>
      </div>

      {/* Excerpt */}
      <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
        {item.excerpt}
      </p>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {item.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className={`px-2 py-1 text-xs rounded-full ${hoverBg} ${textColor}`}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <FaHeart className={textColor} size={14} />
            {item.likes}
          </span>
          <span className="flex items-center gap-1">
            <FaEye size={14} />
            {item.views}
          </span>
          <span className="flex items-center gap-1">
            <FaClock size={14} />
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
        <span
          className={`${textColor} font-medium group-hover:translate-x-1 transition-transform`}
        >
          {t("read") || "Read"} →
        </span>
      </div>
    </div>
  );
}

// Prose List Item Component (List View)
function ProseListItem({
  item,
  lang,
  textColor,
  gradient,
  borderColor,
  hoverBg,
  onNavigate,
  onNavigateAuthor,
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${borderColor} hover:shadow-xl transition-all duration-300 cursor-pointer`}
      onClick={() => onNavigate(item.id)}
      role="article"
      aria-label={`Prose: ${item.title}`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            {item.featured && (
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
              {item.type}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {item.language.toUpperCase()}
            </span>
            {item.readTime && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {item.readTime} {t("read") || "read"}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {item.title}
          </h3>

          <span
            className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
            onClick={(e) => onNavigateAuthor(item.authorSlug, e)}
          >
            <FaUser size={12} />
            <span>{item.author}</span>
          </span>

          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
            {item.excerpt}
          </p>
        </div>

        {/* Stats */}
        <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <FaHeart className={textColor} size={14} />
            {item.likes}
          </span>
          <span className="flex items-center gap-1">
            <FaEye size={14} />
            {item.views}
          </span>
          <span
            className={`${textColor} font-medium group-hover:translate-x-1 transition-transform`}
          >
            {t("read") || "Read"} →
          </span>
        </div>
      </div>
    </div>
  );
}
