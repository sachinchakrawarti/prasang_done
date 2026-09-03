// src/app/(main)/(admin)/admin-dashboard/poets/components/PoetTable.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaHeart,
  FaUsers,
  FaBookOpen,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaSpinner,
  FaCopy,
  FaCheckCircle,
  FaGlobe,
  FaCalendarAlt,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";

export default function PoetTable({
  poets = [],
  onDelete,
  onBulkDelete,
  onStatusChange,
  onFeaturedToggle,
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
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
      case "deceased":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Check if all poets are selected
  const isAllSelected =
    poets.length > 0 && poets.every((poet) => selectedIds.includes(poet.id));

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-8`}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading poets...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (poets.length === 0) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-8`}
      >
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <FaUsers className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No poets found
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
                Poet
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Country
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                Era
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                Status
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
            {poets.map((poet) => {
              const isExpanded = expandedRows[poet.id];
              return (
                <>
                  {/* Main Row */}
                  <tr
                    key={poet.id}
                    className={`${hoverBg} transition-colors ${selectedIds.includes(poet.id) ? "bg-amber-50 dark:bg-amber-900/10" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(poet.id)}
                        onChange={(e) => onSelect?.(poet.id, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                        disabled={isLoading || isDeleting}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleRow(poet.id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                        >
                          {isExpanded ? (
                            <FaChevronUp size={12} />
                          ) : (
                            <FaChevronDown size={12} />
                          )}
                        </button>
                        {/* Avatar */}
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                        >
                          {poet.image ? (
                            <img
                              src={poet.image}
                              alt={poet.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            poet.name?.[0] || "U"
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin-dashboard/poets/${poet.id}`}
                              className="font-medium text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition truncate"
                            >
                              {poet.name}
                            </Link>
                            {poet.featured && (
                              <FaStar
                                className="text-yellow-400"
                                size={12}
                                title="Featured"
                              />
                            )}
                          </div>
                          {/* Tags preview */}
                          {poet.tags && poet.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {poet.tags.slice(0, 2).map((tag, index) => {
                                const tagName =
                                  typeof tag === "string"
                                    ? tag
                                    : tag?.name || "";
                                return (
                                  <span
                                    key={index}
                                    className={`px-1.5 py-0.5 text-xs rounded ${hoverBg} ${textColor}`}
                                  >
                                    #{tagName}
                                  </span>
                                );
                              })}
                              {poet.tags.length > 2 && (
                                <span className="text-xs text-gray-400">
                                  +{poet.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <FaGlobe size={12} className="text-gray-400" />
                        {poet.country || poet.nationality || "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <FaCalendarAlt size={12} className="text-gray-400" />
                        {poet.era || poet.century || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(poet.status)}`}
                      >
                        {poet.status || "active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaBookOpen size={12} />
                          {poet.metadata?.works || poet.works || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaHeart size={12} className="text-red-400" />
                          {poet.metadata?.likes || poet.likes || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaUsers size={12} />
                          {poet.metadata?.followers || poet.followers || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {/* Copy Slug */}
                        <button
                          onClick={() =>
                            copyToClipboard(poet.slug, `slug-${poet.id}`)
                          }
                          className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition relative`}
                          title="Copy slug"
                        >
                          {copiedId === `slug-${poet.id}` ? (
                            <FaCheckCircle
                              size={14}
                              className="text-green-500"
                            />
                          ) : (
                            <FaCopy size={14} />
                          )}
                        </button>

                        {/* Toggle Featured */}
                        <button
                          onClick={() =>
                            onFeaturedToggle?.(poet.id, !poet.featured)
                          }
                          className={`p-1.5 rounded ${hoverBg} transition ${
                            poet.featured
                              ? "text-yellow-400"
                              : "text-gray-400 hover:text-yellow-400"
                          }`}
                          title={
                            poet.featured ? "Remove featured" : "Make featured"
                          }
                        >
                          <FaStar size={14} />
                        </button>

                        {/* View on Site */}
                        <Link
                          href={`/poets/${poet.slug}`}
                          target="_blank"
                          className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition`}
                          title="View on site"
                        >
                          <FaEye size={14} />
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/admin-dashboard/poets/${poet.id}/edit`}
                          className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition`}
                          title="Edit poet"
                        >
                          <FaEdit size={14} />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => onDelete?.(poet.id)}
                          disabled={isDeleting}
                          className={`p-1.5 rounded ${hoverBg} text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition disabled:opacity-50`}
                          title="Delete poet"
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

                  {/* Expanded Row - Now inside the same tbody as a separate tr */}
                  {isExpanded && (
                    <tr
                      key={`${poet.id}-expanded`}
                      className="bg-gray-50 dark:bg-gray-900/20"
                    >
                      <td colSpan="7" className="px-4 py-4">
                        <div className="space-y-3">
                          {/* Biography */}
                          {poet.biography && (
                            <div>
                              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                Biography
                              </h4>
                              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                                {poet.biography}
                              </p>
                            </div>
                          )}

                          {/* Metadata Details */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Birth Year
                              </p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {poet.birthYear || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Death Year
                              </p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {poet.deathYear || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Nationality
                              </p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {poet.nationality || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Century
                              </p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {poet.century || "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <button
                              onClick={() => {
                                const newStatus =
                                  poet.status === "active"
                                    ? "inactive"
                                    : "active";
                                onStatusChange?.(poet.id, newStatus);
                              }}
                              className={`px-3 py-1 text-xs rounded-lg ${hoverBg} text-gray-600 dark:text-gray-400 transition`}
                            >
                              {poet.status === "active"
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                            <button
                              onClick={() =>
                                onFeaturedToggle?.(poet.id, !poet.featured)
                              }
                              className={`px-3 py-1 text-xs rounded-lg ${hoverBg} text-gray-600 dark:text-gray-400 transition`}
                            >
                              {poet.featured
                                ? "Remove Featured"
                                : "Make Featured"}
                            </button>
                            <Link
                              href={`/admin-dashboard/poems/new?poetId=${poet.id}`}
                              className={`px-3 py-1 text-xs rounded-lg ${hoverBg} text-gray-600 dark:text-gray-400 transition`}
                            >
                              Add Poem
                            </Link>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Are you sure you want to delete "${poet.name}"?`,
                                  )
                                ) {
                                  onDelete?.(poet.id);
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
          Showing <span className="font-medium">{poets.length}</span> poets
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
                  if (confirm(`Delete ${selectedIds.length} selected poets?`)) {
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
                    confirm(`Activate ${selectedIds.length} selected poets?`)
                  ) {
                    selectedIds.forEach((id) => onStatusChange?.(id, "active"));
                  }
                }}
                className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Activate Selected
              </button>
              <button
                onClick={() => {
                  if (
                    confirm(
                      `Make ${selectedIds.length} selected poets featured?`,
                    )
                  ) {
                    selectedIds.forEach((id) => onFeaturedToggle?.(id, true));
                  }
                }}
                className="px-3 py-1 text-xs bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                Featured Selected
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
