// src/app/(main)/[lang]/(public)/poems/page.jsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  FaSearch,
  FaFilter,
  FaFeather,
  FaChevronDown,
  FaTh,
  FaList,
  FaBookOpen,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import PoemsCard from "@/components/poems/poemscard";
import { fetchPoems } from "@/services/poemService";

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
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Load poems from API
  const loadPoems = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = {
          page,
          limit: pagination.limit,
        };

        // Only add filters if they have values
        if (searchTerm) {
          queryParams.search = searchTerm;
        }
        if (selectedLanguage && selectedLanguage !== "all") {
          queryParams.language = selectedLanguage;
        }
        // DON'T add status filter yet - let's see all poems first
        // queryParams.status = "published";

        console.log("Fetching poems with params:", queryParams);
        const response = await fetchPoems(queryParams);
        console.log("API Response:", response);

        if (response.success && response.data) {
          const poemsList = Array.isArray(response.data) ? response.data : [];
          console.log(`✅ Found ${poemsList.length} poems`);

          setPoems(poemsList);
          setFilteredPoems(poemsList);

          if (response.pagination) {
            setPagination({
              page: response.pagination.page || page,
              limit: response.pagination.limit || pagination.limit,
              total: response.pagination.total || poemsList.length,
              totalPages: response.pagination.totalPages || 1,
            });
          }
        } else {
          console.error("Invalid response:", response);
          setError("Invalid response from server");
        }
      } catch (err) {
        console.error("Failed to load poems:", err);
        setError(err.message || "Failed to load poems");
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, selectedLanguage, pagination.limit],
  );

  // Initial load
  useEffect(() => {
    loadPoems(1);
  }, [loadPoems]);

  // Get unique types and languages from loaded poems
  const types = useMemo(() => {
    const uniqueTypes = new Set(
      poems.map((p) => p.category?.name || p.type || "Poem"),
    );
    return ["all", ...uniqueTypes];
  }, [poems]);

  const languages = useMemo(() => {
    const uniqueLanguages = new Set(poems.map((p) => p.language || "en"));
    return ["all", ...uniqueLanguages];
  }, [poems]);

  // Client-side filtering and sorting
  useEffect(() => {
    let filtered = [...poems];

    // Type filter (using category)
    if (selectedType !== "all") {
      filtered = filtered.filter(
        (poem) => (poem.category?.name || poem.type || "Poem") === selectedType,
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt || b.created_at || 0) -
            new Date(a.createdAt || a.created_at || 0),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt || a.created_at || 0) -
            new Date(b.createdAt || b.created_at || 0),
        );
        break;
      case "popular":
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "views":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        break;
    }

    setFilteredPoems(filtered);
  }, [selectedType, sortBy, poems]);

  // Handle like
  const handleLike = (poemId, liked) => {
    setPoems((prev) =>
      prev.map((p) =>
        p.id === poemId
          ? { ...p, likes: (p.likes || 0) + (liked ? 1 : -1), isLiked: liked }
          : p,
      ),
    );
  };

  // Handle bookmark
  const handleBookmark = (poemId, bookmarked) => {
    console.log(`Poem ${poemId} ${bookmarked ? "bookmarked" : "unbookmarked"}`);
  };

  // Handle share
  const handleShare = (poemId) => {
    console.log(`Sharing poem ${poemId}`);
  };

  // Load more
  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      loadPoems(pagination.page + 1);
    }
  };

  // Theme styles (keep your existing theme functions)
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

  // Render states
  if (isLoading && poems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error && poems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaBookOpen className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
            Error loading poems
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mt-2">{error}</p>
          <button
            onClick={() => loadPoems(1)}
            className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
              {t?.("poems") || "Poems"}
            </h1>
            <span className="text-sm text-gray-400">
              ({poems.length} total)
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2 ml-11">
            {t?.("poemsDescription") || "Discover poems from around the world"}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t?.("searchPoems") || "Search poems, poets..."}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Reload with search
                  loadPoems(1);
                }}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${borderColor} bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
                aria-label="Search poems"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg border ${borderColor} ${hoverBg} flex items-center gap-2 transition whitespace-nowrap`}
              >
                <FaFilter className={textColor} />
                <span>{t?.("filter") || "Filter"}</span>
                <FaChevronDown
                  className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </button>

              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className={`px-4 py-2 rounded-lg border ${borderColor} ${hoverBg} transition`}
              >
                {viewMode === "grid" ? <FaList /> : <FaTh />}
              </button>
            </div>
          </div>

          {showFilters && (
            <div
              className={`p-4 rounded-lg border ${borderColor} bg-white dark:bg-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-4`}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t?.("type") || "Type"}
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type === "all" ? t?.("allTypes") || "All Types" : type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t?.("language") || "Language"}
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    loadPoems(1);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang === "all"
                        ? t?.("allLanguages") || "All Languages"
                        : lang}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t?.("sortBy") || "Sort By"}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="newest">{t?.("newest") || "Newest"}</option>
                  <option value="oldest">{t?.("oldest") || "Oldest"}</option>
                  <option value="popular">
                    {t?.("mostLiked") || "Most Liked"}
                  </option>
                  <option value="views">
                    {t?.("mostViewed") || "Most Viewed"}
                  </option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Poems Display */}
        {filteredPoems.length === 0 ? (
          <div
            className={`text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border ${borderColor}`}
          >
            <FaBookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
              {t?.("noPoemsFound") || "No poems found"}
            </h3>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              {t?.("tryDifferentSearch") ||
                "Try adjusting your search or filters"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPoems.map((poem) => (
              <PoemsCard
                key={poem.id}
                poem={{
                  ...poem,
                  poet: poem.poet?.name || poem.author || "Unknown Poet",
                  excerpt:
                    poem.description ||
                    poem.excerpt ||
                    poem.content?.substring(0, 150) + "...",
                  tags: poem.tags || [],
                  type: poem.category?.name || poem.type || "Poem",
                }}
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
                poem={{
                  ...poem,
                  poet: poem.poet?.name || poem.author || "Unknown Poet",
                  excerpt:
                    poem.description ||
                    poem.excerpt ||
                    poem.content?.substring(0, 150) + "...",
                  tags: poem.tags || [],
                  type: poem.category?.name || poem.type || "Poem",
                }}
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
            {t?.("showing") || "Showing"} {filteredPoems.length}{" "}
            {t?.("poems") || "poems"}
            {pagination.total > 0 &&
              ` (${t?.("total") || "Total"}: ${pagination.total})`}
          </div>
        )}

        {/* Load More */}
        {pagination.page < pagination.totalPages && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg border ${borderColor} ${hoverBg} transition disabled:opacity-50`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
                  {t?.("loading") || "Loading..."}
                </span>
              ) : (
                t?.("loadMore") || "Load More"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
