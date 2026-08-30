// src/components/poems/details/PoemDetailContent.jsx
"use client";

import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

const PoemDetailContent = ({
  poem,
  lang,
  textColor,
  borderColor,
  hoverBg,
  t,
}) => {
  // Get poem content based on language
  const getPoemContent = () => {
    if (!poem) return "";
    if (
      lang !== poem.language &&
      poem.translations &&
      poem.translations[lang]
    ) {
      return poem.translations[lang].content;
    }
    return poem.content;
  };

  const getPoemTitle = () => {
    if (!poem) return "";
    if (
      lang !== poem.language &&
      poem.translations &&
      poem.translations[lang]
    ) {
      return poem.translations[lang].title;
    }
    return poem.title;
  };

  return (
    <div className="p-6 sm:p-8">
      <div className={`relative`}>
        <FaQuoteLeft
          className={`absolute -top-2 -left-2 text-4xl ${textColor} opacity-10`}
        />
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
          {getPoemContent()}
        </div>
        <FaQuoteRight
          className={`absolute -bottom-2 -right-2 text-4xl ${textColor} opacity-10`}
        />
      </div>

      {/* Tags */}
      {poem.tags && poem.tags.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            {t("tags") || "Tags"}
          </h4>
          <div className="flex flex-wrap gap-2">
            {poem.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-3 py-1 text-xs rounded-full ${hoverBg} ${textColor}`}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PoemDetailContent;
