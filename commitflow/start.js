// commitflow/start.js

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createLogger } from "./lib/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const log = createLogger("start");
log("launching server + web", { level: "step" });

const cmd = process.platform === "win32" ? "npx.cmd" : "npx";

const child = spawn(
  cmd,
  [
    "concurrently",
    "-n", "server,web",
    "-c", "green,cyan",
    "npm:dev:server",
    "npm:dev:web",
  ],
  {
    cwd: REPO_ROOT,
    stdio: "inherit",
    shell: true,
  }
);

child.on("exit", (code) => {
  log(`both servers exited with code ${code ?? 0}`);
  log.close();
  process.exit(code ?? 0);
});