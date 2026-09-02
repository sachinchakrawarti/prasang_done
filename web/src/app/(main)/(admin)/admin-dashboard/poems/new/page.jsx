// src/app/(main)/(admin)/admin-dashboard/poems/new/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import PoemForm from "../components/PoemForm";
import { createPoem } from "@/services/adminService";
import { fetchPoets } from "@/services/poetService";
import { fetchCategories } from "@/services/adminService";

export default function CreatePoemPage() {
  const router = useRouter();
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [poets, setPoets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load poets and categories for the form
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [poetsRes, categoriesRes] = await Promise.all([
          fetchPoets({ limit: 100, status: "active" }),
          fetchCategories({ limit: 100 }),
        ]);

        const poetsData = poetsRes.data || [];
        const categoriesData = categoriesRes.data || [];

        setPoets(poetsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to load form data:", err);
        setError(err.message || "Failed to load poets and categories");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Ensure poetId and categoryId are numbers
      const submitData = {
        ...formData,
        poetId: parseInt(formData.poetId),
        categoryId: parseInt(formData.categoryId),
      };

      const response = await createPoem(submitData);

      if (response.success) {
        setSuccess(true);
        // Redirect to poems list after a short delay
        setTimeout(() => {
          router.push("/admin-dashboard/poems");
        }, 1500);
      } else {
        throw new Error(response.message || "Failed to create poem");
      }
    } catch (err) {
      console.error("Failed to create poem:", err);
      setError(err.message || "Failed to create poem");
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/admin-dashboard/poems");
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
            Loading form data...
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
            href="/admin-dashboard/poems"
            className={`p-2 rounded-lg ${hoverBg} transition`}
          >
            <FaArrowLeft className={textColor} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Poem
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add a new poem to the collection
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
          <FaCheckCircle className="text-green-500 text-xl" />
          <p className="text-green-700 dark:text-green-300">
            Poem created successfully! Redirecting...
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
        <h3 className={`text-sm font-semibold ${textColor} mb-2`}>
          Quick Tips
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <li>
            • <strong>Title:</strong> Choose a clear, descriptive title
          </li>
          <li>
            • <strong>Slug:</strong> Will be automatically generated from the
            title
          </li>
          <li>
            • <strong>Content:</strong> Use proper formatting with line breaks
          </li>
          <li>
            • <strong>Tags:</strong> Add relevant tags to help with
            categorization
          </li>
          <li>
            • <strong>Status:</strong> Save as draft or publish immediately
          </li>
        </ul>
      </div>

      {/* Poem Form */}
      <PoemForm
        poets={poets}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        isEdit={false}
      />

      {/* Preview Card - Shows what the poem will look like */}
      <div
        className={`mt-6 bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}
      >
        <h3 className={`text-sm font-semibold ${textColor} mb-4`}>
          Preview Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Fields to fill:</p>
            <ul className="mt-1 space-y-1 text-gray-600 dark:text-gray-300">
              <li>• Title (required)</li>
              <li>• Slug (auto-generated)</li>
              <li>• Content (required)</li>
              <li>• Poet (required)</li>
              <li>• Category (required)</li>
              <li>• Language (required)</li>
            </ul>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Optional fields:</p>
            <ul className="mt-1 space-y-1 text-gray-600 dark:text-gray-300">
              <li>• Description</li>
              <li>• Script</li>
              <li>• Cover Image</li>
              <li>• Tags</li>
              <li>• Status (default: draft)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
