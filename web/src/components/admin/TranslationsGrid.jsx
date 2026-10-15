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
              className={`rounded-xl border ${
                has
                  ? "border-green-300 dark:border-green-800"
                  : "border-gray-200 dark:border-gray-700"
              } bg-white dark:bg-gray-800 overflow-hidden`}
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
                    className={`text-base ${l.rtl ? "font-serif" : ""}`}
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
                    placeholder={`Translation in ${l.name}…`}
                    disabled={disabled}
                    className={`w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm whitespace-pre-wrap ${
                      l.rtl ? "text-right font-serif leading-loose" : ""
                    }`}
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
