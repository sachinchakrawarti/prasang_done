// src/components/layout/navbar/navbardesktop/components/AITranslationSelector.jsx
"use client";

import { FaRobot, FaVolumeUp, FaCheck } from "react-icons/fa";
import { useTranslation } from "@/hooks/useTranslation";

const AITranslationSelector = ({
  themeName,
  buttonBg,
  iconColor,
  checkboxColor,
  aiTranslation,
  setAiTranslation,
  audioEnabled,
  setAudioEnabled,
  aiLanguages,
  toggleAiLanguage,
}) => {
  const { t } = useTranslation();

  // Get selected count
  const selectedCount = aiLanguages?.filter((l) => l.enabled).length || 0;
  const maxLanguages = 3;

  return (
    <div className="space-y-4">
      {/* AI Translation Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <div className="flex items-center gap-3">
          <FaRobot className={iconColor} />
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {t("aiAssistant")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("translationAssistant")}
            </p>
          </div>
        </div>
        <button
          onClick={() => setAiTranslation(!aiTranslation)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            aiTranslation ? "bg-amber-500" : "bg-gray-300 dark:bg-gray-600"
          }`}
          aria-label={t("aiAssistant")}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              aiTranslation ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>

      {/* Audio Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <div className="flex items-center gap-3">
          <FaVolumeUp className={iconColor} />
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {t("audioPlayback") || "Audio Playback"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("readPoemsAloud") || "Read poems aloud"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            audioEnabled ? "bg-amber-500" : "bg-gray-300 dark:bg-gray-600"
          }`}
          aria-label={t("audioPlayback") || "Audio Playback"}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              audioEnabled ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>

      {/* AI Language Selection (Max 3) */}
      {aiTranslation && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("selectLanguages") || "Select up to 3 languages"}
            </label>
            <span className="text-xs text-gray-500">
              {selectedCount}/{maxLanguages} {t("selected") || "selected"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {aiLanguages?.map((lang) => {
              const isDisabled = !lang.enabled && selectedCount >= maxLanguages;

              return (
                <button
                  key={lang.code}
                  onClick={() => toggleAiLanguage(lang.code)}
                  disabled={isDisabled}
                  className={`flex items-center gap-2 p-2 rounded-lg text-left transition ${
                    lang.enabled
                      ? `${buttonBg} ${iconColor} font-medium`
                      : isDisabled
                        ? "opacity-40 cursor-not-allowed text-gray-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  aria-label={`${lang.name} ${lang.enabled ? t("selected") || "selected" : ""}`}
                >
                  <span className="flex-1 text-sm truncate">{lang.name}</span>
                  {lang.enabled && (
                    <FaCheck className={checkboxColor} size={12} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selection info */}
          {selectedCount === maxLanguages && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              {t("maxLanguagesReached") || "Maximum 3 languages selected"}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AITranslationSelector;
