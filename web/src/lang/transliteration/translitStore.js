import { romanizeAsciiCached } from '../romanization/engines/index.js';
import { fetchTransliteration } from './providers/google.js';

const CACHE_MAX = 500;
const cache    = new Map();
const inflight = new Map();

const state = { loading: false };
const listeners = new Set();
const emit = () => { for (const l of listeners) l(); };

function setLoading(v) {
  if (state.loading === v) return;
  state.loading = v;
  emit();
}
function cacheSet(key, value) {
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
  cache.set(key, value);
}

export const translitStore = {
  getState: () => state,
  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },

  async transliterate(text, fromScript, toScript, toLanguage) {
    if (!text) return '';
    if (fromScript === toScript && !toLanguage) return text;

    const key = `${fromScript}>${toScript}@${toLanguage ?? ''}:${text}`;
    if (cache.has(key))    return cache.get(key);
    if (inflight.has(key)) return inflight.get(key);

    setLoading(true);

    const promise = (async () => {
      const pivot = fromScript === 'Latin'
        ? text
        : romanizeAsciiCached(text, fromScript);

      const out = await fetchTransliteration(pivot, 'Latin', toScript, toLanguage);
      cacheSet(key, out);
      return out;
    })()
      .catch((err) => {
        console.warn('[translit]', err.message);
        return text;
      })
      .finally(() => {
        inflight.delete(key);
        if (inflight.size === 0) setLoading(false);
      });

    inflight.set(key, promise);
    return promise;
  },

  clearCache() { cache.clear(); inflight.clear(); },
};
