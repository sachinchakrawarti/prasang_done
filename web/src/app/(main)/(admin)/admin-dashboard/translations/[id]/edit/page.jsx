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
