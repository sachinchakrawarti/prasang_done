// src/app/(main)/(admin)/admin-dashboard/components/DataTable.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaChevronDown,
  FaChevronUp,
  FaSpinner,
  FaCopy,
  FaCheckCircle,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";

export default function DataTable({
  data = [],
  columns = [],
  actions = [],
  onDelete,
  onBulkDelete,
  onStatusChange,
  onRowClick,
  isLoading = false,
  isDeleting = false,
  selectedIds = [],
  onSelect,
  onSelectAll,
  pagination = null,
  onPageChange,
  emptyMessage = "No data found",
  searchable = true,
  searchPlaceholder = "Search...",
  onSearch,
}) {
  const { themeName } = useTheme();
  const [expandedRows, setExpandedRows] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Toggle row expansion
  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Copy to clipboard
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
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

  // Check if all items are selected
  const isAllSelected =
    data.length > 0 && data.every((item) => selectedIds.includes(item.id));

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  // Render cell value based on column type
  const renderCellValue = (item, column) => {
    const value = column.accessor ? item[column.accessor] : null;

    // If custom render function provided
    if (column.render) {
      return column.render(item);
    }

    // If value is null or undefined
    if (value === null || value === undefined) {
      return <span className="text-gray-400">N/A</span>;
    }

    // If value is a date
    if (column.type === "date" && value) {
      try {
        return new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch {
        return value;
      }
    }

    // If value is a boolean
    if (column.type === "boolean") {
      return value ? (
        <span className="text-green-500">✓</span>
      ) : (
        <span className="text-red-500">✗</span>
      );
    }

    // If value is a status
    if (column.type === "status") {
      const statusColors = {
        active:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        published:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        draft:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        archived:
          "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
        inactive:
          "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
        deceased:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      };
      const colorClass =
        statusColors[value?.toLowerCase()] || statusColors.inactive;
      return (
        <span className={`px-2 py-1 text-xs rounded-full ${colorClass}`}>
          {value}
        </span>
      );
    }

    // Default: return value as string
    return value;
  };

  // Sort data
  const sortedData = [...data];
  if (sortField) {
    sortedData.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-8`}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-8`}
      >
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-3xl text-gray-400">📊</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {emptyMessage}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} overflow-hidden`}
    >
      {/* Search Bar */}
      {searchable && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative max-w-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead
            className={`bg-gray-50 dark:bg-gray-900/30 border-b ${borderColor}`}
          >
            <tr>
              {onSelect && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                    disabled={isLoading || isDeleting}
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    column.sortable
                      ? "cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                      : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.accessor)}
                >
                  <span className="flex items-center gap-1">
                    {column.header}
                    {column.sortable &&
                      sortField === column.accessor &&
                      (sortDirection === "asc" ? (
                        <FaSortUp size={12} />
                      ) : (
                        <FaSortDown size={12} />
                      ))}
                    {column.sortable && sortField !== column.accessor && (
                      <FaSort size={12} className="opacity-30" />
                    )}
                  </span>
                </th>
              ))}
              {(actions.length > 0 || onDelete) && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((item) => {
              const isExpanded = expandedRows[item.id];
              return (
                <>
                  {/* Main Row */}
                  <tr
                    key={item.id}
                    className={`${hoverBg} transition-colors ${selectedIds.includes(item.id) ? "bg-amber-50 dark:bg-amber-900/10" : ""}`}
                    onClick={() => onRowClick?.(item)}
                  >
                    {onSelect && (
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={(e) =>
                            onSelect?.(item.id, e.target.checked)
                          }
                          className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                          disabled={isLoading || isDeleting}
                        />
                      </td>
                    )}
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-4 py-3 ${column.className || ""}`}
                      >
                        {renderCellValue(item, column)}
                      </td>
                    ))}
                    {(actions.length > 0 || onDelete) && (
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          {actions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick?.(item)}
                              className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:${action.color || "text-amber-600"} transition`}
                              title={action.label}
                            >
                              {action.icon}
                            </button>
                          ))}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item.id)}
                              disabled={isDeleting}
                              className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition disabled:opacity-50`}
                              title="Delete"
                            >
                              {isDeleting ? (
                                <FaSpinner className="animate-spin" size={14} />
                              ) : (
                                <FaTrash size={14} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      {pagination && (
        <div
          className={`px-4 py-3 border-t ${borderColor} bg-gray-50 dark:bg-gray-900/30 flex flex-col sm:flex-row justify-between items-center gap-2`}
        >
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {data.length} of {pagination.total} items
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`p-2 rounded-lg border ${borderColor} ${hoverBg} transition disabled:opacity-50`}
            >
              <FaChevronLeft size={14} />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className={`p-2 rounded-lg border ${borderColor} ${hoverBg} transition disabled:opacity-50`}
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
