// src/services/poemService.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Get poem by slug
export async function fetchPoemBySlug(slug) {
  const response = await fetch(`${API_BASE_URL}/poems/slug/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Get related poems
export async function fetchRelatedPoems(poemId, limit = 3) {
  const response = await fetch(`${API_BASE_URL}/poems/${poemId}/related?limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Toggle like
export async function toggleLike(poemId) {
  const response = await fetch(`${API_BASE_URL}/poems/${poemId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to toggle like");
  }

  return response.json();
}

// Toggle bookmark
export async function toggleBookmark(poemId) {
  const response = await fetch(`${API_BASE_URL}/poems/${poemId}/bookmark`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to toggle bookmark");
  }

  return response.json();
}

// Get all poems (with pagination)
export async function fetchPoems(params = {}) {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value);
    }
  });

  const url = `${API_BASE_URL}/poems?${queryParams.toString()}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}