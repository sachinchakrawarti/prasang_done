// src/components/poems/RomanizationPoetryDisplay.jsx

import React, { useState, useEffect, useMemo } from "react";
import {
  detectScript,
  getScriptDisplayName,
} from "../../utils/languageDetector";
import {
  romanizeLine,
  isRomanizationAvailable,
} from "../../utils/romanizationService";

const RomanizationPoetryDisplay = ({
  poetry,
  title,
  author,
  className = "",
  showToggle = true,
  defaultShowRomanization = true,
  onRomanizationChange = null,
}) => {
  const [scriptInfo, setScriptInfo] = useState({});
  const [supported, setSupported] = useState(false);
  const [showRomanization, setShowRomanization] = useState(
    defaultShowRomanization,
  );
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (!poetry) return;
    const info = detectScript(poetry);
    setScriptInfo(info);
    const ok = isRomanizationAvailable(poetry);
    setSupported(ok);
    if (!ok) setShowRomanization(false);
  }, [poetry]);

  const lines = useMemo(() => {
    if (!poetry) return [];
    return poetry.split("\n").map((line, index) => ({
      index,
      original: line,
      romanized: supported && line.trim() ? romanizeLine(line) : "",
    }));
  }, [poetry, supported]);

  useEffect(() => {
    if (!onRomanizationChange) return;
    const text = lines.map((l) => l.romanized).join("\n");
    onRomanizationChange(text);
  }, [lines, onRomanizationChange]);

  const handleCopy = async () => {
    const text = lines
      .map((l) =>
        showRomanization && l.romanized
          ? `${l.original}\n${l.romanized}`
          : l.original,
      )
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const getScriptEmoji = (script) => {
    const emojis = {
      devanagari: "🇮🇳",
      arabic: "🇵🇰",
      chinese: "🇨🇳",
      cyrillic: "🇷🇺",
      latin: "🔤",
      unknown: "❓",
    };
    return emojis[script] || "📝";
  };

  const isRTL = scriptInfo.script === "arabic";

  return (
    <div className={`romanization-poetry-display ${className}`}>
      {(title || author) && (
        <div className="poetry-header">
          {title && (
            <h2 className="poetry-title" dir={isRTL ? "rtl" : "ltr"}>
              {title}
            </h2>
          )}
          {author && (
            <p className="poetry-author" dir={isRTL ? "rtl" : "ltr"}>
              — {author}
            </p>
          )}
        </div>
      )}

      {showToggle && supported && (
        <div className="romanization-controls">
          <button
            onClick={() => setShowRomanization((v) => !v)}
            className={`toggle-btn ${showRomanization ? "active" : ""}`}
            aria-pressed={showRomanization}
          >
            {showRomanization ? "Hide Transliteration" : "Show Transliteration"}
          </button>
          <button onClick={handleCopy} className="copy-btn">
            {copySuccess ? "✓ Copied!" : "📋 Copy"}
          </button>
          {scriptInfo.script && (
            <span className="script-badge">
              <span className="script-emoji">
                {getScriptEmoji(scriptInfo.script)}
              </span>
              <span className="script-name">
                {getScriptDisplayName(scriptInfo.script)}
              </span>
            </span>
          )}
        </div>
      )}

      <div className="poem-body">
        {lines.map((line) => {
          const isEmpty = !line.original.trim();
          return (
            <div key={line.index} className="line-pair">
              <p className="line-original" dir={isRTL ? "rtl" : "ltr"}>
                {isEmpty ? "\u00A0" : line.original}
              </p>
              {showRomanization && line.romanized && (
                <p className="line-romanized" dir="ltr">
                  {line.romanized}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!supported && poetry && (
        <div className="no-romanization-available">
          <span className="info-icon">ℹ️</span>
          <span>Transliteration not available for this script</span>
        </div>
      )}

      <style jsx>{`
        .romanization-poetry-display {
          max-width: 100%;
          padding: 24px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .poetry-header {
          margin-bottom: 20px;
        }

        .poetry-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 6px 0;
        }

        .poetry-author {
          font-size: 0.95rem;
          color: #6c757d;
          font-style: italic;
          margin: 0;
        }

        .romanization-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e9ecef;
        }

        .toggle-btn {
          padding: 8px 18px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: background 0.2s;
        }

        .toggle-btn:hover {
          background: #0056b3;
        }

        .toggle-btn.active {
          background: #28a745;
        }

        .toggle-btn.active:hover {
          background: #1e7e34;
        }

        .copy-btn {
          padding: 8px 16px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.2s;
        }

        .copy-btn:hover {
          background: #5a6268;
        }

        .script-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f1f3f5;
          color: #495057;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          margin-left: auto;
        }

        .script-emoji {
          font-size: 0.9rem;
        }

        /* ---- poem body ---- */

        .poem-body {
          font-family:
            "Noto Serif Devanagari", "Noto Nastaliq Urdu", "Georgia", serif;
        }

        .line-pair {
          margin: 0 0 16px 0;
        }

        .line-pair:last-child {
          margin-bottom: 0;
        }

        .line-original {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #1a1a2e;
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .line-romanized {
          font-family: "Georgia", serif;
          font-style: italic;
          font-weight: 600;
          font-size: 1rem;
          line-height: 1.6;
          color: #495057;
          margin: 4px 0 0 0;
          padding-left: 4px;
          white-space: pre-wrap;
          word-break: break-word;
          animation: fadeIn 0.25s ease;
        }

        /* RTL original + LTR romanized */
        .line-original[dir="rtl"] {
          text-align: right;
        }

        .line-romanized[dir="ltr"] {
          text-align: left;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .no-romanization-available {
          margin-top: 20px;
          padding: 12px 16px;
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffc107;
          border-radius: 8px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 640px) {
          .romanization-poetry-display {
            padding: 16px;
          }
          .poetry-title {
            font-size: 1.3rem;
          }
          .line-original {
            font-size: 1.05rem;
          }
          .line-romanized {
            font-size: 0.92rem;
          }
          .script-badge {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default RomanizationPoetryDisplay;
