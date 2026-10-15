import { Router } from 'express';
import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '..', '..', 'db', 'database', 'prasang.db');
const db = createClient({ url: `file:${DB_PATH}` });

const router = Router();
const now = () => Math.floor(Date.now() / 1000);

async function loadPoem(id) {
  const r = await db.execute({
    sql: 'SELECT id, language, translations FROM poems WHERE id = ? LIMIT 1',
    args: [id],
  });
  return r.rows[0] ?? null;
}

function parseMap(raw) {
  if (!raw) return {};
  try { return JSON.parse(raw) ?? {}; } catch { return {}; }
}

/* ── GET all translations for a poem ── */
router.get('/:id/translations', async (req, res) => {
  try {
    const poemId = Number(req.params.id);
    if (!poemId) return res.status(400).json({ success: false, error: 'invalid id' });

    const row = await loadPoem(poemId);
    if (!row) return res.status(404).json({ success: false, error: 'poem not found' });

    const map = parseMap(row.translations);
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

/* ── GET one language ── */
router.get('/:id/translations/:lang', async (req, res) => {
  try {
    const poemId = Number(req.params.id);
    const lang   = String(req.params.lang).toLowerCase();

    const row = await loadPoem(poemId);
    if (!row) return res.status(404).json({ success: false, error: 'poem not found' });

    const map = parseMap(row.translations);
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

/* ── PUT — replace the whole translations object ── */
router.put('/:id/translations', async (req, res) => {
  try {
    const poemId = Number(req.params.id);
    const incoming = req.body?.translations ?? req.body;

    if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
      return res.status(400).json({ success: false, error: 'body must be { translations: { lang: text } }' });
    }

    // sanitize: only strings, drop empties
    const clean = {};
    for (const [k, v] of Object.entries(incoming)) {
      if (typeof v === 'string' && v.trim()) clean[k] = v;
    }

    const row = await loadPoem(poemId);
    if (!row) return res.status(404).json({ success: false, error: 'poem not found' });

    await db.execute({
      sql: 'UPDATE poems SET translations = ?, updated_at = ? WHERE id = ?',
      args: [JSON.stringify(clean), now(), poemId],
    });

    res.json({
      success: true,
      poemId,
      languages: Object.keys(clean),
      translations: clean,
    });
  } catch (err) {
    console.error('[translations] PUT', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ── PATCH — merge one language ── */
router.patch('/:id/translations/:lang', async (req, res) => {
  try {
    const poemId = Number(req.params.id);
    const lang   = String(req.params.lang).toLowerCase();
    const text   = req.body?.content ?? req.body?.text;

    if (typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'body must be { content: string }' });
    }

    const row = await loadPoem(poemId);
    if (!row) return res.status(404).json({ success: false, error: 'poem not found' });

    const map = parseMap(row.translations);
    if (text.trim()) map[lang] = text;
    else delete map[lang];

    await db.execute({
      sql: 'UPDATE poems SET translations = ?, updated_at = ? WHERE id = ?',
      args: [JSON.stringify(map), now(), poemId],
    });

    res.json({ success: true, poemId, targetLanguage: lang, content: map[lang] ?? null });
  } catch (err) {
    console.error('[translations] PATCH', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ── DELETE one language ── */
router.delete('/:id/translations/:lang', async (req, res) => {
  try {
    const poemId = Number(req.params.id);
    const lang   = String(req.params.lang).toLowerCase();

    const row = await loadPoem(poemId);
    if (!row) return res.status(404).json({ success: false, error: 'poem not found' });

    const map = parseMap(row.translations);
    delete map[lang];

    await db.execute({
      sql: 'UPDATE poems SET translations = ?, updated_at = ? WHERE id = ?',
      args: [JSON.stringify(map), now(), poemId],
    });

    res.json({ success: true, poemId, removed: lang, languages: Object.keys(map) });
  } catch (err) {
    console.error('[translations] DELETE', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
