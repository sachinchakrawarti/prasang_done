"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchPoems } from "@/services/poemService";
import * as R from "@/lang/romanization";
import { translitStore } from "@/lang/transliteration";
import { LANGUAGES, SCRIPT_TO_LANGUAGES } from "@/lang/languages";

const ALL_LANGS = Object.values(LANGUAGES);

export default function TestPage() {
  const [poems, setPoems]   = useState([]);
  const [poem, setPoem]     = useState(null);

  const [targetScript, setTargetScript] = useState("Arabic");
  const [targetLang,   setTargetLang]   = useState("ur");

  const [roman, setRoman]   = useState("");
  const [ascii, setAscii]   = useState("");
  const [out, setOut]       = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | ok | error

  // --- import self-check ---
  const missing = ["romanizeCached", "romanizeAsciiCached", "SUPPORTED_SCRIPTS"]
    .filter((k) => typeof R[k] === "undefined");

  // --- load poems once ---
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetchPoems({ page: 1, limit: 20 });
        const list = res?.poems ?? [];
        setPoems(list);
        setPoem(list[0] ?? null);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // --- derive roman + ascii on poem change ---
  useEffect(() => {
    if (!poem || missing.length) return;
    try {
      setRoman(R.romanizeCached(poem.content ?? "", poem.script ?? "Latin"));
      setAscii(R.romanizeAsciiCached(poem.content ?? "", poem.script ?? "Latin"));
    } catch (e) {
      setRoman("⚠ " + e.message);
      setAscii("⚠ " + e.message);
    }
    setOut("");
    setStatus("idle");
  }, [poem, missing.length]);

  // --- languages available for the current target script ---
  const languagesForScript = useMemo(
    () => SCRIPT_TO_LANGUAGES[targetScript] ?? [],
    [targetScript],
  );

  // when target script changes, pick a sensible default language
  useEffect(() => {
    if (languagesForScript.length && !languagesForScript.find((l) => l.code === targetLang)) {
      setTargetLang(languagesForScript[0].code);
    }
  }, [languagesForScript, targetLang]);

  async function runTranslit() {
    if (!poem) return;
    const target = LANGUAGES[targetLang];
    if (!target) return;

    setStatus("loading");
    setOut("");
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
      setOut("⚠ " + e.message);
      setStatus("error");
    }
  }

  // --- import failure UI ---
  if (missing.length) {
    return (
      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto", fontFamily: "monospace" }}>
        <h2 style={{ color: "#c33" }}>Import problem</h2>
        <p>Missing from <code>@/lang/romanization</code>:</p>
        <ul>{missing.map((k) => <li key={k}>{k}</li>)}</ul>
        <p>
          Re-run <code>node scripts/fix.js --force</code> and restart{" "}
          <code>npm run dev</code>.
        </p>
      </div>
    );
  }

  if (!poem) return <div style={{ padding: 24 }}>Loading…</div>;

  const target = LANGUAGES[targetLang];

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>{poem.title}</h1>
      <p style={{ color: "#666", marginTop: 0 }}>
        {poem.language?.toUpperCase()} · {poem.script}
      </p>

      {/* --- poem switcher --- */}
      <label style={{ display: "block", margin: "12px 0 24px" }}>
        Poem:{" "}
        <select
          value={poem.id}
          onChange={(e) =>
            setPoem(poems.find((p) => p.id === Number(e.target.value)))
          }
          style={{ padding: "6px 10px", borderRadius: 6 }}
        >
          {poems.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} [{p.language}/{p.script}]
            </option>
          ))}
        </select>
      </label>

      {/* --- diagnostics --- */}
      <pre
        style={{
          background: "#f3f3f3",
          padding: 10,
          fontSize: 11,
          borderRadius: 6,
          overflowX: "auto",
        }}
      >
{JSON.stringify(
  {
    poemId: poem.id,
    language: poem.language,
    script: poem.script,
    contentLen: poem.content?.length,
    SUPPORTED_SCRIPTS: R.SUPPORTED_SCRIPTS,
    SUPPORTED_GOOGLE_LANGS: ["hi","ur","ar","fa","ps","bn","pa","gu","ta","te","kn","ml","or","en","fr","de","es","tr","ru","ja","ko","zh"],
  },
  null,
  2,
)}
      </pre>

      {/* --- views --- */}
      <Section title="1. Original">
        <div dir={poem.script === "Arabic" ? "rtl" : "ltr"} style={{ fontSize: 18, lineHeight: 1.8 }}>
          {poem.content}
        </div>
      </Section>

      <Section title="2. Roman (display)">
        <div style={{ fontSize: 18, lineHeight: 1.8 }}>{roman}</div>
      </Section>

      <Section title="3. Roman (ASCII pivot)">
        <div style={{ fontFamily: "monospace", fontSize: 15, lineHeight: 1.6 }}>
          {ascii}
        </div>
      </Section>

      {/* --- transliteration controls --- */}
      <Section title="4. Transliterate to…">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <label>
            Script:{" "}
            <select
              value={targetScript}
              onChange={(e) => setTargetScript(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: 6 }}
            >
              {R.SUPPORTED_SCRIPTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label>
            Language:{" "}
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: 6 }}
            >
              {languagesForScript.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native} — {l.name}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={runTranslit}
            disabled={status === "loading"}
            style={{
              padding: "6px 16px",
              borderRadius: 6,
              border: "1px solid #111",
              background: status === "loading" ? "#eee" : "#111",
              color: status === "loading" ? "#666" : "#fff",
              cursor: status === "loading" ? "wait" : "pointer",
            }}
          >
            {status === "loading" ? "…" : "Run"}
          </button>
        </div>

        <div
          dir={target?.dir}
          style={{
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: 14,
            minHeight: 60,
            fontSize: 20,
            lineHeight: 2,
            fontFamily:
              target?.script === "Arabic"
                ? "'Noto Nastaliq Urdu', 'Amiri', serif"
                : undefined,
            background: status === "error" ? "#fff5f5" : "white",
          }}
        >
          {out || <span style={{ color: "#999", fontSize: 14 }}>(not yet run)</span>}
        </div>

        {status === "ok" && (
          <p style={{ fontSize: 12, color: "#080" }}>
            ✓ {poem.script} → {target.script} ({target.name})
          </p>
        )}
        {status === "error" && (
          <p style={{ fontSize: 12, color: "#c33" }}>✗ failed</p>
        )}
      </Section>

      {/* --- quick matrix: same text to every Arabic-family language --- */}
      <Section title="5. Same script, different language (Arabic family)">
        <QuickMatrix
          text={poem.content}
          fromScript={poem.script}
          langs={["ur", "ar", "fa", "ps"]}
        />
      </Section>

      {/* --- quick matrix: same script, various Indic languages --- */}
      <Section title="6. Same script, different Indic language">
        <QuickMatrix
          text={poem.content}
          fromScript={poem.script}
          langs={["hi", "bn", "pa", "gu", "ta", "te", "kn", "ml", "or"]}
        />
      </Section>

      {/* --- full language list --- */}
      <Section title="7. All supported languages">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
              <th style={{ padding: 6 }}>Code</th>
              <th style={{ padding: 6 }}>Name</th>
              <th style={{ padding: 6 }}>Native</th>
              <th style={{ padding: 6 }}>Script</th>
              <th style={{ padding: 6 }}>Google</th>
              <th style={{ padding: 6 }}>Dir</th>
            </tr>
          </thead>
          <tbody>
            {ALL_LANGS.map((l) => (
              <tr key={l.code} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 6, fontFamily: "monospace" }}>{l.code}</td>
                <td style={{ padding: 6 }}>{l.name}</td>
                <td style={{ padding: 6, direction: l.dir }}>{l.native}</td>
                <td style={{ padding: 6 }}>{l.script}</td>
                <td style={{ padding: 6, fontFamily: "monospace" }}>{l.googleLang}</td>
                <td style={{ padding: 6 }}>{l.dir}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 16, margin: "0 0 8px", color: "#333" }}>{title}</h2>
      {children}
    </section>
  );
}

