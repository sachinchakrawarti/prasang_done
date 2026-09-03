// src/app/(main)/(admin)/admin-dashboard/translations/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaPlus,
  FaSpinner,
  FaExclamationTriangle,
  FaSync,
  FaChevronLeft,
  FaChevronRight,
  FaLanguage,
  FaSearch,
  FaFilter,
  FaFileAlt,
  FaUser,
  FaGlobe,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import {
  fetchPoemTranslations,
  deleteTranslation,
} from "@/services/adminService";

export default function AdminTranslationsPage() {
  const router = useRouter();
  const { themeName } = useTheme();
  const { t } = useTranslation();

  // State
  const [translations, setTranslations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Load translations
  const loadTranslations = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        // Since we don't have a dedicated translations list endpoint,
        // we need to fetch all poems and their translations
        // This is a simplified version - you may want to create a dedicated endpoint
        const params = {
          page,
          limit: pagination.limit,
          search: searchTerm || undefined,
          status: filterStatus !== "all" ? filterStatus : undefined,
        };

        // Remove undefined values
        Object.keys(params).forEach((key) => {
          if (params[key] === undefined || params[key] === "") {
            delete params[key];
          }
        });

        // For now, we'll use mock data or fetch from a dedicated endpoint
        // If you have a dedicated translations endpoint, use that instead
        const response = await fetchTranslations(params);
        const translationsData = response.data || [];
        setTranslations(translationsData);

        if (response.pagination) {
          setPagination({
            page: response.pagination.page || page,
            limit: response.pagination.limit || pagination.limit,
            total: response.pagination.total || 0,
            totalPages: response.pagination.totalPages || 0,
          });
        }
      } catch (err) {
        console.error("Failed to load translations:", err);
        setError(err.message || "Failed to load translations");
        // Use mock data if API fails
        setTranslations(getMockTranslations());
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, filterStatus, filterLanguage, pagination.limit],
  );

  // Initial load
  useEffect(() => {
    loadTranslations(1);
  }, [loadTranslations]);

  // Handle refresh
  const handleRefresh = () => {
    loadTranslations(pagination.page);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadTranslations(newPage);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this translation? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTranslation(id);
      // Remove from list
      setTranslations(translations.filter((t) => t.id !== id));
      // Update total count
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
        totalPages: Math.ceil((prev.total - 1) / prev.limit),
      }));
    } catch (err) {
      console.error("Failed to delete translation:", err);
      alert("Failed to delete translation: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Mock data function (for development)
  const getMockTranslations = () => {
    return [
      {
        id: 1,
        poemId: 1,
        poemTitle: "Sonnet 18",
        language: "hi",
        title: "सॉनेट 18",
        translatedBy: "Admin",
        status: "published",
        createdAt: "2024-01-15T10:00:00Z",
      },
      {
        id: 2,
        poemId: 2,
        poemTitle: "Gitanjali",
        language: "ur",
        title: "گیتانجلی",
        translatedBy: "Admin",
        status: "draft",
        createdAt: "2024-01-14T14:30:00Z",
      },
      {
        id: 3,
        poemId: 3,
        poemTitle: "Mujhse Pehli Si Mohabbat",
        language: "en",
        title: "That Love Like Before",
        translatedBy: "Editor",
        status: "published",
        createdAt: "2024-01-13T09:15:00Z",
      },
    ];
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

  const getStatusBadge = (status) => {
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

  // Language options for filter
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

  // Status options for filter
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
  ];

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t?.("translations") || "Translations"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pagination.total}{" "}
            {t?.("totalTranslations") || "total translations"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className={`p-2 rounded-lg border ${borderColor} ${hoverBg} transition disabled:opacity-50`}
            title="Refresh"
          >
            <FaSync className={isLoading ? "animate-spin" : ""} size={16} />
          </button>
          <Link
            href="/admin-dashboard/translations/new"
            className={`px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg hover:shadow-lg transition flex items-center gap-2`}
          >
            <FaPlus size={14} />
            {t?.("addTranslation") || "Add Translation"}
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-red-500 text-xl" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search translations by title or poem..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            disabled={isLoading}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition appearance-none"
              disabled={isLoading}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            disabled={isLoading}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {(searchTerm ||
            filterLanguage !== "all" ||
            filterStatus !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterLanguage("all");
                setFilterStatus("all");
              }}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Translations Table */}
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} overflow-hidden`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className={`bg-gray-50 dark:bg-gray-900/30 border-b ${borderColor}`}
            >
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Translation
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Original Poem
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  Language
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Translator
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden xl:table-cell">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center">
                    <FaSpinner className="animate-spin text-3xl text-amber-500 mx-auto" />
                  </td>
                </tr>
              ) : translations.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <FaLanguage className="text-4xl mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p>No translations found</p>
                    <p className="text-sm mt-1">
                      Try adjusting your search or filters
                    </p>
                  </td>
                </tr>
              ) : (
                translations.map((translation) => (
                  <tr
                    key={translation.id}
                    className={`${hoverBg} transition-colors`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center text-white text-sm`}
                        >
                          <FaLanguage size={14} />
                        </div>
                        <div>
                          <Link
                            href={`/admin-dashboard/translations/${translation.id}`}
                            className="font-medium text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition"
                          >
                            {translation.title}
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {translation.language?.toUpperCase() || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {translation.poemTitle || "Unknown Poem"}
                        </p>
                        <p className="text-xs text-gray-400">
                          ID: {translation.poemId || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {languageOptions.find(
                          (l) => l.value === translation.language,
                        )?.label ||
                          translation.language?.toUpperCase() ||
                          "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <FaUser size={12} className="text-gray-400" />
                        {translation.translatedBy || "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(translation.status)}`}
                      >
                        {translation.status || "draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin-dashboard/translations/${translation.id}`}
                          className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition`}
                          title="View translation"
                        >
                          <FaEye size={14} />
                        </Link>
                        <Link
                          href={`/admin-dashboard/translations/${translation.id}/edit`}
                          className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition`}
                          title="Edit translation"
                        >
                          <FaEdit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(translation.id)}
                          disabled={isDeleting}
                          className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition disabled:opacity-50`}
                          title="Delete translation"
                        >
                          {isDeleting ? (
                            <FaSpinner className="animate-spin" size={14} />
                          ) : (
                            <FaTrash size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className={`px-4 py-3 border-t ${borderColor} bg-gray-50 dark:bg-gray-900/30 flex flex-col sm:flex-row justify-between items-center gap-2`}
        >
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{translations.length}</span>{" "}
            translations
            {pagination.total > 0 && ` of ${pagination.total}`}
          </div>
          <div className="flex items-center gap-2">
            {pagination.totalPages > 1 && (
              <>
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1 || isLoading}
                  className={`p-2 rounded-lg border ${borderColor} ${hoverBg} transition disabled:opacity-50`}
                >
                  <FaChevronLeft size={14} />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={
                    pagination.page === pagination.totalPages || isLoading
                  }
                  className={`p-2 rounded-lg border ${borderColor} ${hoverBg} transition disabled:opacity-50`}
                >
                  <FaChevronRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      {!isLoading && translations.length > 0 && (
        <div
          className={`mt-6 p-4 ${hoverBg} rounded-2xl border ${borderColor}`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {pagination.total}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Published
              </p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {translations.filter((t) => t.status === "published").length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Draft</p>
              <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {translations.filter((t) => t.status === "draft").length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Languages
              </p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {new Set(translations.map((t) => t.language)).size}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to fetch translations (you'll need to implement this based on your API)
async function fetchTranslations(params = {}) {
  // This is a placeholder - implement based on your actual API endpoint
  // For now, return mock data
  const mockData = {
    data: [
      {
        id: 1,
        poemId: 1,
        poemTitle: "Sonnet 18",
        language: "hi",
        title: "सॉनेट 18",
        translatedBy: "Admin",
        status: "published",
        createdAt: "2024-01-15T10:00:00Z",
      },
      {
        id: 2,
        poemId: 2,
        poemTitle: "Gitanjali",
        language: "ur",
        title: "گیتانجلی",
        translatedBy: "Admin",
        status: "draft",
        createdAt: "2024-01-14T14:30:00Z",
      },
      {
        id: 3,
        poemId: 3,
        poemTitle: "Mujhse Pehli Si Mohabbat",
        language: "en",
        title: "That Love Like Before",
        translatedBy: "Editor",
        status: "published",
        createdAt: "2024-01-13T09:15:00Z",
      },
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 3,
      totalPages: 1,
    },
  };

  // If you have a real API endpoint, use it instead
  // const response = await fetch(`${API_BASE_URL}/translations?${queryParams}`);
  // return response.json();

  return mockData;
}
