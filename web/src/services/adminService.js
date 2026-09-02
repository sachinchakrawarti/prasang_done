// src/services/adminService.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ============================================
// POEMS
// ============================================

// Get all poems with pagination and filters
export async function fetchPoems(params = {}) {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value);
    }
  });

  const response = await fetch(`${API_BASE_URL}/poems?${queryParams}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Get poem by ID
export async function fetchPoemById(id) {
  const response = await fetch(`${API_BASE_URL}/poems/${id}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Get poem by slug
export async function fetchPoemBySlug(slug) {
  const response = await fetch(`${API_BASE_URL}/poems/slug/${slug}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Create new poem
export async function createPoem(data) {
  const response = await fetch(`${API_BASE_URL}/poems`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create poem");
  }

  return response.json();
}

// Update poem
export async function updatePoem(id, data) {
  const response = await fetch(`${API_BASE_URL}/poems/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update poem");
  }

  return response.json();
}

// Delete poem
export async function deletePoem(id) {
  const response = await fetch(`${API_BASE_URL}/poems/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to delete poem");
  }

  return response.json();
}

// Update poem status
export async function updatePoemStatus(id, status) {
  const response = await fetch(`${API_BASE_URL}/poems/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update poem status");
  }

  return response.json();
}

// ============================================
// POETS
// ============================================

// Get all poets
export async function fetchPoets(params = {}) {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value);
    }
  });

  const response = await fetch(`${API_BASE_URL}/poets?${queryParams}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Get poet by ID
export async function fetchPoetById(id) {
  const response = await fetch(`${API_BASE_URL}/poets/${id}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Create new poet
export async function createPoet(data) {
  const response = await fetch(`${API_BASE_URL}/poets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create poet");
  }

  return response.json();
}

// Update poet
export async function updatePoet(id, data) {
  const response = await fetch(`${API_BASE_URL}/poets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update poet");
  }

  return response.json();
}

// Delete poet
export async function deletePoet(id) {
  const response = await fetch(`${API_BASE_URL}/poets/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to delete poet");
  }

  return response.json();
}

// ============================================
// CATEGORIES
// ============================================

// Get all categories
export async function fetchCategories(params = {}) {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value);
    }
  });

  const response = await fetch(`${API_BASE_URL}/categories?${queryParams}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Get category by ID
export async function fetchCategoryById(id) {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Create new category
export async function createCategory(data) {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create category");
  }

  return response.json();
}

// Update category
export async function updateCategory(id, data) {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update category");
  }

  return response.json();
}

// Delete category
export async function deleteCategory(id) {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to delete category");
  }

  return response.json();
}

// ============================================
// TAGS
// ============================================

// Get all tags
export async function fetchTags(params = {}) {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value);
    }
  });

  const response = await fetch(`${API_BASE_URL}/tags?${queryParams}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Create new tag
export async function createTag(data) {
  const response = await fetch(`${API_BASE_URL}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create tag");
  }

  return response.json();
}

// Update tag
export async function updateTag(id, data) {
  const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update tag");
  }

  return response.json();
}

// Delete tag
export async function deleteTag(id) {
  const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to delete tag");
  }

  return response.json();
}

// ============================================
// TRANSLATIONS
// ============================================

// Get translations for a poem
export async function fetchPoemTranslations(poemId) {
  const response = await fetch(`${API_BASE_URL}/ai-translations/poem/${poemId}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Create translation
export async function createTranslation(data) {
  const response = await fetch(`${API_BASE_URL}/ai-translations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create translation");
  }

  return response.json();
}

// Update translation
export async function updateTranslation(id, data) {
  const response = await fetch(`${API_BASE_URL}/ai-translations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update translation");
  }

  return response.json();
}

// Delete translation
export async function deleteTranslation(id) {
  const response = await fetch(`${API_BASE_URL}/ai-translations/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to delete translation");
  }

  return response.json();
}