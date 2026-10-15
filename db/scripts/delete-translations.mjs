// db/scripts/delete-translations.mjs
// Deletes AI-generated translations.
//
// What it clears:
//   - poems.translations  → set to NULL for every row
//   - ai_translations     → DROP all rows (table kept)
//
// Usage:
//   node scripts/delete-translations.mjs             # dry run — shows what would change
//   node scripts/delete-translations.mjs --confirm   # actually deletes
//   node scripts/delete-translations.mjs --confirm --poem 93   # only poem 93

import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '..', 'database', 'prasang.db');
const db = createClient({ url: `file:${DB_PATH}` });

const args = process.argv.slice(2);
const CONFIRM = args.includes('--confirm');
const poemId  = args.includes('--poem') ? Number(args[args.indexOf('--poem') + 1]) : null;

console.log('DB:', DB_PATH);
console.log('mode:', CONFIRM ? 'DELETE' : 'DRY RUN (add --confirm to actually delete)');
if (poemId) console.log('scope: poem #' + poemId);
console.log('');

/* ─────── 1. poems.translations ─────── */

const wherePoem = poemId ? `WHERE id = ${poemId}` : '';
const before = await db.execute(
  `SELECT COUNT(*) AS n FROM poems ${poemId ? wherePoem + ' AND' : 'WHERE'} translations IS NOT NULL`
);
console.log(`poems with translations: ${before.rows[0].n}`);

/* ─────── 2. ai_translations ─────── */

let aiCount = 0;
try {
  const whereAi = poemId ? `WHERE poem_id = ${poemId}` : '';
  const r = await db.execute(`SELECT COUNT(*) AS n FROM ai_translations ${whereAi}`);
  aiCount = r.rows[0].n;
  console.log(`ai_translations rows:    ${aiCount}`);
} catch {
  console.log('ai_translations:         (table missing — nothing to do)');
}

/* ─────── 3. Execute (only if --confirm) ─────── */

if (!CONFIRM) {
  console.log('\nDry run only. Re-run with --confirm to apply.');
  process.exit(0);
}

console.log('\nDeleting…');

/* 3a. Clear poems.translations */
const updSql = poemId
  ? 'UPDATE poems SET translations = NULL, updated_at = ? WHERE id = ?'
  : 'UPDATE poems SET translations = NULL, updated_at = ? WHERE translations IS NOT NULL';
const updArgs = poemId ? [Math.floor(Date.now() / 1000), poemId] : [Math.floor(Date.now() / 1000)];

const r1 = await db.execute({ sql: updSql, args: updArgs });
console.log(`  poems.translations cleared → ${r1.rowsAffected} rows`);

/* 3b. Empty ai_translations */
try {
  const delSql = poemId
    ? 'DELETE FROM ai_translations WHERE poem_id = ?'
    : 'DELETE FROM ai_translations';
  const r2 = await db.execute({
    sql: delSql,
    args: poemId ? [poemId] : [],
  });
  console.log(`  ai_translations rows deleted → ${r2.rowsAffected}`);
} catch (e) {
  console.log('  ai_translations: skipped —', e.message);
}

/* ─────── 4. Verify ─────── */

console.log('\nVerifying…');
const after = await db.execute(
  `SELECT COUNT(*) AS n FROM poems ${poemId ? 'WHERE id = ' + poemId + ' AND' : 'WHERE'} translations IS NOT NULL`
);
console.log(`poems with translations: ${after.rows[0].n}  (was ${before.rows[0].n})`);

try {
  const whereAi = poemId ? `WHERE poem_id = ${poemId}` : '';
  const r = await db.execute(`SELECT COUNT(*) AS n FROM ai_translations ${whereAi}`);
  console.log(`ai_translations rows:    ${r.rows[0].n}  (was ${aiCount})`);
} catch {}

console.log('\n✓ done.');