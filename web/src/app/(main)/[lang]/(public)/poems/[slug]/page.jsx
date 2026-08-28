// src/app/(main)/[lang]/(public)/poems/[slug]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  FaStar, // ✅ Added FaStar
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

// Sample poems data (same as above, but we'll fetch by slug)
const samplePoems = [
  {
    id: 1,
    slug: "sonnet-18",
    title: "Sonnet 18",
    poet: "William Shakespeare",
    poetSlug: "william-shakespeare",
    excerpt:
      "Shall I compare thee to a summer's day? Thou art more lovely and more temperate...",
    content:
      "Shall I compare thee to a summer's day? Thou art more lovely and more temperate: Rough winds do shake the darling buds of May, And summer's lease hath all too short a date: Sometime too hot the eye of heaven shines, And often is his gold complexion dimm'd; And every fair from fair sometime declines, By chance or nature's changing course untrimm'd; But thy eternal summer shall not fade, Nor lose possession of that fair thou ow'st; Nor shall death brag thou wander'st in his shade, When in eternal lines to time thou grow'st: So long as men can breathe or eyes can see, So long lives this, and this gives life to thee.",
    type: "Sonnet",
    language: "en",
    likes: 1243,
    views: 5678,
    createdAt: "2024-01-15",
    tags: ["classic", "love", "nature"],
    featured: true,
  },
  {
    id: 2,
    slug: "the-road-not-taken",
    title: "The Road Not Taken",
    poet: "Robert Frost",
    poetSlug: "robert-frost",
    excerpt:
      "Two roads diverged in a yellow wood, And sorry I could not travel both...",
    content:
      "Two roads diverged in a yellow wood, And sorry I could not travel both And be one traveler, long I stood And looked down one as far as I could To where it bent in the undergrowth; Then took the other, as just as fair, And having perhaps the better claim, Because it was grassy and wanted wear; Though as for that the passing there Had worn them really about the same, And both that morning equally lay In leaves no step had trodden black. Oh, I kept the first for another day! Yet knowing how way leads on to way, I doubted if I should ever come back. I shall be telling this with a sigh Somewhere ages and ages hence: Two roads diverged in a wood, and I— I took the one less traveled by, And that has made all the difference.",
    type: "Narrative",
    language: "en",
    likes: 987,
    views: 4321,
    createdAt: "2024-01-10",
    tags: ["classic", "nature", "reflection"],
    featured: true,
  },
  {
    id: 3,
    slug: "kavita-1",
    title: "कविता 1",
    poet: "महादेवी वर्मा",
    poetSlug: "mahadevi-verma",
    excerpt: "मैंने देखा एक सपना, जिसमें थी बहार...",
    content:
      "मैंने देखा एक सपना, जिसमें थी बहार, फूल खिले थे हर किनारे, थी खुशियों की सौगात, हवा में थी खुशबू, थी रौनक हर जगह, दिल को था सुकून, मन को था आराम।",
    type: "गीत",
    language: "hi",
    likes: 567,
    views: 2345,
    createdAt: "2024-01-05",
    tags: ["हिंदी", "प्रेम", "प्रकृति"],
    featured: false,
  },
  {
    id: 4,
    slug: "ghazal",
    title: "غزل",
    poet: "فیض احمد فیض",
    poetSlug: "faiz-ahmed-faiz",
    excerpt: "دل کا ہر سوز و گداز اپنا ہے...",
    content:
      "دل کا ہر سوز و گداز اپنا ہے، زندگی کا ہر طوفان اپنا ہے، ہر نفس میں ہے تیری ہی خوشبو، ہر قدم میں ہے تیری ہی پہچان، زندگی تیری ہے، موت بھی تیری ہے، میں تو بس تیرا ہوں، تو ہے میرے لیے۔",
    type: "غزل",
    language: "ur",
    likes: 432,
    views: 1987,
    createdAt: "2024-01-01",
    tags: ["اردو", "محبت", "شاعری"],
    featured: false,
  },
  {
    id: 5,
    slug: "the-raven",
    title: "The Raven",
    poet: "Edgar Allan Poe",
    poetSlug: "edgar-allan-poe",
    excerpt: "Once upon a midnight dreary, while I pondered, weak and weary...",
    content:
      "Once upon a midnight dreary, while I pondered, weak and weary, Over many a quaint and curious volume of forgotten lore— While I nodded, nearly napping, suddenly there came a tapping, As of some one gently rapping, rapping at my chamber door. 'Tis some visitor,' I muttered, 'tapping at my chamber door— Only this and nothing more.'",
    type: "Narrative",
    language: "en",
    likes: 876,
    views: 3456,
    createdAt: "2023-12-20",
    tags: ["classic", "dark", "mystery"],
    featured: false,
  },
  {
    id: 6,
    slug: "if",
    title: "If—",
    poet: "Rudyard Kipling",
    poetSlug: "rudyard-kipling",
    excerpt:
      "If you can keep your head when all about you Are losing theirs and blaming it on you...",
    content:
      "If you can keep your head when all about you Are losing theirs and blaming it on you, If you can trust yourself when all men doubt you, But make allowance for their doubting too; If you can wait and not be tired by waiting, Or being lied about, don't deal in lies, Or being hated, don't give way to hating, And yet don't look too good, nor talk too wise.",
    type: "Didactic",
    language: "en",
    likes: 765,
    views: 2987,
    createdAt: "2023-12-15",
    tags: ["classic", "inspiration", "wisdom"],
    featured: false,
  },
];

