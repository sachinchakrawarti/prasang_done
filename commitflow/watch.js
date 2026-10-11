// commitflow/watch.js

import chokidar from "chokidar";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createLogger } from "./lib/logger.js";
import { loadConfig } from "./lib/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const log = createLogger("watch");
const cfg = loadConfig();

const DEBOUNCE_MS = cfg.watch?.debounceMs ?? 30000;
const WATCH_PATHS = cfg.watch?.paths ?? ["**/*.js"];
const IGNORED = cfg.watch?.ignored ?? ["**/node_modules/**"];

let timer = null;
const pending = new Set();

function runSave(message) {
  log(`invoking save.js: "${message}"`, { level: "step" });
  const res = spawnSync(
    process.execPath,
    [path.join(__dirname, "save.js"), message],
    { cwd: REPO_ROOT, stdio: "inherit" }
  );
  if (res.status !== 0) {
    log(`save.js exited with code ${res.status}`, { level: "err" });
  }
}

function flush() {
  const files = [...pending];
  pending.clear();
  if (files.length === 0) return;

  const head = files.slice(0, 4).join(", ");
  const tail = files.length > 4 ? ` +${files.length - 4} more` : "";
  const message = `auto: ${head}${tail}`;

  log(`${files.length} file(s) changed — committing`, { level: "step" });
  runSave(message);
}

const watcher = chokidar.watch(WATCH_PATHS, {
  cwd: REPO_ROOT,
  ignored: IGNORED,
  ignoreInitial: true,
  awaitWriteFinish: { stabilityThreshold: 800, pollInterval: 200 },
});

watcher.on("all", (event, relPath) => {
  log(`${event}: ${relPath}`);
  pending.add(relPath);
  clearTimeout(timer);
  timer = setTimeout(flush, DEBOUNCE_MS);
});

watcher.on("ready", () => {
  log("watcher ready", { level: "ok" });
  console.log(`\n👀 Watching ${REPO_ROOT}`);
  console.log(`   Debounce: ${DEBOUNCE_MS / 1000}s`);
  console.log(`   Log:      ${log.filePath}`);
  console.log(`   Ctrl+C to stop\n`);
});

process.on("SIGINT", () => {
  console.log("\n\n👋 Stopping watcher...");
  log("watcher stopping", { level: "warn" });
  if (pending.size > 0) {
    log(`${pending.size} pending change(s) — saving now`, { level: "step" });
    flush();
  }
  watcher.close().then(() => {
    log("watcher stopped", { level: "ok" });
    log.close();
    process.exit(0);
  });
});