// db/scripts/translate-one.mjs
// Translates ONE poem into all target languages and stores them
// as a JSON object in poems.translations.
//
// Usage:
//   node scripts/translate-one.mjs --poem 93
//   node scripts/translate-one.mjs --poem 93 --force

import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '..', 'database', 'prasang.db');
const db = createClient({ url: `file:${DB_PATH}` });

const args = process.argv.slice(2);
const poemId = args.includes('--poem') ? Number(args[args.indexOf('--poem') + 1]) : null;
const FORCE  = args.includes('--force');

if (!poemId) {
  console.error('usage: node scripts/translate-one.mjs --poem <id> [--force]');
  process.exit(1);
}

const TARGETS = [
  'hi', 'ur', 'ar', 'fa', 'ps',
  'bn', 'pa', 'gu', 'ta', 'te', 'kn', 'ml', 'or',
  'en', 'fr', 'de', 'es', 'tr', 'ru',
  'zh', 'ja', 'ko',
];

const now = () => Math.floor(Date.now() / 1000);

function decodeEntities(s) {
  if (!s) return s;
  return s
    .replace(/&#10;/g, '\n')
    .replace(/&#13;/g, '\r')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

async function tryGoogle(text, sl, tl) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const chunks = data?.[0];
    if (!Array.isArray(chunks)) return null;
    const joined = chunks.map((c) => c?.[0] ?? '').join('');
    return joined ? { text: joined, provider: 'google' } : null;
  } catch { return null; }
}

async function tryMyMemory(text, sl, tl) {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sl}|${tl}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const t = data?.responseData?.translatedText;
    return t ? { text: decodeEntities(t), provider: 'mymemory' } : null;
  } catch { return null; }
}

async function translate(text, sl, tl) {
  return (await tryGoogle(text, sl, tl)) || (await tryMyMemory(text, sl, tl));
}

/* ─── run ─── */

const poemRes = await db.execute({
  sql: 'SELECT id, title, content, language, script, translations FROM poems WHERE id = ?',
  args: [poemId],
});
const poem = poemRes.rows[0];
if (!poem) {
  console.error(`poem #${poemId} not found`);
  process.exit(1);
}

console.log(`poem #${poem.id} [${poem.language}/${poem.script}] "${poem.title}"`);
console.log(`content length: ${poem.content.length}`);
console.log(`targets: ${TARGETS.join(', ')}\n`);

// Load existing JSON if any
let map = {};
if (poem.translations) {
  try { map = JSON.parse(poem.translations) ?? {}; }
  catch { map = {}; }
}
const had = Object.keys(map).length;
if (had) console.log(`existing translations: ${had} (${Object.keys(map).join(', ')})\n`);

let added = 0, skipped = 0, failed = 0;

for (const tl of TARGETS) {
  if (tl === poem.language) { skipped++; continue; }

  if (map[tl] && !FORCE) {
    skipped++;
    console.log(`   ${tl}  cached (${map[tl].length} chars)`);
    continue;
  }

  process.stdout.write(`   ${tl}  … `);
  const t0 = Date.now();
  const out = await translate(poem.content, poem.language, tl);
  const ms = Date.now() - t0;

  if (!out) {
    failed++;
    console.log('FAILED');
    continue;
  }

  console.log(`ok (${out.provider}, ${out.text.length} chars, ${ms}ms)`);
  map[tl] = out.text;
  added++;

  await new Promise((r) => setTimeout(r, 250));
}

// Save
const json = JSON.stringify(map);
await db.execute({
  sql: 'UPDATE poems SET translations = ?, updated_at = ? WHERE id = ?',
  args: [json, now(), poem.id],
});

console.log(`\nsaved ${Object.keys(map).length} translations (${json.length} bytes)`);
console.log(`added=${added}  skipped=${skipped}  failed=${failed}`);