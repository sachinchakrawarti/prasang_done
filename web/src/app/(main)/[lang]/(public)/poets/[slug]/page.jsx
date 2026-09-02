// src/app/(main)/[lang]/(public)/poets/[slug]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaUser,
  FaGlobe,
  FaClock,
  FaHeart,
  FaBookOpen,
  FaUsers,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaQuoteLeft,
  FaShare,
  FaCopy,
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaFeather,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaAward,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import PoemsCard from "@/components/poems/poemscard";
import { fetchPoetBySlug, fetchPoetPoems } from "@/services/poetService";
import { toggleLike } from "@/services/poemService";

export default function PoetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params?.lang || "en";
  const slug = params?.slug;
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [poet, setPoet] = useState(null);
  const [poems, setPoems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullBio, setShowFullBio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Load poet data
  useEffect(() => {
    const loadPoetData = async () => {
      if (!slug) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch poet by slug
        const poetResponse = await fetchPoetBySlug(slug);
        console.log("Poet response:", poetResponse);

        const poetData = poetResponse.data || poetResponse;

        if (!poetData) {
          setError("Poet not found");
          setIsLoading(false);
          return;
        }

        setPoet(poetData);

        // Fetch poet's poems
        try {
          const poemsResponse = await fetchPoetPoems(poetData.id, {
            page: 1,
            limit: 10,
            status: "published",
          });
          console.log("Poems response:", poemsResponse);

          const poemsData = poemsResponse.data || poemsResponse.poems || [];
          setPoems(Array.isArray(poemsData) ? poemsData : []);

          if (poemsResponse.pagination) {
            setPagination({
              page: poemsResponse.pagination.page || 1,
              limit: poemsResponse.pagination.limit || 10,
              total: poemsResponse.pagination.total || 0,
              totalPages: poemsResponse.pagination.totalPages || 0,
            });
          }
        } catch (poemsErr) {
          console.error("Failed to load poet's poems:", poemsErr);
          setPoems([]);
        }
      } catch (err) {
        console.error("Failed to load poet:", err);
        setError(err.message || "Failed to load poet");
      } finally {
        setIsLoading(false);
      }
    };

    loadPoetData();
  }, [slug]);

  // Load more poems
  const loadMorePoems = async () => {
    if (!poet || pagination.page >= pagination.totalPages) return;

    try {
      const nextPage = pagination.page + 1;
      const response = await fetchPoetPoems(poet.id, {
        page: nextPage,
        limit: pagination.limit,
        status: "published",
      });

      const newPoems = response.data || response.poems || [];
      setPoems((prev) => [
        ...prev,
        ...(Array.isArray(newPoems) ? newPoems : []),
      ]);

      if (response.pagination) {
        setPagination({
          page: response.pagination.page || nextPage,
          limit: response.pagination.limit || pagination.limit,
          total: response.pagination.total || 0,
          totalPages: response.pagination.totalPages || 0,
        });
      }
    } catch (err) {
      console.error("Failed to load more poems:", err);
    }
  };

  // Handle like
  const handleLike = async (poemId, liked) => {
    setPoems((prev) =>
      prev.map((p) =>
        p.id === poemId
          ? { ...p, likes: (p.likes || 0) + (liked ? 1 : -1), isLiked: liked }
          : p,
      ),
    );

    try {
      await toggleLike(poemId);
    } catch (err) {
      // Revert on error
      setPoems((prev) =>
        prev.map((p) =>
          p.id === poemId
            ? {
                ...p,
                likes: (p.likes || 0) + (liked ? -1 : 1),
                isLiked: !liked,
              }
            : p,
        ),
      );
      console.error("Failed to toggle like:", err);
    }
  };

  // Handle share
  const handleShare = () => {
    setShowShare(!showShare);
  };

  // Handle copy link
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Theme-aware styles
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
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {t?.("loading") || "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Not found
  if (error || !poet) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="text-center">
          <FaUser className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
            {t?.("poetNotFound") || "Poet not found"}
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mt-2">{error}</p>
          <Link
            href={`/${lang}/poets`}
            className={`inline-block mt-4 px-6 py-2 bg-gradient-to-r ${gradient} text-white rounded-full font-medium hover:shadow-lg transition-all`}
          >
            {t?.("viewAllPoets") || "View All Poets"} →
          </Link>
        </div>
      </div>
    );
  }

  // Format poet data
  const poetName = poet.name || "Unknown Poet";
  const poetCountry = poet.country || poet.nationality || "Unknown";
  const poetEra = poet.era || poet.century || "";
  const poetBio = poet.bio || poet.biography || "";
  const poetImage = poet.image || poet.avatar || null;
  const poetTags = poet.tags || [];
  const poetLikes = poet.likes || 0;
  const poetFollowers = poet.followers || 0;
  const poetWorks = poet.works || poems.length || 0;
  const isFeatured = poet.featured || false;
  const poetSocial = poet.social || {};

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/${lang}/poets`}
          className={`inline-flex items-center gap-2 ${textColor} hover:underline mb-6 group`}
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          {t?.("backToPoets") || "Back to Poets"}
        </Link>

        {/* Poet Profile Card */}
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${borderColor} overflow-hidden`}
        >
          {/* Header with Gradient */}
          <div
            className={`p-6 sm:p-8 bg-gradient-to-r ${gradient} bg-opacity-10 border-b ${borderColor}`}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div
                  className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-white text-4xl shadow-lg`}
                >
                  {poetImage ? (
                    <img
                      src={poetImage}
                      alt={poetName}
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
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {poetName}
                  </h1>
                  {isFeatured && (
                    <span
                      className={`px-3 py-1 text-xs font-medium text-white bg-gradient-to-r ${gradient} rounded-full`}
                    >
                      <FaStar className="inline mr-1" size={10} />
                      {t?.("featured") || "Featured"}
                    </span>
                  )}
                </div>

                {/* Country and Era */}
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaGlobe size={14} />
                    {poetCountry}
                  </span>
                  {poetEra && (
                    <span className="flex items-center gap-1">
                      <FaClock size={14} />
                      {poetEra}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <FaBookOpen size={14} />
                    {poetWorks} {t?.("works") || "works"}
                  </span>
                </div>

                {/* Tags */}
                {poetTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {poetTags.map((tag, index) => {
                      const tagName =
                        typeof tag === "string" ? tag : tag?.name || "";
                      return (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-full ${hoverBg} ${textColor}`}
                        >
                          #{tagName}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className={`p-2 rounded-full ${hoverBg} transition-all relative`}
                  aria-label={t?.("share") || "Share"}
                >
                  <FaShare className={`text-xl ${textColor}`} />
                  {showShare && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FaCopy size={14} />
                        {copied
                          ? t?.("copied") || "Copied!"
                          : t?.("copyLink") || "Copy Link"}
                      </button>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(poetName)}&url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FaTwitter size={14} className="text-blue-400" />
                        Twitter
                      </a>
                      <a
                        href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FaFacebook size={14} className="text-blue-600" />
                        Facebook
                      </a>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            className={`p-6 grid grid-cols-3 gap-4 border-b ${borderColor} bg-gray-50 dark:bg-gray-900/30`}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {poetWorks}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t?.("works") || "Works"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {poetLikes}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <FaHeart className={`inline ${textColor}`} size={12} />{" "}
                {t?.("likes") || "Likes"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {poetFollowers}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <FaUsers className="inline" size={12} />{" "}
                {t?.("followers") || "Followers"}
              </div>
            </div>
          </div>

          {/* Bio */}
          {poetBio && (
            <div className="p-6">
              <h3 className={`text-lg font-semibold ${textColor} mb-3`}>
                {t?.("biography") || "Biography"}
              </h3>
              <div className="relative">
                <FaQuoteLeft
                  className={`absolute -top-1 -left-1 text-3xl ${textColor} opacity-20`}
                />
                <div className="pl-6">
                  <p
                    className={`text-gray-700 dark:text-gray-300 leading-relaxed ${!showFullBio ? "line-clamp-4" : ""}`}
                  >
                    {poetBio}
                  </p>
                  {poetBio.length > 300 && (
                    <button
                      onClick={() => setShowFullBio(!showFullBio)}
                      className={`mt-2 ${textColor} hover:underline text-sm font-medium`}
                    >
                      {showFullBio ? (
                        <span className="flex items-center gap-1">
                          {t?.("showLess") || "Show Less"}{" "}
                          <FaChevronUp size={12} />
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          {t?.("readMore") || "Read More"}{" "}
                          <FaChevronDown size={12} />
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Social Links */}
          {Object.keys(poetSocial).length > 0 && (
            <div className={`p-6 border-t ${borderColor}`}>
              <h3
                className={`text-sm font-medium text-gray-500 dark:text-gray-400 mb-3`}
              >
                {t?.("connect") || "Connect"}
              </h3>
              <div className="flex gap-3">
                {poetSocial.twitter && (
                  <a
                    href={
                      poetSocial.twitter.startsWith("http")
                        ? poetSocial.twitter
                        : `https://twitter.com/${poetSocial.twitter}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full ${hoverBg} ${textColor} transition-colors`}
                  >
                    <FaTwitter size={20} />
                  </a>
                )}
                {poetSocial.instagram && (
                  <a
                    href={
                      poetSocial.instagram.startsWith("http")
                        ? poetSocial.instagram
                        : `https://instagram.com/${poetSocial.instagram}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full ${hoverBg} ${textColor} transition-colors`}
                  >
                    <FaInstagram size={20} />
                  </a>
                )}
                {poetSocial.facebook && (
                  <a
                    href={
                      poetSocial.facebook.startsWith("http")
                        ? poetSocial.facebook
                        : `https://facebook.com/${poetSocial.facebook}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full ${hoverBg} ${textColor} transition-colors`}
                  >
                    <FaFacebook size={20} />
                  </a>
                )}
                {poetSocial.linkedin && (
                  <a
                    href={
                      poetSocial.linkedin.startsWith("http")
                        ? poetSocial.linkedin
                        : `https://linkedin.com/in/${poetSocial.linkedin}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full ${hoverBg} ${textColor} transition-colors`}
                  >
                    <FaLinkedin size={20} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Poems Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${textColor}`}>
              {t?.("poemsByPoet") || "Poems by"} {poetName}
            </h2>
            <span className="text-sm text-gray-400">
              {poems.length} {t?.("poems") || "poems"}
            </span>
          </div>

          {poems.length === 0 ? (
            <div
              className={`text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border ${borderColor}`}
            >
              <FaFeather className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">
                {t?.("noPoemsFound") || "No poems found"}
              </h3>
              <p className="text-gray-400 dark:text-gray-500 mt-2">
                {t?.("noPoemsByPoet") ||
                  "This poet doesn't have any published poems yet."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {poems.map((poem) => (
                  <PoemsCard
                    key={poem.id}
                    poem={{
                      ...poem,
                      poet: poetName,
                      poetSlug: slug,
                      excerpt:
                        poem.excerpt ||
                        poem.description ||
                        poem.content?.substring(0, 150) + "...",
                      tags: poem.tags || [],
                      type: poem.category?.name || poem.type || "Poem",
                    }}
                    lang={lang}
                    variant="grid"
                    showActions={true}
                    showTags={true}
                    showExcerpt={true}
                    onLike={handleLike}
                    onBookmark={() => {}}
                    onShare={() => {}}
                  />
                ))}
              </div>

              {/* Load More */}
              {pagination.page < pagination.totalPages && (
                <div className="mt-8 text-center">
                  <button
                    onClick={loadMorePoems}
                    className={`px-6 py-2 rounded-lg border ${borderColor} ${hoverBg} transition`}
                  >
                    {t?.("loadMore") || "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
