// commitflow/lib/logger.js

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = path.resolve(__dirname, "..", "logs");

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
         `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function rotateIfNeeded(filePath, maxSizeMb) {
  try {
    if (!fs.existsSync(filePath)) return;
    const { size } = fs.statSync(filePath);
    if (size > maxSizeMb * 1024 * 1024) {
      fs.renameSync(filePath, `${filePath}.${Date.now()}.old`);
    }
  } catch {
    // ignore
  }
}

export function createLogger(name) {
  const cfg = loadConfig();
  const fileEnabled = cfg.logging?.enabled && cfg.logging?.file;
  const consoleEnabled = cfg.logging?.console !== false;
  const maxSizeMb = cfg.logging?.maxLogSizeMb ?? 5;

  ensureLogDir();
  const logFile = path.join(LOG_DIR, `${name}.log`);
  rotateIfNeeded(logFile, maxSizeMb);

  let stream = null;
  if (fileEnabled) {
    try {
      stream = fs.createWriteStream(logFile, { flags: "a" });
    } catch (err) {
      console.error("⚠️  Could not open log file:", err.message);
    }
  }

  const levels = {
    info: "ℹ️ ",
    ok:   "✅",
    warn: "⚠️ ",
    err:  "❌",
    step: "→ ",
  };

  const colors = {
    info: "\x1b[37m",
    ok:   "\x1b[32m",
    warn: "\x1b[33m",
    err:  "\x1b[31m",
    step: "\x1b[36m",
  };
  const RESET = "\x1b[0m";

  function log(message, { level = "info", silent = false } = {}) {
    if (silent) return;
    const prefix = levels[level] ?? "";
    const line = `[${timestamp()}] ${prefix} ${message}`;

    if (consoleEnabled) {
      const color = colors[level] ?? "";
      console.log(`${color}${line}${RESET}`);
    }
    if (stream) {
      stream.write(line + "\n");
    }
  }

  log.close = () => {
    if (stream) stream.end();
  };
  log.filePath = logFile;

  return log;
}