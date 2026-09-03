// src/app/(main)/(admin)/admin-dashboard/poets/components/PoetForm.jsx
"use client";

import { useState, useEffect } from "react";
import {
  FaSave,
  FaTimes,
  FaPlus,
  FaMinus,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaGlobe,
  FaCalendarAlt,
  FaTags,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaLink,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";

export default function PoetForm({
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
    biography: "",
    country: "",
    nationality: "",
    era: "",
    century: "",
    birthYear: "",
    deathYear: "",
    status: "active",
    image: "",
    coverImage: "",
    featured: false,
    tags: [],
    social: {
      twitter: "",
      instagram: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      website: "",
    },
    metadata: {
      works: 0,
      likes: 0,
      followers: 0,
    },
  });
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Initialize form with data
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        biography: initialData.biography || initialData.bio || "",
        country: initialData.country || "",
        nationality: initialData.nationality || "",
        era: initialData.era || "",
        century: initialData.century || "",
        birthYear: initialData.birthYear || "",
        deathYear: initialData.deathYear || "",
        status: initialData.status || "active",
        image: initialData.image || initialData.avatar || "",
        coverImage: initialData.coverImage || "",
        featured: initialData.featured || false,
        tags: initialData.tags || [],
        social: {
          twitter: initialData.social?.twitter || "",
          instagram: initialData.social?.instagram || "",
          facebook: initialData.social?.facebook || "",
          linkedin: initialData.social?.linkedin || "",
          youtube: initialData.social?.youtube || "",
          website: initialData.social?.website || "",
        },
        metadata: {
          works: initialData.metadata?.works || initialData.works || 0,
          likes: initialData.metadata?.likes || initialData.likes || 0,
          followers:
            initialData.metadata?.followers || initialData.followers || 0,
        },
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

  // Handle nested social changes
  const handleSocialChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [key]: value,
      },
    }));
  };

  // Handle nested metadata changes
  const handleMetadataChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [key]: parseInt(value) || 0,
      },
    }));
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
        if (!value?.trim()) error = "Name is required";
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

  // Handle tag input
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
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
      const submitData = {
        ...formData,
        tags: formData.tags,
        social: formData.social,
        metadata: formData.metadata,
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to save poet",
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

  // Social media platforms with icons
  const socialPlatforms = {
    twitter: {
      icon: FaTwitter,
      label: "Twitter",
      placeholder: "@username",
      color: "#1DA1F2",
    },
    instagram: {
      icon: FaInstagram,
      label: "Instagram",
      placeholder: "@username",
      color: "#E4405F",
    },
    facebook: {
      icon: FaFacebook,
      label: "Facebook",
      placeholder: "username",
      color: "#1877F2",
    },
    linkedin: {
      icon: FaLinkedin,
      label: "LinkedIn",
      placeholder: "username",
      color: "#0A66C2",
    },
    youtube: {
      icon: FaYoutube,
      label: "YouTube",
      placeholder: "channel-id",
      color: "#FF0000",
    },
    website: {
      icon: FaLink,
      label: "Website",
      placeholder: "https://...",
      color: "#6B7280",
    },
  };

  // Status options
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "deceased", label: "Deceased" },
  ];

  // Tab navigation
  const tabs = [
    { id: "basic", label: "Basic Info", icon: FaUser },
    { id: "social", label: "Social Links", icon: FaGlobe },
    { id: "metadata", label: "Metadata", icon: FaCalendarAlt },
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
        className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} overflow-hidden`}
      >
        {/* Tabs */}
        <div className={`border-b ${borderColor} px-6 pt-4 overflow-x-auto`}>
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-t-lg transition flex items-center gap-2 ${
                    isActive
                      ? `bg-gradient-to-r ${gradient} text-white`
                      : `${hoverBg} text-gray-600 dark:text-gray-400`
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
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
                    placeholder="Enter poet name"
                    disabled={isLoading || isSubmitting}
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
                  placeholder="poet-url-slug"
                  disabled={isLoading || isSubmitting}
                />
                {touched.slug && errors.slug && (
                  <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
                )}
              </div>

              {/* Biography */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Biography
                </label>
                <textarea
                  name="biography"
                  value={formData.biography}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  placeholder="Write a detailed biography of the poet..."
                  disabled={isLoading || isSubmitting}
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaGlobe className="inline mr-1" />
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  placeholder="e.g., India, England"
                  disabled={isLoading || isSubmitting}
                />
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  placeholder="e.g., Indian, British"
                  disabled={isLoading || isSubmitting}
                />
              </div>

              {/* Era */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaCalendarAlt className="inline mr-1" />
                  Era
                </label>
                <input
                  type="text"
                  name="era"
                  value={formData.era}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  placeholder="e.g., Renaissance, Romantic"
                  disabled={isLoading || isSubmitting}
                />
              </div>

              {/* Century */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Century
                </label>
                <input
                  type="text"
                  name="century"
                  value={formData.century}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  placeholder="e.g., 18th, 19th"
                  disabled={isLoading || isSubmitting}
                />
              </div>

              {/* Birth Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Birth Year
                </label>
                <input
                  type="text"
                  name="birthYear"
                  value={formData.birthYear}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  placeholder="e.g., 1564"
                  disabled={isLoading || isSubmitting}
                />
              </div>

              {/* Death Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Death Year
                </label>
                <input
                  type="text"
                  name="deathYear"
                  value={formData.deathYear}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  placeholder="e.g., 1616"
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

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  placeholder="https://example.com/avatar.jpg"
                  disabled={isLoading || isSubmitting}
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  placeholder="https://example.com/cover.jpg"
                  disabled={isLoading || isSubmitting}
                />
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                    disabled={isLoading || isSubmitting}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Featured Poet
                  </span>
                </label>
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaTags className="inline mr-1" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 text-sm rounded-full ${hoverBg} ${textColor} border ${borderColor} flex items-center gap-2`}
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-400 hover:text-red-500 transition"
                        disabled={isLoading || isSubmitting}
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                    placeholder="Type a tag and press Enter"
                    disabled={isLoading || isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => addTag(tagInput.trim())}
                    className={`px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg hover:shadow-lg transition disabled:opacity-50`}
                    disabled={isLoading || isSubmitting || !tagInput.trim()}
                  >
                    <FaPlus size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === "social" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(socialPlatforms).map(([key, platform]) => {
                const Icon = platform.icon;
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Icon
                        className="inline mr-1"
                        style={{ color: platform.color }}
                      />
                      {platform.label}
                    </label>
                    <input
                      type="text"
                      value={formData.social[key] || ""}
                      onChange={(e) => handleSocialChange(key, e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                      placeholder={platform.placeholder}
                      disabled={isLoading || isSubmitting}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Metadata Tab */}
          {activeTab === "metadata" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Works
                </label>
                <input
                  type="number"
                  value={formData.metadata.works}
                  onChange={(e) =>
                    handleMetadataChange("works", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  min="0"
                  disabled={isLoading || isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Likes
                </label>
                <input
                  type="number"
                  value={formData.metadata.likes}
                  onChange={(e) =>
                    handleMetadataChange("likes", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  min="0"
                  disabled={isLoading || isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Followers
                </label>
                <input
                  type="number"
                  value={formData.metadata.followers}
                  onChange={(e) =>
                    handleMetadataChange("followers", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  min="0"
                  disabled={isLoading || isSubmitting}
                />
              </div>
            </div>
          )}
        </div>
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
          {isSubmitting ? "Saving..." : isEdit ? "Update Poet" : "Create Poet"}
        </button>
      </div>
    </form>
  );
}
