// _dbcheck.mjs — throwaway. Delete after use.
import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = createClient({ url: `file:${path.resolve(__dirname, 'db/database/prasang.db')}` });

console.log('--- tables ---');
const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
console.log(tables.rows.map(r => r.name).join('\n'));

console.log('\n--- poems columns ---');
const cols = await db.execute('PRAGMA table_info(poems)');
console.table(cols.rows.map(r => ({ name: r.name, type: r.type, notnull: r.notnull })));

console.log('\n--- sample row from poems ---');
const one = await db.execute('SELECT * FROM poems LIMIT 1');
console.log(one.rows[0] ?? '(empty table)');