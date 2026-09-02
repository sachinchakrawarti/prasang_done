// src/app/(main)/[lang]/admin-dashboard/components/AdminHeader.jsx
"use client";

import { useState } from "react";
import { FaBars, FaBell, FaUserCircle, FaSearch } from "react-icons/fa";

export default function AdminHeader({
  lang,
  setSidebarOpen,
  borderColor,
  gradient,
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header
      className={`bg-white dark:bg-gray-800 border-b ${borderColor} px-4 py-3 flex items-center justify-between sticky top-0 z-30`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Toggle sidebar"
        >
          <FaBars size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
          <FaSearch className="text-gray-400 mr-2" size={14} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 w-32 lg:w-48"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            aria-label="Notifications"
          >
            <FaBell size={18} className="text-gray-600 dark:text-gray-300" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Notifications
                </p>
              </div>
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                No new notifications
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
