console.log('🔧 Loading fetchPoetry.js...');

import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../schema/index.js';
import { poets } from '../schema/poets.js';
import { poems } from '../schema/poems.js';
import { categories } from '../schema/categories.js';
import { tags } from '../schema/tags.js';
import { eq, and, sql } from 'drizzle-orm';

console.log('📂 Connecting to database at: ./database/prasang.db');

// Initialize database connection
const client = createClient({
  url: 'file:./database/prasang.db',
});

console.log('✅ Database client created');

// Create Drizzle instance
const db = drizzle(client, { schema });

console.log('✅ Drizzle ORM initialized');

// PoetryDB API endpoints
const API_BASE = 'https://poetrydb.org';

// Helper function to fetch with retry
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`📡 Fetching: ${url}`);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log(`✅ Received ${Array.isArray(data) ? data.length : 'data'} items`);
      return data;
    } catch (error) {
      console.log(`⚠️ Attempt ${i + 1} failed: ${error.message}`);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Get all authors
export async function fetchAuthors() {
  console.log('📚 Fetching authors...');
  const data = await fetchWithRetry(`${API_BASE}/authors`);
  return data.authors || [];
}

// Get poems by author
export async function fetchPoemsByAuthor(author) {
  console.log(`📝 Fetching poems for ${author}...`);
  const data = await fetchWithRetry(`${API_BASE}/author/${encodeURIComponent(author)}`);
  return data || [];
}

// Get random poems
export async function fetchRandomPoems(count = 10) {
  console.log(`🎲 Fetching ${count} random poems...`);
  const data = await fetchWithRetry(`${API_BASE}/random/${count}`);
  return data || [];
}

// Get poem by title
export async function fetchPoemByTitle(title) {
  console.log(`🔍 Searching for "${title}"...`);
  const data = await fetchWithRetry(`${API_BASE}/title/${encodeURIComponent(title)}`);
  return data[0] || null;
}

// Search poems
export async function searchPoems(query) {
  console.log(`🔎 Searching for "${query}"...`);
  const data = await fetchWithRetry(`${API_BASE}/lines/${encodeURIComponent(query)}`);
  return data || [];
}

// Get poem by ID
export async function fetchPoemById(id) {
  console.log(`🔍 Fetching poem by ID: ${id}...`);
  const data = await fetchWithRetry(`${API_BASE}/id/${encodeURIComponent(id)}`);
  return data[0] || null;
}

// Get all poems (paginated)
export async function fetchAllPoems(limit = 100) {
  console.log(`📚 Fetching ${limit} poems...`);
  const data = await fetchWithRetry(`${API_BASE}/random/${limit}`);
  return data || [];
}

// Also export the db instance for use in other files
export { db, client };