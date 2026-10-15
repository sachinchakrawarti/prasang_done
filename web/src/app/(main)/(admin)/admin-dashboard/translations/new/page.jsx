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
      router.push(`/admin-dashboard/translations/${picked.id}/edit`);
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
