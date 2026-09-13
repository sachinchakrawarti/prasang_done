// src/utils/romanization.js

/**
 * True if text contains Devanagari or Arabic-script characters
 * that would benefit from romanization.
 */
export function isRomanizationAvailable(text) {
  if (!text || typeof text !== "string") return false;
  return /[\u0600-\u06FF\u0750-\u077F\u0900-\u097F]/.test(text);
}

const DEV_MAP = {
  "अ":"a","आ":"aa","इ":"i","ई":"ee","उ":"u","ऊ":"oo","ऋ":"ri",
  "ए":"e","ऐ":"ai","ओ":"o","औ":"au",
  "क":"k","ख":"kh","ग":"g","घ":"gh","ङ":"n",
  "च":"ch","छ":"chh","ज":"j","झ":"jh","ञ":"n",
  "ट":"t","ठ":"th","ड":"d","ढ":"dh","ण":"n",
  "त":"t","थ":"th","द":"d","ध":"dh","न":"n",
  "प":"p","फ":"ph","ब":"b","भ":"bh","म":"m",
  "य":"y","र":"r","ल":"l","व":"v","श":"sh","ष":"sh","स":"s","ह":"h",
  "ा":"a","ि":"i","ी":"i","ु":"u","ू":"u","ृ":"ri",
  "े":"e","ै":"ai","ो":"o","ौ":"au",
  "ं":"n","ँ":"n","ः":"h","्":"","़":"",
  "।":"|","॥":"||",
};

export function romanize(text) {
  if (!text) return "";
  return text.split("").map((ch) => DEV_MAP[ch] ?? ch).join("");
}

/**
 * Detects the script of a string.
 */
export function detectScript(text) {
  if (!text) return "unknown";
  if (/[\u0900-\u097F]/.test(text)) return "devanagari";
  if (/[\u0600-\u06FF]/.test(text)) return "arabic";
  if (/[a-zA-Z]/.test(text)) return "latin";
  return "unknown";
}