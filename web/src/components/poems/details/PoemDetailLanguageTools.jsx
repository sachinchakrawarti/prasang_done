// src/components/poems/details/PoemDetailLanguageTools.jsx
"use client";

import { useState, useEffect } from "react";
import { FaLanguage, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Romanization from "@/components/poems/romanization";
import Transliteration from "@/components/poems/transliteration";
import Translation from "@/components/poems/translation";

const PoemDetailLanguageTools = ({
  poem,
  lang,
  textColor,
  gradient,
  borderColor,
  hoverBg,
  t,
}) => {
  const [showLanguageTools, setShowLanguageTools] = useState(true);
  const [activeTool, setActiveTool] = useState("translation");

  // Check if poem has translations directly in the component
  const hasTranslations =
    poem?.translations && Object.keys(poem.translations).length > 0;
  const isHindiOrUrdu = poem?.language === "hi" || poem?.language === "ur";
  const isEnglishPoem = poem?.language === "en";

  // Determine which tabs to show
  const showRomanization = isHindiOrUrdu;
  const showTransliteration = isHindiOrUrdu;
  const showTranslation = hasTranslations;

  // Check if any tool should be shown
  const shouldShowTools =
    showRomanization || showTransliteration || showTranslation;

  // Set default active tab
  useEffect(() => {
    if (showTranslation) {
      setActiveTool("translation");
    } else if (showRomanization) {
      setActiveTool("romanization");
    } else if (showTransliteration) {
      setActiveTool("transliteration");
    }
  }, [showTranslation, showRomanization, showTransliteration]);

  // Debug logging
  console.log("PoemDetailLanguageTools:", {
    hasTranslations,
    isHindiOrUrdu,
    isEnglishPoem,
    showTranslation,
    showRomanization,
    showTransliteration,
    shouldShowTools,
    translations: poem?.translations,
  });

  if (!shouldShowTools) return null;

  return (
    <div className="mt-8">
      {/* Language Tools Header */}
      <button
        onClick={() => setShowLanguageTools(!showLanguageTools)}
        className={`flex items-center gap-2 w-full p-3 rounded-xl border ${borderColor} ${hoverBg} transition-colors`}
      >
        <FaLanguage className={textColor} />
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {t("languageTools") || "Language Tools"}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
          {showRomanization && `(${t("romanization") || "Romanization"}`}
          {showRomanization && showTransliteration && `, `}
          {showTransliteration &&
            `${t("transliteration") || "Transliteration"}`}
          {(showRomanization || showTransliteration) && showTranslation && `, `}
          {showTranslation && `${t("translation") || "Translation"}`}
          {showTranslation && `)`}
        </span>
        <span className="ml-auto">
          {showLanguageTools ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>

      {showLanguageTools && (
        <div className="mt-4 space-y-4">
          {/* Tool Tabs */}
          {(showRomanization || showTransliteration || showTranslation) && (
            <div className="flex flex-wrap gap-2">
              {showRomanization && (
                <button
                  onClick={() => setActiveTool("romanization")}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    activeTool === "romanization"
                      ? `bg-gradient-to-r ${gradient} text-white`
                      : `${hoverBg} ${textColor} border ${borderColor}`
                  }`}
                >
                  {t("romanization") || "Romanization"}
                </button>
              )}
              {showTransliteration && (
                <button
                  onClick={() => setActiveTool("transliteration")}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    activeTool === "transliteration"
                      ? `bg-gradient-to-r ${gradient} text-white`
                      : `${hoverBg} ${textColor} border ${borderColor}`
                  }`}
                >
                  {t("transliteration") || "Transliteration"}
                </button>
              )}
              {showTranslation && (
                <button
                  onClick={() => setActiveTool("translation")}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    activeTool === "translation"
                      ? `bg-gradient-to-r ${gradient} text-white`
                      : `${hoverBg} ${textColor} border ${borderColor}`
                  }`}
                >
                  {t("translation") || "Translation"}
                </button>
              )}
            </div>
          )}

          {/* Tool Content */}
          <div className="mt-2">
            {/* Romanization - Only for Hindi/Urdu poems */}
            {showRomanization && activeTool === "romanization" && (
              <Romanization text={poem.content} language={poem.language} />
            )}

            {/* Transliteration - Only for Hindi/Urdu poems */}
            {showTransliteration && activeTool === "transliteration" && (
              <Transliteration
                text={poem.content}
                fromLang={poem.language}
                toLang={lang === poem.language ? "en" : lang}
              />
            )}

            {/* Translation - For all poems with translations */}
            {showTranslation && activeTool === "translation" && (
              <Translation
                poem={poem}
                availableLanguages={["hi", "ur", "ar", "en"]}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PoemDetailLanguageTools;
