#!/usr/bin/env node
/**
 * web/scripts/setup-lang.js
 * Creates src/lang/romanization + src/lang/transliteration + hooks.
 *
 * Run from web/:
 *   node scripts/setup-lang.js
 *   node scripts/setup-lang.js --force
 */

const fs   = require('fs');
const path = require('path');

const ROOT  = path.resolve(__dirname, '..');
const FORCE = process.argv.includes('--force');

function ensureDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
    console.log(`  \x1b[32m+\x1b[0m ${path.relative(ROOT, p)}/`);
  }
}

function write(relPath, content) {
  const full = path.join(ROOT, relPath);
  ensureDir(path.dirname(full));
  if (fs.existsSync(full) && !FORCE) {
    console.log(`  \x1b[33m·\x1b[0m ${relPath} (exists, skipped)`);
    return;
  }
  fs.writeFileSync(full, content.replace(/^\n/, ''), 'utf8');
  console.log(`  \x1b[32m✓\x1b[0m ${relPath}`);
}

const FILES = {

  /* ---------------------------------------------------------------- */
  /*  src/lang/romanization                                            */
  /* ---------------------------------------------------------------- */

  'src/lang/romanization/engines/devanagari.js': `
// Devanagari → ISO 15919 Roman
const VOWELS = {
  'अ':'a','आ':'ā','इ':'i','ई':'ī','उ':'u','ऊ':'ū','ऋ':'r̥','ए':'ē','ऐ':'ai','ओ':'ō','औ':'au',
};
const CONSONANTS = {
  'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'ṅ',
  'च':'c','छ':'ch','ज':'j','झ':'jh','ञ':'ñ',
  'ट':'ṭ','ठ':'ṭh','ड':'ḍ','ढ':'ḍh','ण':'ṇ',
  'त':'t','थ':'th','द':'d','ध':'dh','न':'n',
  'प':'p','फ':'ph','ब':'b','भ':'bh','म':'m',
  'य':'y','र':'r','ल':'l','व':'v',
  'श':'ś','ष':'ṣ','स':'s','ह':'h',
  'ळ':'ḷ','क़':'q','ख़':'k͟h','ग़':'ġ','ज़':'z','ड़':'ṛ','ढ़':'ṛh','फ़':'f',
};
const MATRAS = {
  'ा':'ā','ि':'i','ी':'ī','ु':'u','ू':'ū','ृ':'r̥','े':'ē','ै':'ai','ो':'ō','ौ':'au',
};
const DIGITS = { '०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9' };

const VIRAMA = '्', ANUSVARA = 'ं', CANDRABINDU = 'ँ', VISARGA = 'ः';

export function romanizeDevanagari(input) {
  const out = [];
  const chars = [...input];
  let i = 0;
  while (i < chars.length) {
    const c = chars[i];

    if (DIGITS[c] !== undefined) { out.push(DIGITS[c]); i++; continue; }

    if (CONSONANTS[c]) {
      let s = CONSONANTS[c];
      const next = chars[i + 1];
      if (next === VIRAMA) { out.push(s); i += 2; continue; }
      if (next && MATRAS[next] !== undefined) { out.push(s + MATRAS[next]); i += 2; continue; }
      out.push(s + 'a'); i++; continue;
    }

    if (VOWELS[c])         { out.push(VOWELS[c]); i++; continue; }
    if (c === ANUSVARA)    { out.push('ṁ'); i++; continue; }
    if (c === CANDRABINDU) { out.push('m̐'); i++; continue; }
    if (c === VISARGA)     { out.push('ḥ'); i++; continue; }
    if (c === VIRAMA)      { i++; continue; }

    out.push(c); i++;
  }
  return out.join('');
}
`,

  'src/lang/romanization/engines/arabic.js': `
const MAP = {
  'ا':'a','آ':'ā','أ':'a','إ':'i','ب':'b','پ':'p','ت':'t','ٹ':'ṭ','ث':'th','ج':'j','چ':'c',
  'ح':'ḥ','خ':'kh','د':'d','ڈ':'ḍ','ذ':'dh','ر':'r','ڑ':'ṛ','ز':'z','ژ':'zh','س':'s','ش':'sh',
  'ص':'ṣ','ض':'ḍ','ط':'ṭ','ظ':'ẓ','ع':'ʻ','غ':'gh','ف':'f','ق':'q','ک':'k','گ':'g','ل':'l',
  'م':'m','ن':'n','ں':'ṉ','و':'w','ہ':'h','ھ':'h','ء':'ʾ','ی':'y','ے':'e','ى':'ā',
  '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9',
  '\\u0650':'i','\\u064E':'a','\\u064F':'u','\\u0652':'','\\u0651':'',
};

export function romanizeArabic(input) {
  return [...input].map((c) => MAP[c] ?? c).join('');
}
`,

  'src/lang/romanization/engines/latin.js': `
export function romanizeLatin(input) { return input; }
`,

  'src/lang/romanization/engines/index.js': `
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
  const key = \`\${script}:\${text}\`;
  if (CACHE.has(key)) return CACHE.get(key);
  const out = romanize(text, script);
  CACHE.set(key, out);
  return out;
}
`,

  'src/lang/romanization/scriptStore.js': `
import { romanizeCached } from './engines/index.js';

let state = { mode: 'original', targetScript: null };
const listeners = new Set();
const emit = () => { for (const l of listeners) l(); };

export const scriptStore = {
  getState: () => state,
  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },

  setMode(mode) { if (state.mode === mode) return; state = { ...state, mode }; emit(); },
  setTargetScript(targetScript) {
    if (state.targetScript === targetScript) return;
    state = { ...state, targetScript }; emit();
  },
  reset() { state = { mode: 'original', targetScript: null }; emit(); },
  getRomanized: (text, script) => (text ? romanizeCached(text, script) : ''),
};
`,

  'src/lang/romanization/index.js': `
export { scriptStore } from './scriptStore.js';
export { romanize, romanizeCached, SUPPORTED_SCRIPTS } from './engines/index.js';
`,

  /* ---------------------------------------------------------------- */
  /*  src/lang/transliteration                                         */
  /* ---------------------------------------------------------------- */

  'src/lang/transliteration/providers/google.js': `
const LANG_FOR_SCRIPT = {
  Devanagari: 'hi',
  Arabic:     'ur',
  Bengali:    'bn',
  Tamil:      'ta',
  Telugu:     'te',
  Gurmukhi:   'pa',
  Gujarati:   'gu',
  Kannada:    'kn',
  Malayalam:  'ml',
  Odia:       'or',
  Latin:      'en',
};

export async function fetchTransliteration(text, _fromScript, toScript) {
  const lang = LANG_FOR_SCRIPT[toScript];
  if (!lang) return text;

  const url =
    'https://inputtools.google.com/request' +
    \`?text=\${encodeURIComponent(text)}\` +
    \`&itc=\${lang}-t-i0-und&num=1&app=test\`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(\`google inputtools \${res.status}\`);
  const data = await res.json();
  return data?.[1]?.[0]?.[1]?.[0] ?? text;
}
`,

  'src/lang/transliteration/translitStore.js': `
import { romanizeCached } from '../romanization/engines/index.js';
import { fetchTransliteration } from './providers/google.js';

const CACHE_MAX = 500;
const cache    = new Map();
const inflight = new Map();

const state = { loading: false };
const listeners = new Set();
const emit = () => { for (const l of listeners) l(); };

function setLoading(v) {
  if (state.loading === v) return;
  state.loading = v;
  emit();
}

function cacheSet(key, value) {
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
  cache.set(key, value);
}

export const translitStore = {
  getState: () => state,
  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },

  async transliterate(text, fromScript, toScript) {
    if (!text) return '';
    if (fromScript === toScript) return text;

    const key = \`\${fromScript}>\${toScript}:\${text}\`;
    if (cache.has(key))    return cache.get(key);
    if (inflight.has(key)) return inflight.get(key);

    setLoading(true);

    const promise = (async () => {
      const roman = romanizeCached(text, fromScript);
      const out   = await fetchTransliteration(roman, 'Latin', toScript);
      cacheSet(key, out);
      return out;
    })()
      .catch((err) => { console.warn('[translit]', err.message); return text; })
      .finally(() => {
        inflight.delete(key);
        if (inflight.size === 0) setLoading(false);
      });

    inflight.set(key, promise);
    return promise;
  },

  clearCache() { cache.clear(); inflight.clear(); },
};
`,

  'src/lang/transliteration/index.js': `
export { translitStore } from './translitStore.js';
`,

  /* ---------------------------------------------------------------- */
  /*  React hooks                                                      */
  /* ---------------------------------------------------------------- */

  'src/hooks/useScript.js': `
'use client';
import { useSyncExternalStore, useCallback } from 'react';
import { scriptStore } from '@/lang/romanization/scriptStore.js';
import { romanizeCached } from '@/lang/romanization/engines/index.js';

export function useScript() {
  const state = useSyncExternalStore(
    scriptStore.subscribe,
    scriptStore.getState,
    scriptStore.getState,
  );

  const getRomanized = useCallback((text, script) => romanizeCached(text, script), []);

  return {
    ...state,
    getRomanized,
    setMode:         scriptStore.setMode,
    setTargetScript: scriptStore.setTargetScript,
    reset:           scriptStore.reset,
  };
}
`,

  'src/hooks/useTransliteration.js': `
'use client';
import { useSyncExternalStore } from 'react';
import { translitStore } from '@/lang/transliteration/translitStore.js';

export function useTransliteration() {
  const state = useSyncExternalStore(
    translitStore.subscribe,
    translitStore.getState,
    translitStore.getState,
  );

  return {
    ...state,
    transliterate: translitStore.transliterate,
    clearCache:    translitStore.clearCache,
  };
}
`,

  'src/hooks/usePoemView.js': `
'use client';
import { useEffect, useState } from 'react';
import { useScript } from './useScript.js';
import { useTransliteration } from './useTransliteration.js';
import { romanizeCached } from '@/lang/romanization/engines/index.js';

export function usePoemView(poem) {
  const { mode, targetScript } = useScript();
  const { transliterate } = useTransliteration();
  const [text, setText] = useState(poem?.content ?? '');

  useEffect(() => {
    if (!poem) return;
    let cancelled = false;

    async function compute() {
      try {
        if (mode === 'original') {
          if (!cancelled) setText(poem.content);
          return;
        }
        if (mode === 'roman') {
          const out = romanizeCached(poem.content, poem.script);
          if (!cancelled) setText(out);
          return;
        }
        if (mode === 'transliterate') {
          const out = await transliterate(poem.content, poem.script, targetScript || poem.script);
          if (!cancelled) setText(out);
        }
      } catch {
        if (!cancelled) setText(poem.content);
      }
    }

    compute();
    return () => { cancelled = true; };
  }, [mode, targetScript, poem?.content, poem?.script, transliterate, poem]);

  return { text, mode };
}
`,

  /* ---------------------------------------------------------------- */
  /*  Barrel export                                                    */
  /* ---------------------------------------------------------------- */

  'src/lang/index.js': `
export * from './romanization/index.js';
export * from './transliteration/index.js';
`,
};

