// src/components/poems/details/PoemDetailRelated.jsx
"use client";

import PoemsCard from "@/components/poems/poemscard";

const PoemDetailRelated = ({ relatedPoems, lang, textColor, t }) => {
  if (relatedPoems.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className={`text-2xl font-bold ${textColor} mb-6`}>
        {t("relatedPoems") || "Related Poems"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPoems.map((relatedPoem) => (
          <PoemsCard
            key={relatedPoem.id}
            poem={relatedPoem}
            lang={lang}
            variant="compact"
            showActions={false}
            showTags={false}
            showExcerpt={false}
          />
        ))}
      </div>
    </div>
  );
};

export default PoemDetailRelated;
