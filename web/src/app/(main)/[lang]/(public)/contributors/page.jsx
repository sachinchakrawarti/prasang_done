// src/app/(main)/[lang]/(public)/contributors/page.jsx
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
  FaFeatherAlt,
  FaPenFancy,
  FaUsers,
  FaUserGraduate,
  FaUserEdit,
  FaComment,
  FaLanguage,
  FaCrown,
  FaLinkedin,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

// Sample contributors data (replace with actual data from your API)
const sampleContributors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    slug: "sarah-johnson",
    role: "Scholar",
    country: "USA",
    bio: "Professor of Comparative Literature at Harvard University. Specializes in cross-cultural poetic traditions.",
    contributions: 45,
    likes: 1234,
    followers: 5678,
    featured: true,
    tags: ["comparative", "scholar", "harvard"],
    social: {
      twitter: "@sarahjohnson",
      instagram: "@drsarahjohnson",
      linkedin: "sarah-johnson",
    },
  },
  {
    id: 2,
    name: "Mohammed Al-Rashid",
    slug: "mohammed-al-rashid",
    role: "Translator",
    country: "Egypt",
    bio: "Award-winning translator of Arabic poetry into English. Has translated works of 50+ poets.",
    contributions: 89,
    likes: 987,
    followers: 4321,
    featured: true,
    tags: ["translator", "arabic", "award"],
    social: {
      twitter: "@alrashid",
      instagram: "@mohammed_alrashid",
      linkedin: "mohammed-al-rashid",
    },
  },
  {
    id: 3,
    name: "Priya Sharma",
    slug: "priya-sharma",
    role: "Editor",
    country: "India",
    bio: "Senior editor at Prasang. Passionate about promoting contemporary poetry from South Asia.",
    contributions: 67,
    likes: 876,
    followers: 3456,
    featured: false,
    tags: ["editor", "southasia", "contemporary"],
    social: {
      twitter: "@priyasharma",
      instagram: "@priya_editor",
      linkedin: "priya-sharma",
    },
  },
  {
    id: 4,
    name: "James Morrison",
    slug: "james-morrison",
    role: "Commentator",
    country: "UK",
    bio: "Literary critic and commentator. Writes extensively on modern poetry and its cultural impact.",
    contributions: 34,
    likes: 765,
    followers: 2987,
    featured: false,
    tags: ["critic", "modern", "commentator"],
    social: {
      twitter: "@jamesmorrison",
      instagram: "@james_literary",
      linkedin: "james-morrison",
    },
  },
  {
    id: 5,
    name: "Chen Wei",
    slug: "chen-wei",
    role: "Scholar",
    country: "China",
    bio: "Scholar of classical Chinese poetry. Has published extensively on Tang dynasty poets.",
    contributions: 56,
    likes: 654,
    followers: 2345,
    featured: false,
    tags: ["chinese", "classical", "tang"],
    social: {
      twitter: "@chenwei",
      instagram: "@chen_wei_poetry",
    },
  },
  {
    id: 6,
    name: "Aisha Khan",
    slug: "aisha-khan",
    role: "Translator",
    country: "Pakistan",
    bio: "Translates Urdu poetry into English and other languages. Focuses on contemporary Urdu poets.",
    contributions: 78,
    likes: 543,
    followers: 1987,
    featured: false,
    tags: ["urdu", "translator", "contemporary"],
    social: {
      twitter: "@aishakhan",
      instagram: "@aisha_translates",
    },
  },
];

const roleIcons = {
  Scholar: FaUserGraduate,
  Translator: FaLanguage,
  Editor: FaUserEdit,
  Commentator: FaComment,
};

const roleColors = {
  Scholar: "text-purple-500",
  Translator: "text-blue-500",
  Editor: "text-green-500",
  Commentator: "text-rose-500",
};

const roleBgColors = {
  Scholar: "bg-purple-50 dark:bg-purple-900/20",
  Translator: "bg-blue-50 dark:bg-blue-900/20",
  Editor: "bg-green-50 dark:bg-green-900/20",
  Commentator: "bg-rose-50 dark:bg-rose-900/20",
};

