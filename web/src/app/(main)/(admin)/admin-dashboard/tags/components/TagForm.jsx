// src/app/(main)/(admin)/admin-dashboard/tags/components/TagForm.jsx
"use client";

import { useState, useEffect } from "react";
import {
  FaSave,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTags,
  FaInfoCircle,
  FaPalette,
  FaHashtag,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";

export default function TagForm({
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}) {
  const { themeName } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#8b5cf6",
    icon: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Initialize form with data
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        color: initialData.color || "#8b5cf6",
        icon: initialData.icon || "",
        status: initialData.status || "active",
      });
    }
  }, [initialData]);

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
      case "name":
        if (!value?.trim()) error = "Tag name is required";
        break;
      case "slug":
        if (!value?.trim()) error = "Slug is required";
        else if (!/^[a-z0-9-]+$/.test(value))
          error =
            "Slug can only contain lowercase letters, numbers, and hyphens";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: error }));
    return error;
  };

  // Validate all fields
  const validateForm = () => {
    const fieldsToValidate = ["name", "slug"];
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      const error = validateField(field);
      if (error) isValid = false;
    });

    return isValid;
  };

  // Generate slug from name
  const generateSlug = () => {
    if (!formData.name) return;
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, slug }));
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
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to save tag",
      }));
    } finally {
      setIsSubmitting(false);
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

  // Color options
  const colorOptions = [
    { value: "#8b5cf6", label: "Purple" },
    { value: "#3b82f6", label: "Blue" },
    { value: "#10b981", label: "Green" },
    { value: "#f59e0b", label: "Amber" },
    { value: "#ef4444", label: "Red" },
    { value: "#ec4899", label: "Pink" },
    { value: "#06b6d4", label: "Cyan" },
    { value: "#f97316", label: "Orange" },
    { value: "#6b7280", label: "Gray" },
    { value: "#1f2937", label: "Dark" },
  ];

  // Status options
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Submit Error */}
      {errors.submit && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
          <FaExclamationTriangle className="text-red-500 text-xl" />
          <p className="text-red-700 dark:text-red-300">{errors.submit}</p>
          <button
            type="button"
            onClick={() => setErrors((prev) => ({ ...prev, submit: "" }))}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FaHashtag className="inline mr-1" />
              Tag Name *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  touched.name && errors.name
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition`}
                placeholder="Enter tag name"
                disabled={isLoading || isSubmitting}
                required
              />
              <button
                type="button"
                onClick={generateSlug}
                className={`px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg hover:shadow-lg transition whitespace-nowrap`}
                disabled={isLoading || isSubmitting || !formData.name}
              >
                Generate Slug
              </button>
            </div>
            {touched.name && errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 rounded-lg border ${
                touched.slug && errors.slug
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition`}
              placeholder="tag-url-slug"
              disabled={isLoading || isSubmitting}
              required
            />
            {touched.slug && errors.slug && (
              <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              placeholder="Describe the tag..."
              disabled={isLoading || isSubmitting}
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FaPalette className="inline mr-1" />
              Color
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  disabled={isLoading || isSubmitting}
                >
                  {colorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div
                className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 flex-shrink-0"
                style={{ backgroundColor: formData.color }}
              />
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                disabled={isLoading || isSubmitting}
              />
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FaTags className="inline mr-1" />
              Icon (emoji or icon class)
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              placeholder="🏷️ or fa-tag"
              disabled={isLoading || isSubmitting}
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
              disabled={isLoading || isSubmitting}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} overflow-hidden`}
      >
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
        >
          <span
            className={`text-sm font-semibold ${textColor} flex items-center gap-2`}
          >
            <FaInfoCircle size={14} />
            Preview
          </span>
          <span className="text-gray-400">
            {showPreview ? <FaMinus size={12} /> : <FaPlus size={12} />}
          </span>
        </button>

        {showPreview && (
          <div className="px-6 pb-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{
                  backgroundColor: formData.color || "#8b5cf6",
                  color: "#fff",
                }}
              >
                {formData.icon || <FaTags />}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  #{formData.name || "Tag Name"}
                </p>
                {formData.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.description}
                  </p>
                )}
              </div>
              <span
                className={`ml-auto px-2 py-1 text-xs rounded-full ${
                  formData.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : formData.status === "archived"
                      ? "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {formData.status || "active"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
          disabled={isLoading || isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className={`px-6 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg font-medium hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50`}
        >
          {isSubmitting ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaSave size={14} />
          )}
          {isSubmitting ? "Saving..." : isEdit ? "Update Tag" : "Create Tag"}
        </button>
      </div>
    </form>
  );
}
