// web/scripts/make-admin-translations.mjs
// Writes:
//   server/routes/translations.routes.js       (adds PUT/PATCH/DELETE)
//   web/src/services/poemService.js            (adds admin CRUD)
//   web/src/components/admin/TranslationsGrid.jsx
//   web/src/app/(main)/(admin)/admin-dashboard/translations/page.jsx
//   web/src/app/(main)/(admin)/admin-dashboard/translations/new/page.jsx
//   web/src/app/(main)/(admin)/admin-dashboard/translations/[id]/edit/page.jsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB    = path.resolve(__dirname, '..');
const ROOT   = path.resolve(WEB, '..');
const SERVER = path.join(ROOT, 'server');
const SRC    = path.join(WEB, 'src');
const ADMIN  = path.join(SRC, 'app', '(main)', '(admin)', 'admin-dashboard', 'translations');

const FILES = {

/* ══════════════════════════════════════════════════════════════════
 *  1. server/routes/translations.routes.js
 *     GET + PUT + PATCH + DELETE for /api/poems/:id/translations
 * ══════════════════════════════════════════════════════════════════ */
[path.join(SERVER, 'routes', 'translations.routes.js')]: `
import { Router } from 'express';
import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '..', '..', 'db', 'database', 'prasang.db');
const db = createClient({ url: \`file:\${DB_PATH}\` });

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
    if (!text) return res.status(404).json({ success: false, error: \`no translation for \${lang}\` });

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
`.replace(/^\n/, ''),

/* ══════════════════════════════════════════════════════════════════
 *  2. web/src/services/poemService.js — add admin CRUD
 *     Appended to a NEW file to avoid clobbering; we'll write a
 *     separate file for admin-specific helpers.
 * ══════════════════════════════════════════════════════════════════ */
[path.join(SRC, 'services', 'translationService.js')]: `
// src/services/translationService.js
// Admin CRUD for poems.translations. Reads use poemService.fetchPoemTranslations.

import { fetchPoemTranslations } from './poemService.js';

async function apiFetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch {}
  if (!response.ok) {
    const msg = data?.error || data?.message || \`HTTP \${response.status}\`;
    throw new Error(msg);
  }
  return data;
}

/** Replace the whole translations map. */
export async function saveAllTranslations(poemId, translations) {
  if (!poemId) throw new Error('poemId required');
  return apiFetchJson(\`/api/poems/\${poemId}/translations\`, {
    method: 'PUT',
    body: JSON.stringify({ translations }),
  });
}

/** Save one language. */
export async function saveTranslation(poemId, lang, content) {
  if (!poemId || !lang) throw new Error('poemId and lang required');
  return apiFetchJson(\`/api/poems/\${poemId}/translations/\${encodeURIComponent(lang)}\`, {
    method: 'PATCH',
    body: JSON.stringify({ content }),
  });
}

/** Remove one language. */
export async function deleteTranslation(poemId, lang) {
  if (!poemId || !lang) throw new Error('poemId and lang required');
  return apiFetchJson(\`/api/poems/\${poemId}/translations/\${encodeURIComponent(lang)}\`, {
    method: 'DELETE',
  });
}

/** Re-export the reader function for convenience. */
export { fetchPoemTranslations };
`.replace(/^\n/, ''),

/* ══════════════════════════════════════════════════════════════════
 *  3. web/src/lib/translationLanguages.js
 * ══════════════════════════════════════════════════════════════════ */
[path.join(SRC, 'lib', 'translationLanguages.js')]: `
export const TRANSLATION_LANGUAGES = [
  { code: 'hi', name: 'Hindi',     native: 'हिन्दी',     rtl: false },
  { code: 'ur', name: 'Urdu',      native: 'اردو',        rtl: true  },
  { code: 'ar', name: 'Arabic',    native: 'العربية',    rtl: true  },
  { code: 'fa', name: 'Persian',   native: 'فارسی',       rtl: true  },
  { code: 'ps', name: 'Pashto',    native: 'پښتو',       rtl: true  },
  { code: 'bn', name: 'Bengali',   native: 'বাংলা',       rtl: false },
  { code: 'pa', name: 'Punjabi',   native: 'ਪੰਜਾਬੀ',      rtl: false },
  { code: 'gu', name: 'Gujarati',  native: 'ગુજરાતી',     rtl: false },
  { code: 'ta', name: 'Tamil',     native: 'தமிழ்',       rtl: false },
  { code: 'te', name: 'Telugu',    native: 'తెలుగు',      rtl: false },
  { code: 'kn', name: 'Kannada',   native: 'ಕನ್ನಡ',       rtl: false },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം',      rtl: false },
  { code: 'or', name: 'Odia',      native: 'ଓଡ଼ିଆ',       rtl: false },
  { code: 'en', name: 'English',   native: 'English',    rtl: false },
  { code: 'fr', name: 'French',    native: 'Français',   rtl: false },
  { code: 'de', name: 'German',    native: 'Deutsch',    rtl: false },
  { code: 'es', name: 'Spanish',   native: 'Español',    rtl: false },
  { code: 'tr', name: 'Turkish',   native: 'Türkçe',     rtl: false },
  { code: 'ru', name: 'Russian',   native: 'Русский',    rtl: false },
  { code: 'zh', name: 'Chinese',   native: '中文',       rtl: false },
  { code: 'ja', name: 'Japanese',  native: '日本語',      rtl: false },
  { code: 'ko', name: 'Korean',    native: '한국어',      rtl: false },
];

export const LANG_MAP = Object.fromEntries(
  TRANSLATION_LANGUAGES.map((l) => [l.code, l]),
);
`.replace(/^\n/, ''),

/* ══════════════════════════════════════════════════════════════════
 *  4. web/src/components/admin/TranslationsGrid.jsx
 * ══════════════════════════════════════════════════════════════════ */
[path.join(SRC, 'components', 'admin', 'TranslationsGrid.jsx')]: `
"use client";

import { useState } from "react";
import { TRANSLATION_LANGUAGES } from "@/lib/translationLanguages";

export default function TranslationsGrid({
  value = {},
  onChange,
  sourceLanguage = "en",
  textareaRows = 4,
  disabled = false,
}) {
  const [openLang, setOpenLang] = useState(null);

  function update(code, text) {
    const next = { ...value };
    if (text.trim()) next[code] = text;
    else delete next[code];
    onChange?.(next);
  }

  const filledCount = Object.keys(value).length;
  const total = TRANSLATION_LANGUAGES.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">
          {filledCount} of {total} languages filled
        </p>
        {!disabled && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const next = { ...value };
                for (const l of TRANSLATION_LANGUAGES) {
                  if (l.code !== sourceLanguage && !next[l.code]) next[l.code] = "";
                }
                onChange?.(next);
              }}
              className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              Ensure all keys
            </button>
            <button
              type="button"
              onClick={() => onChange?.({})}
              className="text-xs px-3 py-1 rounded-full border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {TRANSLATION_LANGUAGES.map((l) => {
          const text = value[l.code] ?? "";
          const has  = Boolean(text);
          const isSource = l.code === sourceLanguage;
          const open = openLang === l.code;

          return (
            <div
              key={l.code}
              className={\`rounded-xl border \${
                has
                  ? "border-green-300 dark:border-green-800"
                  : "border-gray-200 dark:border-gray-700"
              } bg-white dark:bg-gray-800 overflow-hidden\`}
            >
              <button
                type="button"
                onClick={() => setOpenLang(open ? null : l.code)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-750"
                disabled={disabled}
              >
                <span className="flex items-center gap-3">
                  <span
                    dir={l.rtl ? "rtl" : "ltr"}
                    className={\`text-base \${l.rtl ? "font-serif" : ""}\`}
                  >
                    {l.native}
                  </span>
                  <span className="text-xs text-gray-500">
                    {l.name} <span className="font-mono">({l.code})</span>
                  </span>
                  {isSource && (
                    <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                      source
                    </span>
                  )}
                  {has && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                      {text.length} chars
                    </span>
                  )}
                </span>
                <span className="text-xs text-gray-400">{open ? "▲" : "▼"}</span>
              </button>

              {open && (
                <div className="border-t border-gray-100 dark:border-gray-700 p-3">
                  <textarea
                    dir={l.rtl ? "rtl" : "ltr"}
                    rows={textareaRows}
                    value={text}
                    onChange={(e) => update(l.code, e.target.value)}
                    placeholder={\`Translation in \${l.name}…\`}
                    disabled={disabled}
                    className={\`w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm whitespace-pre-wrap \${
                      l.rtl ? "text-right font-serif leading-loose" : ""
                    }\`}
                  />
                  <div className="mt-2 flex justify-between">
                    <span className="text-xs text-gray-400">{text.length} chars</span>
                    {has && !disabled && (
                      <button
                        type="button"
                        onClick={() => update(l.code, "")}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
`.replace(/^\n/, ''),

/* ══════════════════════════════════════════════════════════════════
 *  5. List page: /translations
 * ══════════════════════════════════════════════════════════════════ */
[path.join(ADMIN, 'page.jsx')]: `
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaPlus, FaEdit, FaSearch, FaLanguage, FaCheckCircle, FaCircle } from "react-icons/fa";
import { fetchPoems } from "@/services/poemService";
import { TRANSLATION_LANGUAGES } from "@/lib/translationLanguages";

const PAGE_LIMIT = 50;

export default function TranslationsListPage() {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchPoems({ page: 1, limit: PAGE_LIMIT });
        if (!cancelled) setPoems(Array.isArray(res?.poems) ? res.poems : []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const rows = useMemo(() => {
    let list = [...poems];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.title ?? "").toLowerCase().includes(q) ||
          (p.slug ?? "").toLowerCase().includes(q),
      );
    }
    if (langFilter) {
      list = list.filter((p) => {
        const map = p.translations ? safeParse(p.translations) : {};
        return langFilter === "missing" ? !Object.keys(map).length : Boolean(map[langFilter]);
      });
    }
    return list;
  }, [poems, search, langFilter]);

  function safeParse(s) {
    try { return typeof s === "string" ? JSON.parse(s) : (s ?? {}); }
    catch { return {}; }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaLanguage className="text-3xl text-amber-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Translations
            </h1>
            <p className="text-sm text-gray-500">
              Manage poem translations across 22 languages
            </p>
          </div>
        </div>
        <Link
          href="/admin-dashboard/translations/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
        >
          <FaPlus size={12} /> New translation set
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[240px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or slug…"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
        <select
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        >
          <option value="">All languages</option>
          <option value="missing">Missing any</option>
          {TRANSLATION_LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.native} — {l.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No poems match.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Poem</th>
                <th className="px-4 py-3 font-medium">Language</th>
                <th className="px-4 py-3 font-medium">Translations</th>
                <th className="px-4 py-3 font-medium">Missing</th>
                <th className="px-4 py-3 font-medium w-24"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const map = p.translations ? safeParse(p.translations) : {};
                const have = Object.keys(map).length;
                const total = TRANSLATION_LANGUAGES.length;
                const missing = total - have;
                return (
                  <tr key={p.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{p.title}</div>
                      <div className="text-xs text-gray-400 font-mono">#{p.id} · {p.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 uppercase">{p.language}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <FaCheckCircle size={12} /> {have}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-gray-400">
                        <FaCircle size={12} /> {missing}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={\`/admin-dashboard/translations/\${p.id}/edit\`}
                        className="inline-flex items-center gap-1 text-amber-600 hover:underline"
                      >
                        <FaEdit size={12} /> Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
`.replace(/^\n/, ''),

/* ══════════════════════════════════════════════════════════════════
 *  6. New page: /translations/new
 * ══════════════════════════════════════════════════════════════════ */
[path.join(ADMIN, 'new', 'page.jsx')]: `
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaSearch } from "react-icons/fa";
import { fetchPoems } from "@/services/poemService";
import { saveAllTranslations } from "@/services/translationService";
import TranslationsGrid from "@/components/admin/TranslationsGrid";

export default function NewTranslationPage() {
  const router = useRouter();
  const [poems, setPoems] = useState([]);
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState(null);
  const [map, setMap] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetchPoems({ page: 1, limit: 200 });
      setPoems(Array.isArray(res?.poems) ? res.poems : []);
    })();
  }, []);

  const filtered = search
    ? poems.filter((p) =>
        (p.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (p.slug ?? "").toLowerCase().includes(search.toLowerCase()),
      )
    : poems;

  async function save() {
    if (!picked) return setError("Pick a poem first");
    setSaving(true);
    setError(null);
    try {
      await saveAllTranslations(picked.id, map);
      router.push(\`/admin-dashboard/translations/\${picked.id}/edit\`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link
        href="/admin-dashboard/translations"
        className="inline-flex items-center gap-2 text-amber-600 hover:underline mb-4"
      >
        <FaArrowLeft size={12} /> Back
      </Link>

      <h1 className="text-2xl font-bold mb-2">New translation set</h1>
      <p className="text-sm text-gray-500 mb-6">
        Pick a poem, fill in translations, and save.
      </p>

      {!picked ? (
        <div>
          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search poem…"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            />
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800 max-h-[500px] overflow-y-auto">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setPicked(p)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-gray-400 font-mono">
                  #{p.id} · {p.slug} · {p.language?.toUpperCase()}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-gray-500">Poem #{picked.id}</div>
                <div className="font-medium">{picked.title}</div>
                <div className="text-sm text-gray-500 mt-1 line-clamp-3 whitespace-pre-wrap">
                  {picked.content?.slice(0, 200)}…
                </div>
              </div>
              <button
                onClick={() => { setPicked(null); setMap({}); }}
                className="text-xs text-amber-600 hover:underline"
              >
                Change
              </button>
            </div>
          </div>

          <TranslationsGrid
            value={map}
            onChange={setMap}
            sourceLanguage={picked.language}
          />

          {error && <p className="mt-4 text-sm text-red-500">⚠ {error}</p>}

          <div className="mt-6 flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
            >
              <FaSave size={12} /> {saving ? "Saving…" : "Save translations"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
`.replace(/^\n/, ''),

/* ══════════════════════════════════════════════════════════════════
 *  7. Edit page: /translations/[id]/edit
 * ══════════════════════════════════════════════════════════════════ */
[path.join(ADMIN, '[id]', 'edit', 'page.jsx')]: `
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaTrash } from "react-icons/fa";
import { fetchPoemTranslations } from "@/services/poemService";
import { saveAllTranslations } from "@/services/translationService";
import TranslationsGrid from "@/components/admin/TranslationsGrid";

export default function EditTranslationPage() {
  const params = useParams();
  const router = useRouter();
  const poemId = Number(params.id);

  const [poemInfo, setPoemInfo] = useState(null);
  const [map, setMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchPoemTranslations(poemId);
        if (cancelled) return;
        setMap(data?.translations ?? {});
        setPoemInfo({
          id: poemId,
          language: data?.sourceLanguage ?? "en",
          languages: data?.languages ?? [],
        });
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [poemId]);

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await saveAllTranslations(poemId, map);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link
        href="/admin-dashboard/translations"
        className="inline-flex items-center gap-2 text-amber-600 hover:underline mb-4"
      >
        <FaArrowLeft size={12} /> Back
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit translations</h1>
        <p className="text-sm text-gray-500">
          Poem #{poemId} · source language: {poemInfo?.language?.toUpperCase()}
        </p>
      </div>

      <TranslationsGrid
        value={map}
        onChange={setMap}
        sourceLanguage={poemInfo?.language ?? "en"}
        textareaRows={6}
      />

      {error && <p className="mt-4 text-sm text-red-500">⚠ {error}</p>}
      {saved && <p className="mt-4 text-sm text-green-600">✓ Saved</p>}

      <div className="mt-6 flex gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
        >
          <FaSave size={12} /> {saving ? "Saving…" : "Save changes"}
        </button>
        <button
          onClick={() => router.push("/admin-dashboard/translations")}
          className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
`.replace(/^\n/, ''),

};

console.log(`\nmake-admin-translations.mjs → ${WEB}\n`);

for (const [fullPath, content] of Object.entries(FILES)) {
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('  ✓', path.relative(ROOT, fullPath));
}

console.log('\nDone.\n');