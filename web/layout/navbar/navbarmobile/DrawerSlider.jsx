// src/public_app/layout/navbar/components/DrawerSlider.jsx
import { Link, NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useTheme } from "../../../../theme";

const DrawerSlider = ({ isOpen, onClose, title = "Menu", children }) => {
  const { theme, themeName } = useTheme();

  // Theme-based helper functions
  const getDrawerGradient = () => {
    switch (themeName) {
      case "forest":
        return "from-green-50 to-white";
      case "lavender":
        return "from-purple-50 to-white";
      case "rose":
        return "from-rose-50 to-white";
      case "sepia":
        return "from-amber-100 to-amber-50";
      case "dark":
        return "from-gray-800 to-gray-900";
      default:
        return "from-amber-50 to-white";
    }
  };

  const getHeaderGradient = () => {
    switch (themeName) {
      case "forest":
        return "from-green-100 to-emerald-100";
      case "lavender":
        return "from-purple-100 to-pink-100";
      case "rose":
        return "from-rose-100 to-pink-100";
      case "sepia":
        return "from-amber-200 to-yellow-200";
      case "dark":
        return "from-gray-700 to-gray-600";
      default:
        return "from-amber-100 to-yellow-100";
    }
  };

  const getFooterGradient = () => {
    switch (themeName) {
      case "forest":
        return "from-green-50 to-emerald-50";
      case "lavender":
        return "from-purple-50 to-pink-50";
      case "rose":
        return "from-rose-50 to-pink-50";
      case "sepia":
        return "from-amber-100 to-yellow-100";
      case "dark":
        return "from-gray-800 to-gray-700";
      default:
        return "from-amber-50 to-yellow-50";
    }
  };

  const getBorderColor = () => {
    switch (themeName) {
      case "forest":
        return "border-green-200";
      case "lavender":
        return "border-purple-200";
      case "rose":
        return "border-rose-200";
      case "sepia":
        return "border-amber-300";
      case "dark":
        return "border-gray-700";
      default:
        return "border-amber-200";
    }
  };

  const getTitleColor = () => {
    switch (themeName) {
      case "forest":
        return "text-green-800";
      case "lavender":
        return "text-purple-800";
      case "rose":
        return "text-rose-800";
      case "sepia":
        return "text-amber-800";
      case "dark":
        return "text-amber-400";
      default:
        return "text-amber-800";
    }
  };

  const getCloseButtonColor = () => {
    switch (themeName) {
      case "forest":
        return "text-green-600 hover:bg-green-200";
      case "lavender":
        return "text-purple-600 hover:bg-purple-200";
      case "rose":
        return "text-rose-600 hover:bg-rose-200";
      case "sepia":
        return "text-amber-600 hover:bg-amber-200";
      case "dark":
        return "text-amber-400 hover:bg-gray-600";
      default:
        return "text-amber-600 hover:bg-amber-200";
    }
  };

  const getFooterTextColor = () => {
    switch (themeName) {
      case "forest":
        return "text-green-600";
      case "lavender":
        return "text-purple-600";
      case "rose":
        return "text-rose-600";
      case "sepia":
        return "text-amber-600";
      case "dark":
        return "text-amber-400";
      default:
        return "text-amber-600";
    }
  };

  const drawerGradient = getDrawerGradient();
  const headerGradient = getHeaderGradient();
  const footerGradient = getFooterGradient();
  const borderColor = getBorderColor();
  const titleColor = getTitleColor();
  const closeButtonColor = getCloseButtonColor();
  const footerTextColor = getFooterTextColor();

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`absolute left-0 top-0 h-full w-80 bg-gradient-to-b ${drawerGradient} shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div
            className={`sticky top-0 bg-gradient-to-r ${headerGradient} p-4 border-b ${borderColor}`}
          >
            <div className="flex justify-between items-center">
              <h2 className={`text-lg font-semibold ${titleColor}`}>{title}</h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-full transition-all ${closeButtonColor}`}
                aria-label="Close menu"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">{children}</div>

          {/* Footer */}
          <div
            className={`sticky bottom-0 bg-gradient-to-r ${footerGradient} p-4 border-t ${borderColor} text-center text-xs ${footerTextColor}`}
          >
            <p>© 2024 Prasang Poetry</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawerSlider;
