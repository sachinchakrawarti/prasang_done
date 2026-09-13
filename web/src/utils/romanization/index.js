// src/utils/romanization/index.js

import * as devanagari from "./devanagari";
import * as urdu from "./urdu";
// import * as bengali from "./bengali";
// import * as tamil from "./tamil";
// import * as telugu from "./telugu";
// import * as gujarati from "./gujarati";

/**
 * Registry of all supported languages.
 *
 * Adding a new language:
 *   1. Create ./<lang>.js exporting { scriptName, langCodes, detect,
 *      and either transliterate() or { charMap, digraphs, wordOverrides } }
 *   2. Import it above.
 *   3. Add it below.
 *
 * Detection walks this list in order; the first module whose detect()
 * returns true wins. Put more specific scripts earlier.
 */
const LANGUAGES = [
  devanagari,
  urdu,
  // bengali,
  // tamil,
  // telugu,
  // gujarati,
];

// --------------------------------------------------
// Generic pipeline (used when a module doesn't provide
// its own transliterate function)
// --------------------------------------------------

function applyWordOverrides(text, wordOverrides) {
  if (!wordOverrides || Object.keys(wordOverrides).length === 0) return text;
  return text
    .split(/(\s+)/)
    .map((token) => {
      if (/^\s+$/.test(token)) return token;
      const m = token.match(/^([^\s!.,?;:।॥۔،؟؛]+)(.*)$/);
      if (!m) return token;
      const [, word, tail] = m;
      const override = wordOverrides[word];
      return override ? override + tail : token;
    })
    .join("");
}

function applyDigraphs(text, digraphs) {
  if (!digraphs || digraphs.length === 0) return text;
  let out = text;
  for (const [seq, rep] of digraphs) {
    out = out.split(seq).join(rep);
  }
  return out;
}

function applyCharMap(text, charMap) {
  if (!charMap) return text;
  return text
    .split("")
    .map((ch) => charMap[ch] ?? ch)
    .join("");
}

function genericTransliterate(text, langModule) {
  let out = text;
  out = applyWordOverrides(out, langModule.wordOverrides);
  out = applyDigraphs(out, langModule.digraphs);
  out = applyCharMap(out, langModule.charMap);
  return out;
}

/**
 * Use the module's own transliterate() if it provides one.
 * Otherwise run the generic pipeline.
 */
function transliterate(text, langModule) {
  if (typeof langModule.transliterate === "function") {
    return langModule.transliterate(text);
  }
  return genericTransliterate(text, langModule);
}

// --------------------------------------------------
// Detection
// --------------------------------------------------

function findLanguage(text) {
  if (!text || typeof text !== "string") return null;
  for (const lang of LANGUAGES) {
    try {
      if (typeof lang.detect === "function" && lang.detect(text)) {
        return lang;
      }
    } catch (err) {
      console.error("Language detect() failed:", err);
    }
  }
  return null;
}

// --------------------------------------------------
// Public API
// --------------------------------------------------

/**
 * Romanize a single line. Detects script and routes to the right
 * transliterator. Lines with no supported script pass through unchanged.
 */
export function romanizeLine(line) {
  if (!line || typeof line !== "string") return "";

  const lang = findLanguage(line);
  if (!lang) return line;

  try {
    return transliterate(line, lang);
  } catch (err) {
    console.error("romanizeLine failed:", err, { line });
    return line;
  }
}

/**
 * Romanize text preserving line breaks.
 */
export async function romanizePoetry(text, options = {}) {
  const { preserveLineBreaks = true } = options;
  if (!text) return "";

  const lines = text.split("\n");
  const romanized = lines.map((line) => romanizeLine(line));

  return preserveLineBreaks
    ? romanized.join("\n")
    : romanized.join(" ").replace(/\s+/g, " ").trim();
}

/**
 * True if the text contains a script we can romanize.
 */
export function isRomanizationAvailable(text) {
  if (!text || typeof text !== "string") return false;
  return Boolean(findLanguage(text));
}

/**
 * Which script did we detect?
 * Returns the language module's scriptName, or "unknown".
 */
export function detectRomanizationScript(text) {
  if (!text || typeof text !== "string") return "unknown";
  const lang = findLanguage(text);
  return lang?.scriptName ?? "unknown";
}

/**
 * List of supported languages.
 */
export function getSupportedLanguages() {
  return LANGUAGES.map((l) => ({
    scriptName: l.scriptName,
    langCodes: l.langCodes,
  }));
}