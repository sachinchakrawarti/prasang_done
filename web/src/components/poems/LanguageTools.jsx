"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { romanizeCached } from "@/lang/romanization";
import { translitStore } from "@/lang/transliteration";
import { LANGUAGES, SCRIPT_TO_LANGUAGES } from "@/lang/languages";

const SCRIPT_ORDER = [
  "Devanagari", "Bengali", "Gurmukhi", "Gujarati", "Odia",
  "Tamil", "Telugu", "Kannada", "Malayalam",
  "Arabic", "Cyrillic",
];

/**
 * Resolve the language to use for the picked script.
 *  - If the current targetLang already belongs to targetScript → keep it.
 *  - Otherwise → the first language registered under that script.
 *  - If the script has no language → fall back to the poem's language.
 */
function resolveLanguage(targetScript, targetLang, fallbackLang) {
  const candidates = SCRIPT_TO_LANGUAGES[targetScript] ?? [];
  if (candidates.find((l) => l.code === targetLang)) return targetLang;
  if (candidates[0]) return candidates[0].code;
  return fallbackLang;
}

export default function LanguageTools({
  content,
  script,
  language,
  themeGradient = "from-amber-600 to-yellow-500",
  themeText = "text-amber-600 dark:text-amber-400",
  themeBorder = "border-amber-200 dark:border-amber-800",
  themeHover = "hover:bg-amber-50 dark:hover:bg-amber-900/20",
}) {
  const [mode, setMode]                 = useState("original");   // original | roman | translit
  const [targetScript, setTargetScript] = useState(script);
  const [targetLang, setTargetLang]     = useState(language);
  const [output, setOutput]             = useState(content);
  const [busy, setBusy]                 = useState(false);
  const [err, setErr]                   = useState(null);

  // Guard against state updates from stale async calls
  const requestIdRef = useRef(0);

  // ── Reset when the poem changes ───────────────────────────────
  useEffect(() => {
    setMode("original");
    setTargetScript(script);
    setTargetLang(language);
    setOutput(content);
    setErr(null);
  }, [content, script, language]);

  // ── Keep targetLang consistent with targetScript ──────────────
  useEffect(() => {
    const resolved = resolveLanguage(targetScript, targetLang, language);
    if (resolved !== targetLang) setTargetLang(resolved);
  }, [targetScript, targetLang, language]);

  // ── Roman (synchronous, no network) ───────────────────────────
  const romanText = useMemo(() => {
    if (mode !== "roman") return "";
    try {
      return romanizeCached(content, script);
    } catch {
      return content;
    }
  }, [mode, content, script]);

  // ── Languages available for the current script ────────────────
  const langsForScript = useMemo(
    () => SCRIPT_TO_LANGUAGES[targetScript] ?? [],
    [targetScript],
  );

  // ── Transliterate (async) — re-runs on mode / script / language ─
  useEffect(() => {
    if (mode !== "translit") return;

    // Always resolve the language from the script before calling.
    const resolvedLang = resolveLanguage(targetScript, targetLang, language);
    const target = LANGUAGES[resolvedLang];
    if (!target) return;

    // Same script + same language = identity, don't hit the API.
    if (targetScript === script && resolvedLang === language) {
      setOutput(content);
      setErr(null);
      setBusy(false);
      return;
    }

    const myId = ++requestIdRef.current;
    let cancelled = false;

    setBusy(true);
    setErr(null);

    (async () => {
      try {
        const out = await translitStore.transliterate(
          content,
          script,
          targetScript,
          target.googleLang,   // ← always the script's language
          language,            // ← source language, for identity check
        );
        if (cancelled || myId !== requestIdRef.current) return;
        setOutput(out);
      } catch (e) {
        if (cancelled || myId !== requestIdRef.current) return;
        setErr(e?.message || "transliteration failed");
        setOutput(content);
      } finally {
        if (!cancelled && myId === requestIdRef.current) setBusy(false);
      }
    })();

    return () => { cancelled = true; };
  }, [mode, targetScript, targetLang, content, script, language]);

  // ── Compute the visible text ──────────────────────────────────
  const visible =
    mode === "original" ? content :
    mode === "roman"    ? romanText :
                          output;

  const isIdentity =
    mode === "translit" &&
    targetScript === script &&
    targetLang === language;

  const targetDir =
    mode === "translit" && LANGUAGES[targetLang]?.dir === "rtl" ? "rtl" : "ltr";

  return (
    <div className="mt-6">
      {/* ── controls ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode("original")}
          className={`px-3 py-1.5 text-sm rounded-full border transition ${
            mode === "original"
              ? `bg-gradient-to-r ${themeGradient} text-white border-transparent`
              : `${themeHover} ${themeText} ${themeBorder}`
          }`}
        >
          Original
        </button>

        <button
          type="button"
          onClick={() => setMode("roman")}
          className={`px-3 py-1.5 text-sm rounded-full border transition ${
            mode === "roman"
              ? `bg-gradient-to-r ${themeGradient} text-white border-transparent`
              : `${themeHover} ${themeText} ${themeBorder}`
          }`}
        >
          Roman
        </button>

        <button
          type="button"
          onClick={() => setMode("translit")}
          className={`px-3 py-1.5 text-sm rounded-full border transition ${
            mode === "translit"
              ? `bg-gradient-to-r ${themeGradient} text-white border-transparent`
              : `${themeHover} ${themeText} ${themeBorder}`
          }`}
        >
          Transliterate
        </button>

        {mode === "translit" && (
          <>
            <select
              value={targetScript}
              onChange={(e) => {
                setTargetScript(e.target.value);
                // Proactively snap targetLang to a valid one for the new script.
                const resolved = resolveLanguage(e.target.value, targetLang, language);
                setTargetLang(resolved);
              }}
              className={`text-sm px-3 py-1.5 rounded-full border ${themeBorder} bg-white dark:bg-gray-800`}
            >
              {SCRIPT_ORDER.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {langsForScript.length > 0 && (
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className={`text-sm px-3 py-1.5 rounded-full border ${themeBorder} bg-white dark:bg-gray-800`}
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

      {/* ── output ────────────────────────────────────────────── */}
      <div
        dir={targetDir}
        className={`prose prose-lg dark:prose-invert max-w-none leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-200 ${
          targetDir === "rtl" ? "text-right" : ""
        }`}
        style={targetDir === "rtl"
          ? { fontFamily: "'Noto Nastaliq Urdu','Amiri',serif", lineHeight: 2.2 }
          : undefined}
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
