// src/app/(main)/(admin)/admin-dashboard/categories/new/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaFolder,
  FaPlus,
  FaInfoCircle,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import CategoryForm from "../components/CategoryForm";
import { createCategory, fetchCategories } from "@/services/adminService";

export default function CreateCategoryPage() {
  const router = useRouter();
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load categories for parent selection
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchCategories({ limit: 100 });
        const categoriesData = response.data || [];
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError(err.message || "Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Ensure parentId is null if empty
      const submitData = {
        ...formData,
        parentId: formData.parentId || null,
      };

      const response = await createCategory(submitData);

      if (response.success) {
        setSuccess(true);
        // Redirect to categories list after a short delay
        setTimeout(() => {
          router.push("/admin-dashboard/categories");
        }, 1500);
      } else {
        throw new Error(response.message || "Failed to create category");
      }
    } catch (err) {
      console.error("Failed to create category:", err);
      setError(err.message || "Failed to create category");
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/admin-dashboard/categories");
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            Loading categories...
          </p>
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
            href="/admin-dashboard/categories"
            className={`p-2 rounded-lg ${hoverBg} transition`}
          >
            <FaArrowLeft className={textColor} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Category
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add a new category to organize your content
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
          <FaCheckCircle className="text-green-500 text-xl" />
          <p className="text-green-700 dark:text-green-300">
            Category created successfully! Redirecting...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
          <FaExclamationTriangle className="text-red-500 text-xl" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Quick Tips */}
      <div
        className={`mb-6 p-4 rounded-lg bg-gradient-to-r ${gradient} bg-opacity-10 border ${borderColor}`}
      >
        <h3
          className={`text-sm font-semibold ${textColor} mb-2 flex items-center gap-2`}
        >
          <FaPlus size={12} />
          Quick Tips for Adding a Category
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <li>
            • <strong>Name:</strong> Use a clear, descriptive category name
          </li>
          <li>
            • <strong>Slug:</strong> Will be automatically generated from the
            name
          </li>
          <li>
            • <strong>Description:</strong> Briefly describe what this category
            covers
          </li>
          <li>
            • <strong>Parent Category:</strong> Choose if this is a sub-category
          </li>
          <li>
            • <strong>Color:</strong> Pick a color for visual identification
          </li>
          <li>
            • <strong>Icon:</strong> Add an emoji or icon class for better
            visual appeal
          </li>
          <li>
            • <strong>Status:</strong> Set as active to make it available
          </li>
        </ul>
      </div>

      {/* Category Form */}
      <CategoryForm
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        isEdit={false}
      />

      {/* Preview Information Card */}
      <div
        className={`mt-6 bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}
      >
        <h3
          className={`text-sm font-semibold ${textColor} mb-4 flex items-center gap-2`}
        >
          <FaInfoCircle size={14} />
          Category Hierarchy Preview
        </h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Categories can be organized hierarchically. Top-level categories
            appear at the root, and sub-categories appear under their parent.
          </p>
          <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: "#f59e0b" }}
              />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Top Level Category
              </span>
              <span className="text-gray-400 text-xs">(no parent)</span>
            </div>
            <div className="ml-6 mt-2 flex items-center gap-2 text-sm border-l-2 border-gray-300 dark:border-gray-600 pl-4">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: "#3b82f6" }}
              />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Sub-Category
              </span>
              <span className="text-gray-400 text-xs">(has parent)</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400">
            <span className="text-red-500">*</span> Required fields must be
            filled to create the category
          </p>
          {categories.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              <span className="text-green-500">✓</span> {categories.length}{" "}
              existing categories available as parents
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
