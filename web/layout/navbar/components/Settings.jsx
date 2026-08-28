// src/public_app/layout/navbar/components/Settings.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaLanguage,
  FaGlobe,
  FaBookOpen,
  FaPalette,
  FaFont,
  FaAlignLeft,
  FaCheck,
  FaSave,
  FaUndo,
  FaInfoCircle,
  FaEye,
  FaVolumeUp,
  FaKeyboard,
  FaHistory,
  FaDownload,
  FaShareAlt,
  FaBookmark,
  FaHeart,
  FaStar,
  FaBell,
  FaEnvelope,
  FaLock,
  FaUserCircle,
  FaCog,
  FaTimes,
} from "react-icons/fa";
import { useTheme } from "../../../../theme";

const Settings = () => {
  const { theme, themeName } = useTheme();
  const [settings, setSettings] = useState({
    // Language Settings
    literatureLang: "urdu",
    translationLang: "english",
    secondaryTranslation: "none",
    showOriginal: true,
    showTransliteration: true,

    // Display Settings
    theme: "light",
    fontSize: "medium",
    fontFamily: "serif",
    textAlign: "justify",
    lineHeight: "normal",

    // Reading Preferences
    autoScroll: false,
    autoScrollSpeed: "medium",
    nightMode: false,
    sepiaMode: false,

    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    newsletterSubscribed: true,

    // Privacy Settings
    profileVisibility: "public",
    showReadingHistory: true,
    allowComments: true,

    // Download Settings
    downloadQuality: "standard",
    autoDownload: false,

    // Accessibility
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
  });

  const [activeTab, setActiveTab] = useState("language");
  const [saveMessage, setSaveMessage] = useState("");

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("prasang-settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem("prasang-settings", JSON.stringify(settings));
    setSaveMessage("Settings saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);

    // Apply settings to document
    applySettings();
  };

  const resetSettings = () => {
    const defaultSettings = {
      literatureLang: "urdu",
      translationLang: "english",
      secondaryTranslation: "none",
      showOriginal: true,
      showTransliteration: true,
      theme: "light",
      fontSize: "medium",
      fontFamily: "serif",
      textAlign: "justify",
      lineHeight: "normal",
      autoScroll: false,
      autoScrollSpeed: "medium",
      nightMode: false,
      sepiaMode: false,
      emailNotifications: true,
      pushNotifications: false,
      newsletterSubscribed: true,
      profileVisibility: "public",
      showReadingHistory: true,
      allowComments: true,
      downloadQuality: "standard",
      autoDownload: false,
      highContrast: false,
      reduceMotion: false,
      screenReader: false,
    };
    setSettings(defaultSettings);
    localStorage.setItem("prasang-settings", JSON.stringify(defaultSettings));
    applySettings();
    setSaveMessage("Settings reset to default");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const applySettings = () => {
    // Apply theme
    document.documentElement.setAttribute("data-theme", settings.theme);

    // Apply font size
    const fontSizeMap = {
      small: "14px",
      medium: "16px",
      large: "18px",
      xlarge: "20px",
    };
    document.documentElement.style.fontSize = fontSizeMap[settings.fontSize];

    // Apply font family
    document.documentElement.classList.remove(
      "font-serif",
      "font-sans",
      "font-mono",
    );
    document.documentElement.classList.add(settings.fontFamily);

    // Apply high contrast
    if (settings.highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }

    // Apply reduce motion
    if (settings.reduceMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Theme-based helper functions
  const getAccentGradient = () => {
    switch(themeName) {
      case 'forest': return 'from-green-600 to-emerald-600';
      case 'lavender': return 'from-purple-600 to-pink-600';
      case 'rose': return 'from-rose-600 to-pink-600';
      case 'sepia': return 'from-amber-600 to-yellow-700';
      default: return 'from-amber-500 to-yellow-500';
    }
  };

  const getActiveTabClass = (isActive) => {
    const baseClass = `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1`;
    if (isActive) {
      return `${baseClass} bg-gradient-to-r ${getAccentGradient()} text-white shadow-lg`;
    }
    return `${baseClass} ${theme.text.secondary} ${theme.background.cardHover}`;
  };

  const getBorderClass = () => {
    switch(themeName) {
      case 'forest': return 'border-green-200 dark:border-green-800';
      case 'lavender': return 'border-purple-200 dark:border-purple-800';
      case 'rose': return 'border-rose-200 dark:border-rose-800';
      case 'sepia': return 'border-amber-300 dark:border-amber-700';
      default: return 'border-amber-200 dark:border-amber-800';
    }
  };

  const getButtonClass = (isSelected) => {
    if (isSelected) {
      return `flex items-center gap-3 p-4 rounded-xl border-2 ${getBorderClass()} ${theme.background.secondary}`;
    }
    return `flex items-center gap-3 p-4 rounded-xl border-2 ${theme.border.default} ${theme.background.cardHover}`;
  };

  const tabs = [
    { id: "language", label: "Language", icon: FaLanguage },
    { id: "display", label: "Display", icon: FaEye },
    { id: "reading", label: "Reading", icon: FaBookOpen },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "privacy", label: "Privacy", icon: FaLock },
    { id: "downloads", label: "Downloads", icon: FaDownload },
    { id: "accessibility", label: "Accessibility", icon: FaInfoCircle },
    { id: "account", label: "Account", icon: FaUserCircle },
  ];

  const literatureLanguages = [
    {
      code: "urdu",
      name: "اردو",
      flag: "🇵🇰",
      native: "Urdu",
      speakers: "230M",
    },
    {
      code: "hindi",
      name: "हिन्दी",
      flag: "🇮🇳",
      native: "Hindi",
      speakers: "600M",
    },
    {
      code: "persian",
      name: "فارسی",
      flag: "🇮🇷",
      native: "Persian",
      speakers: "110M",
    },
    {
      code: "english",
      name: "English",
      flag: "🇬🇧",
      native: "English",
      speakers: "1.5B",
    },
    {
      code: "french",
      name: "Français",
      flag: "🇫🇷",
      native: "French",
      speakers: "300M",
    },
    {
      code: "arabic",
      name: "العربية",
      flag: "🇸🇦",
      native: "Arabic",
      speakers: "420M",
    },
    {
      code: "spanish",
      name: "Español",
      flag: "🇪🇸",
      native: "Spanish",
      speakers: "580M",
    },
    {
      code: "german",
      name: "Deutsch",
      flag: "🇩🇪",
      native: "German",
      speakers: "130M",
    },
  ];

  const translationLanguages = [
    { code: "english", name: "English", flag: "🇬🇧" },
    { code: "hindi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "urdu", name: "اردو", flag: "🇵🇰" },
    { code: "persian", name: "فارسی", flag: "🇮🇷" },
    { code: "french", name: "Français", flag: "🇫🇷" },
    { code: "arabic", name: "العربية", flag: "🇸🇦" },
    { code: "spanish", name: "Español", flag: "🇪🇸" },
    { code: "german", name: "Deutsch", flag: "🇩🇪" },
    { code: "chinese", name: "中文", flag: "🇨🇳" },
    { code: "russian", name: "Русский", flag: "🇷🇺" },
    { code: "japanese", name: "日本語", flag: "🇯🇵" },
    { code: "korean", name: "한국어", flag: "🇰🇷" },
  ];

  const themes = [
    {
      id: "light",
      name: "Light",
      icon: "☀️",
      gradient: "from-amber-50 to-white",
      desc: "Bright and clean",
    },
    {
      id: "sepia",
      name: "Sepia",
      icon: "📜",
      gradient: "from-amber-100 to-amber-50",
      desc: "Warm vintage feel",
    },
    {
      id: "forest",
      name: "Forest",
      icon: "🌲",
      gradient: "from-green-50 to-emerald-100",
      desc: "Calm and natural",
    },
    {
      id: "ocean",
      name: "Ocean",
      icon: "🌊",
      gradient: "from-blue-50 to-cyan-100",
      desc: "Cool and serene",
    },
    {
      id: "sunset",
      name: "Sunset",
      icon: "🌅",
      gradient: "from-orange-50 to-rose-100",
      desc: "Warm and romantic",
    },
    {
      id: "lavender",
      name: "Lavender",
      icon: "🌸",
      gradient: "from-purple-50 to-pink-100",
      desc: "Soft and elegant",
    },
    {
      id: "midnight",
      name: "Midnight",
      icon: "🌙",
      gradient: "from-gray-900 to-gray-800",
      desc: "Dark mode",
    },
    {
      id: "coffee",
      name: "Coffee",
      icon: "☕",
      gradient: "from-amber-800 to-amber-700",
      desc: "Rich and warm",
    },
  ];

  const fontSizes = [
    { id: "small", name: "Small", value: "14px", preview: "Aa" },
    { id: "medium", name: "Medium", value: "16px", preview: "Aa" },
    { id: "large", name: "Large", value: "18px", preview: "Aa" },
    { id: "xlarge", name: "Extra Large", value: "20px", preview: "Aa" },
  ];

  const fontFamilies = [
    {
      id: "serif",
      name: "Serif",
      value: "font-serif",
      sample: "Aa",
      desc: "Traditional",
    },
    {
      id: "sans",
      name: "Sans Serif",
      value: "font-sans",
      sample: "Aa",
      desc: "Modern",
    },
    {
      id: "mono",
      name: "Monospace",
      value: "font-mono",
      sample: "Aa",
      desc: "Code style",
    },
    {
      id: "handwriting",
      name: "Handwriting",
      value: "font-handwriting",
      sample: "Aa",
      desc: "Personal",
    },
  ];

  const textAlignments = [
    { id: "left", name: "Left", icon: "⬅️", desc: "Aligned to left" },
    { id: "center", name: "Center", icon: "⬆️", desc: "Centered" },
    { id: "right", name: "Right", icon: "➡️", desc: "Aligned to right" },
    { id: "justify", name: "Justify", icon: "⚖️", desc: "Even spacing" },
  ];

  const lineHeights = [
    { id: "compact", name: "Compact", value: "1.2" },
    { id: "normal", name: "Normal", value: "1.5" },
    { id: "relaxed", name: "Relaxed", value: "1.8" },
    { id: "double", name: "Double", value: "2.0" },
  ];

  const downloadQualities = [
    { id: "standard", name: "Standard", size: "~2MB" },
    { id: "high", name: "High Quality", size: "~5MB" },
    { id: "premium", name: "Premium", size: "~10MB" },
  ];

  const accentGradient = getAccentGradient();
  const borderClass = getBorderClass();

  return (
    <div className={`min-h-screen ${theme.background.gradient}`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${accentGradient} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={`p-2 hover:bg-white/20 rounded-full transition`}
            >
              <FaArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-white/80 text-sm">
                Customize your reading experience
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-64 space-y-2">
            <div className={`${theme.background.card} rounded-2xl shadow-lg p-4 sticky top-24 border ${theme.border.card}`}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={getActiveTabClass(isActive)}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className={`${theme.background.card} rounded-3xl shadow-xl p-6 lg:p-8 border ${theme.border.card}`}>
              {/* Save Message */}
              {saveMessage && (
                <div className={`mb-6 ${theme.background.secondary} border ${theme.border.accent} ${theme.text.success} px-4 py-3 rounded-lg flex items-center gap-2`}>
                  <FaCheck className={theme.icon.success} />
                  {saveMessage}
                </div>
              )}

              {/* Language Settings */}
              {activeTab === "language" && (
                <div className="space-y-8">
                  <h2 className={`text-2xl font-bold ${theme.text.primary} flex items-center gap-2`}>
                    <FaLanguage className={theme.icon.primary} /> Language Settings
                  </h2>

                  {/* Literature Language */}
                  <div>
                    <label className={`block text-sm font-medium ${theme.text.secondary} mb-3`}>
                      Primary Literature Language
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {literatureLanguages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() =>
                            updateSetting("literatureLang", lang.code)
                          }
                          className={getButtonClass(settings.literatureLang === lang.code)}
                        >
                          <span className="text-3xl">{lang.flag}</span>
                          <div className="flex-1 text-left">
                            <div className={`font-semibold ${theme.text.primary}`}>
                              {lang.name}
                            </div>
                            <div className={`text-sm ${theme.text.tertiary}`}>
                              {lang.native} · {lang.speakers} speakers
                            </div>
                          </div>
                          {settings.literatureLang === lang.code && (
                            <FaCheck className={theme.icon.primary} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Translation Language */}
                  <div>
                    <label className={`block text-sm font-medium ${theme.text.secondary} mb-3`}>
                      Primary Translation Language
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {translationLanguages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() =>
                            updateSetting("translationLang", lang.code)
                          }
                          className={getButtonClass(settings.translationLang === lang.code)}
                        >
                          <span className="text-2xl">{lang.flag}</span>
                          <span className={`font-medium ${theme.text.primary}`}>
                            {lang.name}
                          </span>
                          {settings.translationLang === lang.code && (
                            <FaCheck className={`${theme.icon.primary} ml-auto`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Secondary Translation */}
                  <div>
                    <label className={`block text-sm font-medium ${theme.text.secondary} mb-3`}>
                      Secondary Translation (Optional)
                    </label>
                    <select
                      value={settings.secondaryTranslation}
                      onChange={(e) =>
                        updateSetting("secondaryTranslation", e.target.value)
                      }
                      className={`w-full p-3 ${theme.input.default} rounded-xl focus:outline-none focus:ring-2 ${theme.ring.focus}`}
                    >
                      <option value="none">None</option>
                      {translationLanguages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Language Display Options */}
                  <div className="space-y-3">
                    <label className={`flex items-center justify-between p-4 ${theme.background.secondary} rounded-xl border ${theme.border.light}`}>
                      <div>
                        <span className={`font-medium ${theme.text.primary}`}>
                          Show Original Text
                        </span>
                        <p className={`text-sm ${theme.text.tertiary}`}>
                          Display the original language alongside translation
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.showOriginal}
                        onChange={(e) =>
                          updateSetting("showOriginal", e.target.checked)
                        }
                        className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                      />
                    </label>

                    <label className={`flex items-center justify-between p-4 ${theme.background.secondary} rounded-xl border ${theme.border.light}`}>
                      <div>
                        <span className={`font-medium ${theme.text.primary}`}>
                          Show Transliteration
                        </span>
                        <p className={`text-sm ${theme.text.tertiary}`}>
                          Display pronunciation guide
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.showTransliteration}
                        onChange={(e) =>
                          updateSetting("showTransliteration", e.target.checked)
                        }
                        className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Display Settings */}
              {activeTab === "display" && (
                <div className="space-y-8">
                  <h2 className={`text-2xl font-bold ${theme.text.primary} flex items-center gap-2`}>
                    <FaEye className={theme.icon.primary} /> Display Settings
                  </h2>

                  {/* Theme Selection */}
                  <div>
                    <label className={`block text-sm font-medium ${theme.text.secondary} mb-3`}>
                      Color Theme
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {themes.map((themeOption) => (
                        <button
                          key={themeOption.id}
                          onClick={() => updateSetting("theme", themeOption.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            settings.theme === themeOption.id
                              ? `border-${themeOption.accent || 'amber-500'} ${theme.background.secondary}`
                              : `${theme.border.default} ${theme.background.cardHover}`
                          }`}
                        >
                          <div
                            className={`h-12 rounded-lg bg-gradient-to-r ${themeOption.gradient} mb-2`}
                          />
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${theme.text.primary}`}>
                              {themeOption.name}
                            </span>
                            {settings.theme === themeOption.id && (
                              <FaCheck className={theme.icon.primary} size={12} />
                            )}
                          </div>
                          <span className={`text-xs ${theme.text.tertiary}`}>
                            {themeOption.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className={`block text-sm font-medium ${theme.text.secondary} mb-3`}>
                      Font Size
                    </label>
                    <div className="flex gap-3">
                      {fontSizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => updateSetting("fontSize", size.id)}
                          className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
                            settings.fontSize === size.id
                              ? `border-amber-500 ${theme.background.secondary}`
                              : `${theme.border.default} ${theme.background.cardHover}`
                          }`}
                        >
                          <div className={`text-2xl mb-1 ${theme.text.primary}`}>{size.preview}</div>
                          <div className={`font-medium ${theme.text.primary}`}>
                            {size.name}
                          </div>
                          <div className={`text-xs ${theme.text.tertiary}`}>
                            {size.value}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Family */}
                  <div>
                    <label className={`block text-sm font-medium ${theme.text.secondary} mb-3`}>
                      Font Family
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {fontFamilies.map((font) => (
                        <button
                          key={font.id}
                          onClick={() => updateSetting("fontFamily", font.id)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            settings.fontFamily === font.id
                              ? `border-amber-500 ${theme.background.secondary}`
                              : `${theme.border.default} ${theme.background.cardHover}`
                          }`}
                        >
                          <div className={`${font.value} text-3xl mb-1 ${theme.text.primary}`}>
                            {font.sample}
                          </div>
                          <div className={`font-medium ${theme.text.primary}`}>
                            {font.name}
                          </div>
                          <div className={`text-xs ${theme.text.tertiary}`}>
                            {font.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Alignment */}
                  <div>
                    <label className={`block text-sm font-medium ${theme.text.secondary} mb-3`}>
                      Text Alignment
                    </label>
                    <div className="flex gap-3">
                      {textAlignments.map((align) => (
                        <button
                          key={align.id}
                          onClick={() => updateSetting("textAlign", align.id)}
                          className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
                            settings.textAlign === align.id
                              ? `border-amber-500 ${theme.background.secondary}`
                              : `${theme.border.default} ${theme.background.cardHover}`
                          }`}
                        >
                          <div className="text-2xl mb-1">{align.icon}</div>
                          <div className={`font-medium ${theme.text.primary}`}>
                            {align.name}
                          </div>
                          <div className={`text-xs ${theme.text.tertiary}`}>
                            {align.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Line Height */}
                  <div>
                    <label className={`block text-sm font-medium ${theme.text.secondary} mb-3`}>
                      Line Height
                    </label>
                    <div className="flex gap-3">
                      {lineHeights.map((height) => (
                        <button
                          key={height.id}
                          onClick={() => updateSetting("lineHeight", height.id)}
                          className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
                            settings.lineHeight === height.id
                              ? `border-amber-500 ${theme.background.secondary}`
                              : `${theme.border.default} ${theme.background.cardHover}`
                          }`}
                        >
                          <div className={`font-medium ${theme.text.primary}`}>
                            {height.name}
                          </div>
                          <div className={`text-xs ${theme.text.tertiary}`}>
                            Line height {height.value}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Reading Settings */}
              {activeTab === "reading" && (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold ${theme.text.primary} flex items-center gap-2`}>
                    <FaBookOpen className={theme.icon.primary} /> Reading Preferences
                  </h2>

                  <div className="space-y-4">
                    <label className={`flex items-center justify-between p-4 ${theme.background.secondary} rounded-xl border ${theme.border.light}`}>
                      <div>
                        <span className={`font-medium ${theme.text.primary}`}>
                          Auto-scroll
                        </span>
                        <p className={`text-sm ${theme.text.tertiary}`}>
                          Automatically scroll through long texts
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.autoScroll}
                        onChange={(e) =>
                          updateSetting("autoScroll", e.target.checked)
                        }
                        className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                      />
                    </label>

                    {settings.autoScroll && (
                      <div className="pl-8">
                        <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                          Scroll Speed
                        </label>
                        <select
                          value={settings.autoScrollSpeed}
                          onChange={(e) =>
                            updateSetting("autoScrollSpeed", e.target.value)
                          }
                          className={`w-full p-2 ${theme.input.default} rounded-lg`}
                        >
                          <option value="slow">Slow</option>
                          <option value="medium">Medium</option>
                          <option value="fast">Fast</option>
                        </select>
                      </div>
                    )}

                    <label className={`flex items-center justify-between p-4 ${theme.background.secondary} rounded-xl border ${theme.border.light}`}>
                      <div>
                        <span className={`font-medium ${theme.text.primary}`}>
                          Night Mode
                        </span>
                        <p className={`text-sm ${theme.text.tertiary}`}>
                          Reduce eye strain at night
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.nightMode}
                        onChange={(e) =>
                          updateSetting("nightMode", e.target.checked)
                        }
                        className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                      />
                    </label>

                    <label className={`flex items-center justify-between p-4 ${theme.background.secondary} rounded-xl border ${theme.border.light}`}>
                      <div>
                        <span className={`font-medium ${theme.text.primary}`}>
                          Sepia Mode
                        </span>
                        <p className={`text-sm ${theme.text.tertiary}`}>
                          Warm, vintage reading experience
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.sepiaMode}
                        onChange={(e) =>
                          updateSetting("sepiaMode", e.target.checked)
                        }
                        className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold ${theme.text.primary} flex items-center gap-2`}>
                    <FaBell className={theme.icon.primary} /> Notification Settings
                  </h2>

                  <div className="space-y-4">
                    <label className={`flex items-center justify-between p-4 ${theme.background.secondary} rounded-xl border ${theme.border.light}`}>
                      <div>
                        <span className={`font-medium ${theme.text.primary}`}>
                          Email Notifications
                        </span>
                        <p className={`text-sm ${theme.text.tertiary}`}>
                          Receive updates via email
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) =>
                          updateSetting("emailNotifications", e.target.checked)
                        }
                        className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                      />
                    </label>

                    <label className={`flex items-center justify-between p-4 ${theme.background.secondary} rounded-xl border ${theme.border.light}`}>
                      <div>
                        <span className={`font-medium ${theme.text.primary}`}>
                          Push Notifications
                        </span>
                        <p className={`text-sm ${theme.text.tertiary}`}>
                          Browser notifications
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) =>
                          updateSetting("pushNotifications", e.target.checked)
                        }
                        className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                      />
                    </label>

                    <label className={`flex items-center justify-between p-4 ${theme.background.secondary} rounded-xl border ${theme.border.light}`}>
                      <div>
                        <span className={`font-medium ${theme.text.primary}`}>
                          Newsletter
                        </span>
                        <p className={`text-sm ${theme.text.tertiary}`}>
                          Weekly poetry newsletter
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.newsletterSubscribed}
                        onChange={(e) =>
                          updateSetting(
                            "newsletterSubscribed",
                            e.target.checked,
                          )
                        }
                        className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold ${theme.text.primary} flex items-center gap-2`}>
                    <FaLock className={theme.icon.primary} /> Privacy Settings
                  </h2>

                  <div>
                    <label className={`block text-sm font-medium ${theme.text.secondary} mb-3`}>
                      Profile Visibility
                    </label>
                    <select
                      value={settings.profileVisibility}
                      onChange={(e) =>
                        updateSetting("profileVisibility", e.target.value)
                      }
                      className={`w-full p-3 ${theme.input.default} rounded-xl focus:outline-none focus:ring-2 ${theme.ring.focus}`}
                    >
                      <option value="public">Public - Everyone can see</option>
                      <option value="followers">Followers Only</option>
                      <option value="private">Private - Only me</option>
                    </select>
                  </div>

                  <div className="space-y-4 mt-4">
                    <label className={`flex items-center justify-between p-4 ${theme.background.secondary} rounded-xl border ${theme.border.light}`}>
                      <div>
                        <span className={`font-medium ${theme.text.primary}`}>
                          Show Reading History
                        </span>
                        <p className={`text-sm ${theme.text.tertiary}`}>
                          Display your reading activity
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.showReadingHistory}
                        onChange={(e) =>
                          updateSetting("showReadingHistory", e.target.checked)
                        }
                        className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                      />
                    </label>

                    <label className={`flex items-center justify-between p-4 ${theme.background.secondary} rounded-xl border ${theme.border.light}`}>
                      <div>
                        <span className={`font-medium ${theme.text.primary}`}>
                          Allow Comments
                        </span>
                        <p className={`text-sm ${theme.text.tertiary}`}>
                          Let others comment on your activity
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.allowComments}
                        onChange={(e) =>
                          updateSetting("allowComments", e.target.checked)
                        }
                        className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Downloads Settings */}
              {activeTab === "downloads" && (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold ${theme.text.primary} flex items-center gap-2`}>
                    <FaDownload className={theme.icon.primary} /> Download Settings
                  </h2>

                  <div>
                    <label className={`block text-sm font-medium ${theme.text.secondary} mb-3`}>
                      Download Quality
                    </label>
                    <div className="flex gap-3">
                      {downloadQualities.map((quality) => (
                        <button
                          key={quality.id}
                          onClick={() =>
                            updateSetting("downloadQuality", quality.id)
                          }
                          className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
                            settings.downloadQuality === quality.id
                              ? `border-amber-500 ${theme.background.secondary}`
                              : `${theme.border.default} ${theme.background.cardHover}`
                          }`}
                        >
                          <div className={`font-medium ${theme.text.primary}`}>
                            {quality.name}
                          </div>
                          <div className={`text-xs ${theme.text.tertiary}`}>
                            {quality.size}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className={`flex items-center justify-between p-4 ${theme.background.secondary} rounded-xl border ${theme.border.light}`}>
                    <div>
                      <span className={`font-medium ${theme.text.primary}`}>
                        Auto-download
                      </span>
                      <p className={`text-sm ${theme.text.tertiary}`}>
                        Automatically download new content
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoDownload}
                      onChange={(e) =>
                        updateSetting("autoDownload", e.target.checked)
                      }
                      className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                    />
                  </label>
                </div>
              )}

              {/* Accessibility Settings */}
              {activeTab === "accessibility" && (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold ${theme.text.primary} flex items-center gap-2`}>
                    <FaInfoCircle className={theme.icon.primary} /> Accessibility
                  </h2>

                  <div className="space-y-4">
                    <label className={`flex items-center justify-between p-4 ${theme.background.secondary} rounded-xl border ${theme.border.light}`}>
                      <div>
                        <span className={`font-medium ${theme.text.primary}`}>
                          High Contrast
                        </span>
                        <p className={`text-sm ${theme.text.tertiary}`}>
                          Increase contrast for better visibility
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.highContrast}
                        onChange={(e) =>
                          updateSetting("highContrast", e.target.checked)
                        }
                        className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                      />
                    </label>

                    <label className={`flex items-center justify-between p-4 ${theme.background.secondary} rounded-xl border ${theme.border.light}`}>
                      <div>
                        <span className={`font-medium ${theme.text.primary}`}>
                          Reduce Motion
                        </span>
                        <p className={`text-sm ${theme.text.tertiary}`}>
                          Minimize animations
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.reduceMotion}
                        onChange={(e) =>
                          updateSetting("reduceMotion", e.target.checked)
                        }
                        className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                      />
                    </label>

                    <label className={`flex items-center justify-between p-4 ${theme.background.secondary} rounded-xl border ${theme.border.light}`}>
                      <div>
                        <span className={`font-medium ${theme.text.primary}`}>
                          Screen Reader
                        </span>
                        <p className={`text-sm ${theme.text.tertiary}`}>
                          Optimize for screen readers
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.screenReader}
                        onChange={(e) =>
                          updateSetting("screenReader", e.target.checked)
                        }
                        className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Account Settings */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold ${theme.text.primary} flex items-center gap-2`}>
                    <FaUserCircle className={theme.icon.primary} /> Account Settings
                  </h2>

                  <div className={`${theme.background.secondary} rounded-xl p-6 text-center border ${theme.border.accent}`}>
                    <FaUserCircle className={`text-6xl ${theme.icon.primary} mx-auto mb-4`} />
                    <h3 className={`text-xl font-bold ${theme.text.primary} mb-2`}>
                      Guest User
                    </h3>
                    <p className={`${theme.text.secondary} mb-4`}>
                      Sign in to sync settings across devices
                    </p>
                    <Link
                      to="/signup"
                      className={`inline-block ${theme.button.primary} px-6 py-2 rounded-lg transition`}
                    >
                      Sign In / Sign Up
                    </Link>
                  </div>

                  <div className={`border-t ${borderClass} pt-6`}>
                    <h3 className={`font-medium ${theme.text.primary} mb-4`}>
                      Data Management
                    </h3>
                    <div className="space-y-3">
                      <button className={`w-full text-left p-3 ${theme.background.secondary} rounded-xl ${theme.background.cardHover} transition flex items-center justify-between`}>
                        <span className={theme.text.primary}>Export my data</span>
                        <FaDownload className={theme.icon.primary} />
                      </button>
                      <button className={`w-full text-left p-3 ${theme.background.secondary} rounded-xl ${theme.background.cardHover} transition flex items-center justify-between`}>
                        <span className={theme.text.primary}>Clear reading history</span>
                        <FaHistory className={theme.icon.primary} />
                      </button>
                      <button className={`w-full text-left p-3 ${theme.background.secondary} rounded-xl ${theme.background.cardHover} transition flex items-center justify-between text-red-600 dark:text-red-400`}>
                        <span>Delete account</span>
                        <FaTimes className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className={`flex gap-4 pt-8 border-t ${borderClass} mt-8`}>
                <button
                  onClick={saveSettings}
                  className={`flex-1 ${theme.button.primary} py-3 rounded-xl transition-all font-medium flex items-center justify-center gap-2`}
                >
                  <FaSave /> Save Changes
                </button>
                <button
                  onClick={resetSettings}
                  className={`flex-1 border-2 ${theme.button.secondary} py-3 rounded-xl transition-all font-medium flex items-center justify-center gap-2`}
                >
                  <FaUndo /> Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;