// db/scripts/add-translations-column.mjs
// Adds poems.translations TEXT column. Idempotent.

import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '..', 'database', 'prasang.db');
const db = createClient({ url: `file:${DB_PATH}` });

console.log('DB:', DB_PATH);

// Check if column already exists
const before = await db.execute('PRAGMA table_info(poems)');
const has = before.rows.some((c) => c.name === 'translations');

if (has) {
  console.log('✓ poems.translations already exists — nothing to do.');
} else {
  await db.execute('ALTER TABLE poems ADD COLUMN translations TEXT');
  console.log('✓ added poems.translations');
}

// Show the relevant columns
const after = await db.execute('PRAGMA table_info(poems)');
console.table(
  after.rows
    .filter((c) => ['id', 'title', 'language', 'script', 'content_version', 'translations'].includes(c.name))
    .map((c) => ({ name: c.name, type: c.type, notnull: c.notnull })),
);