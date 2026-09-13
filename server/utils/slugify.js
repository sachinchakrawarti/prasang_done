// server/utils/slugify.js

import { and, eq, ne } from "drizzle-orm";

/**
 * Devanagari -> Latin mapping tuned for "natural" spellings.
 *
 *   उड़ान        -> udaan
 *   मैं नहीं हूँ -> main nahin hoon
 *   प्रसांग      -> prasaang
 *   गुलज़ार      -> gulzar
 */
const DEVANAGARI_MAP = {
  // Independent vowels
  "अ": "a",  "आ": "aa", "इ": "i",  "ई": "ee", "उ": "u",  "ऊ": "oo",
  "ऋ": "ri", "ए": "e",  "ऐ": "ai", "ओ": "o",  "औ": "au", "ऑ": "o",

  // Consonants
  "क": "k",  "ख": "kh", "ग": "g",  "घ": "gh", "ङ": "n",
  "च": "ch", "छ": "chh","ज": "j",  "झ": "jh", "ञ": "n",
  "ट": "t",  "ठ": "th", "ड": "d",  "ढ": "dh", "ण": "n",
  "त": "t",  "थ": "th", "द": "d",  "ध": "dh", "न": "n",
  "प": "p",  "फ": "ph", "ब": "b",  "भ": "bh", "म": "m",
  "य": "y",  "र": "r",  "ल": "l",  "व": "v",  "श": "sh",
  "ष": "sh", "स": "s",  "ह": "h",
  "ळ": "l",  "क़": "q", "ख़": "kh","ग़": "g", "ज़": "z",
  "ड़": "r",  "ढ़": "rh","फ़": "f", "य़": "y",

  // Matras (vowel signs)
  "ा": "a",  "ि": "i",  "ी": "i",  "ु": "u",  "ू": "u",
  "ृ": "ri", "े": "e",  "ै": "ai", "ो": "o",  "ौ": "au", "ॉ": "o",

  // Nasals / visarga / halant / nukta
  "ं": "n",  "ँ": "n",  "ः": "h",  "्": "",   "़": "",

  // Devanagari digits
  "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
  "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",

  // Punctuation
  "।": " ", "॥": " ",
};

/**
 * Convert a Devanagari string to a rough Latin equivalent.
 */
function transliterateDevanagari(str) {
  return str
    .split("")
    .map((ch) => DEVANAGARI_MAP[ch] ?? ch)
    .join("");
}

/**
 * Convert an arbitrary title into a URL-safe ASCII slug.
 *
 *   "उड़ान"        -> "udaan"
 *   "मैं नहीं हूँ" -> "main-nahin-hoon"
 *   "Love Poem"    -> "love-poem"
 *   "Hello, World!"-> "hello-world"
 */
export function slugify(input) {
  if (!input || typeof input !== "string") return "";

  // 1) Transliterate Devanagari if present
  let text = /[\u0900-\u097F]/.test(input)
    ? transliterateDevanagari(input)
    : input;

  // 2) Normalize, lowercase, strip diacritics
  text = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  // 3) Keep only ascii letters, digits, spaces, hyphens
  text = text.replace(/[^a-z0-9\s-]/g, " ");

  // 4) Collapse whitespace / hyphens
  text = text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return text || "untitled";
}

/**
 * Generate a slug from a title, ensuring it is unique within `poems`.
 * Appends -2, -3, ... until a free slug is found.
 *
 * @param {*} db        - Drizzle db instance
 * @param {*} poems     - poems table schema
 * @param {string} title
 * @param {number|null} excludeId - skip this poem id (for updates)
 */
export async function makeUniqueSlug(db, poems, title, excludeId = null) {
  const base = slugify(title);
  let candidate = base;
  let counter = 1;

  while (true) {
    const where = excludeId
      ? and(eq(poems.slug, candidate), ne(poems.id, excludeId))
      : eq(poems.slug, candidate);

    const [existing] = await db
      .select({ id: poems.id })
      .from(poems)
      .where(where)
      .limit(1);

    if (!existing) return candidate;

    counter += 1;
    candidate = `${base}-${counter}`;
  }
}