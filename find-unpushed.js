#!/usr/bin/env node
/**
 * find-unpushed.js
 * Finds everything that is NOT pushed to the remote.
 * READ-ONLY — never commits, stages, or pushes anything.
 *
 * Usage:
 *   node find-unpushed.js              # asks where to check, then full report
 *   node find-unpushed.js --short      # asks, then compact summary
 *   node find-unpushed.js --json       # no prompt, JSON output
 */

const simpleGit = require('simple-git');
const chalk = require('chalk');
const readline = require('readline');

const args = process.argv.slice(2);
const AS_JSON = args.includes('--json');
const SHORT = args.includes('--short');

const git = simpleGit();

// ===== CONFIG =====
const BRANCHES = ['main', 'dev', 'test'];
const DEFAULT_BRANCH = 'dev';
const AUTO_SCOPE_TIMEOUT_MS = 60 * 1000; // 60s
const SCOPES = [...BRANCHES, 'all'];

const log = {
    header: (m) => console.log(chalk.bold.cyan(`\n${m}`)),
    section: (m) => console.log(chalk.bold.magenta(`\n── ${m} ──`)),
    success: (m) => console.log(chalk.green(`  ✅ ${m}`)),
    warn: (m) => console.log(chalk.yellow(`  ⚠️  ${m}`)),
    error: (m) => console.log(chalk.red(`  ❌ ${m}`)),
    item: (m) => console.log(chalk.white(`  • ${m}`)),
    dim: (m) => console.log(chalk.dim(`    ${m}`)),
    file: (m) => console.log(chalk.cyan(`    📄 ${m}`)),
};

// ============ ASK WHICH SCOPE / BRANCH TO CHECK ============
function askScope() {
    return new Promise((resolve) => {
        if (!process.stdin.isTTY) {
            log.warn(`No interactive terminal — using default scope: ${DEFAULT_BRANCH}`);
            return resolve(DEFAULT_BRANCH);
        }

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        let answered = false;

        const timer = setTimeout(() => {
            if (answered) return;
            answered = true;
            rl.close();
            console.log();
            log.warn(`⏰ No answer in ${AUTO_SCOPE_TIMEOUT_MS / 1000}s — using ${DEFAULT_BRANCH}`);
            resolve(DEFAULT_BRANCH);
        }, AUTO_SCOPE_TIMEOUT_MS);

        const promptText =
            chalk.cyan(`\n🔍 Where should I check? `) +
            chalk.dim(`[${SCOPES.join(' / ')}]`) +
            chalk.yellow(` (auto -> ${DEFAULT_BRANCH} in ${AUTO_SCOPE_TIMEOUT_MS / 1000}s)`) +
            chalk.cyan(' → ');

        rl.question(promptText, (answer) => {
            if (answered) return;
            answered = true;
            clearTimeout(timer);
            rl.close();

            const clean = (answer || '').trim().toLowerCase();
            if (!clean) {
                log.warn(`Empty answer — using ${DEFAULT_BRANCH}`);
                return resolve(DEFAULT_BRANCH);
            }
            if (SCOPES.includes(clean)) return resolve(clean);

            log.warn(`Unknown scope "${clean}" — using ${DEFAULT_BRANCH}`);
            resolve(DEFAULT_BRANCH);
        });
    });
}

