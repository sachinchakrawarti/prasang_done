import { romanizeDevanagari } from './devanagari.js';
import { romanizeBengali }    from './bengali.js';
import { romanizeGurmukhi }   from './gurmukhi.js';
import { romanizeGujarati }   from './gujarati.js';
import { romanizeTamil }      from './tamil.js';
import { romanizeTelugu }     from './telugu.js';
import { romanizeKannada }    from './kannada.js';
import { romanizeMalayalam }  from './malayalam.js';
import { romanizeOdia }       from './odia.js';
import { romanizeArabic }     from './arabic.js';
import { romanizeCyrillic }   from './cyrillic.js';
import { romanizeHan }        from './han.js';
import { romanizeKana }       from './kana.js';
import { romanizeHangul }     from './hangul.js';
import { romanizeLatin }      from './latin.js';

const HANDLERS = {
  Devanagari: romanizeDevanagari,
  Bengali:    romanizeBengali,
  Gurmukhi:   romanizeGurmukhi,
  Gujarati:   romanizeGujarati,
  Tamil:      romanizeTamil,
  Telugu:     romanizeTelugu,
  Kannada:    romanizeKannada,
  Malayalam:  romanizeMalayalam,
  Odia:       romanizeOdia,
  Arabic:     romanizeArabic,
  Cyrillic:   romanizeCyrillic,
  Han:        romanizeHan,
  Kana:       romanizeKana,
  Hangul:     romanizeHangul,
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

const DIACRITIC_MAP = {
  'ā':'a','ī':'i','ū':'u','ē':'e','ō':'o','ṛ':'r','ṝ':'r','ḷ':'l','ḹ':'l',
  'ṅ':'n','ñ':'n','ṭ':'t','ḍ':'d','ṇ':'n','ś':'s','ṣ':'s','ḥ':'h','ṁ':'n',
  'Ā':'A','Ī':'I','Ū':'U','Ē':'E','Ō':'O','Ṛ':'R','Ḷ':'L','Ṅ':'N','Ñ':'N',
  'Ṭ':'T','Ḍ':'D','Ṇ':'N','Ś':'S','Ṣ':'S','Ḥ':'H','Ṁ':'M',
  'ġ':'g','ẓ':'z','ż':'z','ẓ̌':'z','ṣ̌':'sh','ə':'a','ʻ':'','ʾ':'',
};
export function toAscii(text) {
  let out = '';
  for (const ch of text) out += DIACRITIC_MAP[ch] ?? ch;
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
