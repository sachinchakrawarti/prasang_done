"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { romanizeCached } from "@/lang/romanization";
import { translitStore } from "@/lang/transliteration";
import { LANGUAGES, SCRIPT_TO_LANGUAGES } from "@/lang/languages";
import { fetchPoemTranslations } from "@/services/poemService";

const TRANSLIT_SCRIPTS = [
  "Devanagari", "Bengali", "Gurmukhi", "Gujarati", "Odia",
  "Tamil", "Telugu", "Kannada", "Malayalam",
  "Arabic", "Cyrillic",
];

const TRANSLATE_LANGS = [
  "hi", "ur", "ar", "fa", "ps",
  "bn", "pa", "gu", "ta", "te", "kn", "ml", "or",
  "en", "fr", "de", "es", "tr", "ru",
  "zh", "ja", "ko",
];

function resolveLanguage(targetScript, targetLang, fallbackLang) {
  const candidates = SCRIPT_TO_LANGUAGES[targetScript] ?? [];
  if (candidates.find((l) => l.code === targetLang)) return targetLang;
  if (candidates[0]) return candidates[0].code;
  return fallbackLang;
}

export default function LanguageTools({
  poemId,
  content,
  script = "Latin",
  language = "en",
  themeGradient = "from-amber-600 to-yellow-500",
  themeText = "text-amber-600 dark:text-amber-400",
  themeBorder = "border-amber-200 dark:border-amber-800",
  themeHover = "hover:bg-amber-50 dark:hover:bg-amber-900/20",
}) {
  const [mode, setMode] = useState("original");
  const [targetScript, setTargetScript] = useState(
    script === "Latin" ? "Devanagari" : script
  );
  const [targetLang, setTargetLang] = useState(language);
  const [translateLang, setTranslateLang] = useState(language === "en" ? "hi" : "en");

  const [output, setOutput] = useState(content);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const [translations, setTranslations] = useState({});
  const [translationsLoaded, setTranslationsLoaded] = useState(false);
  const [translationError, setTranslationError] = useState(null);

  const requestIdRef = useRef(0);

  // Reset when poem changes
  useEffect(() => {
    setMode("original");
    setTargetScript(script === "Latin" ? "Devanagari" : script);
    setTargetLang(language);
    setTranslateLang(language === "en" ? "hi" : "en");
    setOutput(content);
    setErr(null);
    setTranslations({});
    setTranslationsLoaded(false);
    setTranslationError(null);
  }, [content, script, language, poemId]);

  // Snap targetLang to something valid for the script
  useEffect(() => {
    const resolved = resolveLanguage(targetScript, targetLang, language);
    if (resolved !== targetLang) setTargetLang(resolved);
  }, [targetScript, targetLang, language]);

  const romanText = useMemo(() => {
    if (mode !== "roman") return "";
    try { return romanizeCached(content, script); }
    catch { return content; }
  }, [mode, content, script]);

  const langsForScript = useMemo(
    () => SCRIPT_TO_LANGUAGES[targetScript] ?? [],
    [targetScript],
  );

  // ── Transliterate ──────────────────────────────────────────────
  useEffect(() => {
    if (mode !== "translit") return;
    const resolvedLang = resolveLanguage(targetScript, targetLang, language);
    const target = LANGUAGES[resolvedLang];
    if (!target) return;

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
          content, script, targetScript, target.googleLang, language,
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

  // ── Load translations once when translate mode opens ──────────
  useEffect(() => {
    if (mode !== "translate") return;
    if (translationsLoaded) return;
    if (!poemId) return;

    let cancelled = false;
    setBusy(true);
    setTranslationError(null);

    (async () => {
      try {
        const data = await fetchPoemTranslations(poemId);
        if (cancelled) return;
        setTranslations(data?.translations ?? {});
        setTranslationsLoaded(true);
      } catch (e) {
        if (cancelled) return;
        setTranslationError(e?.message || "could not load translations");
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();

    return () => { cancelled = true; };
  }, [mode, poemId, translationsLoaded]);

  // Update output when translate mode / language changes
  useEffect(() => {
    if (mode !== "translate") return;
    const text = translations[translateLang];
    setOutput(text ?? "");
  }, [mode, translateLang, translations]);

  const visible =
    mode === "original"  ? content :
    mode === "roman"     ? romanText :
                           output;

  const translateHasText =
    mode === "translate" && Boolean(translations[translateLang]);

  const targetDir =
    (mode === "translate" && LANGUAGES[translateLang]?.dir === "rtl") ||
    (mode === "translit"  && LANGUAGES[targetLang]?.dir === "rtl")
      ? "rtl" : "ltr";

  const availableCount = Object.keys(translations).length;

  return (
    <div className="mt-6">
      {/* ── controls ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <ModeButton active={mode === "original"} onClick={() => setMode("original")}
          gradient={themeGradient} text={themeText} border={themeBorder} hover={themeHover}>
          Original
        </ModeButton>

        <ModeButton active={mode === "roman"} onClick={() => setMode("roman")}
          gradient={themeGradient} text={themeText} border={themeBorder} hover={themeHover}>
          Roman
        </ModeButton>

        <ModeButton active={mode === "translit"} onClick={() => setMode("translit")}
          gradient={themeGradient} text={themeText} border={themeBorder} hover={themeHover}>
          Transliterate
        </ModeButton>

        <ModeButton active={mode === "translate"} onClick={() => setMode("translate")}
          gradient={themeGradient} text={themeText} border={themeBorder} hover={themeHover}>
          Translate
          {translationsLoaded && availableCount > 0 && (
            <span className="ml-1 opacity-70">({availableCount})</span>
          )}
        </ModeButton>

        {mode === "translit" && (
          <>
            <select value={targetScript}
              onChange={(e) => {
                const next = e.target.value;
                setTargetScript(next);
                setTargetLang(resolveLanguage(next, targetLang, language));
              }}
              className={`text-sm px-3 py-1.5 rounded-full border ${themeBorder} bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200`}>
              {TRANSLIT_SCRIPTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            {langsForScript.length > 0 && (
              <select value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className={`text-sm px-3 py-1.5 rounded-full border ${themeBorder} bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200`}>
                {langsForScript.map((l) => (
                  <option key={l.code} value={l.code}>{l.native} — {l.name}</option>
                ))}
              </select>
            )}
          </>
        )}

        {mode === "translate" && (
          <select value={translateLang}
            onChange={(e) => setTranslateLang(e.target.value)}
            className={`text-sm px-3 py-1.5 rounded-full border ${themeBorder} bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200`}>
            {TRANSLATE_LANGS.map((code) => {
              const l = LANGUAGES[code];
              if (!l) return null;
              const has = Boolean(translations[code]);
              return (
                <option key={code} value={code}>
                  {l.native} — {l.name}{has ? " ✓" : ""}
                </option>
              );
            })}
          </select>
        )}

        {busy && <span className="text-xs text-gray-400 animate-pulse">loading…</span>}
      </div>

      {/* ── body ─────────────────────────────────────────────── */}
      <div
        dir={targetDir}
        className={`prose prose-lg dark:prose-invert max-w-none leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-200 ${
          targetDir === "rtl" ? "text-right" : ""
        }`}
        style={targetDir === "rtl"
          ? { fontFamily: "'Noto Nastaliq Urdu','Amiri',serif", lineHeight: 2.2 }
          : undefined}
      >
        {mode === "translate" && !translateHasText && !busy
          ? <span className="italic text-gray-400">
              No translation stored for this language yet.
            </span>
          : busy && !output ? "…" : visible}
      </div>

      {err && <p className="mt-2 text-xs text-red-500">⚠ {err}</p>}
      {translationError && (
        <p className="mt-2 text-xs text-amber-600">
          ⚠ translations unavailable: {translationError}
        </p>
      )}

      {mode === "translate" && translationsLoaded && availableCount > 0 && (
        <p className="mt-2 text-xs text-gray-400">
          {availableCount} languages available: {Object.keys(translations).join(", ")}
        </p>
      )}
    </div>
  );
}

function ModeButton({ active, onClick, children, gradient, text, border, hover }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-full border transition inline-flex items-center ${
        active
          ? `bg-gradient-to-r ${gradient} text-white border-transparent`
          : `${hover} ${text} ${border}`
      }`}
    >
      {children}
    </button>
  );
}
