// src/public_app/layout/navbar/navbarmobile/components/ControlPanel.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaGlobe,
  FaRobot,
  FaPalette,
  FaTimes,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { AiFillControl } from "react-icons/ai";
import LiteratureTab from "./LiteratureTab";
import AITab from "./AITab";
import ThemeTab from "./ThemeTab";

const ControlPanel = ({ onClose, themeStyles }) => {
  const [activeTab, setActiveTab] = useState("literature");
  const {
    dropdownBg,
    headerBg,
    tabActiveColor,
    tabInactiveColor,
    iconColor,
    buttonBg,
  } = themeStyles;

  const tabs = [
    { id: "literature", label: "Literature", icon: <FaGlobe /> },
    { id: "ai", label: "AI Translation", icon: <FaRobot /> },
    { id: "theme", label: "Theme", icon: <FaPalette /> },
  ];

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full max-w-sm ${dropdownBg} shadow-2xl z-50 overflow-hidden flex flex-col animate-slide-in-right`}
    >
      {/* Header */}
      <div
        className={`${headerBg} p-4 flex items-center justify-between flex-shrink-0`}
      >
        <h3 className={`font-semibold flex items-center gap-2 ${iconColor}`}>
          <AiFillControl /> Controls & Preferences
        </h3>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg ${buttonBg} transition-colors`}
          aria-label="Close panel"
        >
          <FaTimes className={iconColor} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === tab.id
                ? `${tabActiveColor} border-b-2`
                : `${tabInactiveColor} hover:text-gray-700 dark:hover:text-gray-300`
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content - Scrollable area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "literature" && (
          <LiteratureTab themeStyles={themeStyles} />
        )}
        {activeTab === "ai" && <AITab themeStyles={themeStyles} />}
        {activeTab === "theme" && <ThemeTab themeStyles={themeStyles} />}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Quick settings
          </span>
          <Link
            to="/controls-preferences"
            onClick={onClose}
            className={`flex items-center gap-2 px-3 py-2 ${buttonBg} rounded-lg text-sm ${iconColor} transition-all group`}
          >
            <span>Full Preferences</span>
            <FaExternalLinkAlt
              size={12}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Preferences saved locally</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <FaTimes size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
