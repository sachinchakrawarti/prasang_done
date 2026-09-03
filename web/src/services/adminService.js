// src/services/adminService.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper function to handle fetch errors
async function handleFetchResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

// ============================================
// TAGS
// ============================================

export async function fetchTags(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "all") {
        queryParams.append(key, value);
      }
    });

    const url = `${API_BASE_URL}/tags${queryParams.toString() ? `?${queryParams}` : ''}`;
    console.log("Fetching tags from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleFetchResponse(response);
  } catch (error) {
    console.error("Fetch tags error:", error);
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      success: false,
      error: error.message,
    };
  }
}

export async function fetchTagById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Fetch tag ${id} error:`, error);
    throw error;
  }
}

export async function createTag(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error("Create tag error:", error);
    throw error;
  }
}

export async function updateTag(id, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Update tag ${id} error:`, error);
    throw error;
  }
}

export async function deleteTag(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
      method: "DELETE",
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Delete tag ${id} error:`, error);
    throw error;
  }
}

// ============================================
// POEMS
// ============================================

export async function fetchPoems(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "all") {
        queryParams.append(key, value);
      }
    });

    const url = `${API_BASE_URL}/poems${queryParams.toString() ? `?${queryParams}` : ''}`;
    console.log("Fetching poems from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleFetchResponse(response);
  } catch (error) {
    console.error("Fetch poems error:", error);
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      success: false,
      error: error.message,
    };
  }
}

export async function fetchPoemById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/poems/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Fetch poem ${id} error:`, error);
    throw error;
  }
}

export async function createPoem(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/poems`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error("Create poem error:", error);
    throw error;
  }
}

export async function updatePoem(id, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/poems/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Update poem ${id} error:`, error);
    throw error;
  }
}

export async function deletePoem(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/poems/${id}`, {
      method: "DELETE",
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Delete poem ${id} error:`, error);
    throw error;
  }
}

// ============================================
// POETS
// ============================================

export async function fetchPoets(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "all") {
        queryParams.append(key, value);
      }
    });

    const url = `${API_BASE_URL}/poets${queryParams.toString() ? `?${queryParams}` : ''}`;
    console.log("Fetching poets from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleFetchResponse(response);
  } catch (error) {
    console.error("Fetch poets error:", error);
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      success: false,
      error: error.message,
    };
  }
}

export async function fetchPoetById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/poets/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Fetch poet ${id} error:`, error);
    throw error;
  }
}

export async function createPoet(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/poets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error("Create poet error:", error);
    throw error;
  }
}

export async function updatePoet(id, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/poets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Update poet ${id} error:`, error);
    throw error;
  }
}

export async function deletePoet(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/poets/${id}`, {
      method: "DELETE",
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Delete poet ${id} error:`, error);
    throw error;
  }
}

// ============================================
// CATEGORIES
// ============================================

export async function fetchCategories(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "all") {
        queryParams.append(key, value);
      }
    });

    const url = `${API_BASE_URL}/categories${queryParams.toString() ? `?${queryParams}` : ''}`;
    console.log("Fetching categories from:", url);

    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error("Fetch categories error:", error);
    return { data: [], success: false, error: error.message };
  }
}

export async function fetchCategoryById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Fetch category ${id} error:`, error);
    throw error;
  }
}

export async function createCategory(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error("Create category error:", error);
    throw error;
  }
}

export async function updateCategory(id, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Update category ${id} error:`, error);
    throw error;
  }
}

export async function deleteCategory(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Delete category ${id} error:`, error);
    throw error;
  }
}

// ============================================
// TRANSLATIONS
// ============================================

export async function fetchTranslationById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-translations/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Fetch translation ${id} error:`, error);
    throw error;
  }
}

export async function createTranslation(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-translations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error("Create translation error:", error);
    throw error;
  }
}

export async function updateTranslation(id, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-translations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Update translation ${id} error:`, error);
    throw error;
  }
}

export async function deleteTranslation(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-translations/${id}`, {
      method: "DELETE",
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Delete translation ${id} error:`, error);
    throw error;
  }
}

export async function fetchPoemTranslations(poemId, params = {}) {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    });

    const url = `${API_BASE_URL}/ai-translations/poem/${poemId}${queryParams.toString() ? `?${queryParams}` : ''}`;
    console.log("Fetching poem translations from:", url);

    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Fetch translations for poem ${poemId} error:`, error);
    return { data: [], success: false, error: error.message };
  }
}