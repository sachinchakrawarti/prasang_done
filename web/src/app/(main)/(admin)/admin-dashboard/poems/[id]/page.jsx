// src/app/(main)/(admin)/admin-dashboard/poems/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaExclamationTriangle,
  FaUser,
  FaFolder,
  FaLanguage,
  FaCalendar,
  FaEye,
  FaHeart,
  FaTags,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaFileAlt,
  FaQuoteLeft,
  FaQuoteRight,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import { fetchPoemById, deletePoem } from "@/services/adminService";

export default function PoemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [poem, setPoem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Load poem data
  useEffect(() => {
    const loadPoem = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchPoemById(id);
        const poemData = response.data || response;

        if (!poemData) {
          setError("Poem not found");
          setIsLoading(false);
          return;
        }

        setPoem(poemData);
      } catch (err) {
        console.error("Failed to load poem:", err);
        setError(err.message || "Failed to load poem");
      } finally {
        setIsLoading(false);
      }
    };

    loadPoem();
  }, [id]);

  // Handle delete
  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this poem? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deletePoem(id);
      router.push("/admin-dashboard/poems");
    } catch (err) {
      console.error("Failed to delete poem:", err);
      setError(err.message || "Failed to delete poem");
      setIsDeleting(false);
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "draft":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "archived":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const textColor = getTextColor();
  const gradient = getGradient();
  const borderColor = getBorderColor();
  const hoverBg = getHoverBg();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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
          <p className="text-gray-600 dark:text-gray-300">Loading poem...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !poem) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {error || "Poem not found"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            The poem you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/admin-dashboard/poems"
            className={`px-6 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg font-medium hover:shadow-lg transition-all inline-block`}
          >
            Back to Poems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin-dashboard/poems"
            className={`p-2 rounded-lg ${hoverBg} transition`}
          >
            <FaArrowLeft className={textColor} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {poem.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Poem Details
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin-dashboard/poems/${id}/edit`}
            className={`px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg hover:shadow-lg transition flex items-center gap-2`}
          >
            <FaEdit size={14} />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaTrash size={14} />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
          <FaExclamationTriangle className="text-red-500 text-xl" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Poem Content */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}
          >
            <h2
              className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}
            >
              <FaFileAlt />
              Content
            </h2>
            <div className="relative">
              <FaQuoteLeft
                className={`absolute -top-1 -left-1 text-3xl ${textColor} opacity-20`}
              />
              <div className="pl-6 prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                {poem.content || "No content available"}
              </div>
              <FaQuoteRight
                className={`absolute -bottom-1 -right-1 text-3xl ${textColor} opacity-20`}
              />
            </div>
          </div>

          {/* Description */}
          {poem.description && (
            <div
              className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}
            >
              <h2 className={`text-lg font-semibold ${textColor} mb-4`}>
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {poem.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {poem.tags && poem.tags.length > 0 && (
            <div
              className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}
            >
              <h2
                className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}
              >
                <FaTags />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {poem.tags.map((tag, index) => {
                  const tagName =
                    typeof tag === "string" ? tag : tag?.name || "";
                  return (
                    <span
                      key={index}
                      className={`px-3 py-1 text-sm rounded-full ${hoverBg} ${textColor} border ${borderColor}`}
                    >
                      #{tagName}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}
          >
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Status
                </span>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${getStatusColor(poem.status)}`}
                >
                  {poem.status || "draft"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Language
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {(poem.language || "en").toUpperCase()}
                </span>
              </div>
              {poem.script && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Script
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {poem.script}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Poet Info */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}
          >
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Poet
            </h3>
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-white text-lg font-bold`}
              >
                {(poem.poet?.name || "U")[0]}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {poem.poet?.name || "Unknown Poet"}
                </p>
                {poem.poet?.slug && (
                  <Link
                    href={`/admin-dashboard/poets/${poem.poet?.id}`}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    View Poet Profile →
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Category Info */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}
          >
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Category
            </h3>
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center text-white`}
              >
                <FaFolder size={16} />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {poem.category?.name || "Uncategorized"}
                </p>
                {poem.category?.slug && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {poem.category.slug}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}
          >
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaEye className={textColor} />
                  Views
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {poem.views || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaHeart className="text-red-400" />
                  Likes
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {poem.likes || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaClock className={textColor} />
                  Version
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  v{poem.contentVersion || 1}
                </span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}
          >
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Dates
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaCalendar className={textColor} />
                  Created
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {formatDate(poem.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaCalendar className={textColor} />
                  Updated
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {formatDate(poem.updatedAt || poem.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}
          >
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Actions
            </h3>
            <div className="space-y-2">
              <Link
                href={`/admin-dashboard/poems/${id}/edit`}
                className={`w-full px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2`}
              >
                <FaEdit size={14} />
                Edit Poem
              </Link>
              <Link
                href={`/poems/${poem.slug}`}
                target="_blank"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <FaEye size={14} />
                View on Site
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaTrash size={14} />
                )}
                {isDeleting ? "Deleting..." : "Delete Poem"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
