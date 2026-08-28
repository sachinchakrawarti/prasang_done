// src/public_app/layout/navbar/navbarmobile/components/AITab.jsx
import { FaRobot, FaVolumeUp, FaCheck } from "react-icons/fa";
import { useAiLangSelector } from "../../../../../../../context/AiLangSelectorContext";

const AITab = ({ themeStyles }) => {
  const {
    aiLanguages,
    aiTranslationEnabled,
    audioEnabled,
    toggleAiTranslation,
    toggleAudio,
    toggleLanguage,
    enabledLanguagesCount,
  } = useAiLangSelector();

  const {
    iconColor,
    buttonBg,
    checkboxColor,
    toggleActiveBg,
    toggleInactiveBg,
  } = themeStyles;

  return (
    <div className="space-y-4">
      {/* AI Translation Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="flex items-center gap-3">
          <FaRobot className={iconColor} />
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              AI Translation
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enable real-time translation
            </p>
          </div>
        </div>
        <button
          onClick={toggleAiTranslation}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            aiTranslationEnabled ? toggleActiveBg : toggleInactiveBg
          }`}
          aria-label="Toggle AI translation"
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              aiTranslationEnabled ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>

      {/* Audio Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="flex items-center gap-3">
          <FaVolumeUp className={iconColor} />
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              Audio Playback
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Read poems aloud
            </p>
          </div>
        </div>
        <button
          onClick={toggleAudio}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            audioEnabled ? toggleActiveBg : toggleInactiveBg
          }`}
          aria-label="Toggle audio playback"
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              audioEnabled ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>

      {/* AI Language Selection (Max 3) */}
      {aiTranslationEnabled && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Select up to 3 languages
            </label>
            <span className="text-xs text-gray-500">
              {enabledLanguagesCount}/3 selected
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {aiLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                disabled={!lang.enabled && enabledLanguagesCount >= 3}
                className={`flex items-center gap-2 p-2 rounded-lg text-left transition ${
                  lang.enabled
                    ? `${buttonBg} ${iconColor} font-medium`
                    : enabledLanguagesCount >= 3
                      ? "opacity-40 cursor-not-allowed text-gray-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className="flex-1 text-sm truncate">{lang.name}</span>
                {lang.enabled && (
                  <FaCheck className={checkboxColor} size={12} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help text when no languages selected */}
      {aiTranslationEnabled && enabledLanguagesCount === 0 && (
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <p className="text-xs text-amber-800 dark:text-amber-300">
            💡 Select up to 3 languages above to enable AI translations for
            those languages.
          </p>
        </div>
      )}
    </div>
  );
};

export default AITab;
