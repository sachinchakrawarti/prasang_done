// commitflow/lib/git.js

import { execSync } from "node:child_process";

const IS_WINDOWS = process.platform === "win32";
const SHELL = IS_WINDOWS ? "powershell.exe" : "/bin/sh";

export function tryRun(cmd, cwd = process.cwd()) {
  try {
    const out = execSync(cmd, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      shell: SHELL,
    });
    return { ok: true, out };
  } catch (err) {
    const out = (err.stdout || "") + (err.stderr || "");
    return { ok: false, out, error: err };
  }
}

export function run(cmd, cwd = process.cwd()) {
  execSync(cmd, { cwd, stdio: "inherit", shell: SHELL });
}

export const isGitRepo = (cwd = process.cwd()) =>
  tryRun("git rev-parse --is-inside-work-tree", cwd).ok;

export function hasChanges(cwd = process.cwd()) {
  const res = tryRun("git status --porcelain", cwd);
  return res.ok && res.out.trim().length > 0;
}

export function currentBranch(cwd = process.cwd()) {
  const res = tryRun("git rev-parse --abbrev-ref HEAD", cwd);
  return res.ok ? res.out.trim() : "main";
}

export function currentHead(cwd = process.cwd()) {
  const res = tryRun("git rev-parse --short HEAD", cwd);
  return res.ok ? res.out.trim() : "";
}

export function hasUpstream(cwd = process.cwd()) {
  return tryRun("git rev-parse --abbrev-ref @{u}", cwd).ok;
}