// commitflow/save.js
//
// Commit + pull --rebase + push.
//
// Usage:
//   node save.js                 → default timestamp message
//   node save.js "my message"    → custom message
//   node save.js --pull-first    → pull before staging
//   node save.js "msg" --pull-first

import path from "node:path";
import { fileURLToPath } from "node:url";
import { createLogger } from "./lib/logger.js";
import { loadConfig } from "./lib/config.js";
import {
  tryRun,
  isGitRepo,
  hasChanges,
  currentBranch,
  currentHead,
  hasUpstream,
} from "./lib/git.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// commitflow/ is one level below the repo root
const REPO_ROOT = path.resolve(__dirname, "..");

const log = createLogger("save");
const cfg = loadConfig();

const args = process.argv.slice(2);
const pullFirst = args.includes("--pull-first");
const messageArgs = args.filter((a) => !a.startsWith("--"));
const customMessage = messageArgs.join(" ").trim();

function fail(msg, detail) {
  log(msg, { level: "err" });
  if (detail) log(detail, { level: "err" });
  log.close();
  process.exit(1);
}

function main() {
  log("save: start", { level: "step" });

  if (!isGitRepo(REPO_ROOT)) {
    fail("Not a git repository. Run `git init` at the project root first.");
  }

  const branch = currentBranch(REPO_ROOT);
  log(`repo:   ${REPO_ROOT}`);
  log(`branch: ${branch}`);

  if (pullFirst) {
    log("pull --rebase --autostash (before staging)", { level: "step" });
    const pull = tryRun("git pull --rebase --autostash", REPO_ROOT);
    if (!pull.ok) fail("Pull failed.", pull.out);
  }

  if (!hasChanges(REPO_ROOT)) {
    log("no changes to save", { level: "ok" });
    log.close();
    return;
  }

  const stamp = new Date().toISOString().replace("T", " ").replace(/\..+$/, "");
  const prefix = cfg.save?.defaultMessagePrefix ?? "save:";
  const message = customMessage || `${prefix} ${stamp}`;

  log("staging changes", { level: "step" });
  if (cfg.save?.autoStage !== false) {
    const add = tryRun("git add -A", REPO_ROOT);
    if (!add.ok) fail("git add failed.", add.out);
  }

  const summary = tryRun("git diff --cached --stat", REPO_ROOT);
  if (summary.ok && summary.out.trim()) {
    console.log(summary.out.trim());
    log(summary.out.trim(), { silent: true });
  }

  log(`commit: "${message}"`, { level: "step" });
  const escaped = message.replace(/"/g, '\\"');
  const commit = tryRun(`git commit -m "${escaped}"`, REPO_ROOT);
  if (!commit.ok) fail("Commit failed.", commit.out);

  if (!pullFirst) {
    log("pull --rebase --autostash", { level: "step" });
    const pull = tryRun("git pull --rebase --autostash", REPO_ROOT);
    if (!pull.ok) {
      fail("Pull/rebase failed. Resolve conflicts, then `git rebase --continue`.", pull.out);
    }
  }

  if (cfg.save?.pushOnCommit !== false) {
    log("push", { level: "step" });
    if (!hasUpstream(REPO_ROOT)) {
      log("(no upstream — setting origin/HEAD)");
      const up = tryRun("git push -u origin HEAD", REPO_ROOT);
      if (!up.ok) fail("Initial push failed. Check remote + credentials.", up.out);
    } else {
      const push = tryRun("git push", REPO_ROOT);
      if (!push.ok) fail("Push failed. Check network + credentials.", push.out);
    }
  }

  const head = currentHead(REPO_ROOT);
  log(`saved and pushed at ${head}`, { level: "ok" });
  log.close();
}

main();