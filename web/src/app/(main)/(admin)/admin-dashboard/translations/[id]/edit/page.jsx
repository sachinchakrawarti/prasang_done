// src/app/(main)/(admin)/admin-dashboard/translations/[id]/edit/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaSave,
  FaTrash,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimes,
  FaLanguage,
  FaGlobe,
  FaFileAlt,
  FaUser,
  FaClock,
  FaEye,
  FaEyeSlash,
  FaInfoCircle,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import {
  fetchTranslationById,
  updateTranslation,
  deleteTranslation,
  fetchPoemById,
} from "@/services/adminService";

export default function EditTranslationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [poem, setPoem] = useState(null);
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
  const [showPreview, setShowPreview] = useState(true);

  // Load translation data
  useEffect(() => {
    const loadTranslation = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchTranslationById(id);
        const translationData = response.data || response;

        if (!translationData) {
          setError("Translation not found");
          setIsLoading(false);
          return;
        }

        setFormData({
          poemId: translationData.poemId || translationData.poem?.id || "",
          language: translationData.language || "",
          title: translationData.title || "",
          content: translationData.content || "",
          translatedBy: translationData.translatedBy || "",
          status: translationData.status || "draft",
          notes: translationData.notes || "",
        });

        // Load original poem if available
        if (translationData.poemId || translationData.poem?.id) {
          try {
            const poemResponse = await fetchPoemById(
              translationData.poemId || translationData.poem?.id,
            );
            const poemData = poemResponse.data || poemResponse;
            setPoem(poemData);
          } catch (poemErr) {
            console.error("Failed to load original poem:", poemErr);
          }
        }
      } catch (err) {
        console.error("Failed to load translation:", err);
        setError(err.message || "Failed to load translation");
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslation();
  }, [id]);

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
      case "title":
        if (!value?.trim()) error = "Title is required";
        break;
      case "content":
        if (!value?.trim()) error = "Content is required";
        break;
      case "language":
        if (!value?.trim()) error = "Language is required";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: error }));
    return error;
  };

  // Validate all fields
  const validateForm = () => {
    const fieldsToValidate = ["title", "content", "language"];
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

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateTranslation(id, formData);
      setSuccess(true);

      setTimeout(() => {
        router.push("/admin-dashboard/translations");
      }, 1500);
    } catch (err) {
      console.error("Failed to update translation:", err);
      setError(err.message || "Failed to update translation");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this translation? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteTranslation(id);
      router.push("/admin-dashboard/translations");
    } catch (err) {
      console.error("Failed to delete translation:", err);
      setError(err.message || "Failed to delete translation");
      setIsDeleting(false);
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
          <p className="text-gray-600 dark:text-gray-300">
            Loading translation...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Error Loading Translation
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={`px-6 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg font-medium hover:shadow-lg transition-all`}
          >
            Retry
          </button>
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
              Edit Translation
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update translation details and content
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaTrash size={14} />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
          <FaCheckCircle className="text-green-500 text-xl" />
          <p className="text-green-700 dark:text-green-300">
            Translation updated successfully! Redirecting...
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
            <FaTimes />
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Poem Info */}
            {poem && (
              <div className="md:col-span-2">
                <div
                  className={`p-4 rounded-lg ${hoverBg} border ${borderColor}`}
                >
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <FaFileAlt className={textColor} />
                    Original Poem
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Title
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {poem.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Language
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {(poem.language || "en").toUpperCase()}
                      </p>
                    </div>
                    {poem.poet?.name && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Poet
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {poem.poet.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

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
                disabled
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
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
              />
            </div>

            {/* Title */}
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
              />
              {touched.title && errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Translated Content *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className={`text-sm ${textColor} hover:underline flex items-center gap-1`}
                >
                  {showPreview ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
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
              />
              {touched.content && errors.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content}</p>
              )}
            </div>

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
            disabled={isSaving || success}
            className={`px-6 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg font-medium hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50`}
          >
            {isSaving ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaSave size={14} />
            )}
            {isSaving ? "Saving..." : "Update Translation"}
          </button>
        </div>
      </form>
    </div>
  );
}
