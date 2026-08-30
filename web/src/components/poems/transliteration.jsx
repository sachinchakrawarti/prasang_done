// src/components/poems/transliteration.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FaExchangeAlt, FaCopy, FaCheck, FaSpinner } from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

// Import transliteration library (works in browser)
import { transliterate as tr } from "transliteration";

const Transliteration = ({ text, fromLang, toLang, showCopy = true }) => {
  const params = useParams();
  const currentLang = params?.lang || "en";
  const { themeName } = useTheme();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [transliteratedText, setTransliteratedText] = useState("");
  const [isTransliterating, setIsTransliterating] = useState(false);

  // Determine target language based on current language
  const getTargetLang = () => {
    // If toLang is provided, use it
    if (toLang) return toLang;

    // Otherwise use current language from URL
    return currentLang;
  };

  // Determine source language
  const getSourceLang = () => {
    // If fromLang is provided, use it
    if (fromLang) return fromLang;

    // Otherwise use the poem's language
    return "hi"; // default fallback
  };

  const sourceLang = getSourceLang();
  const targetLang = getTargetLang();

  useEffect(() => {
    if (!text || !sourceLang || !targetLang) return;

    setIsTransliterating(true);

    try {
      let result = "";

      // Using transliteration library for supported languages
      if (sourceLang === "hi" && targetLang === "en") {
        // Hindi to English
        result = tr(text, { from: "hi", to: "en" });
      } else if (sourceLang === "en" && targetLang === "hi") {
        // English to Hindi
        result = tr(text, { from: "en", to: "hi" });
      } else if (sourceLang === "hi" && targetLang === "ur") {
        // Hindi to Urdu
        result = transliterateHiToUr(text);
      } else if (sourceLang === "ur" && targetLang === "hi") {
        // Urdu to Hindi
        result = transliterateUrToHi(text);
      } else if (sourceLang === "ur" && targetLang === "en") {
        // Urdu to English
        result = transliterateUrdu(text);
      } else if (sourceLang === "en" && targetLang === "ur") {
        // English to Urdu
        result = transliterateToUrdu(text);
      } else if (sourceLang === "ar" && targetLang === "en") {
        // Arabic to English
        result = transliterateArabic(text);
      } else if (sourceLang === "en" && targetLang === "ar") {
        // English to Arabic
        result = transliterateToArabic(text);
      } else if (sourceLang === "bn" && targetLang === "en") {
        // Bengali to English
        result = transliterateBengali(text);
      } else if (sourceLang === "te" && targetLang === "en") {
        // Telugu to English
        result = transliterateTelugu(text);
      } else if (sourceLang === "ta" && targetLang === "en") {
        // Tamil to English
        result = transliterateTamil(text);
      } else {
        result = text;
      }

      setTransliteratedText(result);
    } catch (error) {
      console.error("Transliteration error:", error);
      setTransliteratedText(text);
    } finally {
      setIsTransliterating(false);
    }
  }, [text, sourceLang, targetLang]);

  // ==================== CUSTOM TRANSLITERATION FUNCTIONS ====================

  // Hindi to Urdu transliteration
  const transliterateHiToUr = (hiText) => {
    const map = {
      अ: "ا",
      आ: "آ",
      इ: "اِ",
      ई: "اِی",
      उ: "اُ",
      ऊ: "اُو",
      ए: "اے",
      ऐ: "اَے",
      ओ: "او",
      औ: "اَو",
      अं: "اں",
      अः: "اہ",
      क: "ک",
      ख: "کھ",
      ग: "گ",
      घ: "گھ",
      ङ: "ںگ",
      च: "چ",
      छ: "چھ",
      ज: "ج",
      झ: "جھ",
      ञ: "نج",
      ट: "ٹ",
      ठ: "ٹھ",
      ड: "ڈ",
      ढ: "ڈھ",
      ण: "ن",
      त: "ت",
      थ: "تھ",
      द: "د",
      ध: "دھ",
      न: "ن",
      प: "پ",
      फ: "پھ",
      ब: "ب",
      भ: "بھ",
      म: "م",
      य: "ی",
      र: "ر",
      ल: "ل",
      व: "و",
      श: "ش",
      ष: "ش",
      स: "س",
      ह: "ہ",
      क्ष: "کش",
      त्र: "تر",
      ज्ञ: "گیا",
      "ा": "ا",
      "ि": "ِ",
      "ी": "ِی",
      "ु": "ُ",
      "ू": "ُو",
      "े": "ے",
      "ै": "َے",
      "ो": "و",
      "ौ": "َو",
      "ं": "ں",
      "ः": "ہ",
      "़": "",
      "्": "",
    };
    return transliterateWithMap(hiText, map);
  };

  // Urdu to Hindi transliteration
  const transliterateUrToHi = (urText) => {
    const map = {
      ا: "अ",
      آ: "आ",
      ب: "ब",
      پ: "प",
      ت: "त",
      ٹ: "ट",
      ث: "स",
      ج: "ज",
      چ: "च",
      ح: "ह",
      خ: "ख",
      د: "द",
      ڈ: "ड",
      ذ: "ज़",
      ر: "र",
      ڑ: "ड़",
      ز: "ज़",
      ژ: "झ",
      س: "स",
      ش: "श",
      ص: "स",
      ض: "ज़",
      ط: "त",
      ظ: "ज़",
      ع: "अ",
      غ: "ग़",
      ف: "फ",
      ق: "क़",
      ک: "क",
      گ: "ग",
      ل: "ल",
      م: "م",
      ن: "न",
      و: "व",
      ہ: "ह",
      ھ: "ह",
      ی: "य",
      ے: "ए",
      ء: "'",
    };
    return transliterateWithMap(urText, map);
  };

  // Urdu to English transliteration
  const transliterateUrdu = (urduText) => {
    const map = {
      ا: "a",
      آ: "aa",
      ب: "b",
      پ: "p",
      ت: "t",
      ٹ: "t",
      ث: "s",
      ج: "j",
      چ: "ch",
      ح: "h",
      خ: "kh",
      د: "d",
      ڈ: "d",
      ذ: "z",
      ر: "r",
      ڑ: "r",
      ز: "z",
      ژ: "zh",
      س: "s",
      ش: "sh",
      ص: "s",
      ض: "z",
      ط: "t",
      ظ: "z",
      ع: "a",
      غ: "gh",
      ف: "f",
      ق: "q",
      ک: "k",
      گ: "g",
      ل: "l",
      م: "m",
      ن: "n",
      و: "v",
      ہ: "h",
      ھ: "h",
      ی: "y",
      ے: "e",
      ء: "'",
    };
    return transliterateWithMap(urduText, map);
  };

  // English to Urdu transliteration
  const transliterateToUrdu = (englishText) => {
    const map = {
      a: "ا",
      b: "ب",
      p: "پ",
      t: "ت",
      j: "ج",
      ch: "چ",
      h: "ح",
      kh: "خ",
      d: "د",
      z: "ز",
      r: "ر",
      s: "س",
      sh: "ش",
      f: "ف",
      q: "ق",
      k: "ک",
      g: "گ",
      l: "ل",
      m: "م",
      n: "ن",
      v: "و",
      y: "ی",
      e: "ے",
    };
    let result = "";
    let i = 0;
    while (i < englishText.length) {
      const twoChars = englishText.slice(i, i + 2);
      if (map[twoChars]) {
        result += map[twoChars];
        i += 2;
      } else if (map[englishText[i]]) {
        result += map[englishText[i]];
        i++;
      } else {
        result += englishText[i];
        i++;
      }
    }
    return result;
  };

  // Arabic to English transliteration
  const transliterateArabic = (arabicText) => {
    const map = {
      ا: "a",
      ب: "b",
      ت: "t",
      ث: "th",
      ج: "j",
      ح: "h",
      خ: "kh",
      د: "d",
      ذ: "dh",
      ر: "r",
      ز: "z",
      س: "s",
      ش: "sh",
      ص: "s",
      ض: "d",
      ط: "t",
      ظ: "z",
      ع: "a",
      غ: "gh",
      ف: "f",
      ق: "q",
      ك: "k",
      ل: "l",
      م: "m",
      ن: "n",
      ه: "h",
      و: "w",
      ي: "y",
      ء: "'",
    };
    return transliterateWithMap(arabicText, map);
  };

  // English to Arabic transliteration
  const transliterateToArabic = (englishText) => {
    const map = {
      a: "ا",
      b: "ب",
      t: "ت",
      th: "ث",
      j: "ج",
      h: "ح",
      kh: "خ",
      d: "د",
      dh: "ذ",
      r: "ر",
      z: "ز",
      s: "س",
      sh: "ش",
      f: "ف",
      q: "ق",
      k: "ك",
      l: "ل",
      m: "م",
      n: "ن",
      w: "و",
      y: "ي",
    };
    let result = "";
    let i = 0;
    while (i < englishText.length) {
      const twoChars = englishText.slice(i, i + 2);
      if (map[twoChars]) {
        result += map[twoChars];
        i += 2;
      } else if (map[englishText[i]]) {
        result += map[englishText[i]];
        i++;
      } else {
        result += englishText[i];
        i++;
      }
    }
    return result;
  };

  // Bengali to English transliteration
  const transliterateBengali = (bnText) => {
    const map = {
      অ: "a",
      আ: "aa",
      ই: "i",
      ঈ: "ee",
      উ: "u",
      ঊ: "oo",
      এ: "e",
      ঐ: "oi",
      ও: "o",
      ঔ: "ou",
      ক: "k",
      খ: "kh",
      গ: "g",
      ঘ: "gh",
      ঙ: "ng",
      চ: "ch",
      ছ: "chh",
      জ: "j",
      ঝ: "jh",
      ঞ: "n",
      ট: "t",
      ঠ: "th",
      ড: "d",
      ঢ: "dh",
      ণ: "n",
      ত: "t",
      থ: "th",
      দ: "d",
      ধ: "dh",
      ন: "n",
      প: "p",
      ফ: "ph",
      ব: "b",
      ভ: "bh",
      ম: "m",
      য: "y",
      র: "r",
      ল: "l",
      শ: "sh",
      ষ: "sh",
      স: "s",
      হ: "h",
      ড়: "r",
      ঢ়: "rh",
      য়: "y",
    };
    return transliterateWithMap(bnText, map);
  };

  // Telugu to English transliteration
  const transliterateTelugu = (teText) => {
    const map = {
      అ: "a",
      ఆ: "aa",
      ఇ: "i",
      ఈ: "ee",
      ఉ: "u",
      ఊ: "oo",
      ఎ: "e",
      ఏ: "e",
      ఐ: "ai",
      ఒ: "o",
      ఓ: "o",
      ఔ: "au",
      క: "ka",
      ఖ: "kha",
      గ: "ga",
      ఘ: "gha",
      చ: "cha",
      ఛ: "chha",
      జ: "ja",
      ఝ: "jha",
      ట: "ta",
      ఠ: "tha",
      డ: "da",
      ఢ: "dha",
      ణ: "na",
      త: "ta",
      థ: "tha",
      ద: "da",
      ధ: "dha",
      న: "na",
      ప: "pa",
      ఫ: "pha",
      బ: "ba",
      భ: "bha",
      మ: "ma",
      య: "ya",
      ర: "ra",
      ల: "la",
      వ: "va",
      శ: "sha",
      ష: "sha",
      స: "sa",
      హ: "ha",
      క్ష: "ksha",
      జ్ఞ: "gya",
    };
    return transliterateWithMap(teText, map);
  };

  // Tamil to English transliteration
  const transliterateTamil = (taText) => {
    const map = {
      அ: "a",
      ஆ: "aa",
      இ: "i",
      ஈ: "ee",
      உ: "u",
      ஊ: "oo",
      எ: "e",
      ஏ: "e",
      ஐ: "ai",
      ஒ: "o",
      ஓ: "o",
      ஔ: "au",
      க்: "k",
      ங்: "ng",
      ச்: "ch",
      ஞ்: "nj",
      ட்: "t",
      ண்: "n",
      த்: "th",
      ந்: "n",
      ப்: "p",
      ம்: "m",
      ய்: "y",
      ர்: "r",
      ல்: "l",
      வ்: "v",
      ழ்: "zh",
      ள்: "l",
      ற்: "r",
      ன்: "n",
      க: "ka",
      ங: "nga",
      ச: "cha",
      ஞ: "nja",
      ட: "ta",
      ண: "na",
      த: "tha",
      ந: "na",
      ப: "pa",
      ம: "ma",
      ய: "ya",
      ர: "ra",
      ல: "la",
      வ: "va",
      ழ: "zha",
      ள: "la",
      ற: "ra",
      ன: "na",
    };
    return transliterateWithMap(taText, map);
  };

  // Generic transliteration function with map
  const transliterateWithMap = (text, map) => {
    let result = "";
    let i = 0;
    while (i < text.length) {
      const char = text[i];
      const nextChar = text[i + 1] || "";

      // Check for combined characters
      const combined = char + nextChar;
      if (map[combined]) {
        result += map[combined];
        i += 2;
      } else if (map[char]) {
        result += map[char];
        i++;
      } else {
        result += char;
        i++;
      }
    }
    return result;
  };

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

  // Don't show if languages are the same or no text
  if (sourceLang === targetLang || !text) {
    return null;
  }

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
  if (!validPairs.includes(pair)) {
    return null;
  }

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
