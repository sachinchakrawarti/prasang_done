// commitflow/lib/config.js

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.resolve(__dirname, "..", "config.json");

const DEFAULTS = {
  save: {
    defaultMessagePrefix: "save:",
    autoStage: true,
    pullStrategy: "rebase-autostash",
    pushOnCommit: true,
  },
  watch: {
    debounceMs: 30000,
    paths: [
      "server/**/*.{js,mjs,json}",
      "web/src/**/*.{js,jsx,ts,tsx,css}",
      "db/schema/**/*.js",
      "db/automation/**/*.js",
      "commitflow/**/*.js",
      "*.md",
    ],
    ignored: [
      "**/node_modules/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/dist/**",
      "**/.git/**",
      "**/*.db",
      "**/*.db-*",
      "commitflow/logs/**",
    ],
  },
  logging: {
    enabled: true,
    console: true,
    file: true,
    maxLogSizeMb: 5,
  },
};

function deepMerge(base, override) {
  if (Array.isArray(base) || Array.isArray(override)) {
    return override ?? base;
  }
  if (
    typeof base !== "object" || base === null ||
    typeof override !== "object" || override === null
  ) {
    return override ?? base;
  }
  const out = { ...base };
  for (const key of Object.keys(override)) {
    out[key] = deepMerge(base[key], override[key]);
  }
  return out;
}

export function loadConfig() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) return { ...DEFAULTS };
    const raw = fs.readFileSync(CONFIG_PATH, "utf8");
    return deepMerge(DEFAULTS, JSON.parse(raw));
  } catch (err) {
    console.error("⚠️  config.json invalid, using defaults:", err.message);
    return { ...DEFAULTS };
  }
}

export const CONFIG_FILE_PATH = CONFIG_PATH;
export const DEFAULT_CONFIG = DEFAULTS;