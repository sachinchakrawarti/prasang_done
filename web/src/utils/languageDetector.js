// src/utils/languageDetector.js

export function detectScript(text) {
  if (!text) return { script: "unknown", isEnglish: false };

  const isDevanagari = /[\u0900-\u097F]/.test(text);
  const isArabic = /[\u0600-\u06FF]/.test(text);
  const isChinese = /[\u4E00-\u9FFF]/.test(text);
  const isCyrillic = /[\u0400-\u04FF]/.test(text);
  const isLatin = /[A-Za-z]/.test(text);

  if (isDevanagari) return { script: "devanagari", isEnglish: false };
  if (isArabic) return { script: "arabic", isEnglish: false };
  if (isChinese) return { script: "chinese", isEnglish: false };
  if (isCyrillic) return { script: "cyrillic", isEnglish: false };
  if (isLatin) return { script: "latin", isEnglish: true };
  return { script: "unknown", isEnglish: false };
}

export function needsRomanization(text) {
  const { script } = detectScript(text);
  return !["latin", "unknown"].includes(script);
}

export function getScriptDisplayName(script) {
  const names = {
    devanagari: "Devanagari",
    arabic: "Arabic",
    chinese: "Chinese",
    cyrillic: "Cyrillic",
    latin: "Latin",
    unknown: "Unknown",
  };
  return names[script] || "Unknown";
}