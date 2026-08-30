// src/components/poems/details/PoemDetailHeader.jsx
"use client";

import Link from "next/link";
import { FaUser, FaClock, FaEye, FaStar, FaArrowLeft } from "react-icons/fa";
import PoemDetailActions from "./PoemDetailActions";

const PoemDetailHeader = ({
  poem,
  lang,
  textColor,
  gradient,
  borderColor,
  hoverBg,
  t,
  onLike,
  onBookmark,
  onShare,
  liked,
  bookmarked,
  showShare,
  copied,
  handleCopyLink,
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(
      lang === "en" ? "en-US" : lang === "hi" ? "hi-IN" : "ur-PK",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  return (
    <>
      {/* Back Button */}
      <Link
        href={`/${lang}/poems`}
        className={`inline-flex items-center gap-2 ${textColor} hover:underline mb-6 group`}
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        {t("backToPoems") || "Back to Poems"}
      </Link>

      {/* Header */}
      <div
        className={`p-6 sm:p-8 border-b ${borderColor} bg-gradient-to-r ${gradient} bg-opacity-5`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span
                className={`px-3 py-1 text-xs rounded-full ${hoverBg} ${textColor}`}
              >
                {poem.type}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {poem.language.toUpperCase()}
              </span>
              {poem.featured && (
                <span
                  className={`px-3 py-1 text-xs font-medium text-white bg-gradient-to-r ${gradient} rounded-full`}
                >
                  <FaStar className="inline mr-1" size={10} />
                  {t("featured") || "Featured"}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {poem.title}
            </h1>

            {/* Poet */}
            <Link
              href={`/${lang}/poets/${poem.poetSlug}`}
              className={`inline-flex items-center gap-2 mt-2 ${textColor} hover:underline`}
            >
              <FaUser size={14} />
              <span className="font-medium">{poem.poet}</span>
            </Link>

            {/* Date and Stats */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <FaClock size={14} />
                {formatDate(poem.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <FaEye size={14} />
                {poem.views} {t("views") || "views"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <PoemDetailActions
            poem={poem}
            liked={liked}
            bookmarked={bookmarked}
            showShare={showShare}
            copied={copied}
            onLike={onLike}
            onBookmark={onBookmark}
            onShare={onShare}
            handleCopyLink={handleCopyLink}
            textColor={textColor}
            hoverBg={hoverBg}
            t={t}
          />
        </div>
      </div>
    </>
  );
};

export default PoemDetailHeader;