function QuickMatrix({ text, fromScript, langs }) {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  async function runAll() {
    setLoading(true);
    setResults({});
    const next = {};
    for (const code of langs) {
      const l = LANGUAGES[code];
      try {
        next[code] = await translitStore.transliterate(
          text,
          fromScript,
          l.script,
          l.googleLang,
        );
      } catch (e) {
        next[code] = "⚠ " + e.message;
      }
      // update progressively
      setResults({ ...next });
    }
    setLoading(false);
  }

  return (
    <div>
      <button
        onClick={runAll}
        disabled={loading}
        style={{
          padding: "6px 16px",
          borderRadius: 6,
          border: "1px solid #111",
          background: loading ? "#eee" : "#fff",
          cursor: loading ? "wait" : "pointer",
          marginBottom: 12,
        }}
      >
        {loading ? "Running…" : "Run matrix"}
      </button>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
        <tbody>
          {langs.map((code) => {
            const l = LANGUAGES[code];
            return (
              <tr key={code} style={{ borderBottom: "1px solid #eee" }}>
                <td
                  style={{
                    padding: 8,
                    width: 160,
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: "#666",
                    verticalAlign: "top",
                  }}
                >
                  {l.native} ({code})
                </td>
                <td
                  style={{ padding: 8, direction: l.dir, fontSize: 18, lineHeight: 1.8 }}
                >
                  {results[code] ?? <span style={{ color: "#999" }}>—</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}