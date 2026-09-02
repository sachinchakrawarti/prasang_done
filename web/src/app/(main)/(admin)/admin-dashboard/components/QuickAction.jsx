// src/app/(main)/[lang]/admin-dashboard/components/QuickAction.jsx
"use client";

import Link from "next/link";

export default function QuickAction({
  icon: Icon,
  label,
  href,
  gradient,
  borderColor,
  hoverBg,
  textColor,
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} ${hoverBg} transition-all hover:shadow-md gap-2`}
    >
      <div
        className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-white`}
      >
        <Icon size={16} />
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
        {label}
      </span>
    </Link>
  );
}
