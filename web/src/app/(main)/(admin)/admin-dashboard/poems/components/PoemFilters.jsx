// src/app/(main)/(admin)/admin-dashboard/poems/components/PoemFilters.jsx
"use client";

import { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaCalendarAlt,
  FaLanguage,
  FaUser,
  FaFolder,
  FaTags,
  FaSync,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";

export default function PoemFilters({
  filters,
  onFilterChange,
  onReset,
  poets = [],
  categories = [],
  tags = [],
  isLoading = false,
}) {
  const { themeName } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    search: "",
    status: "all",
    language: "all",
    poetId: "",
    categoryId: "",
    tag: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "newest",
    ...filters,
  });

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters((prev) => ({
      ...prev,
      ...filters,
    }));
  }, [filters]);

  // Handle filter change
  const handleChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  // Handle reset
  const handleReset = () => {
    const defaultFilters = {
      search: "",
      status: "all",
      language: "all",
      poetId: "",
      categoryId: "",
      tag: "",
      dateFrom: "",
      dateTo: "",
      sortBy: "newest",
    };
    setLocalFilters(defaultFilters);
    onReset?.();
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.search) count++;
    if (localFilters.status !== "all") count++;
    if (localFilters.language !== "all") count++;
    if (localFilters.poetId) count++;
    if (localFilters.categoryId) count++;
    if (localFilters.tag) count++;
    if (localFilters.dateFrom) count++;
    if (localFilters.dateTo) count++;
    return count;
  };

  // Theme styles
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

  const getBgColor = () => {
    switch (themeName) {
      case "forest":
        return "bg-green-50 dark:bg-green-900/20";
      case "lavender":
        return "bg-purple-50 dark:bg-purple-900/20";
      case "rose":
        return "bg-rose-50 dark:bg-rose-900/20";
      case "sepia":
        return "bg-amber-50 dark:bg-amber-900/20";
      default:
        return "bg-amber-50 dark:bg-amber-900/20";
    }
  };

  const textColor = getTextColor();
  const gradient = getGradient();
  const borderColor = getBorderColor();
  const hoverBg = getHoverBg();
  const bgColor = getBgColor();

  const activeCount = getActiveFilterCount();

  // Language options
  const languageOptions = [
    { value: "all", label: "All Languages" },
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "ur", label: "Urdu" },
    { value: "ar", label: "Arabic" },
    { value: "fr", label: "French" },
    { value: "es", label: "Spanish" },
    { value: "de", label: "German" },
    { value: "ru", label: "Russian" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
  ];

  // Status options
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
  ];

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" },
    { value: "views", label: "Most Viewed" },
    { value: "title_asc", label: "Title A-Z" },
    { value: "title_desc", label: "Title Z-A" },
  ];

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-4 mb-6`}
    >
      {/* Search Bar - Always Visible */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={localFilters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            placeholder="Search poems by title, content, or description..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            disabled={isLoading}
          />
          {localFilters.search && (
            <button
              onClick={() => handleChange("search", "")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <FaTimes size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {/* Filter Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-4 py-2 rounded-lg border ${borderColor} ${hoverBg} flex items-center gap-2 transition whitespace-nowrap relative`}
            disabled={isLoading}
          >
            <FaFilter className={textColor} />
            <span className="hidden sm:inline">Filters</span>
            {activeCount > 0 && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${gradient} text-white`}
              >
                {activeCount}
              </span>
            )}
            {isExpanded ? (
              <FaChevronUp size={12} />
            ) : (
              <FaChevronDown size={12} />
            )}
          </button>

          {/* Reset Button */}
          {activeCount > 0 && (
            <button
              onClick={handleReset}
              className={`px-4 py-2 rounded-lg border ${borderColor} ${hoverBg} text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition flex items-center gap-2`}
              disabled={isLoading}
            >
              <FaSync size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={localFilters.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                disabled={isLoading}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaLanguage className="inline mr-1" size={12} />
                Language
              </label>
              <select
                value={localFilters.language}
                onChange={(e) => handleChange("language", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                disabled={isLoading}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Poet Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaUser className="inline mr-1" size={12} />
                Poet
              </label>
              <select
                value={localFilters.poetId}
                onChange={(e) => handleChange("poetId", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                disabled={isLoading}
              >
                <option value="">All Poets</option>
                {poets.map((poet) => (
                  <option key={poet.id} value={poet.id}>
                    {poet.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaFolder className="inline mr-1" size={12} />
                Category
              </label>
              <select
                value={localFilters.categoryId}
                onChange={(e) => handleChange("categoryId", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                disabled={isLoading}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaTags className="inline mr-1" size={12} />
                Tag
              </label>
              <select
                value={localFilters.tag}
                onChange={(e) => handleChange("tag", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                disabled={isLoading}
              >
                <option value="">All Tags</option>
                {tags.map((tag) => {
                  const tagName =
                    typeof tag === "string" ? tag : tag?.name || "";
                  return (
                    <option key={tagName} value={tagName}>
                      #{tagName}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaCalendarAlt className="inline mr-1" size={12} />
                Date From
              </label>
              <input
                type="date"
                value={localFilters.dateFrom}
                onChange={(e) => handleChange("dateFrom", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                disabled={isLoading}
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaCalendarAlt className="inline mr-1" size={12} />
                Date To
              </label>
              <input
                type="date"
                value={localFilters.dateTo}
                onChange={(e) => handleChange("dateTo", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                disabled={isLoading}
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                value={localFilters.sortBy}
                onChange={(e) => handleChange("sortBy", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                disabled={isLoading}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeCount > 0 && (
            <div
              className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Active filters:
                </span>
                {localFilters.search && (
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${bgColor} ${textColor} flex items-center gap-1`}
                  >
                    Search: "{localFilters.search}"
                    <button
                      onClick={() => handleChange("search", "")}
                      className="hover:text-red-500 transition"
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                )}
                {localFilters.status !== "all" && (
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${bgColor} ${textColor} flex items-center gap-1`}
                  >
                    Status: {localFilters.status}
                    <button
                      onClick={() => handleChange("status", "all")}
                      className="hover:text-red-500 transition"
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                )}
                {localFilters.language !== "all" && (
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${bgColor} ${textColor} flex items-center gap-1`}
                  >
                    Language: {localFilters.language.toUpperCase()}
                    <button
                      onClick={() => handleChange("language", "all")}
                      className="hover:text-red-500 transition"
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                )}
                {localFilters.poetId && (
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${bgColor} ${textColor} flex items-center gap-1`}
                  >
                    Poet:{" "}
                    {poets.find((p) => p.id === parseInt(localFilters.poetId))
                      ?.name || "Unknown"}
                    <button
                      onClick={() => handleChange("poetId", "")}
                      className="hover:text-red-500 transition"
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                )}
                {localFilters.categoryId && (
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${bgColor} ${textColor} flex items-center gap-1`}
                  >
                    Category:{" "}
                    {categories.find(
                      (c) => c.id === parseInt(localFilters.categoryId),
                    )?.name || "Unknown"}
                    <button
                      onClick={() => handleChange("categoryId", "")}
                      className="hover:text-red-500 transition"
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                )}
                {localFilters.tag && (
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${bgColor} ${textColor} flex items-center gap-1`}
                  >
                    Tag: #{localFilters.tag}
                    <button
                      onClick={() => handleChange("tag", "")}
                      className="hover:text-red-500 transition"
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                )}
                {localFilters.dateFrom && (
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${bgColor} ${textColor} flex items-center gap-1`}
                  >
                    From: {new Date(localFilters.dateFrom).toLocaleDateString()}
                    <button
                      onClick={() => handleChange("dateFrom", "")}
                      className="hover:text-red-500 transition"
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                )}
                {localFilters.dateTo && (
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${bgColor} ${textColor} flex items-center gap-1`}
                  >
                    To: {new Date(localFilters.dateTo).toLocaleDateString()}
                    <button
                      onClick={() => handleChange("dateTo", "")}
                      className="hover:text-red-500 transition"
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleReset}
                  className="text-sm text-red-500 hover:text-red-700 transition"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
