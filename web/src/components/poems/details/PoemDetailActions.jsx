// src/components/poems/details/PoemDetailActions.jsx
"use client";

import {
  FaHeart,
  FaBookmark,
  FaRegBookmark,
  FaShare,
  FaCopy,
  FaTwitter,
  FaFacebook,
  FaLink,
} from "react-icons/fa";

const PoemDetailActions = ({
  poem,
  liked,
  bookmarked,
  showShare,
  copied,
  onLike,
  onBookmark,
  onShare,
  handleCopyLink,
  textColor,
  hoverBg,
  t,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onLike}
        className={`p-2 rounded-full ${hoverBg} transition-all group`}
        aria-label={t("like") || "Like"}
      >
        <FaHeart
          className={`text-xl transition-all ${
            liked ? "text-red-500 scale-110" : textColor
          } group-hover:scale-110`}
        />
      </button>
      <button
        onClick={onBookmark}
        className={`p-2 rounded-full ${hoverBg} transition-all`}
        aria-label={t("bookmark") || "Bookmark"}
      >
        {bookmarked ? (
          <FaBookmark className={`text-xl ${textColor}`} />
        ) : (
          <FaRegBookmark className="text-xl text-gray-400" />
        )}
      </button>
      <button
        onClick={onShare}
        className={`p-2 rounded-full ${hoverBg} transition-all relative`}
        aria-label={t("share") || "Share"}
      >
        <FaShare className={`text-xl ${textColor}`} />
        {showShare && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaCopy size={14} />
              {copied ? t("copied") || "Copied!" : t("copyLink") || "Copy Link"}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(poem.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaTwitter size={14} className="text-blue-400" />
              Twitter
            </a>
            <a
              href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaFacebook size={14} className="text-blue-600" />
              Facebook
            </a>
          </div>
        )}
      </button>
    </div>
  );
};

export default PoemDetailActions;
