// src/app/(main)/[lang]/admin-dashboard/components/StatsCard.jsx
"use client";

import Link from "next/link";

export default function StatsCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
  gradient,
  borderColor,
  hoverBg,
  href,
}) {
  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  const card = (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorMap[color] || gradient} flex items-center justify-center text-white`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }

  return card;
}
