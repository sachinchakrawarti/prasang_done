// db/scripts/import-translations.mjs
// Reads a JSON file (map of lang → text) and stores into poems.translations.
//
// Usage:
//   node scripts/import-translations.mjs --poem 1 --file translations/poem-1.json
//   node scripts/import-translations.mjs --poem 1 --file translations/poem-1.json --merge

import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '..', 'database', 'prasang.db');
const db = createClient({ url: `file:${DB_PATH}` });

const args = process.argv.slice(2);
const poemId  = args.includes('--poem')  ? Number(args[args.indexOf('--poem') + 1]) : null;
const fileRel = args.includes('--file')  ? args[args.indexOf('--file') + 1] : null;
const MERGE   = args.includes('--merge');
const FORCE   = args.includes('--force');

if (!poemId || !fileRel) {
  console.error('usage: node scripts/import-translations.mjs --poem <id> --file <path.json> [--merge] [--force]');
  process.exit(1);
}

const fileAbs = path.isAbsolute(fileRel)
  ? fileRel
  : path.resolve(__dirname, '..', fileRel);

if (!fs.existsSync(fileAbs)) {
  console.error('JSON file not found:', fileAbs);
  process.exit(1);
}

const raw = fs.readFileSync(fileAbs, 'utf8');
let incoming;
try {
  incoming = JSON.parse(raw);
} catch (e) {
  console.error('invalid JSON:', e.message);
  process.exit(1);
}

if (typeof incoming !== 'object' || Array.isArray(incoming)) {
  console.error('JSON must be an object: { "ur": "...", "ar": "...", ... }');
  process.exit(1);
}

const langKeys = Object.keys(incoming);
console.log(`importing ${langKeys.length} translations for poem #${poemId}`);
console.log('languages:', langKeys.join(', '));
console.log('mode   :', MERGE ? 'merge' : 'replace');
console.log('');

// Verify poem exists
const poemRes = await db.execute({
  sql: 'SELECT id, title, language, translations FROM poems WHERE id = ?',
  args: [poemId],
});
const poem = poemRes.rows[0];
if (!poem) {
  console.error(`poem #${poemId} not found`);
  process.exit(1);
}

console.log(`poem: #${poem.id} [${poem.language}] "${poem.title}"`);

// Build final map
let final = {};
if (MERGE && poem.translations) {
  try { final = JSON.parse(poem.translations) ?? {}; } catch {}
}

const before = Object.keys(final).length;
let added = 0, updated = 0;

for (const [lang, text] of Object.entries(incoming)) {
  if (typeof text !== 'string') {
    console.log(`   ${lang}  skipped (not a string)`);
    continue;
  }
  const had = Boolean(final[lang]);
  final[lang] = text;
  if (had) updated++; else added++;
  console.log(`   ${lang}  ${had ? 'updated' : 'added'}  (${text.length} chars)`);
}

const json = JSON.stringify(final);
await db.execute({
  sql: 'UPDATE poems SET translations = ?, updated_at = ? WHERE id = ?',
  args: [json, Math.floor(Date.now() / 1000), poemId],
});

console.log('');
console.log(`stored ${Object.keys(final).length} translations (was ${before})`);
console.log(`added=${added}  updated=${updated}`);
console.log(`json size: ${json.length} bytes`);
console.log('✓ saved');