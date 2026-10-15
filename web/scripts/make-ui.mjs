// web/scripts/make-ui.mjs
// Rewrites the poems list page, the poem detail page, and adds a fresh
// LanguageTools component. Deletes the old RomanizationPoetryDisplay usage.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB  = path.resolve(__dirname, '..');
const SRC  = path.join(WEB, 'src');
const COMP = path.join(SRC, 'components', 'poems');
const LIST = path.join(SRC, 'app', '(main)', '[lang]', '(public)', 'poems', 'page.jsx');
const DET  = path.join(SRC, 'app', '(main)', '[lang]', '(public)', 'poems', '[slug]', 'page.jsx');

/* ══════════════════════════════════════════════════════════════════
 *  components/poems/LanguageTools.jsx
 *  Unified control: Roman toggle + script/language picker + output
 * ══════════════════════════════════════════════════════════════════ */
const LANGUAGE_TOOLS = `
"use client";

import { useEffect, useMemo, useState } from "react";
import { romanizeCached } from "@/lang/romanization";
import { translitStore } from "@/lang/transliteration";
import { LANGUAGES, SCRIPT_TO_LANGUAGES } from "@/lang/languages";

const SCRIPT_ORDER = [
  "Devanagari", "Bengali", "Gurmukhi", "Gujarati", "Odia",
  "Tamil", "Telugu", "Kannada", "Malayalam",
  "Arabic", "Cyrillic",
];

export default function LanguageTools({
  content,
  script,
  language,
  themeGradient = "from-amber-600 to-yellow-500",
  themeText = "text-amber-600 dark:text-amber-400",
  themeBorder = "border-amber-200 dark:border-amber-800",
  themeHover = "hover:bg-amber-50 dark:hover:bg-amber-900/20",
}) {
  const [mode, setMode]                 = useState("original");  // original | roman | translit
  const [targetScript, setTargetScript] = useState(script);
  const [targetLang, setTargetLang]     = useState(language);
  const [output, setOutput]             = useState(content);
  const [busy, setBusy]                 = useState(false);
  const [err, setErr]                   = useState(null);

  const romanText = useMemo(
    () => (mode === "roman" ? romanizeCached(content, script) : ""),
    [mode, content, script],
  );

  const langsForScript = useMemo(
    () => SCRIPT_TO_LANGUAGES[targetScript] ?? [],
    [targetScript],
  );

  // If the current language isn't valid for the picked script, snap to the first
  useEffect(() => {
    if (langsForScript.length && !langsForScript.find((l) => l.code === targetLang)) {
      setTargetLang(langsForScript[0].code);
    }
  }, [langsForScript, targetLang]);

  // Reset when the poem changes
  useEffect(() => {
    setMode("original");
    setTargetScript(script);
    setTargetLang(language);
    setOutput(content);
    setErr(null);
  }, [content, script, language]);

  // Run transliteration when mode switches to translit, or target changes
  useEffect(() => {
    if (mode !== "translit") return;
    const target = LANGUAGES[targetLang];
    if (!target) return;

    let cancelled = false;
    setBusy(true);
    setErr(null);

    (async () => {
      try {
        const out = await translitStore.transliterate(
          content,
          script,
          target.script,
          target.googleLang,
          language,
        );
        if (!cancelled) setOutput(out);
      } catch (e) {
        if (!cancelled) setErr(e.message || "transliteration failed");
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();

    return () => { cancelled = true; };
  }, [mode, targetLang, content, script, language]);

  const isIdentity =
    mode === "translit" &&
    targetScript === script &&
    targetLang === language;

  const visible = mode === "original" ? content
                 : mode === "roman"    ? romanText
                 : output;

  const dir = mode === "translit" && LANGUAGES[targetLang]?.dir === "rtl"
    ? "rtl" : "ltr";

  return (
    <div className="mt-6">
      {/* ── controls row ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode("original")}
          className={\`px-3 py-1.5 text-sm rounded-full border transition \${
            mode === "original"
              ? \`bg-gradient-to-r \${themeGradient} text-white border-transparent\`
              : \`\${themeHover} \${themeText} \${themeBorder}\`
          }\`}
        >
          Original
        </button>

        <button
          type="button"
          onClick={() => setMode("roman")}
          className={\`px-3 py-1.5 text-sm rounded-full border transition \${
            mode === "roman"
              ? \`bg-gradient-to-r \${themeGradient} text-white border-transparent\`
              : \`\${themeHover} \${themeText} \${themeBorder}\`
          }\`}
        >
          Roman
        </button>

        <button
          type="button"
          onClick={() => setMode("translit")}
          className={\`px-3 py-1.5 text-sm rounded-full border transition \${
            mode === "translit"
              ? \`bg-gradient-to-r \${themeGradient} text-white border-transparent\`
              : \`\${themeHover} \${themeText} \${themeBorder}\`
          }\`}
        >
          Transliterate
        </button>

        {mode === "translit" && (
          <>
            <select
              value={targetScript}
              onChange={(e) => setTargetScript(e.target.value)}
              className={\`text-sm px-3 py-1.5 rounded-full border \${themeBorder} bg-white dark:bg-gray-800\`}
            >
              {SCRIPT_ORDER.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {langsForScript.length > 1 && (
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className={\`text-sm px-3 py-1.5 rounded-full border \${themeBorder} bg-white dark:bg-gray-800\`}
              >
                {langsForScript.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.native} — {l.name}
                  </option>
                ))}
              </select>
            )}
          </>
        )}

        {busy && (
          <span className="text-xs text-gray-400 animate-pulse">translating…</span>
        )}
      </div>

      {/* ── output ───────────────────────────────────────────────── */}
      <div
        dir={dir}
        className={\`prose prose-lg dark:prose-invert max-w-none leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-200 \${
          dir === "rtl" ? "text-right font-serif" : ""
        }\`}
        style={dir === "rtl" ? { fontFamily: "'Noto Nastaliq Urdu','Amiri',serif", lineHeight: 2.2 } : undefined}
      >
        {busy ? "…" : visible}
      </div>

      {isIdentity && (
        <p className="mt-2 text-xs text-gray-400">
          Already in this script and language.
        </p>
      )}
      {err && (
        <p className="mt-2 text-xs text-red-500">⚠ {err}</p>
      )}
    </div>
  );
}
`.replace(/^\n/, '');

