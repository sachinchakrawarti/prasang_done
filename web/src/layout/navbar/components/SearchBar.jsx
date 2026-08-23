// src/public_app/layout/navbar/components/SearchBar.jsx
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useTheme } from "../../../../theme";

const SearchBar = ({ mobile = false, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, themeName } = useTheme();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setSearchQuery("");
      if (onClose) onClose();
    }
  };

  // Theme-based styling
  const getBorderColor = () => {
    switch (themeName) {
      case "forest":
        return "border-green-200 dark:border-green-800";
      case "lavender":
        return "border-purple-200 dark:border-purple-800";
      case "rose":
        return "border-rose-200 dark:border-rose-800";
      case "sepia":
        return "border-amber-300 dark:border-amber-700";
      default:
        return "border-amber-200 dark:border-amber-800";
    }
  };

  const getFocusRingColor = () => {
    switch (themeName) {
      case "forest":
        return "focus:ring-green-400 dark:focus:ring-green-600";
      case "lavender":
        return "focus:ring-purple-400 dark:focus:ring-purple-600";
      case "rose":
        return "focus:ring-rose-400 dark:focus:ring-rose-600";
      case "sepia":
        return "focus:ring-amber-500 dark:focus:ring-amber-600";
      default:
        return "focus:ring-amber-400 dark:focus:ring-amber-600";
    }
  };

  const getPlaceholderColor = () => {
    switch (themeName) {
      case "forest":
        return "placeholder:text-green-400 dark:placeholder:text-green-600";
      case "lavender":
        return "placeholder:text-purple-400 dark:placeholder:text-purple-600";
      case "rose":
        return "placeholder:text-rose-400 dark:placeholder:text-rose-600";
      case "sepia":
        return "placeholder:text-amber-600 dark:placeholder:text-amber-500";
      default:
        return "placeholder:text-amber-400 dark:placeholder:text-amber-600";
    }
  };

  const getIconColor = () => {
    switch (themeName) {
      case "forest":
        return "text-green-400 dark:text-green-600";
      case "lavender":
        return "text-purple-400 dark:text-purple-600";
      case "rose":
        return "text-rose-400 dark:text-rose-600";
      case "sepia":
        return "text-amber-600 dark:text-amber-500";
      default:
        return "text-amber-400 dark:text-amber-600";
    }
  };

  const borderColor = getBorderColor();
  const focusRingColor = getFocusRingColor();
  const placeholderColor = getPlaceholderColor();
  const iconColor = getIconColor();

  if (mobile) {
    return (
      <div className={`md:hidden py-3 border-t ${borderColor}`}>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search poems, poets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-2 pl-10 pr-4 rounded-full border ${borderColor} 
              ${theme.background.overlay} ${theme.text.primary} 
              focus:outline-none focus:ring-2 ${focusRingColor}`}
            autoFocus
          />
          <FaSearch
            className={`absolute left-3 top-3 ${iconColor}`}
            size={16}
          />
        </form>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="hidden md:block relative flex-1 max-w-md mx-4"
    >
      <input
        type="text"
        placeholder="Search poems, poets..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`w-full px-4 py-2 pl-10 pr-4 rounded-full border ${borderColor} 
          ${theme.background.overlay} ${theme.text.primary} backdrop-blur-sm
          focus:outline-none focus:ring-2 ${focusRingColor}
          ${placeholderColor}`}
      />
      <FaSearch className={`absolute left-3 top-3 ${iconColor}`} size={16} />
    </form>
  );
};

export default SearchBar;
