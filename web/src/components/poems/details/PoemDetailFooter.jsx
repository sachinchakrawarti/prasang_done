// src/components/poems/details/PoemDetailFooter.jsx
"use client";

import Link from "next/link";
import { FaHeart, FaEye } from "react-icons/fa";

const PoemDetailFooter = ({ poem, lang, textColor, t }) => {
  return (
    <div
      className={`p-6 sm:p-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <FaHeart className={textColor} size={14} />
            <span>
              {poem.likes} {t("likes") || "likes"}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <FaEye size={14} />
            <span>
              {poem.views} {t("views") || "views"}
            </span>
          </span>
        </div>
        <Link
          href={`/${lang}/poets/${poem.poetSlug}`}
          className={`flex items-center gap-2 text-sm ${textColor} hover:underline`}
        >
          {t("moreByPoet") || "More by this poet"} →
        </Link>
      </div>
    </div>
  );
};

export default PoemDetailFooter;
