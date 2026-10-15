// web/scripts/fix-ui-final.mjs
// Final LanguageTools UI + cache warming + per-line progress.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB  = path.resolve(__dirname, '..');
const COMP = path.join(WEB, 'src', 'components', 'poems');
const TOOLS = path.join(COMP, 'LanguageTools.jsx');

const LANGUAGE_TOOLS = `
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { romanizeCached, SUPPORTED_SCRIPTS } from "@/lang/romanization";
import { translitStore } from "@/lang/transliteration";
import { LANGUAGES, SCRIPT_TO_LANGUAGES } from "@/lang/languages";

/**
 * Script order for the picker.
 * Latin omitted (source is usually Latin; picking Latin as a target = identity).
 * Han/Kana/Hangul omitted (Google Input Tools has no working Latin→CJK model).
 */
const TRANSLIT_SCRIPTS = [
  "Devanagari",
  "Bengali",
  "Gurmukhi",
  "Gujarati",
  "Odia",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Arabic",
  "Cyrillic",
];

function resolveLanguage(targetScript, targetLang, fallbackLang) {
  const candidates = SCRIPT_TO_LANGUAGES[targetScript] ?? [];
  if (candidates.find((l) => l.code === targetLang)) return targetLang;
  if (candidates[0]) return candidates[0].code;
  return fallbackLang;
}

export default function LanguageTools({
  content,
  script = "Latin",
  language = "en",
  themeGradient = "from-amber-600 to-yellow-500",
  themeText = "text-amber-600 dark:text-amber-400",
  themeBorder = "border-amber-200 dark:border-amber-800",
  themeHover = "hover:bg-amber-50 dark:hover:bg-amber-900/20",
}) {
  const [mode, setMode] = useState("original"); // original | roman | translit
  const [targetScript, setTargetScript] = useState(() =>
    script === "Latin" ? "Devanagari" : script
  );
  const [targetLang, setTargetLang] = useState(language);
  const [output, setOutput] = useState(content);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const requestIdRef = useRef(0);

  // ── Reset when the poem changes ───────────────────────────────
  useEffect(() => {
    setMode("original");
    setTargetScript(script === "Latin" ? "Devanagari" : script);
    setTargetLang(language);
    setOutput(content);
    setErr(null);
    setProgress({ done: 0, total: 0 });
  }, [content, script, language]);

  // ── Snap targetLang to a valid one for the script ────────────
  useEffect(() => {
    const resolved = resolveLanguage(targetScript, targetLang, language);
    if (resolved !== targetLang) setTargetLang(resolved);
  }, [targetScript, targetLang, language]);

  // ── Roman text (sync) ─────────────────────────────────────────
  const romanText = useMemo(() => {
    if (mode !== "roman") return "";
    try {
      return romanizeCached(content, script);
    } catch {
      return content;
    }
  }, [mode, content, script]);

  // ── Language options for the current script ──────────────────
  const langsForScript = useMemo(
    () => SCRIPT_TO_LANGUAGES[targetScript] ?? [],
    [targetScript],
  );

  // ── Transliterate (async) ─────────────────────────────────────
  useEffect(() => {
    if (mode !== "translit") return;

    const resolvedLang = resolveLanguage(targetScript, targetLang, language);
    const target = LANGUAGES[resolvedLang];
    if (!target) return;

    // identity: same script + same language → no work
    if (targetScript === script && resolvedLang === language) {
      setOutput(content);
      setErr(null);
      setBusy(false);
      setProgress({ done: 0, total: 0 });
      return;
    }

    const myId = ++requestIdRef.current;
    let cancelled = false;

    // Count non-empty lines for progress display
    const totalLines = content.split(/\\r?\\n/).filter((l) => l.trim()).length;
    setProgress({ done: 0, total: totalLines });
    setBusy(true);
    setErr(null);

    (async () => {
      try {
        const out = await translitStore.transliterate(
          content,
          script,
          targetScript,
          target.googleLang,
          language,
        );
        if (cancelled || myId !== requestIdRef.current) return;
        setOutput(out);
        setProgress({ done: totalLines, total: totalLines });
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

  // ── Visible text ──────────────────────────────────────────────
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

  const canPickTargetScript = TRANSLIT_SCRIPTS.includes(targetScript);

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="mt-6">
      {/* ── controls ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <ModeButton
          active={mode === "original"}
          onClick={() => setMode("original")}
          gradient={themeGradient}
          text={themeText}
          border={themeBorder}
          hover={themeHover}
        >
          Original
        </ModeButton>

        <ModeButton
          active={mode === "roman"}
          onClick={() => setMode("roman")}
          gradient={themeGradient}
          text={themeText}
          border={themeBorder}
          hover={themeHover}
        >
          Roman
        </ModeButton>

        <ModeButton
          active={mode === "translit"}
          onClick={() => setMode("translit")}
          gradient={themeGradient}
          text={themeText}
          border={themeBorder}
          hover={themeHover}
        >
          Transliterate
        </ModeButton>

        {mode === "translit" && (
          <>
            <select
              value={targetScript}
              onChange={(e) => {
                const next = e.target.value;
                setTargetScript(next);
                setTargetLang(resolveLanguage(next, targetLang, language));
              }}
              className={\`text-sm px-3 py-1.5 rounded-full border \${themeBorder} bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200\`}
            >
              {TRANSLIT_SCRIPTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {langsForScript.length > 0 && (
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className={\`text-sm px-3 py-1.5 rounded-full border \${themeBorder} bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200\`}
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
          <span className="text-xs text-gray-400 animate-pulse">
            {progress.total > 1
              ? \`translating \${progress.done}/\${progress.total} lines…\`
              : "translating…"}
          </span>
        )}
      </div>

      {/* ── poem body ────────────────────────────────────────── */}
      <div
        dir={targetDir}
        className={\`prose prose-lg dark:prose-invert max-w-none leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-200 \${
          targetDir === "rtl" ? "text-right" : ""
        }\`}
        style={
          targetDir === "rtl"
            ? { fontFamily: "'Noto Nastaliq Urdu','Amiri',serif", lineHeight: 2.2 }
            : undefined
        }
      >
        {busy && !output ? "…" : visible}
      </div>

      {isIdentity && (
        <p className="mt-2 text-xs text-gray-400">
          Already in this script and language.
        </p>
      )}
      {!isIdentity && !canPickTargetScript && (
        <p className="mt-2 text-xs text-amber-600">
          This script isn't supported for transliteration from the source.
        </p>
      )}
      {err && (
        <p className="mt-2 text-xs text-red-500">⚠ {err}</p>
      )}
    </div>
  );
}

function ModeButton({ active, onClick, children, gradient, text, border, hover }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={\`px-3 py-1.5 text-sm rounded-full border transition \${
        active
          ? \`bg-gradient-to-r \${gradient} text-white border-transparent\`
          : \`\${hover} \${text} \${border}\`
      }\`}
    >
      {children}
    </button>
  );
}
`.replace(/^\n/, '');

console.log(`\nfix-ui-final.mjs → ${WEB}\n`);
fs.writeFileSync(TOOLS, LANGUAGE_TOOLS, 'utf8');
console.log('  ✓', path.relative(WEB, TOOLS));
console.log('\nDone.\n');