// src/app/(main)/(admin)/admin-dashboard/components/SearchBar.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaTimes,
  FaFilter,
  FaSync,
  FaChevronDown,
  FaChevronUp,
  FaSlidersH,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";

export default function SearchBar({
  value = "",
  onChange,
  onSearch,
  onClear,
  onFilterToggle,
  onRefresh,
  placeholder = "Search...",
  isLoading = false,
  showFilter = true,
  showRefresh = true,
  filterCount = 0,
  autoFocus = false,
  debounceTime = 300,
  variant = "default", // default, minimal, rounded
  size = "default", // default, small, large
  className = "",
  suggestions = [],
  onSuggestionSelect,
  recentSearches = [],
  onRecentSearchClick,
  maxRecentSearches = 5,
}) {
  const { themeName } = useTheme();
  const [searchTerm, setSearchTerm] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Sync with external value
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== value) {
        onChange?.(searchTerm);
        onSearch?.(searchTerm);
      }
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceTime, onChange, onSearch, value]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setShowRecent(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K or Cmd+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape to clear search
      if (e.key === "Escape" && isFocused) {
        handleClear();
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFocused]);

  // Handle input change
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      setShowSuggestions(true);
      setShowRecent(false);
    } else {
      setShowSuggestions(false);
      setShowRecent(recentSearches.length > 0);
    }
  };

  // Handle clear
  const handleClear = () => {
    setSearchTerm("");
    onChange?.("");
    onSearch?.("");
    onClear?.();
    setShowSuggestions(false);
    setShowRecent(false);
    inputRef.current?.focus();
  };

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    if (searchTerm.length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else if (searchTerm.length === 0 && recentSearches.length > 0) {
      setShowRecent(true);
    }
  };

  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow click
    setTimeout(() => {
      setShowSuggestions(false);
      setShowRecent(false);
    }, 200);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    const value =
      typeof suggestion === "string"
        ? suggestion
        : suggestion.value || suggestion.label;
    setSearchTerm(value);
    onChange?.(value);
    onSearch?.(value);
    onSuggestionSelect?.(suggestion);
    setShowSuggestions(false);
    setShowRecent(false);
    inputRef.current?.blur();
  };

  // Handle recent search click
  const handleRecentClick = (term) => {
    setSearchTerm(term);
    onChange?.(term);
    onSearch?.(term);
    onRecentSearchClick?.(term);
    setShowRecent(false);
    inputRef.current?.blur();
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch?.(searchTerm);
      // Add to recent searches
      const updatedRecent = [
        searchTerm,
        ...recentSearches.filter((s) => s !== searchTerm),
      ].slice(0, maxRecentSearches);
      // You might want to save this to localStorage or state
      console.log("Recent searches:", updatedRecent);
    }
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

  const textColor = getTextColor();
  const gradient = getGradient();
  const borderColor = getBorderColor();
  const hoverBg = getHoverBg();

  // Size classes
  const sizeClasses = {
    small: "py-1.5 text-sm",
    default: "py-2 text-base",
    large: "py-3 text-lg",
  };

  // Variant classes
  const variantClasses = {
    default: "rounded-lg",
    minimal: "rounded-none border-0 border-b-2",
    rounded: "rounded-full",
  };

  // Size padding
  const paddingClasses = {
    small: "pl-8 pr-16",
    default: "pl-10 pr-20",
    large: "pl-12 pr-24",
  };

  const buttonPadding = {
    small: "px-3 py-1.5",
    default: "px-4 py-2",
    large: "px-5 py-2.5",
  };

  const iconSize = {
    small: 14,
    default: 16,
    large: 18,
  };

  return (
    <div className={`relative ${className}`} ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Icon */}
        <FaSearch
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors ${
            isFocused ? textColor : ""
          }`}
          size={iconSize[size]}
        />

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`
            w-full ${paddingClasses[size]} ${sizeClasses[size]} ${variantClasses[variant]}
            border ${borderColor} bg-white dark:bg-gray-800
            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
            transition-all duration-200
            ${isFocused ? "shadow-md" : ""}
            ${searchTerm ? "pr-24" : "pr-12"}
          `}
          disabled={isLoading}
          aria-label={placeholder}
        />

        {/* Action Buttons */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {/* Clear Button */}
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className={`p-1 rounded-full ${hoverBg} text-gray-400 hover:text-red-500 transition-colors`}
              aria-label="Clear search"
              disabled={isLoading}
            >
              <FaTimes size={iconSize[size] - 2} />
            </button>
          )}

          {/* Filter Button */}
          {showFilter && (
            <button
              type="button"
              onClick={onFilterToggle}
              className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-amber-500 transition-colors relative`}
              aria-label="Toggle filters"
              disabled={isLoading}
            >
              <FaSlidersH size={iconSize[size] - 2} />
              {filterCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold text-white bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center`}
                >
                  {filterCount}
                </span>
              )}
            </button>
          )}

          {/* Refresh Button */}
          {showRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-blue-500 transition-colors ${isLoading ? "animate-spin" : ""}`}
              aria-label="Refresh"
              disabled={isLoading}
            >
              <FaSync size={iconSize[size] - 2} />
            </button>
          )}
        </div>

        {/* Keyboard shortcut hint */}
        {!searchTerm && !isFocused && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 hidden sm:block">
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400 text-xs border border-gray-300 dark:border-gray-600">
              Ctrl+K
            </kbd>
          </div>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {(showSuggestions || showRecent) && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50">
          <div
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl border ${borderColor} max-h-64 overflow-y-auto`}
          >
            {/* Recent Searches */}
            {showRecent && recentSearches.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <span>Recent Searches</span>
                  <button
                    onClick={() => {
                      // Clear recent searches
                      console.log("Clear recent searches");
                    }}
                    className="text-amber-500 hover:text-amber-600 transition"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentClick(term)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2"
                  >
                    <FaSearch size={12} className="text-gray-400" />
                    {term}
                  </button>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div>
                {showRecent && recentSearches.length > 0 && (
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    Suggestions
                  </div>
                )}
                {suggestions.map((suggestion, index) => {
                  const label =
                    typeof suggestion === "string"
                      ? suggestion
                      : suggestion.label || suggestion.value;
                  const value =
                    typeof suggestion === "string"
                      ? suggestion
                      : suggestion.value || suggestion.label;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2"
                    >
                      <FaSearch size={12} className="text-gray-400" />
                      <span
                        dangerouslySetInnerHTML={{
                          __html: label.replace(
                            new RegExp(searchTerm, "gi"),
                            (match) =>
                              `<strong class="text-amber-500">${match}</strong>`,
                          ),
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
