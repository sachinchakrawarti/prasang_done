// D:\Sachin Chakrawarti\Learn\done\prasang_done\server.js
// Minimal HTTP API. Owns the DB. Web calls this over HTTP.

import express from 'express';
import cors from 'cors';
import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Absolute path — works no matter what CWD you launch from
const DB_PATH = path.resolve(__dirname, 'db', 'database', 'prasang.db');

const db = createClient({ url: `file:${DB_PATH}` });

const app = express();
app.use(cors());           // allow http://localhost:3000 to call this
app.use(express.json());

const PORT = process.env.PORT || 4000;

// -------- Routes (adjust SQL to your real schema) --------
app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: DB_PATH });
});

app.get('/api/poems', async (req, res) => {
  try {
    const limit  = Math.min(Number(req.query.limit) || 50, 200);
    const result = await db.execute({
      sql: 'SELECT * FROM poems LIMIT ?',
      args: [limit],
    });
    res.json({ count: result.rows.length, rows: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/poems/:id', async (req, res) => {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM poems WHERE id = ?',
      args: [req.params.id],
    });
    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: 'not found' });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// -------- Start --------
app.listen(PORT, () => {
  console.log(`\x1b[32m[SERVER]\x1b[0m http://localhost:${PORT}`);
  console.log(`\x1b[32m[SERVER]\x1b[0m db: ${DB_PATH}`);
});