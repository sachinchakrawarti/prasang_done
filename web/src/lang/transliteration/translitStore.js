// web/src/lang/transliteration/translitStore.js
import { romanizeAsciiCached } from '../romanization/engines/index.js';
import { fetchTransliteration } from './providers/google.js';

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

// Google Input Tools collapses newlines. Transliterate line by line,
// blank lines preserved, then rejoin with the original separators.
async function transliteratePreservingLines(text, fromScript, toScript, toLanguage) {
  // Split on \n but keep the separators so we can rebuild
  const parts = text.split(/(\n)/);
  const out = [];

  for (const part of parts) {
    if (part === '\n' || part === '\r\n') {
      out.push(part);
      continue;
    }
    if (!part.trim()) {
      out.push(part); // whitespace-only line, keep as-is
      continue;
    }

    const pivot = fromScript === 'Latin'
      ? part
      : romanizeAsciiCached(part, fromScript);

    try {
      const converted = await fetchTransliteration(pivot, 'Latin', toScript, toLanguage);
      out.push(converted);
    } catch {
      out.push(part); // fall back to original line on error
    }
  }

  return out.join('');
}

export const translitStore = {
  getState: () => state,
  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },

  async transliterate(text, fromScript, toScript, toLanguage, fromLanguage) {
    if (!text) return '';

    if (fromScript === toScript) {
      const sameLanguage =
        !fromLanguage || !toLanguage || fromLanguage === toLanguage;
      if (sameLanguage) return text;
    }

    const key = `${fromScript}:${fromLanguage ?? ''}>${toScript}:${toLanguage ?? ''}:${text}`;
    if (cache.has(key))    return cache.get(key);
    if (inflight.has(key)) return inflight.get(key);

    setLoading(true);
    const promise = (async () => {
      const out = await transliteratePreservingLines(
        text, fromScript, toScript, toLanguage,
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