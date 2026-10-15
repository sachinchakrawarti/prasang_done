// server/routes/translations.routes.js
import { Router } from 'express';
import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '..', '..', 'db', 'database', 'prasang.db');
const db = createClient({ url: `file:${DB_PATH}` });

const router = Router();

/* GET /api/poems/:id/translations   →  { success, translations: { ur, fr, ... } } */
router.get('/:id/translations', async (req, res) => {
  try {
    const poemId = Number(req.params.id);
    if (!poemId) return res.status(400).json({ success: false, error: 'invalid id' });

    const r = await db.execute({
      sql: 'SELECT id, language, translations FROM poems WHERE id = ? LIMIT 1',
      args: [poemId],
    });
    const row = r.rows[0];
    if (!row) return res.status(404).json({ success: false, error: 'poem not found' });

    let map = {};
    if (row.translations) {
      try { map = JSON.parse(row.translations) ?? {}; } catch {}
    }

    res.json({
      success: true,
      poemId: row.id,
      sourceLanguage: row.language,
      languages: Object.keys(map),
      translations: map,
    });
  } catch (err) {
    console.error('[translations]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* GET /api/poems/:id/translations/:lang  →  { success, content } */
router.get('/:id/translations/:lang', async (req, res) => {
  try {
    const poemId = Number(req.params.id);
    const lang   = String(req.params.lang).toLowerCase();

    const r = await db.execute({
      sql: 'SELECT id, language, translations FROM poems WHERE id = ? LIMIT 1',
      args: [poemId],
    });
    const row = r.rows[0];
    if (!row) return res.status(404).json({ success: false, error: 'poem not found' });

    let map = {};
    if (row.translations) {
      try { map = JSON.parse(row.translations) ?? {}; } catch {}
    }

    const text = map[lang];
    if (!text) return res.status(404).json({ success: false, error: `no translation for ${lang}` });

    res.json({
      success: true,
      poemId: row.id,
      sourceLanguage: row.language,
      targetLanguage: lang,
      content: text,
    });
  } catch (err) {
    console.error('[translations]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;