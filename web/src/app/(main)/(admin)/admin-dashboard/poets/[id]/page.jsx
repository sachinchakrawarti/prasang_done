// src/app/(main)/(admin)/admin-dashboard/poets/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaExclamationTriangle,
  FaUser,
  FaGlobe,
  FaCalendarAlt,
  FaTags,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaHeart,
  FaBookOpen,
  FaUsers,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFeather,
  FaQuoteLeft,
  FaQuoteRight,
  FaLink,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import { fetchPoetById, deletePoet } from "@/services/adminService";
import { fetchPoetPoems } from "@/services/poetService";
import PoemsCard from "@/components/poems/poemscard";

export default function PoetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [poet, setPoet] = useState(null);
  const [poems, setPoems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [showFullBio, setShowFullBio] = useState(false);
  const [poemsLoading, setPoemsLoading] = useState(true);

  // Load poet data
  useEffect(() => {
    const loadPoetData = async () => {
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
        
        setPoet(poetData);
        
        // Load poet's poems
        setPoemsLoading(true);
        try {
          const poemsResponse = await fetchPoetPoems(id, { 
            limit: 10, 
            page: 1,
            status: "published" 
          });
          const poemsData = poemsResponse.data || poemsResponse.poems || [];
          setPoems(Array.isArray(poemsData) ? poemsData : []);
        } catch (poemsErr) {
          console.error("Failed to load poet's poems:", poemsErr);
          setPoems([]);
        } finally {
          setPoemsLoading(false);
        }
        
      } catch (err) {
        console.error("Failed to load poet:", err);
        setError(err.message || "Failed to load poet");
      } finally {
        setIsLoading(false);
      }
    };

    loadPoetData();
  }, [id]);

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

  // Handle like (for poems)
  const handleLike = (poemId, liked) => {
    setPoems(prev =>
      prev.map(p =>
        p.id === poemId
          ? { ...p, likes: (p.likes || 0) + (liked ? 1 : -1), isLiked: liked }
          : p
      )
    );
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "inactive": return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
      case "deceased": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
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
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Social media platforms with icons
  const socialPlatforms = {
    twitter: { icon: FaTwitter, label: "Twitter", color: "#1DA1F2" },
    instagram: { icon: FaInstagram, label: "Instagram", color: "#E4405F" },
    facebook: { icon: FaFacebook, label: "Facebook", color: "#1877F2" },
    linkedin: { icon: FaLinkedin, label: "LinkedIn", color: "#0A66C2" },
    youtube: { icon: FaYoutube, label: "YouTube", color: "#FF0000" },
    website: { icon: FaLink, label: "Website", color: "#6B7280" },
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
  if (error || !poet) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {error || "Poet not found"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            The poet you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/admin-dashboard/poets"
            className={`px-6 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg font-medium hover:shadow-lg transition-all inline-block`}
          >
            Back to Poets
          </Link>
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
              {poet.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Poet Details
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin-dashboard/poets/${id}/edit`}
            className={`px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg hover:shadow-lg transition flex items-center gap-2`}
          >
            <FaEdit size={14} />
            Edit
          </Link>
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

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
          <FaExclamationTriangle className="text-red-500 text-xl" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Poet Profile Card */}
          <div className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} overflow-hidden`}>
            {/* Header with Gradient */}
            <div className={`p-6 bg-gradient-to-r ${gradient} bg-opacity-10 border-b ${borderColor}`}>
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-white text-3xl shadow-lg`}>
                    {poet.image ? (
                      <img
                        src={poet.image}
                        alt={poet.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FaUser />
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {poet.name}
                    </h2>
                    {poet.featured && (
                      <span className={`px-3 py-1 text-xs font-medium text-white bg-gradient-to-r ${gradient} rounded-full`}>
                        <FaStar className="inline mr-1" size={10} />
                        Featured
                      </span>
                    )}
                    <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(poet.status)}`}>
                      {poet.status || "active"}
                    </span>
                  </div>

                  {/* Country and Era */}
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {poet.country && (
                      <span className="flex items-center gap-1">
                        <FaGlobe size={14} />
                        {poet.country}
                      </span>
                    )}
                    {poet.era && (
                      <span className="flex items-center gap-1">
                        <FaClock size={14} />
                        {poet.era}
                      </span>
                    )}
                    {poet.birthYear && (
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt size={14} />
                        {poet.birthYear}{poet.deathYear ? ` - ${poet.deathYear}` : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {poet.biography && (
              <div className="p-6">
                <h3 className={`text-sm font-semibold ${textColor} mb-3 flex items-center gap-2`}>
                  <FaQuoteLeft size={14} />
                  Biography
                </h3>
                <div className="relative">
                  <FaQuoteLeft className={`absolute -top-1 -left-1 text-2xl ${textColor} opacity-20`} />
                  <div className="pl-4">
                    <p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${!showFullBio ? "line-clamp-4" : ""}`}>
                      {poet.biography}
                    </p>
                    {poet.biography.length > 300 && (
                      <button
                        onClick={() => setShowFullBio(!showFullBio)}
                        className={`mt-2 ${textColor} hover:underline text-sm font-medium`}
                      >
                        {showFullBio ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            {poet.tags && poet.tags.length > 0 && (
              <div className="px-6 pb-6">
                <h3 className={`text-sm font-semibold ${textColor} mb-3 flex items-center gap-2`}>
                  <FaTags size={14} />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {poet.tags.map((tag, index) => {
                    const tagName = typeof tag === 'string' ? tag : tag?.name || '';
                    return (
                      <span
                        key={index}
                        className={`px-3 py-1 text-sm rounded-full ${hoverBg} ${textColor} border ${borderColor}`}
                      >
                        #{tagName}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Poems Section */}
          <div className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${textColor} flex items-center gap-2`}>
                <FaFeather size={16} />
                Poems by {poet.name}
              </h3>
              <Link
                href={`/admin-dashboard/poems?poetId=${poet.id}`}
                className={`text-sm ${textColor} hover:underline`}
              >
                View All →
              </Link>
            </div>

            {poemsLoading ? (
              <div className="flex items-center justify-center py-8">
                <FaSpinner className="animate-spin text-2xl text-amber-500" />
              </div>
            ) : poems.length === 0 ? (
              <div className="text-center py-8">
                <FaFeather className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  No poems found for this poet
                </p>
                <Link
                  href={`/admin-dashboard/poems/new?poetId=${poet.id}`}
                  className={`inline-block mt-3 text-sm ${textColor} hover:underline`}
                >
                  Add first poem →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {poems.map((poem) => (
                  <PoemsCard
                    key={poem.id}
                    poem={{
                      ...poem,
                      poet: poet.name,
                      excerpt: poem.excerpt || poem.description || poem.content?.substring(0, 150) + "...",
                      tags: poem.tags || [],
                      type: poem.category?.name || poem.type || "Poem",
                    }}
                    lang="en"
                    variant="list"
                    showActions={true}
                    showTags={true}
                    showExcerpt={true}
                    onLike={handleLike}
                    onBookmark={() => {}}
                    onShare={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <div className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaBookOpen className={textColor} />
                  Total Works
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {poet.metadata?.works || poet.works || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaHeart className="text-red-400" />
                  Likes
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {poet.metadata?.likes || poet.likes || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaUsers className={textColor} />
                  Followers
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {poet.metadata?.followers || poet.followers || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          {poet.social && Object.values(poet.social).some(value => value) && (
            <div className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Social Links
              </h3>
              <div className="space-y-2">
                {Object.entries(socialPlatforms).map(([key, platform]) => {
                  const value = poet.social?.[key];
                  if (!value) return null;
                  const Icon = platform.icon;
                  return (
                    <a
                      key={key}
                      href={value.startsWith('http') ? value : `https://${value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-2 rounded-lg ${hoverBg} transition group`}
                    >
                      <Icon size={16} style={{ color: platform.color }} />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                        {platform.label}
                      </span>
                      <span className="ml-auto text-xs text-gray-400 truncate max-w-[120px]">
                        {value.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Dates
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaCalendarAlt className={textColor} />
                  Created
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {formatDate(poet.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaCalendarAlt className={textColor} />
                  Updated
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {formatDate(poet.updatedAt || poet.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6`}>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Actions
            </h3>
            <div className="space-y-2">
              <Link
                href={`/admin-dashboard/poets/${id}/edit`}
                className={`w-full px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2`}
              >
                <FaEdit size={14} />
                Edit Poet
              </Link>
              <Link
                href={`/admin-dashboard/poems/new?poetId=${poet.id}`}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <FaFeather size={14} />
                Add Poem
              </Link>
              <Link
                href={`/poets/${poet.slug}`}
                target="_blank"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <FaGlobe size={14} />
                View on Site
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaTrash size={14} />
                )}
                {isDeleting ? "Deleting..." : "Delete Poet"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}