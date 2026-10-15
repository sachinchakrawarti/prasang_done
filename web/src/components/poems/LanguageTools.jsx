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
              onChange={(e) => setTargetScript(e.target.value)}
              className={`text-sm px-3 py-1.5 rounded-full border ${themeBorder} bg-white dark:bg-gray-800`}
            >
              {SCRIPT_ORDER.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {langsForScript.length > 1 && (
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

      {/* ── output ───────────────────────────────────────────────── */}
      <div
        dir={dir}
        className={`prose prose-lg dark:prose-invert max-w-none leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-200 ${
          dir === "rtl" ? "text-right font-serif" : ""
        }`}
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
