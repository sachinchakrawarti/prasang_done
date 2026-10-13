import { romanizeDevanagari } from './devanagari.js';
import { romanizeArabic }     from './arabic.js';
import { romanizeLatin }      from './latin.js';

const HANDLERS = {
  Devanagari: romanizeDevanagari,
  Arabic:     romanizeArabic,
  Latin:      romanizeLatin,
};

export const SUPPORTED_SCRIPTS = Object.keys(HANDLERS);

// --- display romanization (ISO 15919, keeps diacritics) ---
export function romanize(text, script) {
  const fn = HANDLERS[script];
  return fn ? fn(text) : text;
}

const CACHE = new Map();
export function romanizeCached(text, script) {
  const key = `${script}:${text}`;
  if (CACHE.has(key)) return CACHE.get(key);
  const out = romanize(text, script);
  CACHE.set(key, out);
  return out;
}

// --- ASCII romanization for transliteration input ---
// Same pipeline, then strip all diacritics to plain a-z.
const DIACRITIC_MAP = {
  'ā':'a','ī':'i','ū':'u','ē':'e','ō':'o','ṛ':'r','ṝ':'r','ḷ':'l','ḹ':'l',
  'ṅ':'n','ñ':'n','ṭ':'t','ḍ':'d','ṇ':'n','ś':'s','ṣ':'s','ḥ':'h','ṁ':'n','m̐':'n',
  'Ā':'A','Ī':'I','Ū':'U','Ē':'E','Ō':'O','Ṛ':'R','Ḷ':'L','Ṅ':'N','Ñ':'N',
  'Ṭ':'T','Ḍ':'D','Ṇ':'N','Ś':'S','Ṣ':'S','Ḥ':'H','Ṁ':'M',
  'ġ':'g','ẓ':'z','ʾ':'','ʻ':'','k͟h':'kh',
};

export function toAscii(text) {
  let out = '';
  for (const ch of text) out += DIACRITIC_MAP[ch] ?? ch;
  // strip combining marks (m̐ etc.)
  return out.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const ASCII_CACHE = new Map();
export function romanizeAsciiCached(text, script) {
  const key = `${script}:${text}`;
  if (ASCII_CACHE.has(key)) return ASCII_CACHE.get(key);
  const out = toAscii(romanize(text, script));
  ASCII_CACHE.set(key, out);
  return out;
}