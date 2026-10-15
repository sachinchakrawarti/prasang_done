// src/services/translationService.js
// Admin CRUD for poems.translations. Reads use poemService.fetchPoemTranslations.

import { fetchPoemTranslations } from './poemService.js';

async function apiFetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch {}
  if (!response.ok) {
    const msg = data?.error || data?.message || `HTTP ${response.status}`;
    throw new Error(msg);
  }
  return data;
}

/** Replace the whole translations map. */
export async function saveAllTranslations(poemId, translations) {
  if (!poemId) throw new Error('poemId required');
  return apiFetchJson(`/api/poems/${poemId}/translations`, {
    method: 'PUT',
    body: JSON.stringify({ translations }),
  });
}

/** Save one language. */
export async function saveTranslation(poemId, lang, content) {
  if (!poemId || !lang) throw new Error('poemId and lang required');
  return apiFetchJson(`/api/poems/${poemId}/translations/${encodeURIComponent(lang)}`, {
    method: 'PATCH',
    body: JSON.stringify({ content }),
  });
}

/** Remove one language. */
export async function deleteTranslation(poemId, lang) {
  if (!poemId || !lang) throw new Error('poemId and lang required');
  return apiFetchJson(`/api/poems/${poemId}/translations/${encodeURIComponent(lang)}`, {
    method: 'DELETE',
  });
}

/** Re-export the reader function for convenience. */
export { fetchPoemTranslations };