/* -------------------------------------------------------------------- */
/*  Run                                                                 */
/* -------------------------------------------------------------------- */

console.log(`\n\x1b[36mSetting up src/lang/ in ${ROOT}\x1b[0m\n`);

for (const [rel, content] of Object.entries(FILES)) write(rel, content);

// Make sure the jsconfig alias @/* -> src/* exists
const jsconfigPath = path.join(ROOT, 'jsconfig.json');
if (fs.existsSync(jsconfigPath)) {
  try {
    const cfg = JSON.parse(fs.readFileSync(jsconfigPath, 'utf8'));
    cfg.compilerOptions = cfg.compilerOptions || {};
    cfg.compilerOptions.paths = cfg.compilerOptions.paths || {};
    if (!cfg.compilerOptions.paths['@/*']) {
      cfg.compilerOptions.paths['@/*'] = ['./src/*'];
      fs.writeFileSync(jsconfigPath, JSON.stringify(cfg, null, 2));
      console.log(`  \x1b[32m✓\x1b[0m jsconfig.json (added @/* -> src/*)`);
    } else {
      console.log(`  \x1b[33m·\x1b[0m jsconfig.json (@/* already mapped)`);
    }
  } catch (e) {
    console.log(`  \x1b[31m!\x1b[0m jsconfig.json could not be parsed: ${e.message}`);
  }
} else {
  console.log(`  \x1b[33m·\x1b[0m jsconfig.json not found (create one with @/* -> src/* if needed)`);
}

