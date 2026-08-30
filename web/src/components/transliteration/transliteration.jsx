// src/components/transliteration/transliteration.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FaExchangeAlt, FaCopy, FaCheck, FaSpinner } from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

// Import language-specific transliteration modules
import { transliterateHindi } from "./transliteration_hindi";
import { transliterateUrdu } from "./transliteration_urdu";
import { transliterateArabic } from "./transliteration_arabic";
import { transliterateEnglish } from "./transliteration_english";

// Import transliteration library for other languages
import { transliterate as tr } from "transliteration";

const Transliteration = ({ text, fromLang, toLang, showCopy = true }) => {
  const params = useParams();
  const currentLang = params?.lang || "en";
  const { themeName } = useTheme();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [transliteratedText, setTransliteratedText] = useState("");
  const [isTransliterating, setIsTransliterating] = useState(false);

  // Determine source and target languages based on current language
  const getTransliterationPair = () => {
    if (fromLang && toLang) {
      return { source: fromLang, target: toLang };
    }

    const source = fromLang || "hi";
    let target = currentLang;

    // If current language is the same as source, transliterate to English
    if (target === source) {
      target = "en";
    }

    // If current language is not supported, use English
    const supportedLanguages = ["en", "hi", "ur", "ar", "bn", "te", "ta"];
    if (!supportedLanguages.includes(target)) {
      target = "en";
    }

    return { source, target };
  };

  const { source: sourceLang, target: targetLang } = getTransliterationPair();

  useEffect(() => {
    if (!text || !sourceLang || !targetLang) return;

    setIsTransliterating(true);

    try {
      let result = "";

      // Use language-specific transliteration modules
      if (sourceLang === "hi") {
        result = transliterateHindi(text, targetLang);
      } else if (sourceLang === "ur") {
        result = transliterateUrdu(text, targetLang);
      } else if (sourceLang === "ar") {
        result = transliterateArabic(text, targetLang);
      } else if (sourceLang === "en") {
        result = transliterateEnglish(text, targetLang);
      } else {
        // Fallback to library for other languages
        try {
          result = tr(text, { from: sourceLang, to: targetLang });
        } catch {
          result = text;
        }
      }

      setTransliteratedText(result);
    } catch (error) {
      console.error("Transliteration error:", error);
      setTransliteratedText(text);
    } finally {
      setIsTransliterating(false);
    }
  }, [text, sourceLang, targetLang]);

  // Theme-aware styles
  const getTextColor = () => {
    switch (themeName) {
      case "forest":
        return "text-green-600 dark:text-green-400";
      case "lavender":
        return "text-purple-600 dark:text-purple-400";
      case "rose":
        return "text-rose-600 dark:text-rose-400";
      case "sepia":
        return "text-amber-600 dark:text-amber-400";
      default:
        return "text-amber-600 dark:text-amber-400";
    }
  };

  const getBorderColor = () => {
    switch (themeName) {
      case "forest":
        return "border-green-200 dark:border-green-800";
      case "lavender":
        return "border-purple-200 dark:border-purple-800";
      case "rose":
        return "border-rose-200 dark:border-rose-800";
      case "sepia":
        return "border-amber-200 dark:border-amber-800";
      default:
        return "border-amber-200 dark:border-amber-800";
    }
  };

  const getHoverBg = () => {
    switch (themeName) {
      case "forest":
        return "hover:bg-green-50 dark:hover:bg-green-900/20";
      case "lavender":
        return "hover:bg-purple-50 dark:hover:bg-purple-900/20";
      case "rose":
        return "hover:bg-rose-50 dark:hover:bg-rose-900/20";
      case "sepia":
        return "hover:bg-amber-50 dark:hover:bg-amber-900/20";
      default:
        return "hover:bg-amber-50 dark:hover:bg-amber-900/20";
    }
  };

  const textColor = getTextColor();
  const borderColor = getBorderColor();
  const hoverBg = getHoverBg();

  // Don't show if no text or if source is same as target
  if (!text || sourceLang === targetLang) return null;

  // Valid language pairs
  const validPairs = [
    "hi-en",
    "en-hi",
    "hi-ur",
    "ur-hi",
    "ur-en",
    "en-ur",
    "ar-en",
    "en-ar",
    "bn-en",
    "te-en",
    "ta-en",
  ];
  const pair = `${sourceLang}-${targetLang}`;
  if (!validPairs.includes(pair)) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transliteratedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const languageNames = {
    hi: "हिन्दी",
    ur: "اردو",
    en: "English",
    ar: "العربية",
    bn: "বাংলা",
    te: "తెలుగు",
    ta: "தமிழ்",
  };

  const languageFlags = {
    hi: "🇮🇳",
    ur: "🇵🇰",
    en: "🇬🇧",
    ar: "🇸🇦",
    bn: "🇧🇩",
    te: "🇮🇳",
    ta: "🇮🇳",
  };

  return (
    <div
      className={`p-4 rounded-xl border ${borderColor} bg-gray-50 dark:bg-gray-800/50 transition-all hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FaExchangeAlt className={`text-sm ${textColor}`} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("transliterated") || "Transliterated"}
            {languageFlags[sourceLang] && ` ${languageFlags[sourceLang]}`}
            {languageNames[sourceLang]
              ? ` ${languageNames[sourceLang]}`
              : sourceLang.toUpperCase()}
            {" → "}
            {languageFlags[targetLang] && `${languageFlags[targetLang]}`}
            {languageNames[targetLang]
              ? ` ${languageNames[targetLang]}`
              : targetLang.toUpperCase()}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
            {t("lib") || "lib"}: transliteration
          </span>
        </div>
        {showCopy && (
          <button
            onClick={handleCopy}
            disabled={isTransliterating || !transliteratedText}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${hoverBg} ${textColor} transition-colors ${
              isTransliterating || !transliteratedText
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            aria-label={t("copy") || "Copy"}
          >
            {copied ? (
              <>
                <FaCheck size={12} />
                <span>{t("copied") || "Copied"}</span>
              </>
            ) : (
              <>
                <FaCopy size={12} />
                <span>{t("copy") || "Copy"}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      {isTransliterating ? (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2">
            <FaSpinner className="animate-spin text-amber-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("transliterating") || "Transliterating..."}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {transliteratedText || text}
        </p>
      )}

      <div className="mt-1 text-xs text-gray-400 dark:text-gray-500 flex items-center justify-between">
        <span>
          {t("transliterationNote") ||
            "Converts text from one script to another while preserving pronunciation."}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {sourceLang.toUpperCase()} → {targetLang.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default Transliteration;
