// src/app/(main)/(admin)/admin-dashboard/settings/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaSave,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCog,
  FaPalette,
  FaGlobe,
  FaLanguage,
  FaUsers,
  FaBook,
  FaTags,
  FaFolder,
  FaDatabase,
  FaCloudUploadAlt,
  FaShieldAlt,
  FaUserCog,
  FaBell,
  FaEnvelope,
  FaLock,
  FaKey,
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

export default function SettingsPage() {
  const router = useRouter();
  const { themeName, setThemeName } = useTheme();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    appearance: true,
    content: true,
    users: true,
    integrations: true,
    security: true,
  });

  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Prasang Poetry",
    siteDescription: "A platform for sharing and discovering poetry",
    siteLanguage: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    // Appearance
    theme: "default",
    primaryColor: "#f59e0b",
    fontFamily: "Inter",
    darkMode: false,
    // Content
    defaultPoemStatus: "draft",
    enableComments: true,
    moderationEnabled: true,
    allowGuestViews: true,
    autoTagging: false,
    // Users
    allowRegistration: true,
    registrationRole: "contributor",
    requireEmailVerification: true,
    maxUsers: 100,
    // Integrations
    enableSocialLogin: false,
    enableAI: true,
    enableAnalytics: false,
    googleAnalyticsId: "",
    // Security
    requireStrongPassword: true,
    sessionTimeout: 60,
    twoFactorAuth: false,
    rateLimitEnabled: true,
    // Email
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "admin@prasang.com",
  });

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle setting change
  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Handle save settings
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In production, you would save to your backend
      // await saveSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError(err.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  // Theme styles
  const getTextColor = () => {
    switch (themeName) {
      case "forest":
        return "text-green-600 dark:text-green-400";
      case "lavender":
        return "text-purple-600 dark:text-purple-400";
      case "rose":
        return "text-rose-600 dark:text-rose-400";
      case "sepia":
        return "text-amber-600 dark:text-amber-400";
      default:
        return "text-amber-600 dark:text-amber-400";
    }
  };

  const getGradient = () => {
    switch (themeName) {
      case "forest":
        return "from-green-600 to-emerald-500";
      case "lavender":
        return "from-purple-600 to-pink-500";
      case "rose":
        return "from-rose-600 to-pink-500";
      case "sepia":
        return "from-amber-700 to-yellow-600";
      default:
        return "from-amber-600 to-yellow-500";
    }
  };

  const getBorderColor = () => {
    switch (themeName) {
      case "forest":
        return "border-green-200 dark:border-green-800";
      case "lavender":
        return "border-purple-200 dark:border-purple-800";
      case "rose":
        return "border-rose-200 dark:border-rose-800";
      case "sepia":
        return "border-amber-200 dark:border-amber-800";
      default:
        return "border-amber-200 dark:border-amber-800";
    }
  };

  const getHoverBg = () => {
    switch (themeName) {
      case "forest":
        return "hover:bg-green-50 dark:hover:bg-green-900/20";
      case "lavender":
        return "hover:bg-purple-50 dark:hover:bg-purple-900/20";
      case "rose":
        return "hover:bg-rose-50 dark:hover:bg-rose-900/20";
      case "sepia":
        return "hover:bg-amber-50 dark:hover:bg-amber-900/20";
      default:
        return "hover:bg-amber-50 dark:hover:bg-amber-900/20";
    }
  };

  const textColor = getTextColor();
  const gradient = getGradient();
  const borderColor = getBorderColor();
  const hoverBg = getHoverBg();

  // Tab navigation
  const tabs = [
    { id: "general", label: "General", icon: FaCog },
    { id: "appearance", label: "Appearance", icon: FaPalette },
    { id: "content", label: "Content", icon: FaBook },
    { id: "users", label: "Users", icon: FaUsers },
    { id: "integrations", label: "Integrations", icon: FaDatabase },
    { id: "security", label: "Security", icon: FaShieldAlt },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your platform settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-6 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg font-medium hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50`}
        >
          {isSaving ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaSave size={14} />
          )}
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
          <FaCheckCircle className="text-green-500 text-xl" />
          <p className="text-green-700 dark:text-green-300">
            Settings saved successfully!
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
          <FaExclamationTriangle className="text-red-500 text-xl" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className={`border-b ${borderColor} mb-6 overflow-x-auto`}>
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-t-lg transition flex items-center gap-2 ${
                  isActive
                    ? `bg-gradient-to-r ${gradient} text-white`
                    : `${hoverBg} text-gray-600 dark:text-gray-400`
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {/* General Settings */}
        {activeTab === "general" && (
          <SettingSection
            title="General Settings"
            icon={FaCog}
            isExpanded={expandedSections.general}
            onToggle={() => toggleSection("general")}
            borderColor={borderColor}
            hoverBg={hoverBg}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Description
                </label>
                <input
                  type="text"
                  value={settings.siteDescription}
                  onChange={(e) =>
                    handleChange("siteDescription", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Language
                </label>
                <select
                  value={settings.siteLanguage}
                  onChange={(e) => handleChange("siteLanguage", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ur">Urdu</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleChange("timezone", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Asia/Kolkata">India Standard Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleChange("dateFormat", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </SettingSection>
        )}

        {/* Appearance Settings */}
        {activeTab === "appearance" && (
          <SettingSection
            title="Appearance"
            icon={FaPalette}
            isExpanded={expandedSections.appearance}
            onToggle={() => toggleSection("appearance")}
            borderColor={borderColor}
            hoverBg={hoverBg}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["default", "forest", "lavender", "rose", "sepia"].map(
                    (theme) => (
                      <button
                        key={theme}
                        onClick={() => handleChange("theme", theme)}
                        className={`px-4 py-2 rounded-lg border transition capitalize ${
                          settings.theme === theme
                            ? `border-amber-500 bg-amber-50 dark:bg-amber-900/20`
                            : `border-gray-300 dark:border-gray-600 ${hoverBg}`
                        }`}
                      >
                        {theme}
                      </button>
                    ),
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Color
                </label>
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => handleChange("fontFamily", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => handleChange("darkMode", e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Dark Mode by Default
                  </span>
                </label>
              </div>
            </div>
          </SettingSection>
        )}

        {/* Content Settings */}
        {activeTab === "content" && (
          <SettingSection
            title="Content Settings"
            icon={FaBook}
            isExpanded={expandedSections.content}
            onToggle={() => toggleSection("content")}
            borderColor={borderColor}
            hoverBg={hoverBg}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Poem Status
                </label>
                <select
                  value={settings.defaultPoemStatus}
                  onChange={(e) =>
                    handleChange("defaultPoemStatus", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableComments}
                    onChange={(e) =>
                      handleChange("enableComments", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Comments
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.moderationEnabled}
                    onChange={(e) =>
                      handleChange("moderationEnabled", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Content Moderation
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowGuestViews}
                    onChange={(e) =>
                      handleChange("allowGuestViews", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Allow Guest Views
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoTagging}
                    onChange={(e) =>
                      handleChange("autoTagging", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto-tagging (AI Powered)
                  </span>
                </label>
              </div>
            </div>
          </SettingSection>
        )}

        {/* Users Settings */}
        {activeTab === "users" && (
          <SettingSection
            title="User Settings"
            icon={FaUsers}
            isExpanded={expandedSections.users}
            onToggle={() => toggleSection("users")}
            borderColor={borderColor}
            hoverBg={hoverBg}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowRegistration}
                    onChange={(e) =>
                      handleChange("allowRegistration", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Allow User Registration
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireEmailVerification}
                    onChange={(e) =>
                      handleChange("requireEmailVerification", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Require Email Verification
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default User Role
                </label>
                <select
                  value={settings.registrationRole}
                  onChange={(e) =>
                    handleChange("registrationRole", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                >
                  <option value="admin">Admin</option>
                  <option value="contributor">Contributor</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Users
                </label>
                <input
                  type="number"
                  value={settings.maxUsers}
                  onChange={(e) =>
                    handleChange("maxUsers", parseInt(e.target.value) || 0)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">0 = unlimited</p>
              </div>
            </div>
          </SettingSection>
        )}

        {/* Integrations Settings */}
        {activeTab === "integrations" && (
          <SettingSection
            title="Integrations"
            icon={FaDatabase}
            isExpanded={expandedSections.integrations}
            onToggle={() => toggleSection("integrations")}
            borderColor={borderColor}
            hoverBg={hoverBg}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableAI}
                      onChange={(e) =>
                        handleChange("enableAI", e.target.checked)
                      }
                      className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable AI Features
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableAnalytics}
                      onChange={(e) =>
                        handleChange("enableAnalytics", e.target.checked)
                      }
                      className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Google Analytics
                    </span>
                  </label>
                </div>
              </div>
              {settings.enableAnalytics && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    value={settings.googleAnalyticsId}
                    onChange={(e) =>
                      handleChange("googleAnalyticsId", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
              )}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableSocialLogin}
                    onChange={(e) =>
                      handleChange("enableSocialLogin", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Social Login (Google, Facebook, Twitter)
                  </span>
                </label>
              </div>
            </div>
          </SettingSection>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <SettingSection
            title="Security Settings"
            icon={FaShieldAlt}
            isExpanded={expandedSections.security}
            onToggle={() => toggleSection("security")}
            borderColor={borderColor}
            hoverBg={hoverBg}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireStrongPassword}
                    onChange={(e) =>
                      handleChange("requireStrongPassword", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Require Strong Passwords
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) =>
                      handleChange("twoFactorAuth", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Two-Factor Authentication
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.rateLimitEnabled}
                    onChange={(e) =>
                      handleChange("rateLimitEnabled", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Rate Limiting
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    handleChange(
                      "sessionTimeout",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">0 = no timeout</p>
              </div>
            </div>
          </SettingSection>
        )}
      </div>
    </div>
  );
}

// Setting Section Component
function SettingSection({
  title,
  icon: Icon,
  children,
  isExpanded,
  onToggle,
  borderColor,
  hoverBg,
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl border ${borderColor} overflow-hidden`}
    >
      <button
        onClick={onToggle}
        className={`w-full px-6 py-4 flex items-center justify-between ${hoverBg} transition`}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        {isExpanded ? (
          <FaChevronUp size={16} className="text-gray-400" />
        ) : (
          <FaChevronDown size={16} className="text-gray-400" />
        )}
      </button>
      {isExpanded && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}
