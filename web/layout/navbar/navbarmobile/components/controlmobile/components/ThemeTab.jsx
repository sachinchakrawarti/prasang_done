// src/public_app/layout/navbar/navbarmobile/components/controlmobile/components/ThemeTab.jsx
import { FaCheck } from "react-icons/fa";
import { useTheme } from "../../../../../../../theme";

const themeConfig = {
  light: {
    name: "Light",
    icon: "☀️",
    gradient: "from-amber-400 to-yellow-400",
    bg: "bg-amber-50",
    border: "border-amber-200",
    accent: "text-amber-600",
    description: "Bright and warm",
  },
  dark: {
    name: "Dark",
    icon: "🌙",
    gradient: "from-gray-700 to-gray-900",
    bg: "bg-gray-800",
    border: "border-gray-700",
    accent: "text-amber-400",
    description: "Easy on eyes",
  },
  forest: {
    name: "Forest",
    icon: "🌲",
    gradient: "from-green-500 to-emerald-600",
    bg: "bg-green-50",
    border: "border-green-200",
    accent: "text-green-600",
    description: "Natural and calm",
  },
  lavender: {
    name: "Lavender",
    icon: "🌸",
    gradient: "from-purple-400 to-pink-400",
    bg: "bg-purple-50",
    border: "border-purple-200",
    accent: "text-purple-600",
    description: "Soft and elegant",
  },
  rose: {
    name: "Rose",
    icon: "🌹",
    gradient: "from-rose-400 to-pink-500",
    bg: "bg-rose-50",
    border: "border-rose-200",
    accent: "text-rose-600",
    description: "Romantic and warm",
  },
  sepia: {
    name: "Sepia",
    icon: "📜",
    gradient: "from-amber-600 to-yellow-700",
    bg: "bg-amber-100",
    border: "border-amber-300",
    accent: "text-amber-700",
    description: "Vintage charm",
  },
};

const ThemeTab = () => {
  const { themeName, setTheme } = useTheme();

  return (
    <div className="space-y-3">
      {Object.entries(themeConfig).map(([key, themeOption]) => {
        const isActive = themeName === key;

        return (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={`w-full p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
              isActive
                ? `border-${themeOption.color || "amber"}-500 ${themeOption.bg}`
                : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            }`}
          >
            {/* Theme preview circle */}
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${themeOption.gradient} flex items-center justify-center text-white text-lg shadow-sm flex-shrink-0`}
            >
              {themeOption.icon}
            </div>

            {/* Theme info */}
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span
                  className={`font-medium ${
                    isActive
                      ? themeOption.accent
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {themeOption.name}
                </span>
                {isActive && (
                  <FaCheck className={themeOption.accent} size={14} />
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {themeOption.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeTab;
