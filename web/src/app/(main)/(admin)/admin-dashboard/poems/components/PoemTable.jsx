// src/app/(main)/(admin)/admin-dashboard/poems/components/PoemTable.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaHeart,
  FaTags,
  FaChevronDown,
  FaChevronUp,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaCopy,
  FaCheckCircle,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";

export default function PoemTable({
  poems = [],
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

  // Check if all poems are selected
  const isAllSelected =
    poems.length > 0 && poems.every((poem) => selectedIds.includes(poem.id));

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-8`}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading poems...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (poems.length === 0) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-8`}
      >
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <FaTags className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No poems found
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
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Poet
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                Language
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden xl:table-cell">
                Date
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Stats
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {poems.map((poem) => (
              <tbody key={poem.id}>
                {/* Main Row */}
                <tr
                  className={`${hoverBg} transition-colors ${selectedIds.includes(poem.id) ? "bg-amber-50 dark:bg-amber-900/10" : ""}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(poem.id)}
                      onChange={(e) => onSelect?.(poem.id, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                      disabled={isLoading || isDeleting}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleRow(poem.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                      >
                        {expandedRows[poem.id] ? (
                          <FaChevronUp size={12} />
                        ) : (
                          <FaChevronDown size={12} />
                        )}
                      </button>
                      <Link
                        href={`/admin-dashboard/poems/${poem.id}`}
                        className="font-medium text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition line-clamp-1"
                      >
                        {poem.title}
                      </Link>
                    </div>
                    {/* Tags preview */}
                    {poem.tags && poem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {poem.tags.slice(0, 3).map((tag, index) => {
                          const tagName =
                            typeof tag === "string" ? tag : tag?.name || "";
                          return (
                            <span
                              key={index}
                              className={`px-1.5 py-0.5 text-xs rounded ${hoverBg} ${textColor}`}
                            >
                              #{tagName}
                            </span>
                          );
                        })}
                        {poem.tags.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{poem.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Link
                      href={`/admin-dashboard/poets/${poem.poet?.id}`}
                      className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition"
                    >
                      {poem.poet?.name || "Unknown"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-sm text-gray-600 dark:text-gray-400 uppercase">
                      {poem.language || "en"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(poem.status)}`}
                    >
                      {poem.status || "draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(poem.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <FaEye size={12} />
                        {poem.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaHeart size={12} className="text-red-400" />
                        {poem.likes || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {/* Copy Slug */}
                      <button
                        onClick={() =>
                          copyToClipboard(poem.slug, `slug-${poem.id}`)
                        }
                        className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition relative`}
                        title="Copy slug"
                      >
                        {copiedId === `slug-${poem.id}` ? (
                          <FaCheckCircle size={14} className="text-green-500" />
                        ) : (
                          <FaCopy size={14} />
                        )}
                      </button>

                      {/* View on Site */}
                      <Link
                        href={`/poems/${poem.slug}`}
                        target="_blank"
                        className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition`}
                        title="View on site"
                      >
                        <FaEye size={14} />
                      </Link>

                      {/* Edit */}
                      <Link
                        href={`/admin-dashboard/poems/${poem.id}/edit`}
                        className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition`}
                        title="Edit poem"
                      >
                        <FaEdit size={14} />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => onDelete?.(poem.id)}
                        disabled={isDeleting}
                        className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition disabled:opacity-50`}
                        title="Delete poem"
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
                {expandedRows[poem.id] && (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-4 bg-gray-50 dark:bg-gray-900/20"
                    >
                      <div className="space-y-3">
                        {/* Description */}
                        {poem.description && (
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                              Description
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {poem.description}
                            </p>
                          </div>
                        )}

                        {/* Content Preview */}
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            Content Preview
                          </h4>
                          <div className="text-sm text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none max-h-32 overflow-y-auto whitespace-pre-wrap">
                            {poem.content?.substring(0, 300)}
                            {poem.content?.length > 300 && "..."}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => {
                              const newStatus =
                                poem.status === "published"
                                  ? "draft"
                                  : "published";
                              onStatusChange?.(poem.id, newStatus);
                            }}
                            className={`px-3 py-1 text-xs rounded-lg ${hoverBg} text-gray-600 dark:text-gray-400 transition`}
                          >
                            {poem.status === "published"
                              ? "Unpublish"
                              : "Publish"}
                          </button>
                          <Link
                            href={`/admin-dashboard/poems/${poem.id}/edit`}
                            className={`px-3 py-1 text-xs rounded-lg ${hoverBg} text-gray-600 dark:text-gray-400 transition`}
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this poem?",
                                )
                              ) {
                                onDelete?.(poem.id);
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
              </tbody>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        className={`px-4 py-3 border-t ${borderColor} bg-gray-50 dark:bg-gray-900/30 flex flex-col sm:flex-row justify-between items-center gap-2`}
      >
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium">{poems.length}</span> poems
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
                  if (confirm(`Delete ${selectedIds.length} selected poems?`)) {
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
                    confirm(`Publish ${selectedIds.length} selected poems?`)
                  ) {
                    selectedIds.forEach((id) =>
                      onStatusChange?.(id, "published"),
                    );
                  }
                }}
                className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Publish Selected
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