export default function PoemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params?.lang || "en";
  const slug = params?.slug;
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [poem, setPoem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  // Find poem by slug
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const foundPoem = samplePoems.find((p) => p.slug === slug);
      setPoem(foundPoem || null);
      setIsLoading(false);
    }, 500);
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

  // Handle like
  const handleLike = () => {
    setLiked(!liked);
  };

  // Handle bookmark
  const handleBookmark = () => {
    setBookmarked(!bookmarked);
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
    return new Date(dateString).toLocaleDateString(
      lang === "en" ? "en-US" : lang === "hi" ? "hi-IN" : "ur-PK",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {t("loading") || "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Not found
  if (!poem) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="text-center">
          <FaBookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
            {t("noPoemsFound") || "Poem not found"}
          </h3>
          <Link
            href={`/${lang}/poems`}
            className={`inline-block mt-4 px-6 py-2 bg-gradient-to-r ${gradient} text-white rounded-full font-medium hover:shadow-lg transition-all`}
          >
            {t("viewAll") || "View All Poems"} →
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
          {t("backToPoems") || "Back to Poems"}
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
                    {poem.type}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {poem.language.toUpperCase()}
                  </span>
                  {poem.featured && (
                    <span
                      className={`px-3 py-1 text-xs font-medium text-white bg-gradient-to-r ${gradient} rounded-full`}
                    >
                      <FaStar className="inline mr-1" size={10} />
                      {t("featured") || "Featured"}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  {poem.title}
                </h1>

                {/* Poet */}
                <Link
                  href={`/${lang}/poets/${poem.poetSlug}`}
                  className={`inline-flex items-center gap-2 mt-2 ${textColor} hover:underline`}
                >
                  <FaUser size={14} />
                  <span className="font-medium">{poem.poet}</span>
                </Link>

                {/* Date and Stats */}
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaClock size={14} />
                    {formatDate(poem.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaEye size={14} />
                    {poem.views} {t("views") || "views"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-full ${hoverBg} transition-all group`}
                  aria-label={t("like") || "Like"}
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
                  aria-label={t("bookmark") || "Bookmark"}
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
                  aria-label={t("share") || "Share"}
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
                          ? t("copied") || "Copied!"
                          : t("copyLink") || "Copy Link"}
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
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FaLink size={14} />
                        {t("copyLink") || "Copy Link"}
                      </button>
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
                {poem.content}
              </div>
              <FaQuoteRight
                className={`absolute -bottom-2 -right-2 text-4xl ${textColor} opacity-10`}
              />
            </div>

            {/* Tags */}
            {poem.tags && poem.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {t("tags") || "Tags"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {poem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-xs rounded-full ${hoverBg} ${textColor}`}
                    >
                      #{tag}
                    </span>
                  ))}
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
                    {poem.likes + (liked ? 1 : 0)} {t("likes") || "likes"}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <FaEye size={14} />
                  <span>
                    {poem.views} {t("views") || "views"}
                  </span>
                </span>
              </div>
              <Link
                href={`/${lang}/poets/${poem.poetSlug}`}
                className={`flex items-center gap-2 text-sm ${textColor} hover:underline`}
              >
                {t("moreByPoet") || "More by this poet"} →
              </Link>
            </div>
          </div>
        </div>

        {/* Related Poems (Optional) */}
        <div className="mt-8">
          <h2 className={`text-xl font-bold ${textColor} mb-4`}>
            {t("relatedPoems") || "Related Poems"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {t("comingSoon") || "Related poems coming soon..."}
          </p>
        </div>
      </div>
    </div>
  );
}
