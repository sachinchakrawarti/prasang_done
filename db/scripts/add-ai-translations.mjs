// db/scripts/add-ai-translations.mjs
import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '..', 'database', 'prasang.db');
const db = createClient({ url: `file:${DB_PATH}` });

console.log('DB:', DB_PATH);

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS ai_translations (
    id                     INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    poem_id                INTEGER NOT NULL,
    source_lang            TEXT    NOT NULL,
    source_script          TEXT,
    target_lang            TEXT    NOT NULL,
    target_script          TEXT,
    title                  TEXT,
    content                TEXT    NOT NULL,
    provider               TEXT    NOT NULL DEFAULT 'google',
    model                  TEXT,
    source_content_version INTEGER NOT NULL DEFAULT 1,
    status                 TEXT    NOT NULL DEFAULT 'ai',
    created_at             INTEGER NOT NULL,
    updated_at             INTEGER NOT NULL,
    FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS ait_poem_id_idx ON ai_translations (poem_id)`,
  `CREATE INDEX IF NOT EXISTS ait_target_lang_idx ON ai_translations (target_lang)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS ait_poem_target_unique ON ai_translations (poem_id, target_lang)`,
];

for (const sql of STATEMENTS) {
  try {
    await db.execute(sql);
    console.log('  ✓', sql.slice(0, 70).replace(/\s+/g, ' ') + '…');
  } catch (e) {
    console.error('  ✗', e.message);
  }
}

console.log('\nVerifying…');
const t = await db.execute(
  "SELECT name FROM sqlite_master WHERE type='table' AND name='ai_translations'"
);
if (t.rows.length) {
  const cols = await db.execute('PRAGMA table_info(ai_translations)');
  console.table(cols.rows.map((r) => ({ name: r.name, type: r.type, notnull: r.notnull })));
  console.log('✅ ai_translations ready.');
} else {
  console.error('❌ table not created.');
}