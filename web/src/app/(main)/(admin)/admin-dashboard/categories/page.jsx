// src/app/(main)/(admin)/admin-dashboard/categories/page.jsx
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
  FaFolder,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import CategoryTable from "./components/CategoryTable";
import {
  fetchCategories,
  deleteCategory,
  updateCategory,
} from "@/services/adminService";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { themeName } = useTheme();
  const { t } = useTranslation();

  // State
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Load categories
  const loadCategories = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);

      try {
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

        const response = await fetchCategories(params);
        const categoriesData = response.data || [];
        setCategories(categoriesData);

        if (response.pagination) {
          setPagination({
            page: response.pagination.page || page,
            limit: response.pagination.limit || pagination.limit,
            total: response.pagination.total || 0,
            totalPages: response.pagination.totalPages || 0,
          });
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError(err.message || "Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, filterStatus, pagination.limit],
  );

  // Initial load
  useEffect(() => {
    loadCategories(1);
  }, [loadCategories]);

  // Handle refresh
  const handleRefresh = () => {
    loadCategories(pagination.page);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadCategories(newPage);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCategory(id);
      // Remove from list
      setCategories(categories.filter((c) => c.id !== id));
      // Remove from selection
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
      // Update total count
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
        totalPages: Math.ceil((prev.total - 1) / prev.limit),
      }));
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert("Failed to delete category: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async (ids) => {
    if (
      !confirm(
        `Are you sure you want to delete ${ids.length} categories? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await Promise.all(ids.map((id) => deleteCategory(id)));
      // Remove from list
      setCategories(categories.filter((c) => !ids.includes(c.id)));
      setSelectedIds([]);
      // Update total count
      setPagination((prev) => ({
        ...prev,
        total: prev.total - ids.length,
        totalPages: Math.ceil((prev.total - ids.length) / prev.limit),
      }));
    } catch (err) {
      console.error("Failed to delete categories:", err);
      alert("Failed to delete categories: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateCategory(id, { status: newStatus });
      // Update in list
      setCategories(
        categories.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status: " + err.message);
    }
  };

  // Handle selection
  const handleSelect = (id, checked) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((sid) => sid !== id),
    );
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? categories.map((c) => c.id) : []);
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

  // Status options for filter
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t?.("categories") || "Categories"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pagination.total} {t?.("totalCategories") || "total categories"}
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
            href="/admin-dashboard/categories/new"
            className={`px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg hover:shadow-lg transition flex items-center gap-2`}
          >
            <FaPlus size={14} />
            {t?.("addCategory") || "Add Category"}
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
            placeholder="Search categories by name or description..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            disabled={isLoading}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition appearance-none"
              disabled={isLoading}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {(searchTerm || filterStatus !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
              }}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Categories Table */}
      <CategoryTable
        categories={categories}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onStatusChange={handleStatusChange}
        isLoading={isLoading}
        isDeleting={isDeleting}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} categories
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || isLoading}
              className={`p-2 rounded-lg border ${borderColor} ${hoverBg} transition disabled:opacity-50`}
            >
              <FaChevronLeft size={14} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                      className={`w-9 h-9 rounded-lg transition ${
                        pagination.page === pageNum
                          ? `bg-gradient-to-r ${gradient} text-white`
                          : `${hoverBg} text-gray-700 dark:text-gray-300`
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                },
              )}
              {pagination.totalPages > 5 &&
                pagination.page < pagination.totalPages - 2 && (
                  <>
                    <span className="text-gray-400">...</span>
                    <button
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={isLoading}
                      className={`w-9 h-9 rounded-lg ${hoverBg} text-gray-700 dark:text-gray-300 transition`}
                    >
                      {pagination.totalPages}
                    </button>
                  </>
                )}
            </div>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages || isLoading}
              className={`p-2 rounded-lg border ${borderColor} ${hoverBg} transition disabled:opacity-50`}
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Empty State with Add Button */}
      {!isLoading && categories.length === 0 && !error && (
        <div
          className={`mt-6 text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border ${borderColor}`}
        >
          <FaFolder className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t?.("noCategoriesFound") || "No categories found"}
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mb-4">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by creating your first category"}
          </p>
          <Link
            href="/admin-dashboard/categories/new"
            className={`inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg hover:shadow-lg transition`}
          >
            <FaPlus size={14} />
            {t?.("addFirstCategory") || "Add your first category"}
          </Link>
        </div>
      )}

      {/* Categories Stats */}
      {!isLoading && categories.length > 0 && (
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
              <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {categories.filter((c) => c.status === "active").length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Inactive
              </p>
              <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {categories.filter((c) => c.status === "inactive").length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Archived
              </p>
              <p className="text-lg font-bold text-gray-600 dark:text-gray-400">
                {categories.filter((c) => c.status === "archived").length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