console.log(`\n\x1b[32mDone.\x1b[0m Structure:`);
console.log(`
  web/src/lang/
  ├── index.js
  ├── romanization/
  │   ├── index.js
  │   ├── scriptStore.js
  │   └── engines/
  │       ├── index.js
  │       ├── devanagari.js
  │       ├── arabic.js
  │       └── latin.js
  └── transliteration/
      ├── index.js
      ├── translitStore.js
      └── providers/
          └── google.js

  web/src/hooks/
  ├── useScript.js
  ├── useTransliteration.js
  └── usePoemView.js
`);

console.log(`\x1b[36mNext:\x1b[0m use it in a component:\n
  import { usePoemView } from '@/hooks/usePoemView';
  import { useScript }   from '@/hooks/useScript';
  import { SUPPORTED_SCRIPTS } from '@/lang/romanization';

  const { text } = usePoemView(poem);
  const { mode, setMode, targetScript, setTargetScript } = useScript();

  <button onClick={() => setMode('original')}>Original</button>
  <button onClick={() => setMode('roman')}>Roman</button>
  <button onClick={() => setMode('transliterate')}>Transliterate</button>
  {mode === 'transliterate' && (
    <select value={targetScript ?? ''} onChange={(e) => setTargetScript(e.target.value)}>
      {SUPPORTED_SCRIPTS.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  )}
  <p>{text}</p>
`);