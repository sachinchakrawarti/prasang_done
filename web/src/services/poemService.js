// src/services/poemService.js
//
// All requests use relative URLs (/api/...). Next.js proxies these to the
// Express backend via rewrites in next.config.mjs.

async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) {
    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${response.statusText || "Empty response"}`
      );
    }
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    const preview = text.slice(0, 200).replace(/\s+/g, " ");
    console.error("Non-JSON response received:", {
      status: response.status,
      contentType: response.headers.get("content-type"),
      preview,
    });
    throw new Error(
      `Expected JSON but received ${
        response.headers.get("content-type") || "unknown content type"
      } (status ${response.status}).`
    );
  }
}

async function extractErrorMessage(response) {
  const fallback = `HTTP error ${response.status}`;
  try {
    const text = await response.text();
    if (!text) return fallback;
    try {
      const data = JSON.parse(text);
      return data.error || data.message || fallback;
    } catch {
      return response.statusText || fallback;
    }
  } catch {
    return response.statusText || fallback;
  }
}

async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!response.ok) {
    const message = await extractErrorMessage(response);
    throw new Error(message);
  }
  return parseJsonResponse(response);
}

/* ── poems ── */

export async function fetchPoemBySlug(slug) {
  if (!slug) throw new Error("Slug is required");
  return apiFetch(`/api/poems/slug/${encodeURIComponent(slug)}`);
}

export async function fetchRelatedPoems(poemId) {
  if (!poemId) return { data: [] };
  try {
    return await apiFetch(`/api/poems/related/${encodeURIComponent(poemId)}`);
  } catch (e) {
    console.error("Error fetching related poems:", e);
    return { data: [] };
  }
}

export async function toggleLike(poemId) {
  if (!poemId) throw new Error("Poem ID is required");
  return apiFetch(`/api/poems/${encodeURIComponent(poemId)}/like`, { method: "POST" });
}

export async function toggleBookmark(poemId) {
  if (!poemId) throw new Error("Poem ID is required");
  return apiFetch(`/api/poems/${encodeURIComponent(poemId)}/bookmark`, { method: "POST" });
}

export async function fetchPoems(filters = {}) {
  const qp = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qp.append(k, v);
  });
  const q = qp.toString();
  const json = await apiFetch(`/api/poems${q ? `?${q}` : ""}`);
  return {
    success: json?.success ?? true,
    poems: json?.data ?? json?.poems ?? [],
    pagination: json?.pagination ?? null,
  };
}

/* ── translations ── */

/**
 * Fetch the translations map for a poem.
 * Expects the server response to include `translations: { ur: "...", fr: "..." }`.
 * Falls back to `data` or the raw row so it works with several controller shapes.
 */
export async function fetchPoemTranslations(poemId) {
  if (!poemId) throw new Error("Poem ID is required");

  try {
    const json = await apiFetch(`/api/ai-translations/${encodeURIComponent(poemId)}`);

    // Unwrap any common server shape:
    //   { translations: {...} }  |  { data: { translations: {...} } }  |  raw map
    const map =
      json?.translations ??
      json?.data?.translations ??
      json?.data ??
      json ??
      {};

    const translations =
      typeof map === "string" ? JSON.parse(map) : map;

    return {
      success: true,
      poemId,
      translations: translations ?? {},
      languages: Object.keys(translations ?? {}),
    };
  } catch (e) {
    console.error("Error fetching poem translations:", e);
    return { success: false, translations: {}, languages: [] };
  }
}

/**
 * Fetch one language's translation.
 * If the server doesn't expose a per-language route, falls back to the map.
 */
export async function fetchPoemTranslation(poemId, lang) {
  if (!poemId || !lang) throw new Error("poemId and lang are required");

  // Try direct per-language route first
  try {
    return await apiFetch(
      `/api/ai-translations/${encodeURIComponent(poemId)}/${encodeURIComponent(lang)}`
    );
  } catch {
    // Fall back to fetching the whole map and picking
    const all = await fetchPoemTranslations(poemId);
    const text = all.translations?.[lang];
    if (!text) throw new Error(`No translation for ${lang}`);
    return { success: true, poemId, targetLanguage: lang, content: text };
  }
}

/* ── legacy live translate ── */

export async function translateText(text, fromLang, toLang) {
  if (!text || !fromLang || !toLang) {
    throw new Error("Missing required fields: text, from, to");
  }
  return apiFetch("/api/translate", {
    method: "POST",
    body: JSON.stringify({ text, from: fromLang, to: toLang }),
  });
}