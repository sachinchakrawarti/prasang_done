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
                        href={`/admin-dashboard/translations/${p.id}/edit`}
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
