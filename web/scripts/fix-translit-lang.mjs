// web/scripts/fix-translit-lang.mjs
// Rewrites LanguageTools.jsx and translitStore.js so toLanguage is
// always consistent with targetScript.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(__dirname, '..');

const COMP = path.join(WEB, 'src', 'components', 'poems');
const TOOLS = path.join(COMP, 'LanguageTools.jsx');
const STORE = path.join(WEB, 'src', 'lang', 'transliteration', 'translitStore.js');

/* ══════════════════════════════════════════════════════════════════
 *  LanguageTools.jsx  — resolves language from script before every call
 * ══════════════════════════════════════════════════════════════════ */
const LANGUAGE_TOOLS = `
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
              onChange={(e) => {
                setTargetScript(e.target.value);
                // Proactively snap targetLang to a valid one for the new script.
                const resolved = resolveLanguage(e.target.value, targetLang, language);
                setTargetLang(resolved);
              }}
              className={\`text-sm px-3 py-1.5 rounded-full border \${themeBorder} bg-white dark:bg-gray-800\`}
            >
              {SCRIPT_ORDER.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {langsForScript.length > 0 && (
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

      {/* ── output ────────────────────────────────────────────── */}
      <div
        dir={targetDir}
        className={\`prose prose-lg dark:prose-invert max-w-none leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-200 \${
          targetDir === "rtl" ? "text-right" : ""
        }\`}
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
`.replace(/^\n/, '');

/* ══════════════════════════════════════════════════════════════════
 *  translitStore.js — hard guard: reject en + non-Latin combos
 * ══════════════════════════════════════════════════════════════════ */
const TRANSLIT_STORE = `
import { romanizeAsciiCached } from '../romanization/engines/index.js';
import { fetchTransliteration, LANG_FOR_SCRIPT } from './providers/google.js';

const CACHE_MAX = 500;
const cache    = new Map();
const inflight = new Map();
const state    = { loading: false };
const listeners = new Set();
const emit = () => { for (const l of listeners) l(); };
function setLoading(v) { if (state.loading === v) return; state.loading = v; emit(); }
function cacheSet(key, value) {
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
  cache.set(key, value);
}

// Google Input Tools collapses newlines → transliterate line by line.
async function transliteratePreservingLines(text, fromScript, toScript, toLanguage) {
  const parts = text.split(/(\\r?\\n)/);
  const out = [];

  for (const part of parts) {
    if (part === '\\n' || part === '\\r\\n') { out.push(part); continue; }
    if (!part.trim())                       { out.push(part); continue; }

    const pivot = fromScript === 'Latin'
      ? part
      : romanizeAsciiCached(part, fromScript);

    try {
      const converted = await fetchTransliteration(pivot, 'Latin', toScript, toLanguage);
      out.push(converted);
    } catch {
      out.push(part);
    }
  }
  return out.join('');
}

/**
 * Transliterate text from one script to another.
 *
 * @param {string} text
 * @param {string} fromScript      - e.g. "Latin"
 * @param {string} toScript        - e.g. "Devanagari"
 * @param {string} [toLanguage]    - Google language code for the target; if
 *                                   not given, uses LANG_FOR_SCRIPT[toScript]
 * @param {string} [fromLanguage]  - Google language code of the source
 */
export const translitStore = {
  getState: () => state,
  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },

  async transliterate(text, fromScript, toScript, toLanguage, fromLanguage) {
    if (!text) return '';

    // Identity: same script + same language
    if (fromScript === toScript) {
      const sameLanguage =
        !fromLanguage || !toLanguage || fromLanguage === toLanguage;
      if (sameLanguage) return text;
    }

    // Guard: "en" is only valid as a target for Latin.
    // If someone passes en with a non-Latin script, snap to the script's language.
    let effectiveLang = toLanguage;
    if (toScript !== 'Latin' && (!effectiveLang || effectiveLang === 'en')) {
      effectiveLang = LANG_FOR_SCRIPT[toScript];
    }
    if (!effectiveLang) effectiveLang = LANG_FOR_SCRIPT[toScript];

    const key = \`\${fromScript}:\${fromLanguage ?? ''}>\${toScript}:\${effectiveLang ?? ''}:\${text}\`;
    if (cache.has(key))    return cache.get(key);
    if (inflight.has(key)) return inflight.get(key);

    setLoading(true);
    const promise = (async () => {
      const out = await transliteratePreservingLines(
        text, fromScript, toScript, effectiveLang,
      );
      cacheSet(key, out);
      return out;
    })()
      .catch((err) => { console.warn('[translit]', err.message); return text; })
      .finally(() => {
        inflight.delete(key);
        if (inflight.size === 0) setLoading(false);
      });

    inflight.set(key, promise);
    return promise;
  },

  clearCache() { cache.clear(); inflight.clear(); },
};
`.replace(/^\n/, '');

/* ══════════════════════════════════════════════════════════════════
 *  Write
 * ══════════════════════════════════════════════════════════════════ */
console.log(`\nfix-translit-lang.mjs → ${WEB}\n`);

for (const [fullPath, content] of [
  [TOOLS, LANGUAGE_TOOLS],
  [STORE, TRANSLIT_STORE],
]) {
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('  ✓', path.relative(WEB, fullPath));
}

/* ══════════════════════════════════════════════════════════════════
 *  Smoke test
 * ══════════════════════════════════════════════════════════════════ */
console.log('\n── smoke test ──\n');

const { translitStore } = await import(`file:///${STORE.replace(/\\/g, '/')}`);
const { LANGUAGES, SCRIPT_TO_LANGUAGES } = await import(
  `file:///${path.join(WEB, 'src', 'lang', 'languages.js').replace(/\\/g, '/')}`
);

console.log('Devanagari →', SCRIPT_TO_LANGUAGES['Devanagari']?.map((l) => l.code).join(', '));
console.log('Arabic     →', SCRIPT_TO_LANGUAGES['Arabic']?.map((l) => l.code).join(', '));
console.log('');

// Test 1: English → Devanagari with correct target language "hi"
const t1 = await translitStore.transliterate(
  'Morn in the wake of the morning star',
  'Latin', 'Devanagari', 'hi', 'en',
);
console.log('EN → Devanagari (toLanguage=hi):');
console.log('  ', t1);
console.log('');

// Test 2: English → Devanagari with WRONG target language "en"
// The store should now snap it to "hi" automatically.
const t2 = await translitStore.transliterate(
  'Morn in the wake of the morning star',
  'Latin', 'Devanagari', 'en', 'en',
);
console.log('EN → Devanagari (toLanguage=en, should be auto-fixed):');
console.log('  ', t2);
console.log('');

console.log('✓ done.\n');