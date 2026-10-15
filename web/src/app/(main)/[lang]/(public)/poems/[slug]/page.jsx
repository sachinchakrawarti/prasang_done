"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FaHeart, FaBookOpen, FaUser, FaClock, FaArrowLeft, FaShare,
  FaBookmark, FaRegBookmark, FaEye, FaQuoteLeft, FaQuoteRight,
  FaTwitter, FaFacebook, FaCopy, FaStar,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import PoemsCard from "@/components/poems/poemscard";
import LanguageTools from "@/components/poems/LanguageTools";
import {
  fetchPoemBySlug, fetchRelatedPoems, toggleLike, toggleBookmark,
} from "@/services/poemService";

export default function PoemDetailPage() {
  const params = useParams();
  const lang   = params?.lang || "en";
  const slug   = params?.slug;
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [poem, setPoem]                       = useState(null);
  const [isLoading, setIsLoading]             = useState(true);
  const [error, setError]                     = useState(null);
  const [liked, setLiked]                     = useState(false);
  const [bookmarked, setBookmarked]           = useState(false);
  const [showShare, setShowShare]             = useState(false);
  const [copied, setCopied]                   = useState(false);
  const [relatedPoems, setRelatedPoems]       = useState([]);
  const [shareUrl, setShareUrl]               = useState("");

  const shareRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") setShareUrl(window.location.href);
  }, [slug]);

  useEffect(() => {
    if (!showShare) return;
    const onClick = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) setShowShare(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setShowShare(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [showShare]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!slug) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchPoemBySlug(slug);
        const poemData = response?.data ?? response;
        if (cancelled) return;

        if (!poemData || (!poemData.id && !poemData.slug)) {
          setError("Poem not found");
          setPoem(null);
          return;
        }

        setPoem(poemData);
        setLiked(Boolean(poemData.isLiked));
        setBookmarked(Boolean(poemData.isBookmarked));

        try {
          const r = await fetchRelatedPoems(poemData.id);
          const rd = r?.data ?? r;
          if (!cancelled) setRelatedPoems(Array.isArray(rd) ? rd.slice(0, 3) : []);
        } catch { if (!cancelled) setRelatedPoems([]); }
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load poem");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [slug]);

  const handleLike = async () => {
    if (!poem) return;
    const next = !liked;
    const prev = poem;
    setLiked(next);
    setPoem({ ...poem, likes: Math.max(0, (poem.likes || 0) + (next ? 1 : -1)) });
    try { await toggleLike(poem.id); }
    catch { setLiked(!next); setPoem(prev); }
  };

  const handleBookmark = async () => {
    if (!poem) return;
    const next = !bookmarked;
    setBookmarked(next);
    try { await toggleBookmark(poem.id); }
    catch { setBookmarked(!next); }
  };

  const handleCopyLink = async () => {
    const url = shareUrl || (typeof window !== "undefined" ? window.location.href : "");
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const formatDate = (d) => {
    if (!d) return "";
    try {
      const locale = lang === "en" ? "en-US" : lang === "hi" ? "hi-IN" : "ur-PK";
      return new Date(d).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
    } catch { return d; }
  };

  const getPoemContent = () => {
    if (!poem) return "";
    if (lang !== poem.language && poem.translations?.[lang]?.content) {
      return poem.translations[lang].content;
    }
    return poem.content || "";
  };

  const getPoemTitle = () => {
    if (!poem) return "";
    if (lang !== poem.language && poem.translations?.[lang]?.title) {
      return poem.translations[lang].title;
    }
    return poem.title || "Untitled";
  };

  const poetName = poem?.poet?.name || poem?.author || "Unknown Poet";
  const poetSlug = poem?.poet?.slug || poem?.poetSlug;

  const textColor = (() => {
    switch (themeName) {
      case "forest":   return "text-green-600 dark:text-green-400";
      case "lavender": return "text-purple-600 dark:text-purple-400";
      case "rose":     return "text-rose-600 dark:text-rose-400";
      case "sepia":    return "text-amber-600 dark:text-amber-400";
      default:         return "text-amber-600 dark:text-amber-400";
    }
  })();
  const gradient = (() => {
    switch (themeName) {
      case "forest":   return "from-green-600 to-emerald-500";
      case "lavender": return "from-purple-600 to-pink-500";
      case "rose":     return "from-rose-600 to-pink-500";
      case "sepia":    return "from-amber-700 to-yellow-600";
      default:         return "from-amber-600 to-yellow-500";
    }
  })();
  const borderColor = (() => {
    switch (themeName) {
      case "forest":   return "border-green-200 dark:border-green-800";
      case "lavender": return "border-purple-200 dark:border-purple-800";
      case "rose":     return "border-rose-200 dark:border-rose-800";
      case "sepia":    return "border-amber-200 dark:border-amber-800";
      default:         return "border-amber-200 dark:border-amber-800";
    }
  })();
  const hoverBg = (() => {
    switch (themeName) {
      case "forest":   return "hover:bg-green-50 dark:hover:bg-green-900/20";
      case "lavender": return "hover:bg-purple-50 dark:hover:bg-purple-900/20";
      case "rose":     return "hover:bg-rose-50 dark:hover:bg-rose-900/20";
      case "sepia":    return "hover:bg-amber-50 dark:hover:bg-amber-900/20";
      default:         return "hover:bg-amber-50 dark:hover:bg-amber-900/20";
    }
  })();

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
            className={`inline-block mt-4 px-6 py-2 bg-gradient-to-r ${gradient} text-white rounded-full font-medium`}
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
        <Link
          href={`/${lang}/poems`}
          className={`inline-flex items-center gap-2 ${textColor} hover:underline mb-6 group`}
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          {t?.("backToPoems") || "Back to Poems"}
        </Link>

        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${borderColor} overflow-hidden`}>
          {/* header */}
          <div className={`p-6 sm:p-8 border-b ${borderColor} bg-gradient-to-r ${gradient} bg-opacity-5`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`px-3 py-1 text-xs rounded-full ${hoverBg} ${textColor}`}>
                    {poem.type || poem.category?.name || "Poem"}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {(poem.language || "en").toUpperCase()} · {poem.script || "Latin"}
                  </span>
                  {poem.featured && (
                    <span className={`px-3 py-1 text-xs font-medium text-white bg-gradient-to-r ${gradient} rounded-full`}>
                      <FaStar className="inline mr-1" size={10} />{t?.("featured") || "Featured"}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  {getPoemTitle()}
                </h1>

                {poetSlug ? (
                  <Link
                    href={`/${lang}/poets/${poetSlug}`}
                    className={`inline-flex items-center gap-2 mt-2 ${textColor} hover:underline`}
                  >
                    <FaUser size={14} /><span className="font-medium">{poetName}</span>
                  </Link>
                ) : (
                  <span className={`inline-flex items-center gap-2 mt-2 ${textColor}`}>
                    <FaUser size={14} /><span className="font-medium">{poetName}</span>
                  </span>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaClock size={14} />{formatDate(poem.createdAt || poem.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaEye size={14} />{poem.views || 0} {t?.("views") || "views"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleLike} className={`p-2 rounded-full ${hoverBg} transition-all group`}>
                  <FaHeart className={`text-xl transition-all ${liked ? "text-red-500 scale-110" : textColor}`} />
                </button>
                <button onClick={handleBookmark} className={`p-2 rounded-full ${hoverBg} transition-all`}>
                  {bookmarked
                    ? <FaBookmark className={`text-xl ${textColor}`} />
                    : <FaRegBookmark className="text-xl text-gray-400" />}
                </button>
                <div className="relative" ref={shareRef}>
                  <button onClick={() => setShowShare((v) => !v)} className={`p-2 rounded-full ${hoverBg}`}>
                    <FaShare className={`text-xl ${textColor}`} />
                  </button>
                  {showShare && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FaCopy size={14} />{copied ? t?.("copied") || "Copied!" : t?.("copyLink") || "Copy Link"}
                      </button>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getPoemTitle())}&url=${encodeURIComponent(shareUrl)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FaTwitter size={14} className="text-blue-400" />Twitter
                      </a>
                      <a
                        href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FaFacebook size={14} className="text-blue-600" />Facebook
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* content + language tools */}
          <div className="p-6 sm:p-8">
            <div className="relative">
              <FaQuoteLeft className={`absolute -top-2 -left-2 text-4xl ${textColor} opacity-10`} />

              <LanguageTools
                poemId={poem.id}
                content={getPoemContent()}
                script={poem.script || "Latin"}
                language={poem.language || "en"}
                themeGradient={gradient}
                themeText={textColor}
                themeBorder={borderColor}
                themeHover={hoverBg}
              />

              <FaQuoteRight className={`absolute -bottom-2 -right-2 text-4xl ${textColor} opacity-10`} />
            </div>

            {Array.isArray(poem.tags) && poem.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {t?.("tags") || "Tags"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {poem.tags.map((tag, i) => {
                    const n = typeof tag === "string" ? tag : tag?.name || "";
                    if (!n) return null;
                    return (
                      <span key={`${n}-${i}`} className={`px-3 py-1 text-xs rounded-full ${hoverBg} ${textColor}`}>
                        #{n}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* footer */}
          <div className={`p-6 sm:p-8 border-t ${borderColor} bg-gray-50 dark:bg-gray-900/30`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <FaHeart className={textColor} size={14} />
                  {poem.likes || 0} {t?.("likes") || "likes"}
                </span>
                <span className="flex items-center gap-1">
                  <FaEye size={14} />
                  {poem.views || 0} {t?.("views") || "views"}
                </span>
              </div>
              {poetSlug && (
                <Link href={`/${lang}/poets/${poetSlug}`} className={`flex items-center gap-2 text-sm ${textColor} hover:underline`}>
                  {t?.("moreByPoet") || "More by this poet"} →
                </Link>
              )}
            </div>
          </div>
        </div>

        {relatedPoems.length > 0 && (
          <div className="mt-12">
            <h2 className={`text-2xl font-bold ${textColor} mb-6`}>
              {t?.("relatedPoems") || "Related Poems"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPoems.map((rp) => (
                <PoemsCard
                  key={rp.id}
                  poem={{
                    ...rp,
                    poet: rp.poet?.name || rp.author || "Unknown Poet",
                    poetSlug: rp.poet?.slug,
                    excerpt: rp.excerpt || (rp.content ? rp.content.substring(0, 150) + "..." : ""),
                    tags: rp.tags?.map((tg) => (typeof tg === "string" ? tg : tg?.name)) || [],
                    type: rp.type || rp.category?.name || "Poem",
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
