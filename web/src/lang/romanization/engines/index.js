import { romanizeDevanagari } from './devanagari.js';
import { romanizeArabic }     from './arabic.js';
import { romanizeLatin }      from './latin.js';

const HANDLERS = {
  Devanagari: romanizeDevanagari,
  Arabic:     romanizeArabic,
  Latin:      romanizeLatin,
};

export const SUPPORTED_SCRIPTS = Object.keys(HANDLERS);

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
