// src/app/(main)/[lang]/(public)/poets/page.jsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  FaSearch,
  FaFilter,
  FaUser,
  FaHeart,
  FaBookOpen,
  FaGlobe,
  FaClock,
  FaAward,
  FaStar,
  FaChevronDown,
  FaTh,
  FaList,
  FaQuoteLeft,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaUsers,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

// Sample poets data (replace with actual data from your API)
const samplePoets = [
  {
    id: 1,
    name: "William Shakespeare",
    slug: "william-shakespeare",
    country: "England",
    era: "1564-1616",
    bio: "The greatest writer in the English language, Shakespeare wrote 154 sonnets and numerous plays that have become classics of world literature.",
    works: 154,
    likes: 5432,
    followers: 12345,
    featured: true,
    image: null,
    tags: ["sonnet", "playwright", "renaissance"],
    social: {
      twitter: "@shakespeare",
      instagram: "@william_shakespeare",
    },
  },
  {
    id: 2,
    name: "Rabindranath Tagore",
    slug: "rabindranath-tagore",
    country: "India",
    era: "1861-1941",
    bio: "Bengali poet, philosopher, and Nobel laureate who reshaped Bengali literature and music. Author of 'Gitanjali'.",
    works: 223,
    likes: 4321,
    followers: 9876,
    featured: true,
    image: null,
    tags: ["bengali", "nobel", "philosopher"],
    social: {
      twitter: "@tagore",
      instagram: "@rabindranath_tagore",
    },
  },
  {
    id: 3,
    name: "Faiz Ahmed Faiz",
    slug: "faiz-ahmed-faiz",
    country: "Pakistan",
    era: "1911-1984",
    bio: "One of the most celebrated poets of the Urdu language, Faiz's poetry is known for its revolutionary spirit and romantic imagery.",
    works: 187,
    likes: 3210,
    followers: 7654,
    featured: true,
    image: null,
    tags: ["urdu", "revolutionary", "romantic"],
    social: {
      twitter: "@faiz",
      instagram: "@faiz_ahmed_faiz",
    },
  },
  {
    id: 4,
    name: "Mahadevi Verma",
    slug: "mahadevi-verma",
    country: "India",
    era: "1907-1987",
    bio: "Hindi poet and writer, known for her sensitive and profound poetry. A leading figure of the Chhayavaad movement.",
    works: 156,
    likes: 2987,
    followers: 5432,
    featured: false,
    image: null,
    tags: ["hindi", "chhayavaad", "feminist"],
    social: {
      twitter: "@mahadevi_verma",
      instagram: "@mahadevi_verma",
    },
  },
  {
    id: 5,
    name: "John Keats",
    slug: "john-keats",
    country: "England",
    era: "1795-1821",
    bio: "English Romantic poet, known for his vivid imagery and profound exploration of beauty and mortality.",
    works: 98,
    likes: 2543,
    followers: 4321,
    featured: false,
    image: null,
    tags: ["romantic", "ode", "beauty"],
    social: {
      twitter: "@keats",
      instagram: "@john_keats",
    },
  },
  {
    id: 6,
    name: "Mirza Ghalib",
    slug: "mirza-ghalib",
    country: "India",
    era: "1797-1869",
    bio: "Legendary Urdu and Persian poet whose ghazals are renowned for their depth, wit, and philosophical insight.",
    works: 134,
    likes: 2345,
    followers: 3987,
    featured: false,
    image: null,
    tags: ["urdu", "ghazal", "philosopher"],
    social: {
      twitter: "@ghalib",
      instagram: "@mirza_ghalib",
    },
  },
  {
    id: 7,
    name: "Sylvia Plath",
    slug: "sylvia-plath",
    country: "USA",
    era: "1932-1963",
    bio: "American poet and novelist, known for her confessional style and powerful exploration of mental health and identity.",
    works: 87,
    likes: 1987,
    followers: 3456,
    featured: false,
    image: null,
    tags: ["confessional", "feminist", "modern"],
    social: {
      twitter: "@sylvia_plath",
      instagram: "@sylvia_plath",
    },
  },
  {
    id: 8,
    name: "Pablo Neruda",
    slug: "pablo-neruda",
    country: "Chile",
    era: "1904-1973",
    bio: "Chilean poet and diplomat, Nobel laureate whose passionate poetry explores love, politics, and the natural world.",
    works: 112,
    likes: 1876,
    followers: 2987,
    featured: false,
    image: null,
    tags: ["chilean", "love", "nobel"],
    social: {
      twitter: "@neruda",
      instagram: "@pablo_neruda",
    },
  },
];

