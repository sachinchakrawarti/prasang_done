"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchPoems } from "@/services/poemService";
import { romanizeCached, SUPPORTED_SCRIPTS } from "@/lang/romanization";
import { translitStore } from "@/lang/transliteration";

const SCRIPT_LANG = {
  Devanagari: "hi",
  Arabic:     "ur",
  Bengali:    "bn",
  Tamil:      "ta",
  Telugu:     "te",
  Gurmukhi:   "pa",
  Latin:      "en",
};

export default function TestPage() {
  const params = useParams();
  const lang   = params?.lang || "en";

  const [poems, setPoems]         = useState([]);
  const [poem, setPoem]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [err, setErr]             = useState(null);

  const [view, setView]           = useState("original"); // original | roman | translit
  const [targetScript, setTarget] = useState("Arabic");
  const [translitText, setTranslitText] = useState("");
  const [translitLoading, setTranslitLoading] = useState(false);
  const [translitError, setTranslitError] = useState(null);

  // ---- load poems ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchPoems({ page: 1, limit: 20 });
        const list = res?.poems ?? [];
        if (cancelled) return;
        setPoems(list);
        setPoem(list[0] ?? null);
        console.log("[TEST] loaded poems:", list.length, "first:", list[0]);
      } catch (e) {
        if (!cancelled) setErr(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ---- derived text ----
  const romanText =
    poem && view === "roman"
      ? romanizeCached(poem.content, poem.script || "Latin")
      : "";

  // ---- transliteration trigger ----
  async function runTranslit() {
    if (!poem) return;
    setTranslitLoading(true);
    setTranslitError(null);
    setTranslitText("");

    try {
      console.log("[TEST] translit args:", {
        content: poem.content?.slice(0, 40),
        from: poem.script,
        to: targetScript,
      });

      const out = await translitStore.transliterate(
        poem.content,
        poem.script,
        targetScript,
      );

      console.log("[TEST] translit result:", out);
      setTranslitText(out);
    } catch (e) {
      console.error("[TEST] translit failed:", e);
      setTranslitError(e.message);
    } finally {
      setTranslitLoading(false);
    }
  }

  useEffect(() => {
    if (view === "translit") runTranslit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, targetScript]);

  // ---- render ----
  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (err)     return <div style={{ padding: 24, color: "red" }}>Error: {err}</div>;
  if (!poem)   return <div style={{ padding: 24 }}>No poems in DB.</div>;

  const displayed =
    view === "original" ? poem.content :
    view === "roman"    ? romanText :
                          translitText;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>{poem.title}</h1>

      {/* --- poem switcher --- */}
      <label style={{ display: "block", marginBottom: 16 }}>
        Poem:{" "}
        <select
          value={poem.id}
          onChange={(e) =>
            setPoem(poems.find((p) => p.id === Number(e.target.value)) ?? poem)
          }
        >
          {poems.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} [{p.language}/{p.script}]
            </option>
          ))}
        </select>
      </label>

      {/* --- diagnostic block --- */}
      <pre
        style={{
          background: "#f3f3f3",
          padding: 8,
          fontSize: 11,
          overflowX: "auto",
          marginBottom: 16,
        }}
      >
        {JSON.stringify(
          {
            id: poem.id,
            language: poem.language,
            script: poem.script,
            contentLen: poem.content?.length,
            contentStart: poem.content?.slice(0, 40),
            SUPPORTED_SCRIPTS,
            SCRIPT_LANG_target: SCRIPT_LANG[targetScript],
          },
          null,
          2,
        )}
      </pre>

      {/* --- view controls --- */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setView("original")}
          style={{
            padding: "6px 12px",
            background: view === "original" ? "#111" : "#fff",
            color: view === "original" ? "#fff" : "#111",
            border: "1px solid #111",
            borderRadius: 999,
            cursor: "pointer",
          }}
        >
          Original
        </button>

        <button
          onClick={() => setView("roman")}
          style={{
            padding: "6px 12px",
            background: view === "roman" ? "#111" : "#fff",
            color: view === "roman" ? "#fff" : "#111",
            border: "1px solid #111",
            borderRadius: 999,
            cursor: "pointer",
          }}
        >
          Roman
        </button>

        <button
          onClick={() => setView("translit")}
          style={{
            padding: "6px 12px",
            background: view === "translit" ? "#111" : "#fff",
            color: view === "translit" ? "#fff" : "#111",
            border: "1px solid #111",
            borderRadius: 999,
            cursor: "pointer",
          }}
        >
          Transliterate
        </button>

        {view === "translit" && (
          <select
            value={targetScript}
            onChange={(e) => setTarget(e.target.value)}
            style={{ padding: "6px 10px", borderRadius: 6 }}
          >
            {SUPPORTED_SCRIPTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
      </div>

      {/* --- body --- */}
      <div
        style={{
          minHeight: 120,
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          whiteSpace: "pre-wrap",
          fontSize: 18,
          lineHeight: 1.8,
          direction: targetScript === "Arabic" && view === "translit" ? "rtl" : "ltr",
        }}
      >
        {view === "translit" && translitLoading
          ? "Transliterating…"
          : displayed || <span style={{ color: "#999" }}>(empty)</span>}
      </div>

      {translitError && (
        <p style={{ color: "red", marginTop: 8 }}>Translit error: {translitError}</p>
      )}

      {/* --- manual fire --- */}
      {view === "translit" && !translitLoading && (
        <button
          onClick={runTranslit}
          style={{ marginTop: 12, padding: "6px 12px" }}
        >
          Retry transliterate
        </button>
      )}
    </div>
  );
}