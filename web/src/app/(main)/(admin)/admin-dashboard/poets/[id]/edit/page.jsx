// src/app/(main)/(admin)/admin-dashboard/poets/[id]/edit/page.jsx
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
  FaPlus,
  FaMinus,
  FaUser,
  FaGlobe,
  FaCalendarAlt,
  FaTags,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import { fetchPoetById, updatePoet, deletePoet } from "@/services/adminService";

export default function EditPoetPage() {
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
  const [socialKey, setSocialKey] = useState("");
  const [socialValue, setSocialValue] = useState("");

  // Load poet data
  useEffect(() => {
    const loadPoet = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetchPoetById(id);
        const poetData = response.data || response;
        
        if (!poetData) {
          setError("Poet not found");
          setIsLoading(false);
          return;
        }

        setFormData({
          name: poetData.name || "",
          slug: poetData.slug || "",
          biography: poetData.biography || poetData.bio || "",
          country: poetData.country || "",
          nationality: poetData.nationality || "",
          era: poetData.era || "",
          century: poetData.century || "",
          birthYear: poetData.birthYear || "",
          deathYear: poetData.deathYear || "",
          status: poetData.status || "active",
          image: poetData.image || poetData.avatar || "",
          coverImage: poetData.coverImage || "",
          featured: poetData.featured || false,
          tags: poetData.tags || [],
          social: {
            twitter: poetData.social?.twitter || "",
            instagram: poetData.social?.instagram || "",
            facebook: poetData.social?.facebook || "",
            linkedin: poetData.social?.linkedin || "",
            youtube: poetData.social?.youtube || "",
            website: poetData.social?.website || "",
          },
          metadata: {
            works: poetData.works || poetData.metadata?.works || 0,
            likes: poetData.likes || poetData.metadata?.likes || 0,
            followers: poetData.followers || poetData.metadata?.followers || 0,
          },
        });
      } catch (err) {
        console.error("Failed to load poet:", err);
        setError(err.message || "Failed to load poet");
      } finally {
        setIsLoading(false);
      }
    };

    loadPoet();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  // Handle tag input
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
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

  // Add custom social link
  const addSocialLink = () => {
    if (socialKey && socialValue) {
      setFormData((prev) => ({
        ...prev,
        social: {
          ...prev.social,
          [socialKey]: socialValue,
        },
      }));
      setSocialKey("");
      setSocialValue("");
    }
  };

  const removeSocialLink = (key) => {
    setFormData((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [key]: "",
      },
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Name is required");
      }
      if (!formData.slug.trim()) {
        throw new Error("Slug is required");
      }

      const updateData = {
        ...formData,
        tags: formData.tags,
        social: formData.social,
        metadata: formData.metadata,
      };

      await updatePoet(id, updateData);
      setSuccess(true);
      
      setTimeout(() => {
        router.push("/admin-dashboard/poets");
      }, 1500);
    } catch (err) {
      console.error("Failed to update poet:", err);
      setError(err.message || "Failed to update poet");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this poet? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deletePoet(id);
      router.push("/admin-dashboard/poets");
    } catch (err) {
      console.error("Failed to delete poet:", err);
      setError(err.message || "Failed to delete poet");
      setIsDeleting(false);
    }
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

  // Theme styles
  const getTextColor = () => {
    switch (themeName) {
      case "forest": return "text-green-600 dark:text-green-400";
      case "lavender": return "text-purple-600 dark:text-purple-400";
      case "rose": return "text-rose-600 dark:text-rose-400";
      case "sepia": return "text-amber-600 dark:text-amber-400";
      default: return "text-amber-600 dark:text-amber-400";
    }
  };

  const getGradient = () => {
    switch (themeName) {
      case "forest": return "from-green-600 to-emerald-500";
      case "lavender": return "from-purple-600 to-pink-500";
      case "rose": return "from-rose-600 to-pink-500";
      case "sepia": return "from-amber-700 to-yellow-600";
      default: return "from-amber-600 to-yellow-500";
    }
  };

  const getBorderColor = () => {
    switch (themeName) {
      case "forest": return "border-green-200 dark:border-green-800";
      case "lavender": return "border-purple-200 dark:border-purple-800";
      case "rose": return "border-rose-200 dark:border-rose-800";
      case "sepia": return "border-amber-200 dark:border-amber-800";
      default: return "border-amber-200 dark:border-amber-800";
    }
  };

  const getHoverBg = () => {
    switch (themeName) {
      case "forest": return "hover:bg-green-50 dark:hover:bg-green-900/20";
      case "lavender": return "hover:bg-purple-50 dark:hover:bg-purple-900/20";
      case "rose": return "hover:bg-rose-50 dark:hover:bg-rose-900/20";
      case "sepia": return "hover:bg-amber-50 dark:hover:bg-amber-900/20";
      default: return "hover:bg-amber-50 dark:hover:bg-amber-900/20";
    }
  };

  const textColor = getTextColor();
  const gradient = getGradient();
  const borderColor = getBorderColor();
  const hoverBg = getHoverBg();

  // Social media platforms with icons
  const socialPlatforms = {
    twitter: { icon: FaTwitter, label: "Twitter", placeholder: "@username" },
    instagram: { icon: FaInstagram, label: "Instagram", placeholder: "@username" },
    facebook: { icon: FaFacebook, label: "Facebook", placeholder: "username" },
    linkedin: { icon: FaLinkedin, label: "LinkedIn", placeholder: "username" },
    youtube: { icon: FaYoutube, label: "YouTube", placeholder: "channel-id" },
    website: { icon: FaGlobe, label: "Website", placeholder: "https://..." },
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading poet...</p>
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
            Error Loading Poet
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
            href="/admin-dashboard/poets"
            className={`p-2 rounded-lg ${hoverBg} transition`}
          >
            <FaArrowLeft className={textColor} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Poet
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update poet details and information
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
            Poet updated successfully! Redirecting...
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
        <div className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}>
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
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  placeholder="Enter poet name"
                  required
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className={`px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg hover:shadow-lg transition whitespace-nowrap`}
                  disabled={!formData.name}
                >
                  Generate Slug
                </button>
              </div>
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                placeholder="poet-url-slug"
                required
              />
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
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="deceased">Deceased</option>
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
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Featured Poet
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
            <FaTags />
            Tags
          </h3>
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
            />
            <button
              type="button"
              onClick={() => addTag(tagInput.trim())}
              className={`px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg hover:shadow-lg transition`}
            >
              <FaPlus size={14} />
            </button>
          </div>
        </div>

        {/* Social Links Section */}
        <div className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
            <FaGlobe />
            Social Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(socialPlatforms).map(([key, platform]) => {
              const Icon = platform.icon;
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Icon className="inline mr-1" />
                    {platform.label}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.social[key] || ""}
                      onChange={(e) => handleSocialChange(key, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                      placeholder={platform.placeholder}
                    />
                    {formData.social[key] && (
                      <button
                        type="button"
                        onClick={() => removeSocialLink(key)}
                        className="px-3 py-2 text-red-500 hover:text-red-700 transition"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Metadata Section */}
        <div className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
            <FaUser />
            Metadata
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total Works
              </label>
              <input
                type="number"
                value={formData.metadata.works}
                onChange={(e) => handleMetadataChange("works", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Likes
              </label>
              <input
                type="number"
                value={formData.metadata.likes}
                onChange={(e) => handleMetadataChange("likes", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Followers
              </label>
              <input
                type="number"
                value={formData.metadata.followers}
                onChange={(e) => handleMetadataChange("followers", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin-dashboard/poets"
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
            {isSaving ? "Saving..." : "Update Poet"}
          </button>
        </div>
      </form>
    </div>
  );
}