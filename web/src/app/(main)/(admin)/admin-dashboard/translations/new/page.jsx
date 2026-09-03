// src/app/(main)/(admin)/admin-dashboard/translations/new/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaLanguage,
  FaFileAlt,
  FaPlus,
  FaInfoCircle,
  FaUser,
  FaGlobe,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import { createTranslation, fetchPoems } from "@/services/adminService";

export default function CreateTranslationPage() {
  const router = useRouter();
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [poems, setPoems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [formData, setFormData] = useState({
    poemId: "",
    language: "",
    title: "",
    content: "",
    translatedBy: "",
    status: "draft",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  // Load poems for selection
  useEffect(() => {
    const loadPoems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchPoems({ limit: 100, status: "published" });
        const poemsData = response.data || [];
        setPoems(poemsData);
      } catch (err) {
        console.error("Failed to load poems:", err);
        setError(err.message || "Failed to load poems");
      } finally {
        setIsLoading(false);
      }
    };

    loadPoems();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // If poem changes, update selected poem info
    if (name === "poemId") {
      const poem = poems.find((p) => p.id === parseInt(value));
      setSelectedPoem(poem);
    }
  };

  // Handle blur for validation
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name);
  };

  // Validate a single field
  const validateField = (fieldName) => {
    let error = "";
    const value = formData[fieldName];

    switch (fieldName) {
      case "poemId":
        if (!value) error = "Please select a poem";
        break;
      case "language":
        if (!value?.trim()) error = "Language is required";
        break;
      case "title":
        if (!value?.trim()) error = "Title is required";
        break;
      case "content":
        if (!value?.trim()) error = "Content is required";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: error }));
    return error;
  };

  // Validate all fields
  const validateForm = () => {
    const fieldsToValidate = ["poemId", "language", "title", "content"];
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      const error = validateField(field);
      if (error) isValid = false;
    });

    return isValid;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Focus first error field
      const firstError = Object.keys(errors).find((key) => errors[key]);
      if (firstError) {
        const element = document.querySelector(`[name="${firstError}"]`);
        if (element) element.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const submitData = {
        ...formData,
        poemId: parseInt(formData.poemId),
      };

      const response = await createTranslation(submitData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin-dashboard/translations");
        }, 1500);
      } else {
        throw new Error(response.message || "Failed to create translation");
      }
    } catch (err) {
      console.error("Failed to create translation:", err);
      setError(err.message || "Failed to create translation");
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/admin-dashboard/translations");
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

  // Language options
  const languageOptions = [
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
    { value: "pt", label: "Portuguese" },
    { value: "it", label: "Italian" },
    { value: "ko", label: "Korean" },
  ];

  // Status options
  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading poems...</p>
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
            href="/admin-dashboard/translations"
            className={`p-2 rounded-lg ${hoverBg} transition`}
          >
            <FaArrowLeft className={textColor} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Translation
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Translate a poem into another language
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
          <FaCheckCircle className="text-green-500 text-xl" />
          <p className="text-green-700 dark:text-green-300">
            Translation created successfully! Redirecting...
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
          Quick Tips for Adding a Translation
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <li>
            • <strong>Poem:</strong> Select the original poem to translate
          </li>
          <li>
            • <strong>Language:</strong> Choose the target language
          </li>
          <li>
            • <strong>Title:</strong> Use the translated title
          </li>
          <li>
            • <strong>Content:</strong> Add the translated poem content
          </li>
          <li>
            • <strong>Translator:</strong> Credit who did the translation
          </li>
          <li>
            • <strong>Status:</strong> Save as draft or publish immediately
          </li>
        </ul>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Poem Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaFileAlt className="inline mr-1" />
                Original Poem *
              </label>
              <select
                name="poemId"
                value={formData.poemId}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 rounded-lg border ${
                  touched.poemId && errors.poemId
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition`}
                disabled={isSubmitting}
              >
                <option value="">Select a poem</option>
                {poems.map((poem) => (
                  <option key={poem.id} value={poem.id}>
                    {poem.title} ({poem.language?.toUpperCase() || "EN"})
                  </option>
                ))}
              </select>
              {touched.poemId && errors.poemId && (
                <p className="mt-1 text-sm text-red-500">{errors.poemId}</p>
              )}
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaLanguage className="inline mr-1" />
                Target Language *
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 rounded-lg border ${
                  touched.language && errors.language
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition`}
                disabled={isSubmitting}
              >
                <option value="">Select language</option>
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {touched.language && errors.language && (
                <p className="mt-1 text-sm text-red-500">{errors.language}</p>
              )}
            </div>

            {/* Translated Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Translated Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 rounded-lg border ${
                  touched.title && errors.title
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition`}
                placeholder="Enter translated title"
                disabled={isSubmitting}
              />
              {touched.title && errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Translated By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaUser className="inline mr-1" />
                Translated By
              </label>
              <input
                type="text"
                name="translatedBy"
                value={formData.translatedBy}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                placeholder="Name of translator"
                disabled={isSubmitting}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                disabled={isSubmitting}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Translated Content *
                </label>
                {formData.content && (
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className={`text-sm ${textColor} hover:underline flex items-center gap-1`}
                  >
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </button>
                )}
              </div>

              {showPreview && formData.content && (
                <div
                  className={`mb-4 p-4 rounded-lg ${hoverBg} border ${borderColor} prose prose-sm dark:prose-invert max-w-none`}
                >
                  <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {formData.content}
                  </div>
                </div>
              )}

              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                onBlur={handleBlur}
                rows="12"
                className={`w-full px-4 py-2 rounded-lg border ${
                  touched.content && errors.content
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition font-mono`}
                placeholder="Enter translated poem content..."
                disabled={isSubmitting}
              />
              {touched.content && errors.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content}</p>
              )}
            </div>

            {/* Original Poem Preview */}
            {selectedPoem && (
              <div className="md:col-span-2">
                <div
                  className={`p-4 rounded-lg ${hoverBg} border ${borderColor}`}
                >
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <FaFileAlt className={textColor} />
                    Original Poem Content
                  </h4>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 max-h-48 overflow-y-auto">
                      {selectedPoem.content}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaInfoCircle className="inline mr-1" />
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                placeholder="Add any notes about this translation..."
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin-dashboard/translations"
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || success}
            className={`px-6 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg font-medium hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50`}
          >
            {isSubmitting ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaPlus size={14} />
            )}
            {isSubmitting ? "Creating..." : "Create Translation"}
          </button>
        </div>
      </form>

      {/* Information Card */}
      <div
        className={`mt-6 bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}
      >
        <h3
          className={`text-sm font-semibold ${textColor} mb-4 flex items-center gap-2`}
        >
          <FaGlobe size={14} />
          Translation Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">
              Best Practices:
            </p>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li>• Maintain the original meaning and tone</li>
              <li>• Preserve the poetic structure when possible</li>
              <li>• Use appropriate cultural references</li>
              <li>• Keep the translation natural and flowing</li>
            </ul>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">
              Quality Checklist:
            </p>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li>• ✓ Accurate translation of meaning</li>
              <li>• ✓ Proper grammar and syntax</li>
              <li>• ✓ Appropriate style and register</li>
              <li>• ✓ Reviewed for readability</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400">
            <span className="text-red-500">*</span> Required fields must be
            filled to create the translation
          </p>
        </div>
      </div>
    </div>
  );
}
