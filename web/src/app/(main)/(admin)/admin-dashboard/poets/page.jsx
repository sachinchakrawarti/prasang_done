// src/app/(main)/(admin)/admin-dashboard/poets/page.jsx
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
  FaUsers,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import PoetTable from "./components/PoetTable";
import PoetFilters from "./components/PoetFilters";
import { fetchPoets, deletePoet, updatePoet } from "@/services/adminService";

export default function AdminPoetsPage() {
  const router = useRouter();
  const { themeName } = useTheme();
  const { t } = useTranslation();

  // State
  const [poets, setPoets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    country: "all",
    era: "all",
    sortBy: "popular",
  });

  // Load poets with filters
  const loadPoets = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = {
          page,
          limit: pagination.limit,
          search: filters.search || undefined,
          status: filters.status !== "all" ? filters.status : undefined,
          country: filters.country !== "all" ? filters.country : undefined,
          era: filters.era !== "all" ? filters.era : undefined,
          sortBy: filters.sortBy || undefined,
        };

        // Remove undefined values
        Object.keys(params).forEach((key) => {
          if (params[key] === undefined || params[key] === "") {
            delete params[key];
          }
        });

        const response = await fetchPoets(params);
        const poetsData = response.data || [];
        setPoets(poetsData);

        if (response.pagination) {
          setPagination({
            page: response.pagination.page || page,
            limit: response.pagination.limit || pagination.limit,
            total: response.pagination.total || 0,
            totalPages: response.pagination.totalPages || 0,
          });
        }
      } catch (err) {
        console.error("Failed to load poets:", err);
        setError(err.message || "Failed to load poets");
      } finally {
        setIsLoading(false);
      }
    },
    [filters, pagination.limit],
  );

  // Initial load
  useEffect(() => {
    loadPoets(1);
  }, []);

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Reload with new filters
    loadPoets(1);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      country: "all",
      era: "all",
      sortBy: "popular",
    });
    loadPoets(1);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadPoets(pagination.page);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadPoets(newPage);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this poet? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePoet(id);
      // Remove from list
      setPoets(poets.filter((p) => p.id !== id));
      // Remove from selection
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
      // Update total count
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
        totalPages: Math.ceil((prev.total - 1) / prev.limit),
      }));
    } catch (err) {
      console.error("Failed to delete poet:", err);
      alert("Failed to delete poet: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async (ids) => {
    if (
      !confirm(
        `Are you sure you want to delete ${ids.length} poets? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await Promise.all(ids.map((id) => deletePoet(id)));
      // Remove from list
      setPoets(poets.filter((p) => !ids.includes(p.id)));
      setSelectedIds([]);
      // Update total count
      setPagination((prev) => ({
        ...prev,
        total: prev.total - ids.length,
        totalPages: Math.ceil((prev.total - ids.length) / prev.limit),
      }));
    } catch (err) {
      console.error("Failed to delete poets:", err);
      alert("Failed to delete poets: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updatePoet(id, { status: newStatus });
      // Update in list
      setPoets(
        poets.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status: " + err.message);
    }
  };

  // Handle featured toggle
  const handleFeaturedToggle = async (id, featured) => {
    try {
      await updatePoet(id, { featured });
      // Update in list
      setPoets(poets.map((p) => (p.id === id ? { ...p, featured } : p)));
    } catch (err) {
      console.error("Failed to toggle featured:", err);
      alert("Failed to update featured status: " + err.message);
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
    setSelectedIds(checked ? poets.map((p) => p.id) : []);
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

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t?.("poets") || "Poets"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pagination.total} {t?.("totalPoets") || "total poets"}
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
            href="/admin-dashboard/poets/new"
            className={`px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg hover:shadow-lg transition flex items-center gap-2`}
          >
            <FaPlus size={14} />
            {t?.("addPoet") || "Add Poet"}
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

      {/* Filters */}
      <PoetFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        isLoading={isLoading}
      />

      {/* Poets Table */}
      <PoetTable
        poets={poets}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onStatusChange={handleStatusChange}
        onFeaturedToggle={handleFeaturedToggle}
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
            {pagination.total} poets
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
      {!isLoading && poets.length === 0 && !error && (
        <div
          className={`mt-6 text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border ${borderColor}`}
        >
          <FaUsers className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t?.("noPoetsFound") || "No poets found"}
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mb-4">
            {t?.("tryAdjustingFilters") ||
              "Try adjusting your search or filters"}
          </p>
          <Link
            href="/admin-dashboard/poets/new"
            className={`inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg hover:shadow-lg transition`}
          >
            <FaPlus size={14} />
            {t?.("addFirstPoet") || "Add your first poet"}
          </Link>
        </div>
      )}
    </div>
  );
}
