// src/app/(main)/(admin)/admin-dashboard/tags/components/TagTable.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaTags,
  FaChevronDown,
  FaChevronUp,
  FaSpinner,
  FaCopy,
  FaCheckCircle,
  FaHashtag,
  FaPalette,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";

export default function TagTable({
  tags = [],
  onDelete,
  onBulkDelete,
  onStatusChange,
  isLoading = false,
  isDeleting = false,
  selectedIds = [],
  onSelect,
  onSelectAll,
}) {
  const { themeName } = useTheme();
  const [expandedRows, setExpandedRows] = useState({});
  const [copiedId, setCopiedId] = useState(null);

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

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "inactive":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "archived":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Check if all tags are selected
  const isAllSelected =
    tags.length > 0 && tags.every((tag) => selectedIds.includes(tag.id));

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-8`}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading tags...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (tags.length === 0) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-8`}
      >
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <FaTags className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tags found
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead
            className={`bg-gray-50 dark:bg-gray-900/30 border-b ${borderColor}`}
          >
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  disabled={isLoading || isDeleting}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tag
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Slug
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                Created
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tags.map((tag) => {
              const isExpanded = expandedRows[tag.id];
              return (
                <>
                  {/* Main Row */}
                  <tr
                    key={tag.id}
                    className={`${hoverBg} transition-colors ${selectedIds.includes(tag.id) ? "bg-amber-50 dark:bg-amber-900/10" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(tag.id)}
                        onChange={(e) => onSelect?.(tag.id, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                        disabled={isLoading || isDeleting}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleRow(tag.id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                        >
                          {isExpanded ? (
                            <FaChevronUp size={12} />
                          ) : (
                            <FaChevronDown size={12} />
                          )}
                        </button>

                        {/* Tag Icon */}
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                          style={{
                            backgroundColor: tag.color || "#8b5cf6",
                            color: "#fff",
                          }}
                        >
                          {tag.icon || <FaHashtag size={12} />}
                        </div>

                        <div className="min-w-0">
                          <Link
                            href={`/admin-dashboard/tags/${tag.id}`}
                            className="font-medium text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition truncate"
                          >
                            #{tag.name}
                          </Link>
                          {tag.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {tag.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {tag.slug}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(tag.status)}`}
                      >
                        {tag.status || "active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(tag.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {/* Copy Slug */}
                        <button
                          onClick={() =>
                            copyToClipboard(tag.slug, `slug-${tag.id}`)
                          }
                          className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition relative`}
                          title="Copy slug"
                        >
                          {copiedId === `slug-${tag.id}` ? (
                            <FaCheckCircle
                              size={14}
                              className="text-green-500"
                            />
                          ) : (
                            <FaCopy size={14} />
                          )}
                        </button>

                        {/* View on Site */}
                        <Link
                          href={`/tags/${tag.slug}`}
                          target="_blank"
                          className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition`}
                          title="View on site"
                        >
                          <FaEye size={14} />
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/admin-dashboard/tags/${tag.id}/edit`}
                          className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition`}
                          title="Edit tag"
                        >
                          <FaEdit size={14} />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => onDelete?.(tag.id)}
                          disabled={isDeleting}
                          className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition disabled:opacity-50`}
                          title="Delete tag"
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

                  {/* Expanded Row */}
                  {isExpanded && (
                    <tr className="bg-gray-50 dark:bg-gray-900/20">
                      <td colSpan="6" className="px-4 py-4">
                        <div className="space-y-3">
                          {tag.description && (
                            <div>
                              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                Description
                              </h4>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {tag.description}
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Slug
                              </p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {tag.slug}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Color
                              </p>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-6 h-6 rounded-lg"
                                  style={{
                                    backgroundColor: tag.color || "#8b5cf6",
                                  }}
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {tag.color || "#8b5cf6"}
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Icon
                              </p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {tag.icon || "None"}
                              </p>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <button
                              onClick={() => {
                                const newStatus =
                                  tag.status === "active"
                                    ? "inactive"
                                    : "active";
                                onStatusChange?.(tag.id, newStatus);
                              }}
                              className={`px-3 py-1 text-xs rounded-lg ${hoverBg} text-gray-600 dark:text-gray-400 transition`}
                            >
                              {tag.status === "active"
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                            <Link
                              href={`/admin-dashboard/tags/${tag.id}/edit`}
                              className={`px-3 py-1 text-xs rounded-lg ${hoverBg} text-gray-600 dark:text-gray-400 transition`}
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Are you sure you want to delete "${tag.name}"?`,
                                  )
                                ) {
                                  onDelete?.(tag.id);
                                }
                              }}
                              className={`px-3 py-1 text-xs rounded-lg ${hoverBg} text-red-600 dark:text-red-400 transition`}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        className={`px-4 py-3 border-t ${borderColor} bg-gray-50 dark:bg-gray-900/30 flex flex-col sm:flex-row justify-between items-center gap-2`}
      >
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium">{tags.length}</span> tags
          {selectedIds.length > 0 && (
            <span className="ml-2">
              (<span className="font-medium">{selectedIds.length}</span>{" "}
              selected)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <>
              <button
                onClick={() => {
                  if (confirm(`Delete ${selectedIds.length} selected tags?`)) {
                    onBulkDelete?.(selectedIds);
                  }
                }}
                className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete Selected
              </button>
              <button
                onClick={() => {
                  if (
                    confirm(`Activate ${selectedIds.length} selected tags?`)
                  ) {
                    selectedIds.forEach((id) => onStatusChange?.(id, "active"));
                  }
                }}
                className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Activate Selected
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
