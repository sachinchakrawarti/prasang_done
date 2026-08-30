// src/components/poems/romanization.jsx
"use client";

import { useState, useEffect } from "react";
import { FaLanguage, FaCopy, FaCheck } from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

// Import transliteration library
import { transliterate as tr } from "transliteration";

// Import Indic transliteration library for better Devanagari support
// npm install indic-transliteration
// import { Devanagari } from 'indic-transliteration';

const Romanization = ({ text, language, showCopy = true }) => {
  const { themeName } = useTheme();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [romanizedText, setRomanizedText] = useState("");

  useEffect(() => {
    if (!text) return;

    try {
      let result = "";

      if (language === "hi") {
        // Hindi to Roman using transliteration library
        // transliteration library supports Devanagari to Latin
        result = tr(text, { from: "hi", to: "en" });
      } else if (language === "ur") {
        // Urdu to Roman - use a combination of approaches
        result = romanizeUrdu(text);
      } else if (language === "ar") {
        // Arabic to Roman (transliteration)
        result = romanizeArabic(text);
      } else {
        result = text;
      }

      setRomanizedText(result);
    } catch (error) {
      console.error("Romanization error:", error);
      setRomanizedText(text);
    }
  }, [text, language]);

  // Urdu romanization function
  const romanizeUrdu = (urduText) => {
    // Comprehensive Urdu to Roman mapping
    const map = {
      // Alphabet
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
      "،": ",",
      "۔": ".",
      "؟": "?",
      "!": "!",
      // Vowel signs
      "َ": "a",
      "ُ": "u",
      "ِ": "i",
      "ّ": "shaddah",
      "ْ": "sukoon",
      "ً": "an",
      "ٍ": "in",
      "ٌ": "un",
    };

    let result = "";
    for (let i = 0; i < urduText.length; i++) {
      const char = urduText[i];
      const nextChar = urduText[i + 1] || "";

      // Check for combined characters
      const combined = char + nextChar;
      if (map[combined]) {
        result += map[combined];
        i++;
      } else {
        result += map[char] || char;
      }
    }
    return result;
  };

  // Arabic romanization function
  const romanizeArabic = (arabicText) => {
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
      "َ": "a",
      "ُ": "u",
      "ِ": "i",
      "ّ": "shaddah",
      "ْ": "sukoon",
      "ً": "an",
      "ٍ": "in",
      "ٌ": "un",
    };

    let result = "";
    for (let i = 0; i < arabicText.length; i++) {
      const char = arabicText[i];
      result += map[char] || char;
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

  // Only show for non-English languages that need romanization
  const needsRomanization = [
    "hi",
    "ur",
    "ar",
    "bn",
    "te",
    "ta",
    "ml",
    "kn",
    "mr",
    "gu",
    "pa",
  ].includes(language);

  if (!needsRomanization || !text) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(romanizedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const languageNames = {
    hi: "हिन्दी (Hindi)",
    ur: "اردو (Urdu)",
    ar: "العربية (Arabic)",
    bn: "বাংলা (Bengali)",
    te: "తెలుగు (Telugu)",
    ta: "தமிழ் (Tamil)",
    ml: "മലയാളം (Malayalam)",
    kn: "ಕನ್ನಡ (Kannada)",
    mr: "मराठी (Marathi)",
    gu: "ગુજરાતી (Gujarati)",
    pa: "ਪੰਜਾਬੀ (Punjabi)",
  };

  return (
    <div
      className={`p-4 rounded-xl border ${borderColor} bg-gray-50 dark:bg-gray-800/50 transition-all hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FaLanguage className={`text-sm ${textColor}`} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("romanized") || "Romanized"} (
            {languageNames[language] || language.toUpperCase()})
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
            {t("lib") || "lib"}: transliteration
          </span>
        </div>
        {showCopy && (
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${hoverBg} ${textColor} transition-colors`}
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
      <div className="relative">
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {romanizedText || text}
        </p>
      </div>
      <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
        {t("romanizationNote") ||
          "Romanization uses standard transliteration schemes for better readability."}
      </div>
    </div>
  );
};

export default Romanization;