/* ══════════════════════════════════════════════════════════════════
 *  app/(main)/[lang]/(public)/poems/page.jsx
 * ══════════════════════════════════════════════════════════════════ */
const LIST_PAGE = `
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  FaSearch, FaFilter, FaFeather, FaChevronDown, FaTh, FaList, FaBookOpen,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";
import PoemsCard from "@/components/poems/poemscard";
import { fetchPoems } from "@/services/poemService";

const DEFAULT_LIMIT = 20;
const SEARCH_DEBOUNCE_MS = 400;

export default function PoemsPage() {
  const params = useParams();
  const lang = params?.lang || "en";
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [poems, setPoems]               = useState([]);
  const [filteredPoems, setFilteredPoems] = useState([]);
  const [searchTerm, setSearchTerm]     = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [viewMode, setViewMode]         = useState("grid");
  const [showFilters, setShowFilters]   = useState(false);
  const [sortBy, setSortBy]             = useState("newest");
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState(null);
  const [pagination, setPagination]     = useState({
    page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 0,
  });

  const loadPoems = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = { page, limit: DEFAULT_LIMIT };
      if (searchTerm) queryParams.search = searchTerm;
      if (selectedLanguage && selectedLanguage !== "all") {
        queryParams.language = selectedLanguage;
      }

      const response = await fetchPoems(queryParams);
      const poemsList = Array.isArray(response?.poems) ? response.poems : [];

      if (response?.success) {
        if (page > 1) setPoems((prev) => [...prev, ...poemsList]);
        else          setPoems(poemsList);
        setFilteredPoems(poemsList);

        if (response.pagination) {
          setPagination({
            page: response.pagination.page || page,
            limit: response.pagination.limit || DEFAULT_LIMIT,
            total: response.pagination.total || poemsList.length,
            totalPages: response.pagination.totalPages || 1,
          });
        }
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError(err.message || "Failed to load poems");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedLanguage]);

  useEffect(() => {
    const id = setTimeout(() => loadPoems(1), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedLanguage]);

  const types = useMemo(() => {
    const u = new Set(poems.map((p) => p.category?.name || p.type || "Poem"));
    return ["all", ...u];
  }, [poems]);

  const languages = useMemo(() => {
    const u = new Set(poems.map((p) => p.language || "en"));
    return ["all", ...u];
  }, [poems]);

  useEffect(() => {
    let filtered = [...poems];
    if (selectedType !== "all") {
      filtered = filtered.filter(
        (p) => (p.category?.name || p.type || "Poem") === selectedType,
      );
    }
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt || a.created_at || 0) - new Date(b.createdAt || b.created_at || 0));
        break;
      case "popular":
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "views":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
    }
    setFilteredPoems(filtered);
  }, [selectedType, sortBy, poems]);

  const handleLike = (poemId, liked) => {
    setPoems((prev) =>
      prev.map((p) =>
        p.id === poemId
          ? { ...p, likes: (p.likes || 0) + (liked ? 1 : -1), isLiked: liked }
          : p,
      ),
    );
  };
  const handleBookmark = (id) => console.log("bookmark", id);
  const handleShare    = (id) => console.log("share", id);

  const loadMore = () => {
    if (pagination.page < pagination.totalPages && !isLoading) {
      loadPoems(pagination.page + 1);
    }
  };

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

  const mapPoemForCard = (poem) => ({
    ...poem,
    poet: poem.poet?.name || poem.author || "Unknown Poet",
    poetSlug: poem.poet?.slug,
    poetId: poem.poet?.id,
    excerpt: poem.description || poem.excerpt
      || (poem.content ? poem.content.substring(0, 150) + "..." : ""),
    tags: poem.tags || [],
    type: poem.category?.name || poem.type || "Poem",
  });

  if (isLoading && poems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error && poems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaBookOpen className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
            {t?.("errorLoadingPoems") || "Error loading poems"}
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mt-2">{error}</p>
          <button
            onClick={() => loadPoems(1)}
            className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            {t?.("retry") || "Retry"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <FaFeather className={\`text-3xl \${textColor}\`} />
            <h1 className={\`text-4xl font-bold bg-gradient-to-r \${gradient} bg-clip-text text-transparent\`}>
              {t?.("poems") || "Poems"}
            </h1>
            <span className="text-sm text-gray-400">
              ({pagination.total || poems.length} {t?.("total") || "total"})
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2 ml-11">
            {t?.("poemsDescription") || "Discover poems from around the world"}
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t?.("searchPoems") || "Search poems, poets..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={\`w-full pl-10 pr-4 py-2 rounded-lg border \${borderColor} bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all\`}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={\`px-4 py-2 rounded-lg border \${borderColor} \${hoverBg} flex items-center gap-2 transition whitespace-nowrap\`}
              >
                <FaFilter className={textColor} />
                <span>{t?.("filter") || "Filter"}</span>
                <FaChevronDown className={\`transition-transform \${showFilters ? "rotate-180" : ""}\`} />
              </button>
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className={\`px-4 py-2 rounded-lg border \${borderColor} \${hoverBg} transition\`}
              >
                {viewMode === "grid" ? <FaList /> : <FaTh />}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className={\`p-4 rounded-lg border \${borderColor} bg-white dark:bg-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-4\`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t?.("type") || "Type"}
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type === "all" ? t?.("allTypes") || "All Types" : type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t?.("language") || "Language"}
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  {languages.map((l) => (
                    <option key={l} value={l}>
                      {l === "all" ? t?.("allLanguages") || "All Languages" : l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t?.("sortBy") || "Sort By"}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <option value="newest">{t?.("newest") || "Newest"}</option>
                  <option value="oldest">{t?.("oldest") || "Oldest"}</option>
                  <option value="popular">{t?.("mostLiked") || "Most Liked"}</option>
                  <option value="views">{t?.("mostViewed") || "Most Viewed"}</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {filteredPoems.length === 0 ? (
          <div className={\`text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border \${borderColor}\`}>
            <FaBookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
              {t?.("noPoemsFound") || "No poems found"}
            </h3>
          </div>
        ) : (
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"}>
            {filteredPoems.map((poem) => (
              <PoemsCard
                key={poem.id}
                poem={mapPoemForCard(poem)}
                lang={lang}
                variant={viewMode === "grid" ? "grid" : "list"}
                showActions={true}
                showTags={true}
                showExcerpt={true}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onShare={handleShare}
              />
            ))}
          </div>
        )}

        {filteredPoems.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {t?.("showing") || "Showing"} {filteredPoems.length} {t?.("poems") || "poems"}
          </div>
        )}

        {pagination.page < pagination.totalPages && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className={\`px-6 py-2 rounded-lg border \${borderColor} \${hoverBg} transition disabled:opacity-50\`}
            >
              {isLoading
                ? <span className="flex items-center gap-2"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>{t?.("loading") || "Loading..."}</span>
                : t?.("loadMore") || "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
`.replace(/^\n/, '');

