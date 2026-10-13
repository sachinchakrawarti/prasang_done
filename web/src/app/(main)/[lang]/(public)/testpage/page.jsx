"use client";
import { useEffect, useState } from "react";
import { fetchPoems } from "@/services/poemService";
import { romanizeCached, romanizeAsciiCached, SUPPORTED_SCRIPTS } from "@/lang/romanization";
import { translitStore } from "@/lang/transliteration";
import { LANGUAGES } from "@/lang/languages";

export default function TestPage() {
  const [poems, setPoems] = useState([]);
  const [poem, setPoem]   = useState(null);

  const [targetLang, setTargetLang] = useState("ur");
  const [out, setOut]               = useState("");
  const [ascii, setAscii]           = useState("");
  const [roman, setRoman]           = useState("");
  const [status, setStatus]         = useState("idle");

  // Load poems once
  useEffect(() => {
    (async () => {
      const res  = await fetchPoems({ page: 1, limit: 20 });
      const list = res?.poems ?? [];
      setPoems(list);
      setPoem(list[0] ?? null);
    })();
  }, []);

  // Derive roman + ascii whenever the poem changes
  useEffect(() => {
    if (!poem) return;
    setRoman(romanizeCached(poem.content, poem.script));
    setAscii(romanizeAsciiCached(poem.content, poem.script));
    setOut("");
    setStatus("idle");
  }, [poem]);

  async function runTranslit() {
    if (!poem) return;
    setStatus("loading");
    const target = LANGUAGES[targetLang];
    try {
      const result = await translitStore.transliterate(
        poem.content,
        poem.script,
        target.script,
        target.googleLang,
      );
      setOut(result);
      setStatus("ok");
    } catch (e) {
      setOut(`⚠ ${e.message}`);
      setStatus("error");
    }
  }

  if (!poem) return <div style={{ padding: 24 }}>Loading…</div>;

  const target = LANGUAGES[targetLang];

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22 }}>{poem.title}</h1>

      <label style={{ display: "block", margin: "12px 0" }}>
        Poem:{" "}
        <select
          value={poem.id}
          onChange={(e) => setPoem(poems.find((p) => p.id === Number(e.target.value)))}
        >
          {poems.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} [{p.language}/{p.script}]
            </option>
          ))}
        </select>
      </label>

      <pre style={{ background: "#f3f3f3", padding: 8, fontSize: 11 }}>
        {JSON.stringify({
          id: poem.id, language: poem.language, script: poem.script,
          contentLen: poem.content?.length,
          SUPPORTED_SCRIPTS,
        }, null, 2)}
      </pre>

      <h3>1. Original</h3>
      <div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 16 }}
           dir={poem.script === "Arabic" ? "rtl" : "ltr"}>
        {poem.content}
      </div>

      <h3>2. Roman (display)</h3>
      <div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 16 }}>
        {roman}
      </div>

      <h3>3. Roman (ASCII pivot)</h3>
      <div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 16, fontFamily: "monospace" }}>
        {ascii}
      </div>

      <h3>4. Transliterate to…</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
          {Object.values(LANGUAGES).map((l) => (
            <option key={l.code} value={l.code}>
              {l.native} — {l.name} [{l.script}]
            </option>
          ))}
        </select>
        <button onClick={runTranslit} disabled={status === "loading"}>
          {status === "loading" ? "…" : "Run"}
        </button>
      </div>

      <div
        style={{ border: "1px solid #ddd", padding: 12, minHeight: 60, whiteSpace: "pre-wrap" }}
        dir={target.dir}
      >
        {out || <span style={{ color: "#999" }}>(not yet run)</span>}
      </div>
    </div>
  );
}