// ============ MAIN ============
async function run() {
    const report = {
        cwd: process.cwd(),
        scope: null,
        currentBranch: null,
        uncommitted: { modified: [], staged: [], untracked: [], deleted: [], renamed: [] },
        unpushedCommits: [],
        branches: [],
        stashes: [],
        unpushedTags: [],
        summary: {},
    };

    try {
        // ---------- Determine scope (ask first) ----------
        let scope;
        if (AS_JSON) {
            scope = DEFAULT_BRANCH; // no prompt for machine output
        } else {
            log.header('🔍 UNPUSHED FINDER');
            log.dim(`Repo: ${process.cwd()}`);
            scope = await askScope();
        }
        report.scope = scope;

        // ---------- Basic info ----------
        const currentBranch = (await git.revparse(['--abbrev-ref', 'HEAD'])).trim();
        report.currentBranch = currentBranch;

        if (!AS_JSON) {
            log.section(`🎯 SCOPE: ${scope.toUpperCase()}`);
            log.dim(`Current branch: ${currentBranch}`);
            if (scope !== 'all' && scope !== currentBranch) {
                log.warn(`You're currently on "${currentBranch}" but checking "${scope}".`);
                log.dim(`(read-only — nothing will be switched)`);
            }
        }

        // ---------- 1. Uncommitted changes ----------
        // Uncommitted changes are always relative to the CURRENT working tree.
        // Only show them if the scope is the current branch or 'all'.
        const showUncommitted = (scope === 'all') || (scope === currentBranch);

        if (showUncommitted) {
            const status = await git.status();
            report.uncommitted.modified = status.modified || [];
            report.uncommitted.staged = status.staged || [];
            report.uncommitted.untracked = status.not_added || [];
            report.uncommitted.deleted = status.deleted || [];
            report.uncommitted.renamed = (status.renamed || []).map(r => `${r.from} → ${r.to}`);

            if (!AS_JSON) {
                log.section(`📝 UNCOMMITTED CHANGES (working tree)`);
                const anyUncommitted =
                    report.uncommitted.modified.length ||
                    report.uncommitted.staged.length ||
                    report.uncommitted.untracked.length ||
                    report.uncommitted.deleted.length ||
                    report.uncommitted.renamed.length;

                if (!anyUncommitted) {
                    log.success('Working tree is clean');
                } else {
                    if (report.uncommitted.staged.length) {
                        log.item(chalk.green(`Staged (${report.uncommitted.staged.length}):`));
                        report.uncommitted.staged.forEach(f => log.file(f));
                    }
                    if (report.uncommitted.modified.length) {
                        log.item(chalk.yellow(`Modified (${report.uncommitted.modified.length}):`));
                        report.uncommitted.modified.forEach(f => log.file(f));
                    }
                    if (report.uncommitted.deleted.length) {
                        log.item(chalk.red(`Deleted (${report.uncommitted.deleted.length}):`));
                        report.uncommitted.deleted.forEach(f => log.file(f));
                    }
                    if (report.uncommitted.renamed.length) {
                        log.item(chalk.blue(`Renamed (${report.uncommitted.renamed.length}):`));
                        report.uncommitted.renamed.forEach(f => log.file(f));
                    }
                    if (report.uncommitted.untracked.length) {
                        log.item(chalk.magenta(`Untracked (${report.uncommitted.untracked.length}):`));
                        report.uncommitted.untracked.forEach(f => log.file(f));
                    }
                }
            }
        } else if (!AS_JSON) {
            log.section('📝 UNCOMMITTED CHANGES');
            log.dim(`Skipped — you're on "${currentBranch}", checking "${scope}".`);
        }

        // ---------- 2. Unpushed commits ----------
        const branchesToCheck = scope === 'all' ? null : [scope];

        const collectUnpushedFor = async (branchName) => {
            const out = [];
            let upstream = null;
            try {
                upstream = (await git.revparse(['--abbrev-ref', '--symbolic-full-name', `${branchName}@{u}`])).trim();
            } catch {
                upstream = null;
            }

            if (upstream) {
                try {
                    const logOut = await git.log({ from: `${upstream}..${branchName}`, '--max-count': 100 });
                    logOut.all.forEach(c => out.push({
                        branch: branchName,
                        hash: c.hash.substring(0, 7),
                        date: c.date,
                        message: c.message,
                        author: c.author_name,
                        upstream,
                    }));
                } catch (e) {}
            } else {
                try {
                    const all = await git.log({ maxCount: 20, from: branchName });
                    all.all.forEach(c => out.push({
                        branch: branchName,
                        hash: c.hash.substring(0, 7),
                        date: c.date,
                        message: c.message,
                        author: c.author_name,
                        upstream: null,
                        note: 'no upstream',
                    }));
                } catch (e) {}
            }
            return out;
        };

        if (branchesToCheck) {
            for (const b of branchesToCheck) {
                // Skip if branch doesn't exist
                const list = await git.branchLocal();
                if (!list.all.includes(b)) {
                    if (!AS_JSON) {
                        log.section(`⬆️  UNPUSHED COMMITS (${b})`);
                        log.warn(`Branch "${b}" does not exist locally`);
                    }
                    continue;
                }
                const commits = await collectUnpushedFor(b);
                report.unpushedCommits.push(...commits);

                if (!AS_JSON) {
                    log.section(`⬆️  UNPUSHED COMMITS (${b})`);
                    if (commits.length === 0) {
                        log.success('No unpushed commits');
                    } else {
                        log.item(chalk.yellow(`${commits.length} commit(s) not on remote:`));
                        commits.forEach(c => {
                            log.dim(`${c.hash}  ${c.date}  ${c.author}`);
                            log.dim(`         ${c.message}`);
                            if (c.note) log.dim(`         (${c.note})`);
                        });
                    }
                }
            }
        } else {
            // 'all' — iterate local branches
            const list = await git.branchLocal();
            for (const b of list.all) {
                const commits = await collectUnpushedFor(b);
                report.unpushedCommits.push(...commits);
            }

            if (!AS_JSON) {
                log.section('⬆️  UNPUSHED COMMITS (all branches)');
                if (report.unpushedCommits.length === 0) {
                    log.success('No unpushed commits in any branch');
                } else {
                    const grouped = {};
                    report.unpushedCommits.forEach(c => {
                        (grouped[c.branch] = grouped[c.branch] || []).push(c);
                    });
                    Object.entries(grouped).forEach(([br, arr]) => {
                        log.item(chalk.yellow(`${br} — ${arr.length} commit(s):`));
                        arr.forEach(c => {
                            log.dim(`${c.hash}  ${c.date}  ${c.author}`);
                            log.dim(`         ${c.message}`);
                        });
                    });
                }
            }
        }

        // ---------- 3. Branches vs remote ----------
        const branchSummary = await git.branch(['-vv']);
        const parsedBranches = branchSummary.all.map(line => {
            const isCurrent = line.startsWith('*');
            const rest = isCurrent ? line.slice(2) : line;
            const parts = rest.split(/\s+/);
            const name = parts[0];
            const hash = parts[1];
            const trackMatch = rest.match(/\[([^\]]+)\]/);
            const track = trackMatch ? trackMatch[1] : null;

            let ahead = 0, behind = 0;
            if (track) {
                const am = track.match(/ahead (\d+)/);
                const bm = track.match(/behind (\d+)/);
                if (am) ahead = parseInt(am[1]);
                if (bm) behind = parseInt(bm[1]);
            }

            return {
                name,
                hash: (hash || '').substring(0, 7),
                isCurrent,
                track,
                ahead,
                behind,
                hasUpstream: !!track,
            };
        });

        // Filter branches by scope
        if (scope === 'all') {
            report.branches = parsedBranches;
        } else {
            report.branches = parsedBranches.filter(b => b.name === scope);
        }

        if (!AS_JSON) {
            log.section(`🌿 BRANCHES vs REMOTE${scope === 'all' ? '' : ` (${scope})`}`);
            if (report.branches.length === 0) {
                log.warn(`No matching branch "${scope}" found locally`);
            } else {
                report.branches.forEach(b => {
                    if (b.ahead > 0 && b.hasUpstream) {
                        log.warn(`${b.name}${b.isCurrent ? ' *' : ''}  →  ahead ${b.ahead} commit(s) of ${b.track}`);
                    } else if (!b.hasUpstream) {
                        log.warn(`${b.name}${b.isCurrent ? ' *' : ''}  →  no upstream (never pushed)`);
                    } else if (b.behind > 0) {
                        log.dim(`${b.name}${b.isCurrent ? ' *' : ''}  →  behind ${b.behind} (incoming)`);
                    } else {
                        log.success(`${b.name}${b.isCurrent ? ' *' : ''}  →  up to date`);
                    }
                });
            }
        }

        // ---------- 4. Stashes (always shown — they're global, not per-branch) ----------
        try {
            const stashList = await git.stashList();
            report.stashes = stashList.all.map(s => ({
                hash: s.hash.substring(0, 7),
                message: s.message,
                date: s.date,
            }));
        } catch {}

        if (!AS_JSON) {
            log.section('📦 STASHES (not in any commit)');
            if (report.stashes.length === 0) {
                log.success('No stashes');
            } else {
                log.warn(`${report.stashes.length} stash(es) — these are not pushed:`);
                report.stashes.forEach(s => {
                    log.dim(`${s.hash}  ${s.date}`);
                    log.dim(`         ${s.message}`);
                });
            }
        }

        // ---------- 5. Unpushed tags ----------
        try {
            const tags = await git.tags();
            for (const t of tags.all) {
                const remotes = await git.listRemote(['--tags']);
                const isPushed = remotes.split('\n').some(line => line.includes(`refs/tags/${t}`));
                if (!isPushed) report.unpushedTags.push(t);
            }
        } catch {}

        if (!AS_JSON) {
            log.section('🏷️  TAGS not on remote');
            if (report.unpushedTags.length === 0) {
                log.success('All tags pushed (or none exist)');
            } else {
                report.unpushedTags.forEach(t => log.warn(t));
            }
        }

        // ---------- Summary ----------
        const totalUncommitted = showUncommitted
            ? report.uncommitted.modified.length +
              report.uncommitted.staged.length +
              report.uncommitted.untracked.length +
              report.uncommitted.deleted.length +
              report.uncommitted.renamed.length
            : 0;

        const branchesAhead = report.branches.filter(b => b.ahead > 0).length;
        const branchesNoUpstream = report.branches.filter(b => !b.hasUpstream).length;

        report.summary = {
            scope,
            totalUncommitted,
            unpushedCommits: report.unpushedCommits.length,
            branchesAhead,
            branchesNoUpstream,
            stashes: report.stashes.length,
            unpushedTags: report.unpushedTags.length,
        };

        if (AS_JSON) {
            console.log(JSON.stringify(report, null, 2));
            return;
        }

        if (SHORT) {
            console.log(chalk.bold.cyan(`\n📊 SUMMARY (scope: ${scope})`));
            console.log(`  Uncommitted:      ${totalUncommitted}`);
            console.log(`  Unpushed commits: ${report.unpushedCommits.length}`);
            console.log(`  Branches ahead:   ${branchesAhead}`);
            console.log(`  No-upstream:      ${branchesNoUpstream}`);
            console.log(`  Stashes:          ${report.stashes.length}`);
            console.log(`  Unpushed tags:    ${report.unpushedTags.length}`);
            return;
        }

        console.log(chalk.bold.cyan('\n═══════════════════════════════════════════════════════════════════════'));
        console.log(chalk.bold.cyan(`                     📊 SUMMARY (scope: ${scope})`.padEnd(71) + ' '));
        console.log(chalk.bold.cyan('═══════════════════════════════════════════════════════════════════════'));
        console.log(`  📝 Uncommitted files:     ${totalUncommitted > 0 ? chalk.yellow(totalUncommitted) : chalk.green('0')}`);
        console.log(`  ⬆️  Unpushed commits:      ${report.unpushedCommits.length > 0 ? chalk.yellow(report.unpushedCommits.length) : chalk.green('0')}`);
        console.log(`  🌿 Branches ahead:        ${branchesAhead > 0 ? chalk.yellow(branchesAhead) : chalk.green('0')}`);
        console.log(`  🌿 Branches no upstream:  ${branchesNoUpstream > 0 ? chalk.yellow(branchesNoUpstream) : chalk.green('0')}`);
        console.log(`  📦 Stashes:               ${report.stashes.length > 0 ? chalk.yellow(report.stashes.length) : chalk.green('0')}`);
        console.log(`  🏷️  Unpushed tags:         ${report.unpushedTags.length > 0 ? chalk.yellow(report.unpushedTags.length) : chalk.green('0')}`);
        console.log(chalk.bold.cyan('═══════════════════════════════════════════════════════════════════════\n'));

        const nothingToPush =
            totalUncommitted === 0 &&
            report.unpushedCommits.length === 0 &&
            branchesAhead === 0 &&
            branchesNoUpstream === 0 &&
            report.stashes.length === 0 &&
            report.unpushedTags.length === 0;

        if (nothingToPush) {
            log.success('🎉 Everything is pushed! Nothing pending.');
        } else {
            log.warn('⚠️  Some items are NOT pushed. See sections above.');
        }
    } catch (err) {
        if (AS_JSON) {
            console.log(JSON.stringify({ error: err.message }, null, 2));
        } else {
            log.error(`Failed: ${err.message}`);
        }
        process.exit(1);
    }
}

run();