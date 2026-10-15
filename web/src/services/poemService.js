// src/services/poemService.js
//
// All requests use relative URLs (/api/...). Next.js proxies these to the
// Express backend via rewrites in next.config.mjs.

/**
 * Safely parse a response as JSON.
 */
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
      } (status ${response.status}). Is the API proxy configured in next.config.mjs?`
    );
  }
}

/**
 * Extract a useful error message from a failed response.
 */
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

/**
 * Shared fetch wrapper.
 */
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

/* ══════════════════════════════════════════════════════════════════
 *  POEMS
 * ══════════════════════════════════════════════════════════════════ */

export async function fetchPoemBySlug(slug) {
  if (!slug) throw new Error("Slug is required");
  try {
    return await apiFetch(`/api/poems/slug/${encodeURIComponent(slug)}`);
  } catch (error) {
    console.error("Error fetching poem:", error);
    throw error;
  }
}

export async function fetchRelatedPoems(poemId) {
  if (!poemId) return { data: [] };
  try {
    return await apiFetch(`/api/poems/related/${encodeURIComponent(poemId)}`);
  } catch (error) {
    console.error("Error fetching related poems:", error);
    return { data: [] };
  }
}

export async function toggleLike(poemId) {
  if (!poemId) throw new Error("Poem ID is required");
  try {
    return await apiFetch(`/api/poems/${encodeURIComponent(poemId)}/like`, {
      method: "POST",
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
}

export async function toggleBookmark(poemId) {
  if (!poemId) throw new Error("Poem ID is required");
  try {
    return await apiFetch(`/api/poems/${encodeURIComponent(poemId)}/bookmark`, {
      method: "POST",
    });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    throw error;
  }
}

export async function fetchPoems(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    });

    const query = queryParams.toString();
    const url = `/api/poems${query ? `?${query}` : ""}`;

    const json = await apiFetch(url);

    return {
      success: json?.success ?? true,
      poems: json?.data ?? json?.poems ?? [],
      pagination: json?.pagination ?? null,
    };
  } catch (error) {
    console.error("Error fetching poems:", error);
    throw error;
  }
}

/* ══════════════════════════════════════════════════════════════════
 *  TRANSLATIONS  (reads poems.translations JSON column)
 * ══════════════════════════════════════════════════════════════════ */

/**
 * Fetch all translations stored for a poem.
 * Returns { success, poemId, sourceLanguage, languages: [...], translations: { ur: "...", fr: "..." } }
 */
export async function fetchPoemTranslations(poemId) {
  if (!poemId) throw new Error("Poem ID is required");
  try {
    return await apiFetch(`/api/poems/${encodeURIComponent(poemId)}/translations`);
  } catch (error) {
    console.error("Error fetching poem translations:", error);
    return { success: false, translations: {}, languages: [] };
  }
}

/**
 * Fetch one language's translation for a poem.
 * Returns { success, content } or throws on 404.
 */
export async function fetchPoemTranslation(poemId, lang) {
  if (!poemId || !lang) throw new Error("poemId and lang are required");
  try {
    return await apiFetch(
      `/api/poems/${encodeURIComponent(poemId)}/translations/${encodeURIComponent(lang)}`
    );
  } catch (error) {
    console.error(`Error fetching translation ${lang}:`, error);
    throw error;
  }
}

/* ══════════════════════════════════════════════════════════════════
 *  TRANSLATE (legacy live endpoint)
 * ══════════════════════════════════════════════════════════════════ */

export async function translateText(text, fromLang, toLang) {
  if (!text || !fromLang || !toLang) {
    throw new Error("Missing required fields: text, from, to");
  }
  try {
    return await apiFetch("/api/translate", {
      method: "POST",
      body: JSON.stringify({ text, from: fromLang, to: toLang }),
    });
  } catch (error) {
    console.error("Error translating text:", error);
    throw error;
  }
}