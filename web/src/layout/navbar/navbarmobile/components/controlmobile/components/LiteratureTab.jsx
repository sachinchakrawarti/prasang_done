// src/public_app/layout/navbar/navbarmobile/components/tabs/LiteratureTab.jsx
import { useState } from "react";
import { FaLanguage, FaCheck } from "react-icons/fa";
import { useLanguage } from "../../../../../../../context/LanguageContext";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "ur", name: "اردو", flag: "🇵🇰" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳" },
];

const LiteratureTab = ({ themeStyles }) => {
  const { language, setLanguage } = useLanguage();
  const [romanzation, setRomanzation] = useState(false);
  const { iconColor, buttonBg } = themeStyles;

  return (
    <div className="space-y-4">
      {/* Romanzation Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div className="flex items-center gap-3">
          <FaLanguage className={iconColor} />
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              Romanzation
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Convert to Latin
            </p>
          </div>
        </div>
        <button
          onClick={() => setRomanzation(!romanzation)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            romanzation ? "bg-amber-500" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              romanzation ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>

      {/* Language Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Literature Language
        </label>
        <div className="space-y-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-3 w-full p-3 rounded-xl text-left transition ${
                language === lang.code
                  ? `${buttonBg} ${iconColor} font-medium`
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="flex-1">{lang.name}</span>
              {language === lang.code && (
                <FaCheck className={iconColor} size={16} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiteratureTab;
