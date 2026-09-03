// src/app/(main)/(admin)/admin-dashboard/poets/new/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUser,
  FaGlobe,
  FaCalendarAlt,
  FaTags,
  FaPlus,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import PoetForm from "../components/PoetForm";
import { createPoet } from "@/services/adminService";

export default function CreatePoetPage() {
  const router = useRouter();
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Ensure metadata fields are numbers
      const submitData = {
        ...formData,
        metadata: {
          works: parseInt(formData.metadata?.works) || 0,
          likes: parseInt(formData.metadata?.likes) || 0,
          followers: parseInt(formData.metadata?.followers) || 0,
        },
      };

      const response = await createPoet(submitData);

      if (response.success) {
        setSuccess(true);
        // Redirect to poets list after a short delay
        setTimeout(() => {
          router.push("/admin-dashboard/poets");
        }, 1500);
      } else {
        throw new Error(response.message || "Failed to create poet");
      }
    } catch (err) {
      console.error("Failed to create poet:", err);
      setError(err.message || "Failed to create poet");
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/admin-dashboard/poets");
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin-dashboard/poets"
            className={`p-2 rounded-lg ${hoverBg} transition`}
          >
            <FaArrowLeft className={textColor} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Poet
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add a new poet to the collection
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
          <FaCheckCircle className="text-green-500 text-xl" />
          <p className="text-green-700 dark:text-green-300">
            Poet created successfully! Redirecting...
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
          Quick Tips for Adding a Poet
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <li>
            • <strong>Name:</strong> Use the poet's full name
          </li>
          <li>
            • <strong>Slug:</strong> Will be automatically generated
          </li>
          <li>
            • <strong>Biography:</strong> Include key life events and
            achievements
          </li>
          <li>
            • <strong>Country:</strong> Country of origin or primary residence
          </li>
          <li>
            • <strong>Era:</strong> Literary period or movement they belong to
          </li>
          <li>
            • <strong>Tags:</strong> Add relevant tags for categorization
          </li>
          <li>
            • <strong>Status:</strong> Set as active to make visible on the site
          </li>
          <li>
            • <strong>Social Links:</strong> Connect social media profiles
          </li>
        </ul>
      </div>

      {/* Poet Form */}
      <PoetForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={false}
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
          <FaUser size={14} />
          What You'll Need
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">
              Required Fields:
            </p>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li>
                • <span className="text-red-500">*</span> Name
              </li>
              <li>
                • <span className="text-red-500">*</span> Slug (auto-generated)
              </li>
            </ul>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">
              Recommended Fields:
            </p>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li>• Biography (for poet profile)</li>
              <li>• Country and Nationality</li>
              <li>• Era and Century</li>
              <li>• Birth/Death Years</li>
              <li>• Profile Image</li>
              <li>• Social Media Links</li>
              <li>• Tags for categorization</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400">
            <span className="text-red-500">*</span> Required fields must be
            filled to create the poet
          </p>
        </div>
      </div>
    </div>
  );
}
