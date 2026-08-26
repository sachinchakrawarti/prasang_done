// src/components/homepages/LiteraryCategories.jsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FaBook,
  FaPenFancy,
  FaHeart,
  FaHistory,
  FaAward,
  FaBlog,
  FaQuestionCircle,
  FaPenNib,
  FaFeatherAlt,
  FaArrowRight,
  FaStar,
  FaGlobe,
  FaUsers,
  FaComments,
  FaLeaf,
  FaMoon,
  FaSun,
  FaTree,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

const LiteraryCategories = () => {
  const params = useParams();
  const lang = params?.lang || "en";
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const categories = [
    {
      nameKey: "classicLiterature",
      name: "Classic Literature",
      icon: FaHistory,
      descriptionKey: "classicLiteratureDesc",
      description:
        "Explore timeless works from literary masters across centuries",
      link: "/poems/classics",
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-800",
      hoverBorderColor: "hover:border-amber-300 dark:hover:border-amber-700",
      count: "2,345",
    },
    {
      nameKey: "contemporaryPoetry",
      name: "Contemporary Poetry",
      icon: FaPenFancy,
      descriptionKey: "contemporaryPoetryDesc",
      description: "Discover modern voices shaping the future of poetry",
      link: "/poems/new",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      hoverBorderColor: "hover:border-blue-300 dark:hover:border-blue-700",
      count: "1,876",
    },
    {
      nameKey: "literaryCriticism",
      name: "Literary Criticism",
      icon: FaHeart,
      descriptionKey: "literaryCriticismDesc",
      description: "Deep analysis and interpretation of literary works",
      link: "/prose/criticism",
      color: "text-rose-500",
      bgColor: "bg-rose-50 dark:bg-rose-900/20",
      borderColor: "border-rose-200 dark:border-rose-800",
      hoverBorderColor: "hover:border-rose-300 dark:hover:border-rose-700",
      count: "987",
    },
    {
      nameKey: "shortStories",
      name: "Short Stories",
      icon: FaBook,
      descriptionKey: "shortStoriesDesc",
      description: "Captivating stories that pack a punch in concise form",
      link: "/prose/stories",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      hoverBorderColor: "hover:border-green-300 dark:hover:border-green-700",
      count: "1,234",
    },
    {
      nameKey: "essaysArticles",
      name: "Essays & Articles",
      icon: FaPenNib,
      descriptionKey: "essaysArticlesDesc",
      description: "Thought-provoking essays on literature, culture, and life",
      link: "/prose/essays",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      hoverBorderColor: "hover:border-purple-300 dark:hover:border-purple-700",
      count: "876",
    },
    {
      nameKey: "featuredPoets",
      name: "Featured Poets",
      icon: FaFeatherAlt,
      descriptionKey: "featuredPoetsDesc",
      description: "Meet renowned and emerging poets from around the world",
      link: "/poets/featured",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      hoverBorderColor: "hover:border-orange-300 dark:hover:border-orange-700",
      count: "543",
    },
    {
      nameKey: "memoirs",
      name: "Memoirs",
      icon: FaBook,
      descriptionKey: "memoirsDesc",
      description: "Personal narratives and life stories from diverse voices",
      link: "/prose/memoirs",
      color: "text-teal-500",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      borderColor: "border-teal-200 dark:border-teal-800",
      hoverBorderColor: "hover:border-teal-300 dark:hover:border-teal-700",
      count: "654",
    },
    {
      nameKey: "translations",
      name: "Translations",
      icon: FaGlobe,
      descriptionKey: "translationsDesc",
      description: "Poetry and prose from around the world in translation",
      link: "/translations",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      hoverBorderColor: "hover:border-indigo-300 dark:hover:border-indigo-700",
      count: "432",
    },
    {
      nameKey: "interviews",
      name: "Interviews",
      icon: FaComments,
      descriptionKey: "interviewsDesc",
      description: "In-depth conversations with poets, writers, and scholars",
      link: "/interviews",
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      borderColor: "border-pink-200 dark:border-pink-800",
      hoverBorderColor: "hover:border-pink-300 dark:hover:border-pink-700",
      count: "321",
    },
  ];

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

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div
              className={`p-3 rounded-full bg-gradient-to-r ${gradient} bg-opacity-10`}
            >
              <FaStar className={`w-6 h-6 ${textColor}`} />
            </div>
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
          >
            {t("literaryCategories") || "Literary Categories"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
            {t("categoriesDesc") ||
              "Explore different genres and forms of literature from around the world"}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={index}
                href={`/${lang}${category.link}`}
                className={`group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border ${borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${category.hoverBorderColor}`}
              >
                {/* Category Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${category.bgColor} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-7 h-7 ${category.color}`} />
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </div>

                {/* Category Name */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {t(category.nameKey) || category.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {t(category.descriptionKey) || category.description}
                </p>

                {/* Explore Link */}
                <div
                  className={`inline-flex items-center gap-2 ${textColor} font-medium group-hover:gap-3 transition-all`}
                >
                  <span>{t("explore") || "Explore"}</span>
                  <FaArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-10">
          <Link
            href={`/${lang}/categories`}
            className={`inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r ${gradient} text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all hover:scale-105`}
          >
            {t("viewAllCategories") || "View All Categories"}
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LiteraryCategories;
