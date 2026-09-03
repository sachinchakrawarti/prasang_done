// src/app/(main)/(admin)/admin-dashboard/poets/components/PoetFilters.jsx
"use client";

import { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaGlobe,
  FaCalendarAlt,
  FaUser,
  FaTags,
  FaSync,
  FaSort,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";

export default function PoetFilters({
  filters,
  onFilterChange,
  onReset,
  isLoading = false,
}) {
  const { themeName } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    search: "",
    status: "all",
    country: "all",
    era: "all",
    sortBy: "popular",
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
      country: "all",
      era: "all",
      sortBy: "popular",
    };
    setLocalFilters(defaultFilters);
    onReset?.();
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.search) count++;
    if (localFilters.status !== "all") count++;
    if (localFilters.country !== "all") count++;
    if (localFilters.era !== "all") count++;
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

  // Status options
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "deceased", label: "Deceased" },
  ];

  // Sort options
  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "followers", label: "Most Followers" },
    { value: "works", label: "Most Works" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "name_asc", label: "Name A-Z" },
    { value: "name_desc", label: "Name Z-A" },
  ];

  // Common countries (you can expand this list)
  const countryOptions = [
    { value: "all", label: "All Countries" },
    { value: "India", label: "India" },
    { value: "England", label: "England" },
    { value: "Pakistan", label: "Pakistan" },
    { value: "USA", label: "United States" },
    { value: "Chile", label: "Chile" },
    { value: "Germany", label: "Germany" },
    { value: "France", label: "France" },
    { value: "Russia", label: "Russia" },
    { value: "China", label: "China" },
    { value: "Japan", label: "Japan" },
    { value: "Brazil", label: "Brazil" },
    { value: "Nigeria", label: "Nigeria" },
    { value: "South Africa", label: "South Africa" },
    { value: "Australia", label: "Australia" },
    { value: "Canada", label: "Canada" },
  ];

  // Era options
  const eraOptions = [
    { value: "all", label: "All Eras" },
    { value: "16th Century", label: "16th Century" },
    { value: "17th Century", label: "17th Century" },
    { value: "18th Century", label: "18th Century" },
    { value: "19th Century", label: "19th Century" },
    { value: "20th Century", label: "20th Century" },
    { value: "21st Century", label: "21st Century" },
    { value: "Renaissance", label: "Renaissance" },
    { value: "Romantic", label: "Romantic" },
    { value: "Victorian", label: "Victorian" },
    { value: "Modern", label: "Modern" },
    { value: "Contemporary", label: "Contemporary" },
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
            placeholder="Search poets by name, country, era, or biography..."
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
                <FaUser className="inline mr-1" size={12} />
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

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaGlobe className="inline mr-1" size={12} />
                Country
              </label>
              <select
                value={localFilters.country}
                onChange={(e) => handleChange("country", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                disabled={isLoading}
              >
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Era Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaCalendarAlt className="inline mr-1" size={12} />
                Era
              </label>
              <select
                value={localFilters.era}
                onChange={(e) => handleChange("era", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                disabled={isLoading}
              >
                {eraOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaSort className="inline mr-1" size={12} />
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
                {localFilters.country !== "all" && (
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${bgColor} ${textColor} flex items-center gap-1`}
                  >
                    Country: {localFilters.country}
                    <button
                      onClick={() => handleChange("country", "all")}
                      className="hover:text-red-500 transition"
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                )}
                {localFilters.era !== "all" && (
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${bgColor} ${textColor} flex items-center gap-1`}
                  >
                    Era: {localFilters.era}
                    <button
                      onClick={() => handleChange("era", "all")}
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
