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
  const parts = text.split(/(\r?\n)/);
  const out = [];

  for (const part of parts) {
    if (part === '\n' || part === '\r\n') { out.push(part); continue; }
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

    const key = `${fromScript}:${fromLanguage ?? ''}>${toScript}:${effectiveLang ?? ''}:${text}`;
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
