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

// Sample poem data (replace with actual data from your API)
const samplePoems = [
  {
    id: 1,
    slug: "sonnet-18",
    title: "Sonnet 18",
    poet: "William Shakespeare",
    poetSlug: "william-shakespeare",
    excerpt:
      "Shall I compare thee to a summer's day? Thou art more lovely and more temperate...",
    content:
      "Shall I compare thee to a summer's day? Thou art more lovely and more temperate: Rough winds do shake the darling buds of May, And summer's lease hath all too short a date...",
    type: "Sonnet",
    language: "en",
    likes: 1243,
    views: 5678,
    createdAt: "2024-01-15",
    tags: ["classic", "love", "nature"],
    featured: true,
  },
  {
    id: 2,
    slug: "the-road-not-taken",
    title: "The Road Not Taken",
    poet: "Robert Frost",
    poetSlug: "robert-frost",
    excerpt:
      "Two roads diverged in a yellow wood, And sorry I could not travel both...",
    content:
      "Two roads diverged in a yellow wood, And sorry I could not travel both And be one traveler, long I stood And looked down one as far as I could...",
    type: "Narrative",
    language: "en",
    likes: 987,
    views: 4321,
    createdAt: "2024-01-10",
    tags: ["classic", "nature", "reflection"],
    featured: true,
  },
  {
    id: 3,
    slug: "kavita-1",
    title: "कविता 1",
    poet: "महादेवी वर्मा",
    poetSlug: "mahadevi-verma",
    excerpt: "मैंने देखा एक सपना, जिसमें थी बहार...",
    content:
      "मैंने देखा एक सपना, जिसमें थी बहार, फूल खिले थे हर किनारे, थी खुशियों की सौगात...",
    type: "गीत",
    language: "hi",
    likes: 567,
    views: 2345,
    createdAt: "2024-01-05",
    tags: ["हिंदी", "प्रेम", "प्रकृति"],
    featured: false,
  },
  {
    id: 4,
    slug: "ghazal",
    title: "غزل",
    poet: "فیض احمد فیض",
    poetSlug: "faiz-ahmed-faiz",
    excerpt: "دل کا ہر سوز و گداز اپنا ہے...",
    content: "دل کا ہر سوز و گداز اپنا ہے، زندگی کا ہر طوفان اپنا ہے...",
    type: "غزل",
    language: "ur",
    likes: 432,
    views: 1987,
    createdAt: "2024-01-01",
    tags: ["اردو", "محبت", "شاعری"],
    featured: false,
  },
  {
    id: 5,
    slug: "the-raven",
    title: "The Raven",
    poet: "Edgar Allan Poe",
    poetSlug: "edgar-allan-poe",
    excerpt: "Once upon a midnight dreary, while I pondered, weak and weary...",
    content:
      "Once upon a midnight dreary, while I pondered, weak and weary, Over many a quaint and curious volume of forgotten lore...",
    type: "Narrative",
    language: "en",
    likes: 876,
    views: 3456,
    createdAt: "2023-12-20",
    tags: ["classic", "dark", "mystery"],
    featured: false,
  },
  {
    id: 6,
    slug: "if",
    title: "If—",
    poet: "Rudyard Kipling",
    poetSlug: "rudyard-kipling",
    excerpt:
      "If you can keep your head when all about you Are losing theirs and blaming it on you...",
    content:
      "If you can keep your head when all about you Are losing theirs and blaming it on you, If you can trust yourself when all men doubt you, But make allowance for their doubting too...",
    type: "Didactic",
    language: "en",
    likes: 765,
    views: 2987,
    createdAt: "2023-12-15",
    tags: ["classic", "inspiration", "wisdom"],
    featured: false,
  },
];

export default function PoemsPage() {
  const params = useParams();
  const lang = params?.lang || "en";
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [poems, setPoems] = useState(samplePoems);
  const [filteredPoems, setFilteredPoems] = useState(samplePoems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);

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

  // Navigation handlers
  const navigateToPoem = useCallback(
    (slug) => {
      window.location.href = `/${lang}/poems/${slug}`;
    },
    [lang],
  );

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
              <PoemCard
                key={poem.id}
                poem={poem}
                lang={lang}
                textColor={textColor}
                gradient={gradient}
                borderColor={borderColor}
                hoverBg={hoverBg}
                onNavigate={navigateToPoem}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPoems.map((poem) => (
              <PoemListItem
                key={poem.id}
                poem={poem}
                lang={lang}
                textColor={textColor}
                gradient={gradient}
                borderColor={borderColor}
                hoverBg={hoverBg}
                onNavigate={navigateToPoem}
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

// Poem Card Component (Grid View)
function PoemCard({
  poem,
  lang,
  textColor,
  gradient,
  borderColor,
  hoverBg,
  onNavigate,
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
      onClick={() => onNavigate(poem.slug)}
      role="article"
      aria-label={`Poem: ${poem.title}`}
    >
      {/* Featured Badge */}
      {poem.featured && (
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
          {poem.type}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {poem.language.toUpperCase()}
        </span>
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
      <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
        {poem.excerpt}
      </p>

      {/* Tags */}
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
            {new Date(poem.createdAt).toLocaleDateString()}
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

// Poem List Item Component (List View)
function PoemListItem({
  poem,
  lang,
  textColor,
  gradient,
  borderColor,
  hoverBg,
  onNavigate,
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${borderColor} hover:shadow-xl transition-all duration-300 cursor-pointer`}
      onClick={() => onNavigate(poem.slug)}
      role="article"
      aria-label={`Poem: ${poem.title}`}
    >
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
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {poem.language.toUpperCase()}
            </span>
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

          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
            {poem.excerpt}
          </p>
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