export default function PoetsPage() {
  const params = useParams();
  const lang = params?.lang || "en";
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [poets, setPoets] = useState(samplePoets);
  const [filteredPoets, setFilteredPoets] = useState(samplePoets);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedEra, setSelectedEra] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [isLoading, setIsLoading] = useState(false);

  // Get unique countries for filter
  const countries = useMemo(
    () => ["all", ...new Set(poets.map((p) => p.country))],
    [poets],
  );

  const eras = [
    "all",
    { label: "16th Century", value: "16th" },
    { label: "17th Century", value: "17th" },
    { label: "18th Century", value: "18th" },
    { label: "19th Century", value: "19th" },
    { label: "20th Century", value: "20th" },
  ];

  // Filter poets based on search and filters
  useEffect(() => {
    let filtered = poets;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (poet) =>
          poet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          poet.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          poet.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
          poet.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Country filter
    if (selectedCountry !== "all") {
      filtered = filtered.filter((poet) => poet.country === selectedCountry);
    }

    // Era filter
    if (selectedEra !== "all") {
      filtered = filtered.filter((poet) => {
        const year = parseInt(poet.era.split("-")[0]);
        switch (selectedEra) {
          case "16th":
            return year >= 1500 && year < 1600;
          case "17th":
            return year >= 1600 && year < 1700;
          case "18th":
            return year >= 1700 && year < 1800;
          case "19th":
            return year >= 1800 && year < 1900;
          case "20th":
            return year >= 1900 && year < 2000;
          default:
            return true;
        }
      });
    }

    // Sort
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case "followers":
        filtered.sort((a, b) => b.followers - a.followers);
        break;
      case "works":
        filtered.sort((a, b) => b.works - a.works);
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            parseInt(b.era.split("-")[0]) - parseInt(a.era.split("-")[0]),
        );
        break;
      default:
        break;
    }

    setFilteredPoets(filtered);
  }, [searchTerm, selectedCountry, selectedEra, sortBy, poets]);

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

  // Navigation handler
  const navigateToPoet = useCallback(
    (slug) => {
      window.location.href = `/${lang}/poets/${slug}`;
    },
    [lang],
  );

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
              {t("poets") || "Poets"}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2 ml-11">
            {t("poetsDescription") ||
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
                  t("searchPoets") ||
                  "Search poets by name, country, or style..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              {/* Country Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("country") || "Country"}
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country === "all"
                        ? t("allCountries") || "All Countries"
                        : country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Era Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("era") || "Era"}
                </label>
                <select
                  value={selectedEra}
                  onChange={(e) => setSelectedEra(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {eras.map((era) => (
                    <option key={era.value} value={era.value}>
                      {era.value === "all"
                        ? t("allEras") || "All Eras"
                        : era.label}
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
                  <option value="popular">
                    {t("mostPopular") || "Most Popular"}
                  </option>
                  <option value="followers">
                    {t("mostFollowers") || "Most Followers"}
                  </option>
                  <option value="works">
                    {t("mostWorks") || "Most Works"}
                  </option>
                  <option value="newest">{t("newest") || "Newest"}</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Poets Grid/List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : filteredPoets.length === 0 ? (
          <div
            className={`text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border ${borderColor}`}
          >
            <FaUser className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
              {t("noPoetsFound") || "No poets found"}
            </h3>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              {t("tryDifferentSearch") ||
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
            {t("showing") || "Showing"} {filteredPoets.length}{" "}
            {t("poets") || "poets"}
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

  return (
    <div
      className={`group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
      onClick={() => onNavigate(poet.slug)}
      role="article"
      aria-label={`Poet: ${poet.name}`}
    >
      {/* Featured Badge */}
      {poet.featured && (
        <div className="flex justify-end mb-2">
          <span
            className={`px-2 py-1 text-xs font-medium text-white bg-gradient-to-r ${gradient} rounded-full`}
          >
            <FaStar className="inline mr-1" size={10} />
            {t("featured") || "Featured"}
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
              alt={poet.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <FaUser />
          )}
        </div>
      </div>

      {/* Name */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors text-center">
        {poet.name}
      </h3>

      {/* Country and Era */}
      <div className="flex items-center justify-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <FaGlobe size={12} />
          {poet.country}
        </span>
        <span className="flex items-center gap-1">
          <FaClock size={12} />
          {poet.era}
        </span>
      </div>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {poet.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className={`px-2 py-1 text-xs rounded-full ${hoverBg} ${textColor}`}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Bio */}
      <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 text-center">
        {poet.bio}
      </p>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <FaHeart className={textColor} size={14} />
          {poet.likes}
        </span>
        <span className="flex items-center gap-1">
          <FaUsers size={14} />
          {poet.followers}
        </span>
        <span className="flex items-center gap-1">
          <FaBookOpen size={14} />
          {poet.works}
        </span>
      </div>

      {/* Explore Button */}
      <div className="mt-4 text-center">
        <span
          className={`inline-flex items-center gap-2 ${textColor} font-medium group-hover:gap-3 transition-all`}
        >
          {t("explore") || "Explore"}
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

  return (
    <div
      className={`group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${borderColor} hover:shadow-xl transition-all duration-300 cursor-pointer`}
      onClick={() => onNavigate(poet.slug)}
      role="article"
      aria-label={`Poet: ${poet.name}`}
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
                alt={poet.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <FaUser />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {poet.name}
              </h3>
              {poet.featured && (
                <span
                  className={`px-2 py-0.5 text-xs font-medium text-white bg-gradient-to-r ${gradient} rounded-full`}
                >
                  <FaStar className="inline mr-1" size={8} />
                  {t("featured") || "Featured"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <FaGlobe size={12} />
                {poet.country}
              </span>
              <span className="flex items-center gap-1">
                <FaClock size={12} />
                {poet.era}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap gap-1">
              {poet.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className={`px-1.5 py-0.5 text-xs rounded-full ${hoverBg} ${textColor}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 flex-1">
          {poet.bio}
        </p>

        {/* Stats */}
        <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <FaHeart className={textColor} size={14} />
            {poet.likes}
          </span>
          <span className="flex items-center gap-1">
            <FaUsers size={14} />
            {poet.followers}
          </span>
          <span className="flex items-center gap-1">
            <FaBookOpen size={14} />
            {poet.works}
          </span>
          <span
            className={`${textColor} font-medium group-hover:translate-x-1 transition-transform`}
          >
            {t("explore") || "Explore"} →
          </span>
        </div>
      </div>
    </div>
  );
}
