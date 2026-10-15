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
  'Ä':'a','Ä«':'i','Å«':'u','Ä“':'e','Å':'o','á¹›':'r','á¹':'r','á¸·':'l','á¸¹':'l',
  'á¹…':'n','Ã±':'n','á¹­':'t','á¸':'d','á¹‡':'n','Å›':'s','á¹£':'s','á¸¥':'h','á¹':'n',
  'Ä€':'A','Äª':'I','Åª':'U','Ä’':'E','ÅŒ':'O','á¹š':'R','á¸¶':'L','á¹„':'N','Ã‘':'N',
  'á¹¬':'T','á¸Œ':'D','á¹†':'N','Åš':'S','á¹¢':'S','á¸¤':'H','á¹€':'M',
  'Ä¡':'g','áº“':'z','Å¼':'z','áº“ÌŒ':'z','á¹£ÌŒ':'sh','É™':'a','Ê»':'','Ê¾':'',
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