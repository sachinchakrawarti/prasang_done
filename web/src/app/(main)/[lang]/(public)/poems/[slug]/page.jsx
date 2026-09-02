// src/app/(main)/[lang]/(public)/poems/[slug]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FaHeart,
  FaBookOpen,
  FaUser,
  FaClock,
  FaArrowLeft,
  FaShare,
  FaBookmark,
  FaRegBookmark,
  FaEye,
  FaQuoteLeft,
  FaQuoteRight,
  FaTwitter,
  FaFacebook,
  FaLink,
  FaCopy,
  FaStar,
  FaLanguage,
  FaChevronDown,
  FaChevronUp,
  FaGlobe,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import PoemsCard from "@/components/poems/poemscard";
import Romanization from "@/components/poems/romanization";
import Transliteration from "@/components/poems/transliteration";
import Translation from "@/components/poems/translation";

// Import the service
import {
  fetchPoemBySlug,
  fetchRelatedPoems,
  toggleLike,
  toggleBookmark,
} from "@/services/poemService";

export default function PoemDetailPage() {
  const params = useParams();
  const lang = params?.lang || "en";
  const slug = params?.slug;
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [poem, setPoem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [relatedPoems, setRelatedPoems] = useState([]);
  const [showLanguageTools, setShowLanguageTools] = useState(true);
  const [activeTool, setActiveTool] = useState("translation");

  // Find poem by slug from API
  useEffect(() => {
    const loadPoem = async () => {
      if (!slug) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch poem by slug
        const response = await fetchPoemBySlug(slug);

        // Handle different response structures
        const poemData = response.data || response;

        if (!poemData) {
          setError("Poem not found");
          setIsLoading(false);
          return;
        }

        setPoem(poemData);
        setLiked(poemData.isLiked || false);
        setBookmarked(poemData.isBookmarked || false);

        // Fetch related poems
        try {
          const relatedResponse = await fetchRelatedPoems(poemData.id);
          const relatedData = relatedResponse.data || relatedResponse;
          setRelatedPoems(
            Array.isArray(relatedData) ? relatedData.slice(0, 3) : [],
          );
        } catch (relatedErr) {
          console.error("Failed to load related poems:", relatedErr);
          setRelatedPoems([]);
        }
      } catch (err) {
        console.error("Failed to load poem:", err);
        setError(err.message || "Failed to load poem");
      } finally {
        setIsLoading(false);
      }
    };

    loadPoem();
  }, [slug]);

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

  // Handle like with API
  const handleLike = async () => {
    if (!poem) return;

    const newLiked = !liked;
    // Optimistic update
    setLiked(newLiked);
    setPoem({ ...poem, likes: (poem.likes || 0) + (newLiked ? 1 : -1) });

    try {
      await toggleLike(poem.id);
    } catch (err) {
      // Revert on error
      setLiked(!newLiked);
      setPoem({ ...poem, likes: (poem.likes || 0) + (newLiked ? -1 : 1) });
      console.error("Failed to toggle like:", err);
    }
  };

  // Handle bookmark with API
  const handleBookmark = async () => {
    if (!poem) return;

    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);

    try {
      await toggleBookmark(poem.id);
    } catch (err) {
      setBookmarked(!newBookmarked);
      console.error("Failed to toggle bookmark:", err);
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString(
        lang === "en" ? "en-US" : lang === "hi" ? "hi-IN" : "ur-PK",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      );
    } catch {
      return dateString;
    }
  };

  // Get poem content based on language
  const getPoemContent = () => {
    if (!poem) return "";
    // If current language is different from poem language and translation exists
    if (
      lang !== poem.language &&
      poem.translations &&
      poem.translations[lang]
    ) {
      return poem.translations[lang].content;
    }
    return poem.content || "";
  };

  const getPoemTitle = () => {
    if (!poem) return "";
    if (
      lang !== poem.language &&
      poem.translations &&
      poem.translations[lang]
    ) {
      return poem.translations[lang].title;
    }
    return poem.title || "Untitled";
  };

  // Check if poem needs language tools
  const hasTranslations =
    poem?.translations && Object.keys(poem.translations).length > 0;
  const isHindiOrUrdu =
    poem && (poem.language === "hi" || poem.language === "ur");
  const isEnglishPoem = poem?.language === "en";

  // Determine which tabs to show
  const showRomanization = isHindiOrUrdu;
  const showTransliteration = isHindiOrUrdu;
  const showTranslation = true; // Always show translation option

  // Set default active tab
  useEffect(() => {
    if (showTranslation) {
      setActiveTool("translation");
    } else if (showRomanization) {
      setActiveTool("romanization");
    } else if (showTransliteration) {
      setActiveTool("transliteration");
    }
  }, [showTranslation, showRomanization, showTransliteration]);

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
  if (error || !poem) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="text-center">
          <FaBookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
            {t?.("noPoemsFound") || "Poem not found"}
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mt-2">{error}</p>
          <Link
            href={`/${lang}/poems`}
            className={`inline-block mt-4 px-6 py-2 bg-gradient-to-r ${gradient} text-white rounded-full font-medium hover:shadow-lg transition-all`}
          >
            {t?.("viewAll") || "View All Poems"} →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/${lang}/poems`}
          className={`inline-flex items-center gap-2 ${textColor} hover:underline mb-6 group`}
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          {t?.("backToPoems") || "Back to Poems"}
        </Link>

        {/* Poem Card */}
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${borderColor} overflow-hidden`}
        >
          {/* Header */}
          <div
            className={`p-6 sm:p-8 border-b ${borderColor} bg-gradient-to-r ${gradient} bg-opacity-5`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                {/* Type Badge */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${hoverBg} ${textColor}`}
                  >
                    {poem.type || poem.category?.name || "Poem"}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {(poem.language || "en").toUpperCase()}
                  </span>
                  {poem.featured && (
                    <span
                      className={`px-3 py-1 text-xs font-medium text-white bg-gradient-to-r ${gradient} rounded-full`}
                    >
                      <FaStar className="inline mr-1" size={10} />
                      {t?.("featured") || "Featured"}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  {getPoemTitle()}
                </h1>

                {/* Poet */}
                <Link
                  href={`/${lang}/poets/${poem.poetSlug || poem.poet?.slug}`}
                  className={`inline-flex items-center gap-2 mt-2 ${textColor} hover:underline`}
                >
                  <FaUser size={14} />
                  <span className="font-medium">
                    {poem.poet?.name || poem.poet || "Unknown Poet"}
                  </span>
                </Link>

                {/* Date and Stats */}
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaClock size={14} />
                    {formatDate(poem.createdAt || poem.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaEye size={14} />
                    {poem.views || 0} {t?.("views") || "views"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-full ${hoverBg} transition-all group`}
                  aria-label={t?.("like") || "Like"}
                >
                  <FaHeart
                    className={`text-xl transition-all ${
                      liked ? "text-red-500 scale-110" : textColor
                    } group-hover:scale-110`}
                  />
                </button>
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-full ${hoverBg} transition-all`}
                  aria-label={t?.("bookmark") || "Bookmark"}
                >
                  {bookmarked ? (
                    <FaBookmark className={`text-xl ${textColor}`} />
                  ) : (
                    <FaRegBookmark className="text-xl text-gray-400" />
                  )}
                </button>
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
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(poem.title)}&url=${encodeURIComponent(window.location.href)}`}
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

          {/* Content */}
          <div className="p-6 sm:p-8">
            <div className={`relative`}>
              <FaQuoteLeft
                className={`absolute -top-2 -left-2 text-4xl ${textColor} opacity-10`}
              />
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                {getPoemContent()}
              </div>
              <FaQuoteRight
                className={`absolute -bottom-2 -right-2 text-4xl ${textColor} opacity-10`}
              />
            </div>

            {/* Language Tools Section */}
            {(showRomanization || showTransliteration || showTranslation) && (
              <div className="mt-8">
                <button
                  onClick={() => setShowLanguageTools(!showLanguageTools)}
                  className={`flex items-center gap-2 w-full p-3 rounded-xl border ${borderColor} ${hoverBg} transition-colors`}
                >
                  <FaLanguage className={textColor} />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {t?.("languageTools") || "Language Tools"}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                    {showRomanization &&
                      `${t?.("romanization") || "Romanization"}`}
                    {showRomanization && showTransliteration && `, `}
                    {showTransliteration &&
                      `${t?.("transliteration") || "Transliteration"}`}
                    {(showRomanization || showTransliteration) &&
                      showTranslation &&
                      `, `}
                    {showTranslation &&
                      `${t?.("translation") || "Translation"}`}
                    {showTranslation && `)`}
                  </span>
                  <span className="ml-auto">
                    {showLanguageTools ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </button>

                {showLanguageTools && (
                  <div className="mt-4 space-y-4">
                    {/* Tool Tabs */}
                    {(showRomanization ||
                      showTransliteration ||
                      showTranslation) && (
                      <div className="flex flex-wrap gap-2">
                        {showRomanization && (
                          <button
                            onClick={() => setActiveTool("romanization")}
                            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                              activeTool === "romanization"
                                ? `bg-gradient-to-r ${gradient} text-white`
                                : `${hoverBg} ${textColor} border ${borderColor}`
                            }`}
                          >
                            {t?.("romanization") || "Romanization"}
                          </button>
                        )}
                        {showTransliteration && (
                          <button
                            onClick={() => setActiveTool("transliteration")}
                            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                              activeTool === "transliteration"
                                ? `bg-gradient-to-r ${gradient} text-white`
                                : `${hoverBg} ${textColor} border ${borderColor}`
                            }`}
                          >
                            {t?.("transliteration") || "Transliteration"}
                          </button>
                        )}
                        {showTranslation && (
                          <button
                            onClick={() => setActiveTool("translation")}
                            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                              activeTool === "translation"
                                ? `bg-gradient-to-r ${gradient} text-white`
                                : `${hoverBg} ${textColor} border ${borderColor}`
                            }`}
                          >
                            {t?.("translation") || "Translation"}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Tool Content */}
                    <div className="mt-2">
                      {showRomanization && activeTool === "romanization" && (
                        <Romanization
                          text={poem.content || ""}
                          language={poem.language || "en"}
                        />
                      )}

                      {showTransliteration &&
                        activeTool === "transliteration" && (
                          <Transliteration
                            text={poem.content || ""}
                            fromLang={poem.language || "en"}
                            toLang={lang === poem.language ? "en" : lang}
                          />
                        )}

                      {showTranslation && activeTool === "translation" && (
                        <Translation
                          poem={poem}
                          availableLanguages={[
                            "hi",
                            "ur",
                            "ar",
                            "en",
                            "fr",
                            "es",
                            "de",
                            "ru",
                            "zh",
                            "ja",
                          ]}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {poem.tags && poem.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {t?.("tags") || "Tags"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {poem.tags.map((tag, index) => {
                    const tagName =
                      typeof tag === "string" ? tag : tag?.name || "";
                    return (
                      <span
                        key={index}
                        className={`px-3 py-1 text-xs rounded-full ${hoverBg} ${textColor}`}
                      >
                        #{tagName}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Stats */}
          <div
            className={`p-6 sm:p-8 border-t ${borderColor} bg-gray-50 dark:bg-gray-900/30`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <FaHeart className={textColor} size={14} />
                  <span>
                    {poem.likes || 0} {t?.("likes") || "likes"}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <FaEye size={14} />
                  <span>
                    {poem.views || 0} {t?.("views") || "views"}
                  </span>
                </span>
              </div>
              <Link
                href={`/${lang}/poets/${poem.poetSlug || poem.poet?.slug}`}
                className={`flex items-center gap-2 text-sm ${textColor} hover:underline`}
              >
                {t?.("moreByPoet") || "More by this poet"} →
              </Link>
            </div>
          </div>
        </div>

        {/* Related Poems */}
        {relatedPoems.length > 0 && (
          <div className="mt-12">
            <h2 className={`text-2xl font-bold ${textColor} mb-6`}>
              {t?.("relatedPoems") || "Related Poems"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPoems.map((relatedPoem) => (
                <PoemsCard
                  key={relatedPoem.id}
                  poem={{
                    ...relatedPoem,
                    poet:
                      relatedPoem.poet?.name ||
                      relatedPoem.author ||
                      "Unknown Poet",
                    excerpt:
                      relatedPoem.excerpt ||
                      relatedPoem.content?.substring(0, 150) + "...",
                    tags:
                      relatedPoem.tags?.map((t) =>
                        typeof t === "string" ? t : t?.name,
                      ) || [],
                    type:
                      relatedPoem.type || relatedPoem.category?.name || "Poem",
                  }}
                  lang={lang}
                  variant="compact"
                  showActions={false}
                  showTags={false}
                  showExcerpt={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