/* ══════════════════════════════════════════════════════════════════
 *  app/(main)/[lang]/(public)/poems/[slug]/page.jsx
 * ══════════════════════════════════════════════════════════════════ */
const DETAIL_PAGE = `
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
            href={\`/\${lang}/poems\`}
            className={\`inline-block mt-4 px-6 py-2 bg-gradient-to-r \${gradient} text-white rounded-full font-medium\`}
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
          href={\`/\${lang}/poems\`}
          className={\`inline-flex items-center gap-2 \${textColor} hover:underline mb-6 group\`}
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          {t?.("backToPoems") || "Back to Poems"}
        </Link>

        <div className={\`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border \${borderColor} overflow-hidden\`}>
          {/* header */}
          <div className={\`p-6 sm:p-8 border-b \${borderColor} bg-gradient-to-r \${gradient} bg-opacity-5\`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={\`px-3 py-1 text-xs rounded-full \${hoverBg} \${textColor}\`}>
                    {poem.type || poem.category?.name || "Poem"}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {(poem.language || "en").toUpperCase()} · {poem.script || "Latin"}
                  </span>
                  {poem.featured && (
                    <span className={\`px-3 py-1 text-xs font-medium text-white bg-gradient-to-r \${gradient} rounded-full\`}>
                      <FaStar className="inline mr-1" size={10} />{t?.("featured") || "Featured"}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  {getPoemTitle()}
                </h1>

                {poetSlug ? (
                  <Link
                    href={\`/\${lang}/poets/\${poetSlug}\`}
                    className={\`inline-flex items-center gap-2 mt-2 \${textColor} hover:underline\`}
                  >
                    <FaUser size={14} /><span className="font-medium">{poetName}</span>
                  </Link>
                ) : (
                  <span className={\`inline-flex items-center gap-2 mt-2 \${textColor}\`}>
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
                <button onClick={handleLike} className={\`p-2 rounded-full \${hoverBg} transition-all group\`}>
                  <FaHeart className={\`text-xl transition-all \${liked ? "text-red-500 scale-110" : textColor}\`} />
                </button>
                <button onClick={handleBookmark} className={\`p-2 rounded-full \${hoverBg} transition-all\`}>
                  {bookmarked
                    ? <FaBookmark className={\`text-xl \${textColor}\`} />
                    : <FaRegBookmark className="text-xl text-gray-400" />}
                </button>
                <div className="relative" ref={shareRef}>
                  <button onClick={() => setShowShare((v) => !v)} className={\`p-2 rounded-full \${hoverBg}\`}>
                    <FaShare className={\`text-xl \${textColor}\`} />
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
                        href={\`https://twitter.com/intent/tweet?text=\${encodeURIComponent(getPoemTitle())}&url=\${encodeURIComponent(shareUrl)}\`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FaTwitter size={14} className="text-blue-400" />Twitter
                      </a>
                      <a
                        href={\`https://facebook.com/sharer/sharer.php?u=\${encodeURIComponent(shareUrl)}\`}
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
              <FaQuoteLeft className={\`absolute -top-2 -left-2 text-4xl \${textColor} opacity-10\`} />

              <LanguageTools
                content={getPoemContent()}
                script={poem.script || "Latin"}
                language={poem.language || "en"}
                themeGradient={gradient}
                themeText={textColor}
                themeBorder={borderColor}
                themeHover={hoverBg}
              />

              <FaQuoteRight className={\`absolute -bottom-2 -right-2 text-4xl \${textColor} opacity-10\`} />
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
                      <span key={\`\${n}-\${i}\`} className={\`px-3 py-1 text-xs rounded-full \${hoverBg} \${textColor}\`}>
                        #{n}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* footer */}
          <div className={\`p-6 sm:p-8 border-t \${borderColor} bg-gray-50 dark:bg-gray-900/30\`}>
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
                <Link href={\`/\${lang}/poets/\${poetSlug}\`} className={\`flex items-center gap-2 text-sm \${textColor} hover:underline\`}>
                  {t?.("moreByPoet") || "More by this poet"} →
                </Link>
              )}
            </div>
          </div>
        </div>

        {relatedPoems.length > 0 && (
          <div className="mt-12">
            <h2 className={\`text-2xl font-bold \${textColor} mb-6\`}>
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
`.replace(/^\n/, '');

/* ══════════════════════════════════════════════════════════════════
 *  Write
 * ══════════════════════════════════════════════════════════════════ */
const FILES = {
  [path.join(COMP, 'LanguageTools.jsx')]: LANGUAGE_TOOLS,
  [LIST]: LIST_PAGE,
  [DET]:  DETAIL_PAGE,
};

console.log(`\nmake-ui.mjs → ${WEB}\n`);

for (const [fullPath, content] of Object.entries(FILES)) {
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('  ✓', path.relative(WEB, fullPath));
}

// Try to delete the old RomanizationPoetryDisplay component
const OLD = path.join(COMP, 'RomanizationPoetryDisplay.jsx');
const OLD_CSS = path.join(COMP, 'RomanizationPoetryDisplay.css');
for (const f of [OLD, OLD_CSS]) {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log('  ✗', path.relative(WEB, f), '(deleted)');
  }
}

console.log('\nDone.\n');