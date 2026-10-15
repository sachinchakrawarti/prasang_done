// db/scripts/show-poem.mjs
// Show every field of a poem and its current translations.
//
// Usage:
//   node scripts/show-poem.mjs --poem 93

import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '..', 'database', 'prasang.db');
const db = createClient({ url: `file:${DB_PATH}` });

const args = process.argv.slice(2);
const poemId = args.includes('--poem') ? Number(args[args.indexOf('--poem') + 1]) : null;

if (!poemId) {
  console.error('usage: node scripts/show-poem.mjs --poem <id>');
  process.exit(1);
}

const res = await db.execute({
  sql: `SELECT p.*,
          po.name AS poet_name,
          po.slug AS poet_slug,
          c.name  AS category_name
        FROM poems p
        LEFT JOIN poets po      ON po.id = p.poet_id
        LEFT JOIN categories c  ON c.id  = p.category_id
        WHERE p.id = ?`,
  args: [poemId],
});

const p = res.rows[0];
if (!p) {
  console.error(`poem #${poemId} not found`);
  process.exit(1);
}

console.log('\n══════════════════════════════════════════════════');
console.log(`  POEM #${p.id}`);
console.log('══════════════════════════════════════════════════\n');

console.log('title         :', p.title);
console.log('slug          :', p.slug);
console.log('language      :', p.language);
console.log('script        :', p.script);
console.log('status        :', p.status);
console.log('content_ver   :', p.content_version);
console.log('description   :', p.description ?? '(none)');
console.log('poet          :', p.poet_name ?? '(none)', p.poet_slug ? `(${p.poet_slug})` : '');
console.log('category      :', p.category_name ?? '(none)');
console.log('cover_image   :', p.cover_image ?? '(none)');
console.log('created_at    :', p.created_at ? new Date(p.created_at * 1000).toISOString() : '(none)');
console.log('updated_at    :', p.updated_at ? new Date(p.updated_at * 1000).toISOString() : '(none)');

console.log('\n── CONTENT ───────────────────────────────────────\n');
console.log(p.content);
console.log('\n──────────────────────────────────────────────────\n');

console.log('content length:', p.content?.length ?? 0, 'chars');
console.log('content lines :', p.content?.split(/\r?\n/).length ?? 0);

// Existing translations
console.log('\n── EXISTING TRANSLATIONS ─────────────────────────\n');

if (!p.translations) {
  console.log('(poems.translations is empty)');
} else {
  let map = {};
  try { map = JSON.parse(p.translations); } catch {}
  const keys = Object.keys(map);
  console.log(`poems.translations → ${keys.length} languages`);
  for (const k of keys) {
    const t = map[k] ?? '';
    console.log(`\n[${k}]  (${t.length} chars)`);
    console.log(t.split('\n').map((l) => '   ' + l).join('\n'));
  }
}

// ai_translations table
try {
  const ai = await db.execute({
    sql: 'SELECT target_language, status, model, LENGTH(translation) AS chars FROM ai_translations WHERE poem_id = ? ORDER BY target_language',
    args: [poemId],
  });
  if (ai.rows.length) {
    console.log('\n── ai_translations TABLE ─────────────────────────\n');
    console.table(ai.rows);
  }
} catch {}

console.log('');