export default function ContributorsPage() {
  const params = useParams();
  const lang = params?.lang || "en";
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [contributors, setContributors] = useState(sampleContributors);
  const [filteredContributors, setFilteredContributors] =
    useState(sampleContributors);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [isLoading, setIsLoading] = useState(false);

  // Get unique roles and countries for filters
  const roles = useMemo(
    () => ["all", ...new Set(contributors.map((c) => c.role))],
    [contributors],
  );
  const countries = useMemo(
    () => ["all", ...new Set(contributors.map((c) => c.country))],
    [contributors],
  );

  // Filter contributors based on search and filters
  useEffect(() => {
    let filtered = contributors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (contributor) =>
          contributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contributor.country
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          contributor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contributor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contributor.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Role filter
    if (selectedRole !== "all") {
      filtered = filtered.filter(
        (contributor) => contributor.role === selectedRole,
      );
    }

    // Country filter
    if (selectedCountry !== "all") {
      filtered = filtered.filter(
        (contributor) => contributor.country === selectedCountry,
      );
    }

    // Sort
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case "contributions":
        filtered.sort((a, b) => b.contributions - a.contributions);
        break;
      case "followers":
        filtered.sort((a, b) => b.followers - a.followers);
        break;
      default:
        break;
    }

    setFilteredContributors(filtered);
  }, [searchTerm, selectedRole, selectedCountry, sortBy, contributors]);

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
  const navigateToContributor = useCallback(
    (slug) => {
      window.location.href = `/${lang}/contributors/${slug}`;
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
              {t("contributors") || "Contributors"}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2 ml-11">
            {t("contributorsDescription") ||
              "Meet the scholars, translators, editors, and commentators who enrich our literary community"}
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
                  t("searchContributors") ||
                  "Search by name, role, or specialty..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${borderColor} bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
                aria-label="Search contributors"
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
              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("role") || "Role"}
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role === "all" ? t("allRoles") || "All Roles" : role}
                    </option>
                  ))}
                </select>
              </div>

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
                  <option value="contributions">
                    {t("mostContributions") || "Most Contributions"}
                  </option>
                  <option value="followers">
                    {t("mostFollowers") || "Most Followers"}
                  </option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Contributors Grid/List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : filteredContributors.length === 0 ? (
          <div
            className={`text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border ${borderColor}`}
          >
            <FaUsers className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
              {t("noContributorsFound") || "No contributors found"}
            </h3>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              {t("tryDifferentSearch") ||
                "Try adjusting your search or filters"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContributors.map((contributor) => (
              <ContributorCard
                key={contributor.id}
                contributor={contributor}
                lang={lang}
                textColor={textColor}
                gradient={gradient}
                borderColor={borderColor}
                hoverBg={hoverBg}
                onNavigate={navigateToContributor}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContributors.map((contributor) => (
              <ContributorListItem
                key={contributor.id}
                contributor={contributor}
                lang={lang}
                textColor={textColor}
                gradient={gradient}
                borderColor={borderColor}
                hoverBg={hoverBg}
                onNavigate={navigateToContributor}
              />
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredContributors.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {t("showing") || "Showing"} {filteredContributors.length}{" "}
            {t("contributors") || "contributors"}
          </div>
        )}
      </div>
    </div>
  );
}

// Contributor Card Component (Grid View)
function ContributorCard({
  contributor,
  lang,
  textColor,
  gradient,
  borderColor,
  hoverBg,
  onNavigate,
}) {
  const { t } = useTranslation();
  const RoleIcon = roleIcons[contributor.role] || FaUser;
  const roleColor = roleColors[contributor.role] || textColor;
  const roleBg = roleBgColors[contributor.role] || hoverBg;

  return (
    <div
      className={`group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
      onClick={() => onNavigate(contributor.slug)}
      role="article"
      aria-label={`Contributor: ${contributor.name}`}
    >
      {/* Featured Badge */}
      {contributor.featured && (
        <div className="flex justify-end mb-2">
          <span
            className={`px-2 py-1 text-xs font-medium text-white bg-gradient-to-r ${gradient} rounded-full`}
          >
            <FaCrown className="inline mr-1" size={10} />
            {t("featured") || "Featured"}
          </span>
        </div>
      )}

      {/* Role Badge */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg ${roleBg}`}>
          <RoleIcon className={`${roleColor}`} size={16} />
        </div>
        <span className={`text-sm font-medium ${roleColor}`}>
          {contributor.role}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
        {contributor.name}
      </h3>

      {/* Country */}
      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
        <FaGlobe size={12} />
        <span>{contributor.country}</span>
      </div>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-2">
        {contributor.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className={`px-2 py-1 text-xs rounded-full ${hoverBg} ${textColor}`}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Bio */}
      <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
        {contributor.bio}
      </p>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <FaHeart className={textColor} size={14} />
            {contributor.likes}
          </span>
          <span className="flex items-center gap-1">
            <FaUsers size={14} />
            {contributor.followers}
          </span>
          <span className="flex items-center gap-1">
            <FaBookOpen size={14} />
            {contributor.contributions}
          </span>
        </div>
        <span
          className={`${textColor} font-medium group-hover:translate-x-1 transition-transform`}
        >
          {t("explore") || "Explore"} →
        </span>
      </div>
    </div>
  );
}

// Contributor List Item Component (List View)
function ContributorListItem({
  contributor,
  lang,
  textColor,
  gradient,
  borderColor,
  hoverBg,
  onNavigate,
}) {
  const { t } = useTranslation();
  const RoleIcon = roleIcons[contributor.role] || FaUser;
  const roleColor = roleColors[contributor.role] || textColor;
  const roleBg = roleBgColors[contributor.role] || hoverBg;

  return (
    <div
      className={`group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${borderColor} hover:shadow-xl transition-all duration-300 cursor-pointer`}
      onClick={() => onNavigate(contributor.slug)}
      role="article"
      aria-label={`Contributor: ${contributor.name}`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            {contributor.featured && (
              <span
                className={`px-2 py-0.5 text-xs font-medium text-white bg-gradient-to-r ${gradient} rounded-full`}
              >
                <FaCrown className="inline mr-1" size={8} />
                {t("featured") || "Featured"}
              </span>
            )}
            <span
              className={`flex items-center gap-1 text-sm font-medium ${roleColor}`}
            >
              <div className={`p-0.5 rounded ${roleBg}`}>
                <RoleIcon size={12} />
              </div>
              {contributor.role}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <FaGlobe size={10} />
              {contributor.country}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {contributor.name}
          </h3>

          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
            {contributor.bio}
          </p>

          {/* Tags */}
          <div className="mt-2 flex flex-wrap gap-2">
            {contributor.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-0.5 text-xs rounded-full ${hoverBg} ${textColor}`}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <FaHeart className={textColor} size={14} />
            {contributor.likes}
          </span>
          <span className="flex items-center gap-1">
            <FaUsers size={14} />
            {contributor.followers}
          </span>
          <span className="flex items-center gap-1">
            <FaBookOpen size={14} />
            {contributor.contributions}
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
