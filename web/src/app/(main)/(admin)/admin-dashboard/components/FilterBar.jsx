// src/app/(main)/(admin)/admin-dashboard/components/FilterBar.jsx
"use client";

import { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaSync,
  FaCalendarAlt,
  FaSort,
  FaTag,
  FaFolder,
  FaUser,
  FaGlobe,
  FaLanguage,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";

export default function FilterBar({
  filters = {},
  onFilterChange,
  onReset,
  onSearch,
  onSort,
  isLoading = false,
  searchPlaceholder = "Search...",
  showSearch = true,
  showSort = true,
  filterConfigs = [],
  sortOptions = [],
  customFilters = null,
}) {
  const { themeName } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    search: "",
    sortBy: "newest",
    sortOrder: "desc",
    ...filters,
  });
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters((prev) => ({
      ...prev,
      ...filters,
    }));
  }, [filters]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    Object.entries(localFilters).forEach(([key, value]) => {
      if (key === "search" && value) count++;
      else if (key === "sortBy" && value !== "newest") count++;
      else if (key === "sortOrder" && value !== "desc") count++;
      else if (
        value &&
        value !== "" &&
        value !== "all" &&
        value !== "all" &&
        key !== "search" &&
        key !== "sortBy" &&
        key !== "sortOrder"
      ) {
        count++;
      }
    });
    setActiveFilterCount(count);
  }, [localFilters]);

  // Handle filter change
  const handleChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  // Handle search
  const handleSearch = (value) => {
    handleChange("search", value);
    onSearch?.(value);
  };

  // Handle sort
  const handleSort = (value) => {
    handleChange("sortBy", value);
    onSort?.(value);
  };

  // Handle reset
  const handleReset = () => {
    const defaultFilters = {
      search: "",
      sortBy: "newest",
      sortOrder: "desc",
      ...Object.keys(localFilters).reduce((acc, key) => {
        if (!["search", "sortBy", "sortOrder"].includes(key)) {
          acc[key] = "";
        }
        return acc;
      }, {}),
    };
    setLocalFilters(defaultFilters);
    onReset?.();
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

  // Default sort options
  const defaultSortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" },
    { value: "views", label: "Most Viewed" },
    { value: "name_asc", label: "Name A-Z" },
    { value: "name_desc", label: "Name Z-A" },
  ];

  const sortOptionsList =
    sortOptions.length > 0 ? sortOptions : defaultSortOptions;

  // Get icon for filter type
  const getFilterIcon = (type) => {
    switch (type) {
      case "status":
        return <FaTag size={14} />;
      case "category":
        return <FaFolder size={14} />;
      case "poet":
        return <FaUser size={14} />;
      case "country":
        return <FaGlobe size={14} />;
      case "language":
        return <FaLanguage size={14} />;
      case "date":
        return <FaCalendarAlt size={14} />;
      default:
        return <FaFilter size={14} />;
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-4 mb-6`}
    >
      {/* Search and Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        {showSearch && (
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={localFilters.search || ""}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              disabled={isLoading}
            />
            {localFilters.search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                <FaTimes size={14} />
              </button>
            )}
          </div>
        )}

        <div className="flex gap-2">
          {/* Sort Dropdown */}
          {showSort && (
            <div className="relative">
              <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={localFilters.sortBy || "newest"}
                onChange={(e) => handleSort(e.target.value)}
                className="pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition appearance-none"
                disabled={isLoading}
              >
                {sortOptionsList.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filter Toggle Button */}
          {filterConfigs.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`px-4 py-2 rounded-lg border ${borderColor} ${hoverBg} flex items-center gap-2 transition whitespace-nowrap relative`}
              disabled={isLoading}
            >
              <FaFilter className={textColor} />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span
                  className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${gradient} text-white`}
                >
                  {activeFilterCount}
                </span>
              )}
              {isExpanded ? (
                <FaChevronUp size={12} />
              ) : (
                <FaChevronDown size={12} />
              )}
            </button>
          )}

          {/* Reset Button */}
          {activeFilterCount > 0 && (
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
      {isExpanded && filterConfigs.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filterConfigs.map((config, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                  {getFilterIcon(config.type)}
                  {config.label}
                </label>
                {config.type === "select" && (
                  <select
                    value={localFilters[config.key] || ""}
                    onChange={(e) => handleChange(config.key, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                    disabled={isLoading}
                  >
                    <option value="">{config.placeholder || "All"}</option>
                    {config.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                {config.type === "text" && (
                  <input
                    type="text"
                    value={localFilters[config.key] || ""}
                    onChange={(e) => handleChange(config.key, e.target.value)}
                    placeholder={config.placeholder || "Enter value..."}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                    disabled={isLoading}
                  />
                )}
                {config.type === "date" && (
                  <input
                    type="date"
                    value={localFilters[config.key] || ""}
                    onChange={(e) => handleChange(config.key, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                    disabled={isLoading}
                  />
                )}
                {config.type === "checkbox" && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters[config.key] || false}
                      onChange={(e) =>
                        handleChange(config.key, e.target.checked)
                      }
                      className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {config.checkboxLabel || "Enabled"}
                    </span>
                  </label>
                )}
                {config.type === "custom" &&
                  config.render &&
                  config.render(localFilters, handleChange, isLoading)}
              </div>
            ))}
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div
              className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Active filters:
                </span>
                {Object.entries(localFilters).map(([key, value]) => {
                  if (
                    !value ||
                    value === "" ||
                    key === "sortBy" ||
                    key === "sortOrder"
                  )
                    return null;
                  if (key === "search" && !value) return null;

                  // Find filter config for this key
                  const config = filterConfigs.find((c) => c.key === key);
                  const label = config?.label || key;
                  const displayValue =
                    config?.options?.find((o) => o.value === value)?.label ||
                    value;

                  return (
                    <span
                      key={key}
                      className={`px-3 py-1 text-xs rounded-full ${bgColor} ${textColor} flex items-center gap-1`}
                    >
                      {label}: {displayValue || value}
                      <button
                        onClick={() =>
                          handleChange(
                            key,
                            config?.type === "checkbox" ? false : "",
                          )
                        }
                        className="hover:text-red-500 transition"
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  );
                })}
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
