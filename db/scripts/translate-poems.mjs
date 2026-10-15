// db/scripts/translate-poems.mjs
// Uses the EXISTING ai_translations table.
// Columns: poem_id, source_language, target_language, translation,
//          model, status, attempts, poem_version, error,
//          generated_at, approved_at, created_at, updated_at
//
// Usage:
//   node scripts/translate-poems.mjs                 # all poems, all langs, skip done
//   node scripts/translate-poems.mjs --force         # retranslate
//   node scripts/translate-poems.mjs --lang ur,hi    # specific targets
//   node scripts/translate-poems.mjs --poem 93       # specific poem

import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '..', 'database', 'prasang.db');
const db = createClient({ url: `file:${DB_PATH}` });

const args = process.argv.slice(2);
const FORCE      = args.includes('--force');
const onlyLangs  = args.includes('--lang')
  ? args[args.indexOf('--lang') + 1].split(',').map((s) => s.trim())
  : null;
const onlyPoem   = args.includes('--poem')
  ? Number(args[args.indexOf('--poem') + 1])
  : null;

const TARGETS = [
  'hi', 'ur', 'ar', 'fa', 'ps',
  'bn', 'pa', 'gu', 'ta', 'te', 'kn', 'ml', 'or',
  'en', 'fr', 'de', 'es', 'tr', 'ru',
  'zh', 'ja', 'ko',
];

const now = () => Math.floor(Date.now() / 1000);

async function translateText(text, sourceLang, targetLang) {
  if (!text || sourceLang === targetLang) return null;

  // Google free
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const translated = (data?.[0] ?? []).map((c) => c?.[0] ?? '').join('');
      if (translated) return { text: translated, provider: 'google' };
    }
  } catch {}

  // MyMemory fallback
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const t = data?.responseData?.translatedText;
      if (t) return { text: t, provider: 'mymemory' };
    }
  } catch {}

  return null;
}

const where = onlyPoem ? `WHERE id = ${Number(onlyPoem)}` : '';
const poemsRes = await db.execute(
  `SELECT id, title, content, language, script, content_version FROM poems ${where} ORDER BY id`
);
const poems = poemsRes.rows;

console.log(`Loaded ${poems.length} poems.`);
console.log(`Targets: ${(onlyLangs ?? TARGETS).join(', ')}\n`);

const targets = onlyLangs ?? TARGETS;
let inserted = 0, updated = 0, skipped = 0, failed = 0;

for (const poem of poems) {
  console.log(`── poem #${poem.id} [${poem.language}/${poem.script}] "${(poem.title || '').slice(0, 40)}"`);

  for (const targetLang of targets) {
    if (targetLang === poem.language) { skipped++; continue; }

    // Check existing
    const existing = await db.execute({
      sql: `SELECT id, status, poem_version, translation
            FROM ai_translations
            WHERE poem_id = ? AND target_language = ? LIMIT 1`,
      args: [poem.id, targetLang],
    });
    const row = existing.rows[0];

    if (row && !FORCE
        && row.status === 'done'
        && row.poem_version === poem.content_version
        && row.translation) {
      skipped++;
      console.log(`   ${targetLang}  cached (v${poem.content_version}, ${row.translation.length} chars)`);
      continue;
    }

    process.stdout.write(`   ${targetLang}  … `);
    const t0 = now();
    const out = await translateText(poem.content, poem.language, targetLang);
    const t1 = now();

    if (!out) {
      failed++;
      console.log('FAILED');

      if (row) {
        await db.execute({
          sql: `UPDATE ai_translations SET
                  status = 'failed',
                  attempts = attempts + 1,
                  error = ?,
                  updated_at = ?
                WHERE id = ?`,
          args: ['translate failed', t1, row.id],
        });
      } else {
        await db.execute({
          sql: `INSERT INTO ai_translations
                  (poem_id, source_language, target_language, translation,
                   model, status, attempts, poem_version, error,
                   generated_at, approved_at, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, 'failed', 1, ?, ?, NULL, NULL, ?, ?)`,
          args: [
            poem.id, poem.language, targetLang, null,
            'google-translate-free', poem.content_version, 'translate failed',
            t1, t1,
          ],
        });
      }
      continue;
    }

    console.log(`ok (${t1 - t0}s, ${out.provider}, ${out.text.length} chars)`);

    if (row) {
      await db.execute({
        sql: `UPDATE ai_translations SET
                source_language  = ?,
                translation      = ?,
                model            = ?,
                status           = 'done',
                attempts         = attempts + 1,
                poem_version     = ?,
                error            = NULL,
                generated_at     = ?,
                updated_at       = ?
              WHERE id = ?`,
        args: [
          poem.language,
          out.text,
          out.provider,
          poem.content_version,
          t1, t1,
          row.id,
        ],
      });
      updated++;
    } else {
      await db.execute({
        sql: `INSERT INTO ai_translations
                (poem_id, source_language, target_language, translation,
                 model, status, attempts, poem_version, error,
                 generated_at, approved_at, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, 'done', 1, ?, NULL, ?, NULL, ?, ?)`,
        args: [
          poem.id,
          poem.language,
          targetLang,
          out.text,
          out.provider,
          poem.content_version,
          t1, t1, t1,
        ],
      });
      inserted++;
    }

    await new Promise((r) => setTimeout(r, 200));
  }
  console.log();
}

console.log(`\nDone.  inserted=${inserted}  updated=${updated}  skipped=${skipped}  failed=${failed}`);