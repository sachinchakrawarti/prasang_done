// db/scripts/backup-db.mjs
// Copies prasang.db to a timestamped backup file.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR  = path.resolve(__dirname, '..', 'database');
const SRC     = path.join(DB_DIR, 'prasang.db');

if (!fs.existsSync(SRC)) {
  console.error('DB not found:', SRC);
  process.exit(1);
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const DST   = path.join(DB_DIR, `prasang.backup-${stamp}.db`);

fs.copyFileSync(SRC, DST);

const srcSize = fs.statSync(SRC).size;
const dstSize = fs.statSync(DST).size;

console.log('source:', SRC, `(${srcSize} bytes)`);
console.log('backup:', DST, `(${dstSize} bytes)`);
console.log(srcSize === dstSize ? '✓ backup verified (size matches)' : '⚠ size mismatch — check the file');