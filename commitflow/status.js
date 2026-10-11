// commitflow/status.js

import path from "node:path";
import { fileURLToPath } from "node:url";
import { tryRun, currentBranch, currentHead, hasUpstream } from "./lib/git.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const branch = currentBranch(REPO_ROOT);
const head = currentHead(REPO_ROOT);

let tracking = "";
if (hasUpstream(REPO_ROOT)) {
  const ahead = tryRun("git rev-list --count @{u}..HEAD", REPO_ROOT).out.trim();
  const behind = tryRun("git rev-list --count HEAD..@{u}", REPO_ROOT).out.trim();
  tracking = `↑${ahead} ↓${behind}`;
}

const status = tryRun("git status --short", REPO_ROOT).out.trim();
const lastCommit = tryRun("git log -1 --pretty=format:%h %s", REPO_ROOT).out.trim();

console.log("");
console.log(`🌿 Branch:     ${branch} ${tracking}`);
console.log(`📌 Last commit: ${lastCommit}`);
console.log("");

if (status) {
  console.log("Changes:");
  console.log(status);
} else {
  console.log("✅ Working tree clean");
}
console.log("");