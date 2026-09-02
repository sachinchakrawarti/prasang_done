// src/app/(main)/[lang]/admin-dashboard/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaBook,
  FaUsers,
  FaTags,
  FaFolder,
  FaLanguage,
  FaPlus,
  FaEye,
  FaHeart,
  FaClock,
  FaArrowRight,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaChartLine,
  FaCalendarAlt,
  FaUserPlus,
  FaFileAlt,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import {
  fetchPoems,
  fetchPoets,
  fetchCategories,
  fetchTags,
} from "@/services/adminService";
import StatsCard from "./components/StatsCard";
import QuickAction from "./components/QuickAction";

export default function AdminDashboard() {
  const params = useParams();
  const router = useRouter();
  const lang = params?.lang || "en";
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [stats, setStats] = useState({
    poems: { total: 0, published: 0, draft: 0 },
    poets: { total: 0, active: 0, inactive: 0 },
    categories: 0,
    tags: 0,
    translations: 0,
  });
  const [recentActivity, setRecentActivity] = useState({
    poems: [],
    poets: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [poemsRes, poetsRes, categoriesRes, tagsRes] = await Promise.all([
        fetchPoems({ limit: 100, page: 1 }),
        fetchPoets({ limit: 100, page: 1 }),
        fetchCategories({ limit: 100 }),
        fetchTags({ limit: 100 }),
      ]);

      // Process poems data
      const poemsData = poemsRes.data || [];
      const publishedPoems = poemsData.filter((p) => p.status === "published");
      const draftPoems = poemsData.filter((p) => p.status === "draft");

      // Process poets data
      const poetsData = poetsRes.data || [];
      const activePoets = poetsData.filter((p) => p.status === "active");
      const inactivePoets = poetsData.filter((p) => p.status !== "active");

      // Process categories and tags
      const categoriesData = categoriesRes.data || [];
      const tagsData = tagsRes.data || [];

      // Get recent items (last 5)
      const recentPoems = poemsData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      const recentPoets = poetsData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        poems: {
          total: poemsData.length,
          published: publishedPoems.length,
          draft: draftPoems.length,
        },
        poets: {
          total: poetsData.length,
          active: activePoets.length,
          inactive: inactivePoets.length,
        },
        categories: categoriesData.length,
        tags: tagsData.length,
        translations: 0, // You'll need to fetch translations separately
      });

      setRecentActivity({
        poems: recentPoems,
        poets: recentPoets,
      });

      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadDashboardData();

    // Refresh data every 5 minutes
    const interval = setInterval(loadDashboardData, 300000);
    return () => clearInterval(interval);
  }, [loadDashboardData]);

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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            {t?.("loading") || "Loading dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {t?.("errorLoadingDashboard") || "Error Loading Dashboard"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className={`px-6 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg font-medium hover:shadow-lg transition-all`}
          >
            {t?.("retry") || "Retry"}
          </button>
        </div>
      </div>
    );
  }

  // Stats cards configuration
  const statCards = [
    {
      icon: FaBook,
      label: t?.("poems") || "Poems",
      value: stats.poems.total,
      subtitle: `${stats.poems.published} ${t?.("published") || "published"}, ${stats.poems.draft} ${t?.("draft") || "draft"}`,
      color: "blue",
      href: `/${lang}/admin-dashboard/poems`,
    },
    {
      icon: FaUsers,
      label: t?.("poets") || "Poets",
      value: stats.poets.total,
      subtitle: `${stats.poets.active} ${t?.("active") || "active"}`,
      color: "green",
      href: `/${lang}/admin-dashboard/poets`,
    },
    {
      icon: FaTags,
      label: t?.("tags") || "Tags",
      value: stats.tags,
      subtitle: t?.("totalTags") || "Total tags",
      color: "purple",
      href: `/${lang}/admin-dashboard/tags`,
    },
    {
      icon: FaFolder,
      label: t?.("categories") || "Categories",
      value: stats.categories,
      subtitle: t?.("totalCategories") || "Total categories",
      color: "orange",
      href: `/${lang}/admin-dashboard/categories`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div
        className={`p-6 rounded-2xl bg-gradient-to-r ${gradient} text-white`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {t?.("welcomeBack") || "Welcome Back, Admin!"}
            </h1>
            <p className="text-white/80 mt-1">
              {t?.("dashboardDescription") ||
                "Here's what's happening with your poetry platform today."}
            </p>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <FaClock size={14} />
            <span>
              {t?.("lastUpdated") || "Last updated"}: {lastUpdated || "N/A"}
            </span>
            <button
              onClick={loadDashboardData}
              className="ml-2 px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition"
            >
              {t?.("refresh") || "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <StatsCard
            key={index}
            icon={card.icon}
            label={card.label}
            value={card.value}
            subtitle={card.subtitle}
            color={card.color}
            gradient={gradient}
            borderColor={borderColor}
            hoverBg={hoverBg}
            href={card.href}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <QuickAction
          icon={FaPlus}
          label={t?.("addPoem") || "Add Poem"}
          href={`/${lang}/admin-dashboard/poems/new`}
          gradient={gradient}
          borderColor={borderColor}
          hoverBg={hoverBg}
          textColor={textColor}
        />
        <QuickAction
          icon={FaUserPlus}
          label={t?.("addPoet") || "Add Poet"}
          href={`/${lang}/admin-dashboard/poets/new`}
          gradient={gradient}
          borderColor={borderColor}
          hoverBg={hoverBg}
          textColor={textColor}
        />
        <QuickAction
          icon={FaPlus}
          label={t?.("addTag") || "Add Tag"}
          href={`/${lang}/admin-dashboard/tags/new`}
          gradient={gradient}
          borderColor={borderColor}
          hoverBg={hoverBg}
          textColor={textColor}
        />
        <QuickAction
          icon={FaPlus}
          label={t?.("addCategory") || "Add Category"}
          href={`/${lang}/admin-dashboard/categories/new`}
          gradient={gradient}
          borderColor={borderColor}
          hoverBg={hoverBg}
          textColor={textColor}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Poems */}
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {t?.("recentPoems") || "Recent Poems"}
            </h3>
            <Link
              href={`/${lang}/admin-dashboard/poems`}
              className={`text-sm ${textColor} hover:underline flex items-center gap-1`}
            >
              {t?.("viewAll") || "View All"} <FaArrowRight size={12} />
            </Link>
          </div>

          {recentActivity.poems.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
              {t?.("noPoemsFound") || "No poems found"}
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivity.poems.map((poem) => (
                <Link
                  key={poem.id}
                  href={`/${lang}/admin-dashboard/poems/${poem.id}`}
                  className={`flex items-center justify-between p-3 rounded-lg ${hoverBg} transition group`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                      {poem.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{poem.poet?.name || "Unknown"}</span>
                      <span>•</span>
                      <span>{poem.language || "en"}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FaHeart size={10} className="text-red-400" />
                        {poem.likes || 0}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FaEye size={10} />
                        {poem.views || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-gray-400">
                      {formatDate(poem.createdAt)}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        poem.status === "published"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {poem.status || "draft"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Poets */}
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {t?.("recentPoets") || "Recent Poets"}
            </h3>
            <Link
              href={`/${lang}/admin-dashboard/poets`}
              className={`text-sm ${textColor} hover:underline flex items-center gap-1`}
            >
              {t?.("viewAll") || "View All"} <FaArrowRight size={12} />
            </Link>
          </div>

          {recentActivity.poets.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
              {t?.("noPoetsFound") || "No poets found"}
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivity.poets.map((poet) => (
                <Link
                  key={poet.id}
                  href={`/${lang}/admin-dashboard/poets/${poet.id}`}
                  className={`flex items-center justify-between p-3 rounded-lg ${hoverBg} transition group`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                    >
                      {poet.name?.[0] || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                        {poet.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {poet.country || poet.nationality || "Unknown"}
                        </span>
                        {poet.era && (
                          <>
                            <span>•</span>
                            <span>{poet.era}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-gray-400">
                      {formatDate(poet.createdAt)}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        poet.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}
                    >
                      {poet.status || "inactive"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className={`p-4 ${bgColor} rounded-2xl border ${borderColor}`}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t?.("totalContent") || "Total Content"}
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {stats.poems.total + stats.poets.total}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t?.("publishedContent") || "Published Content"}
            </p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {stats.poems.published + stats.poets.active}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t?.("draftContent") || "Draft Content"}
            </p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {stats.poems.draft + stats.poets.inactive}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t?.("engagement") || "Engagement"}
            </p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {stats.poems.total > 0
                ? Math.round((stats.poems.published / stats.poems.total) * 100)
                : 0}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
