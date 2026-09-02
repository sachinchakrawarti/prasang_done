// src/app/(main)/[lang]/admin-dashboard/components/AdminSidebar.jsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FaHome,
  FaBook,
  FaUsers,
  FaTags,
  FaFolder,
  FaLanguage,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const navItems = [
  { icon: FaHome, label: "Dashboard", href: "/admin-dashboard" },
  { icon: FaBook, label: "Poems", href: "/admin-dashboard/poems" },
  { icon: FaUsers, label: "Poets", href: "/admin-dashboard/poets" },
  { icon: FaTags, label: "Tags", href: "/admin-dashboard/tags" },
  { icon: FaFolder, label: "Categories", href: "/admin-dashboard/categories" },
  {
    icon: FaLanguage,
    label: "Translations",
    href: "/admin-dashboard/translations",
  },
  { icon: FaCog, label: "Settings", href: "/admin-dashboard/settings" },
];

export default function AdminSidebar({
  lang,
  sidebarOpen,
  setSidebarOpen,
  borderColor,
  gradient,
}) {
  const pathname = usePathname();

  const isActive = (href) => {
    const path = `/${lang}${href}`;
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r ${borderColor} z-50 transform transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-white font-bold`}
          >
            P
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Prasang Admin
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Poetry Management
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={`/${lang}${item.href}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? `bg-gradient-to-r ${gradient} text-white`
                    : `hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400`
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={() => console.log("Logout")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all"
          >
            <FaSignOutAlt size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
