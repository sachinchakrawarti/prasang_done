// src/app/(main)/[lang]/(public)/poets/page.jsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaSearch,
  FaFilter,
  FaUser,
  FaHeart,
  FaBookOpen,
  FaGlobe,
  FaClock,
  FaStar,
  FaChevronDown,
  FaTh,
  FaList,
  FaArrowRight,
  FaUsers,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import { fetchPoets } from "@/services/poetService";

export default function PoetsPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params?.lang || "en";
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [poets, setPoets] = useState([]);
  const [filteredPoets, setFilteredPoets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedEra, setSelectedEra] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Load poets from API
  const loadPoets = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = {
          page,
          limit: pagination.limit,
        };

        // Only add search if it has a value
        if (searchTerm) {
          queryParams.search = searchTerm;
        }

        console.log("Fetching poets with params:", queryParams);
        const response = await fetchPoets(queryParams);
        console.log("API Response:", response);

        if (response.success && response.data) {
          const poetsList = Array.isArray(response.data) ? response.data : [];
          console.log(`✅ Found ${poetsList.length} poets`);

          setPoets(poetsList);
          setFilteredPoets(poetsList);

          if (response.pagination) {
            setPagination({
              page: response.pagination.page || page,
              limit: response.pagination.limit || pagination.limit,
              total: response.pagination.total || poetsList.length,
              totalPages: response.pagination.totalPages || 1,
            });
          }
        } else {
          console.error("Invalid response:", response);
          setError("Invalid response from server");
        }
      } catch (err) {
        console.error("Failed to load poets:", err);
        setError(err.message || "Failed to load poets");
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, pagination.limit],
  );

  // Initial load
  useEffect(() => {
    loadPoets(1);
  }, [loadPoets]);

  // Get unique countries for filter
  const countries = useMemo(() => {
    const uniqueCountries = new Set(
      poets.map((p) => p.country || p.nationality || "Unknown"),
    );
    return ["all", ...uniqueCountries];
  }, [poets]);

  // Get unique eras for filter
  const eras = useMemo(() => {
    const uniqueEras = new Set();
    poets.forEach((p) => {
      const era = p.era || p.century || "";
      if (era) uniqueEras.add(era);
    });
    return ["all", ...uniqueEras];
  }, [poets]);

  // Client-side filtering and sorting
  useEffect(() => {
    let filtered = [...poets];

    // Search filter (client-side for instant feedback)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (poet) =>
          (poet.name?.toLowerCase() || "").includes(searchLower) ||
          (
            poet.country?.toLowerCase() ||
            poet.nationality?.toLowerCase() ||
            ""
          ).includes(searchLower) ||
          (
            poet.bio?.toLowerCase() ||
            poet.biography?.toLowerCase() ||
            ""
          ).includes(searchLower) ||
          poet.tags?.some((tag) =>
            (typeof tag === "string" ? tag : tag?.name || "")
              .toLowerCase()
              .includes(searchLower),
          ) ||
          false,
      );
    }

    // Country filter
    if (selectedCountry !== "all") {
      filtered = filtered.filter(
        (poet) =>
          (poet.country || poet.nationality || "Unknown") === selectedCountry,
      );
    }

    // Era filter
    if (selectedEra !== "all") {
      filtered = filtered.filter(
        (poet) => (poet.era || poet.century || "") === selectedEra,
      );
    }

    // Sort
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "followers":
        filtered.sort((a, b) => (b.followers || 0) - (a.followers || 0));
        break;
      case "works":
        filtered.sort((a, b) => (b.works || 0) - (a.works || 0));
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt || b.created_at || 0) -
            new Date(a.createdAt || a.created_at || 0),
        );
        break;
      default:
        break;
    }

    setFilteredPoets(filtered);
  }, [searchTerm, selectedCountry, selectedEra, sortBy, poets]);

  // Navigation handler
  const navigateToPoet = useCallback(
    (slug) => {
      if (slug) {
        router.push(`/${lang}/poets/${slug}`);
      }
    },
    [lang, router],
  );

  // Load more
  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      loadPoets(pagination.page + 1);
    }
  };

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

  // Render states
  if (isLoading && poets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error && poets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaUser className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
            Error loading poets
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mt-2">{error}</p>
          <button
            onClick={() => loadPoets(1)}
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
            <FaUsers className={`text-3xl ${textColor}`} />
            <h1
              className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
            >
              {t?.("poets") || "Poets"}
            </h1>
            <span className="text-sm text-gray-400">
              ({poets.length} total)
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2 ml-11">
            {t?.("poetsDescription") ||
              "Discover poets from around the world and explore their works"}
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
                placeholder={
                  t?.("searchPoets") ||
                  "Search poets by name, country, or style..."
                }
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Reload with search
                  loadPoets(1);
                }}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${borderColor} bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
                aria-label="Search poets"
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
                <span>{t?.("filter") || "Filter"}</span>
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
              className={`p-4 rounded-lg border ${borderColor} bg-white dark:bg-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-4`}
            >
              {/* Country Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t?.("country") || "Country"}
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country === "all"
                        ? t?.("allCountries") || "All Countries"
                        : country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Era Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t?.("era") || "Era"}
                </label>
                <select
                  value={selectedEra}
                  onChange={(e) => setSelectedEra(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {eras.map((era) => (
                    <option key={era} value={era}>
                      {era === "all" ? t?.("allEras") || "All Eras" : era}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t?.("sortBy") || "Sort By"}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="popular">
                    {t?.("mostPopular") || "Most Popular"}
                  </option>
                  <option value="followers">
                    {t?.("mostFollowers") || "Most Followers"}
                  </option>
                  <option value="works">
                    {t?.("mostWorks") || "Most Works"}
                  </option>
                  <option value="newest">{t?.("newest") || "Newest"}</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Poets Grid/List */}
        {filteredPoets.length === 0 ? (
          <div
            className={`text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border ${borderColor}`}
          >
            <FaUser className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
              {t?.("noPoetsFound") || "No poets found"}
            </h3>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              {t?.("tryDifferentSearch") ||
                "Try adjusting your search or filters"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPoets.map((poet) => (
              <PoetCard
                key={poet.id}
                poet={poet}
                lang={lang}
                textColor={textColor}
                gradient={gradient}
                borderColor={borderColor}
                hoverBg={hoverBg}
                onNavigate={navigateToPoet}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPoets.map((poet) => (
              <PoetListItem
                key={poet.id}
                poet={poet}
                lang={lang}
                textColor={textColor}
                gradient={gradient}
                borderColor={borderColor}
                hoverBg={hoverBg}
                onNavigate={navigateToPoet}
              />
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredPoets.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {t?.("showing") || "Showing"} {filteredPoets.length}{" "}
            {t?.("poets") || "poets"}
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

// Poet Card Component (Grid View)
function PoetCard({
  poet,
  lang,
  textColor,
  gradient,
  borderColor,
  hoverBg,
  onNavigate,
}) {
  const { t } = useTranslation();

  // Format poet data for display
  const poetName = poet.name || "Unknown Poet";
  const poetSlug = poet.slug || poet.id;
  const poetCountry = poet.country || poet.nationality || "Unknown";
  const poetEra = poet.era || poet.century || "";
  const poetBio = poet.bio || poet.biography || "";
  const poetTags = poet.tags || [];
  const poetLikes = poet.likes || 0;
  const poetFollowers = poet.followers || 0;
  const poetWorks = poet.works || 0;
  const isFeatured = poet.featured || false;

  return (
    <div
      className={`group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
      onClick={() => onNavigate(poetSlug)}
      role="article"
      aria-label={`Poet: ${poetName}`}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="flex justify-end mb-2">
          <span
            className={`px-2 py-1 text-xs font-medium text-white bg-gradient-to-r ${gradient} rounded-full`}
          >
            <FaStar className="inline mr-1" size={10} />
            {t?.("featured") || "Featured"}
          </span>
        </div>
      )}

      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <div
          className={`w-20 h-20 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-white text-3xl shadow-lg group-hover:scale-110 transition-transform`}
        >
          {poet.image ? (
            <img
              src={poet.image}
              alt={poetName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <FaUser />
          )}
        </div>
      </div>

      {/* Name */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors text-center">
        {poetName}
      </h3>

      {/* Country and Era */}
      <div className="flex items-center justify-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <FaGlobe size={12} />
          {poetCountry}
        </span>
        {poetEra && (
          <span className="flex items-center gap-1">
            <FaClock size={12} />
            {poetEra}
          </span>
        )}
      </div>

      {/* Tags */}
      {poetTags.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {poetTags.slice(0, 3).map((tag, index) => {
            const tagName = typeof tag === "string" ? tag : tag?.name || "";
            return (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded-full ${hoverBg} ${textColor}`}
              >
                #{tagName}
              </span>
            );
          })}
        </div>
      )}

      {/* Bio */}
      {poetBio && (
        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 text-center">
          {poetBio}
        </p>
      )}

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <FaHeart className={textColor} size={14} />
          {poetLikes}
        </span>
        <span className="flex items-center gap-1">
          <FaUsers size={14} />
          {poetFollowers}
        </span>
        <span className="flex items-center gap-1">
          <FaBookOpen size={14} />
          {poetWorks}
        </span>
      </div>

      {/* Explore Button */}
      <div className="mt-4 text-center">
        <span
          className={`inline-flex items-center gap-2 ${textColor} font-medium group-hover:gap-3 transition-all`}
        >
          {t?.("explore") || "Explore"}
          <FaArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </span>
      </div>
    </div>
  );
}

// Poet List Item Component (List View)
function PoetListItem({
  poet,
  lang,
  textColor,
  gradient,
  borderColor,
  hoverBg,
  onNavigate,
}) {
  const { t } = useTranslation();

  const poetName = poet.name || "Unknown Poet";
  const poetSlug = poet.slug || poet.id;
  const poetCountry = poet.country || poet.nationality || "Unknown";
  const poetEra = poet.era || poet.century || "";
  const poetBio = poet.bio || poet.biography || "";
  const poetTags = poet.tags || [];
  const poetLikes = poet.likes || 0;
  const poetFollowers = poet.followers || 0;
  const poetWorks = poet.works || 0;
  const isFeatured = poet.featured || false;

  return (
    <div
      className={`group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${borderColor} hover:shadow-xl transition-all duration-300 cursor-pointer`}
      onClick={() => onNavigate(poetSlug)}
      role="article"
      aria-label={`Poet: ${poetName}`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Avatar and Name */}
        <div className="flex items-center gap-4 flex-1">
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-white text-2xl shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}
          >
            {poet.image ? (
              <img
                src={poet.image}
                alt={poetName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <FaUser />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {poetName}
              </h3>
              {isFeatured && (
                <span
                  className={`px-2 py-0.5 text-xs font-medium text-white bg-gradient-to-r ${gradient} rounded-full`}
                >
                  <FaStar className="inline mr-1" size={8} />
                  {t?.("featured") || "Featured"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <FaGlobe size={12} />
                {poetCountry}
              </span>
              {poetEra && (
                <span className="flex items-center gap-1">
                  <FaClock size={12} />
                  {poetEra}
                </span>
              )}
            </div>

            {poetTags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {poetTags.slice(0, 3).map((tag, index) => {
                  const tagName =
                    typeof tag === "string" ? tag : tag?.name || "";
                  return (
                    <span
                      key={index}
                      className={`px-1.5 py-0.5 text-xs rounded-full ${hoverBg} ${textColor}`}
                    >
                      #{tagName}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {poetBio && (
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 flex-1">
            {poetBio}
          </p>
        )}

        {/* Stats */}
        <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <FaHeart className={textColor} size={14} />
            {poetLikes}
          </span>
          <span className="flex items-center gap-1">
            <FaUsers size={14} />
            {poetFollowers}
          </span>
          <span className="flex items-center gap-1">
            <FaBookOpen size={14} />
            {poetWorks}
          </span>
          <span
            className={`${textColor} font-medium group-hover:translate-x-1 transition-transform`}
          >
            {t?.("explore") || "Explore"} →
          </span>
        </div>
      </div>
    </div>
  );
}
