#!/usr/bin/env node
/**
 * find-unpushed.js
 * Finds everything that is NOT pushed to the remote.
 * READ-ONLY — never commits, stages, or pushes anything.
 *
 * Ignores: anything in .gitignore (untracked) + a hard ignore list below.
 */

const simpleGit = require('simple-git');
const chalk = require('chalk');
const readline = require('readline');
const path = require('path');

const args = process.argv.slice(2);
const AS_JSON = args.includes('--json');
const SHORT = args.includes('--short');

const git = simpleGit();

// ===== CONFIG =====
const BRANCHES = ['main', 'dev', 'test'];
const DEFAULT_BRANCH = 'dev';
const AUTO_SCOPE_TIMEOUT_MS = 60 * 1000;

// Hard ignore list — paths that NEVER count as "uncommitted"
// (matches your auto-push script's IGNORED_PATHS + logs/reports)
const HARD_IGNORE = [
    /(^|[\/\\])\.git([\/\\]|$)/,
    /node_modules[\/\\]/,
    /(^|[\/\\])build[\/\\]/,
    /(^|[\/\\])dist[\/\\]/,
    /\.docusaurus[\/\\]/,
    /\.cache[\/\\]/,
    /package-lock\.json$/,
    /(^|[\/\\])logs[\/\\]/,
    /(^|[\/\\])reports[\/\\]/,
];

function isHardIgnored(p) {
    const normalized = p.replace(/\\/g, '/');
    return HARD_IGNORE.some(rx => rx.test(normalized));
}

// ===== ASK =====
function askScope() {
    return new Promise((resolve) => {
        if (!process.stdin.isTTY) return resolve(DEFAULT_BRANCH);

        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        let answered = false;

        const timer = setTimeout(() => {
            if (answered) return;
            answered = true;
            rl.close();
            console.log();
            console.log(chalk.yellow(`  ⚠️  No answer in ${AUTO_SCOPE_TIMEOUT_MS / 1000}s — using ${DEFAULT_BRANCH}`));
            resolve(DEFAULT_BRANCH);
        }, AUTO_SCOPE_TIMEOUT_MS);

        rl.question(
            chalk.cyan(`\n🔍 Where should I check? `) +
            chalk.dim(`[${[...BRANCHES, 'all'].join(' / ')}]`) +
            chalk.yellow(` (auto -> ${DEFAULT_BRANCH} in ${AUTO_SCOPE_TIMEOUT_MS / 1000}s) → `),
            (answer) => {
                if (answered) return;
                answered = true;
                clearTimeout(timer);
                rl.close();

                const clean = (answer || '').trim().toLowerCase();
                if (!clean) return resolve(DEFAULT_BRANCH);
                if ([...BRANCHES, 'all'].includes(clean)) return resolve(clean);
                console.log(chalk.yellow(`  ⚠️  Unknown "${clean}" — using ${DEFAULT_BRANCH}`));
                resolve(DEFAULT_BRANCH);
            }
        );
    });
}

// ===== HELPERS =====
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

// ===== MAIN =====
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
        // ---------- Scope ----------
        let scope;
        if (AS_JSON) {
            scope = DEFAULT_BRANCH;
        } else {
            log.header('🔍 UNPUSHED FINDER');
            log.dim(`Repo: ${process.cwd()}`);
            scope = await askScope();
        }
        report.scope = scope;

        const currentBranch = (await git.revparse(['--abbrev-ref', 'HEAD'])).trim();
        report.currentBranch = currentBranch;

        if (!AS_JSON) {
            log.section(`🎯 SCOPE: ${scope.toUpperCase()}`);
            log.dim(`Current branch: ${currentBranch}`);
            log.dim(`Hard-ignored: logs/, reports/, node_modules/, build/, dist/, .cache/, package-lock.json, .git/`);
            if (scope !== 'all' && scope !== currentBranch) {
                log.warn(`You're on "${currentBranch}" but checking "${scope}" (read-only).`);
            }
        }

        // ---------- 1. Uncommitted (with filtering) ----------
        const showUncommitted = (scope === 'all') || (scope === currentBranch);

        if (showUncommitted) {
            const status = await git.status();

            // Get list of tracked-but-ignored paths (git ls-files --cached --ignored)
            // These are files git still tracks even though they match .gitignore.
            let trackedIgnored = new Set();
            try {
                const out = await git.raw(['ls-files', '-ci', '--exclude-standard']);
                out.split('\n').filter(Boolean).forEach(f => trackedIgnored.add(f.replace(/\\/g, '/')));
            } catch {}

            const filterFile = (f) => {
                const n = f.replace(/\\/g, '/');
                if (isHardIgnored(n)) return false;
                if (trackedIgnored.has(n)) return false;
                return true;
            };

            report.uncommitted.modified = (status.modified || []).filter(filterFile);
            report.uncommitted.staged = (status.staged || []).filter(filterFile);
            report.uncommitted.untracked = (status.not_added || []).filter(filterFile);
            report.uncommitted.deleted = (status.deleted || []).filter(filterFile);
            report.uncommitted.renamed = (status.renamed || [])
                .map(r => `${r.from} → ${r.to}`)
                .filter(f => {
                    const n = f.split(' → ')[0].replace(/\\/g, '/');
                    return !isHardIgnored(n);
                });

            if (!AS_JSON) {
                log.section('📝 UNCOMMITTED CHANGES (working tree, .gitignore respected)');
                const any =
                    report.uncommitted.modified.length ||
                    report.uncommitted.staged.length ||
                    report.uncommitted.untracked.length ||
                    report.uncommitted.deleted.length ||
                    report.uncommitted.renamed.length;

                if (!any) {
                    log.success('Working tree is clean (after ignoring logs/, reports/, etc.)');
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
            } catch { upstream = null; }

            if (upstream) {
                try {
                    const logOut = await git.log({ from: `${upstream}..${branchName}`, '--max-count': 100 });
                    logOut.all.forEach(c => out.push({
                        branch: branchName, hash: c.hash.substring(0, 7), date: c.date,
                        message: c.message, author: c.author_name, upstream,
                    }));
                } catch {}
            } else {
                try {
                    const all = await git.log({ maxCount: 20, from: branchName });
                    all.all.forEach(c => out.push({
                        branch: branchName, hash: c.hash.substring(0, 7), date: c.date,
                        message: c.message, author: c.author_name, upstream: null, note: 'no upstream',
                    }));
                } catch {}
            }
            return out;
        };

        const localBranches = (await git.branchLocal()).all;

        if (branchesToCheck) {
            for (const b of branchesToCheck) {
                if (!localBranches.includes(b)) {
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
                    if (commits.length === 0) log.success('No unpushed commits');
                    else {
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
            for (const b of localBranches) {
                const commits = await collectUnpushedFor(b);
                report.unpushedCommits.push(...commits);
            }
            if (!AS_JSON) {
                log.section('⬆️  UNPUSHED COMMITS (all branches)');
                if (report.unpushedCommits.length === 0) log.success('No unpushed commits');
                else {
                    const grouped = {};
                    report.unpushedCommits.forEach(c => (grouped[c.branch] = grouped[c.branch] || []).push(c));
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
        const parsed = branchSummary.all.map(line => {
            const isCurrent = line.startsWith('*');
            const rest = isCurrent ? line.slice(2) : line;
            const parts = rest.split(/\s+/);
            const name = parts[0];
            const hash = parts[1];
            const trackMatch = rest.match(/\[([^\]]+)\]/);
            const track = trackMatch ? trackMatch[1] : null;
            let ahead = 0, behind = 0;
            if (track) {
                const am = track.match(/ahead (\d+)/); if (am) ahead = parseInt(am[1]);
                const bm = track.match(/behind (\d+)/); if (bm) behind = parseInt(bm[1]);
            }
            return {
                name, hash: (hash || '').substring(0, 7), isCurrent, track, ahead, behind,
                hasUpstream: !!track,
            };
        });

        report.branches = scope === 'all' ? parsed : parsed.filter(b => b.name === scope);

        if (!AS_JSON) {
            log.section(`🌿 BRANCHES vs REMOTE${scope === 'all' ? '' : ` (${scope})`}`);
            if (report.branches.length === 0) log.warn(`No matching branch "${scope}" found locally`);
            else {
                report.branches.forEach(b => {
                    if (b.ahead > 0 && b.hasUpstream) log.warn(`${b.name}${b.isCurrent ? ' *' : ''}  →  ahead ${b.ahead} of ${b.track}`);
                    else if (!b.hasUpstream) log.warn(`${b.name}${b.isCurrent ? ' *' : ''}  →  no upstream (never pushed)`);
                    else if (b.behind > 0) log.dim(`${b.name}${b.isCurrent ? ' *' : ''}  →  behind ${b.behind}`);
                    else log.success(`${b.name}${b.isCurrent ? ' *' : ''}  →  up to date`);
                });
            }
        }

        // ---------- 4. Stashes ----------
        try {
            const stashList = await git.stashList();
            report.stashes = stashList.all.map(s => ({
                hash: s.hash.substring(0, 7), message: s.message, date: s.date,
            }));
        } catch {}

        if (!AS_JSON) {
            log.section('📦 STASHES');
            if (report.stashes.length === 0) log.success('No stashes');
            else {
                log.warn(`${report.stashes.length} stash(es) — not pushed:`);
                report.stashes.forEach(s => {
                    log.dim(`${s.hash}  ${s.date}`);
                    log.dim(`         ${s.message}`);
                });
            }
        }

        // ---------- 5. Unpushed tags ----------
        try {
            const tags = await git.tags();
            const remotes = await git.listRemote(['--tags']);
            report.unpushedTags = tags.all.filter(t =>
                !remotes.split('\n').some(line => line.includes(`refs/tags/${t}`))
            );
        } catch {}

        if (!AS_JSON) {
            log.section('🏷️  TAGS not on remote');
            if (report.unpushedTags.length === 0) log.success('All tags pushed (or none exist)');
            else report.unpushedTags.forEach(t => log.warn(t));
        }

        // ---------- Summary ----------
        const totalUncommitted = showUncommitted
            ? report.uncommitted.modified.length + report.uncommitted.staged.length +
              report.uncommitted.untracked.length + report.uncommitted.deleted.length +
              report.uncommitted.renamed.length
            : 0;

        const branchesAhead = report.branches.filter(b => b.ahead > 0).length;
        const branchesNoUpstream = report.branches.filter(b => !b.hasUpstream).length;

        report.summary = {
            scope, totalUncommitted,
            unpushedCommits: report.unpushedCommits.length,
            branchesAhead, branchesNoUpstream,
            stashes: report.stashes.length,
            unpushedTags: report.unpushedTags.length,
        };

        if (AS_JSON) { console.log(JSON.stringify(report, null, 2)); return; }

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
        console.log(chalk.bold.cyan(`                     📊 SUMMARY (scope: ${scope})`));
        console.log(chalk.bold.cyan('═══════════════════════════════════════════════════════════════════════'));
        console.log(`  📝 Uncommitted files:     ${totalUncommitted > 0 ? chalk.yellow(totalUncommitted) : chalk.green('0')}`);
        console.log(`  ⬆️  Unpushed commits:      ${report.unpushedCommits.length > 0 ? chalk.yellow(report.unpushedCommits.length) : chalk.green('0')}`);
        console.log(`  🌿 Branches ahead:        ${branchesAhead > 0 ? chalk.yellow(branchesAhead) : chalk.green('0')}`);
        console.log(`  🌿 Branches no upstream:  ${branchesNoUpstream > 0 ? chalk.yellow(branchesNoUpstream) : chalk.green('0')}`);
        console.log(`  📦 Stashes:               ${report.stashes.length > 0 ? chalk.yellow(report.stashes.length) : chalk.green('0')}`);
        console.log(`  🏷️  Unpushed tags:         ${report.unpushedTags.length > 0 ? chalk.yellow(report.unpushedTags.length) : chalk.green('0')}`);
        console.log(chalk.bold.cyan('═══════════════════════════════════════════════════════════════════════\n'));

        const nothing =
            totalUncommitted === 0 &&
            report.unpushedCommits.length === 0 &&
            branchesAhead === 0 &&
            branchesNoUpstream === 0 &&
            report.stashes.length === 0 &&
            report.unpushedTags.length === 0;

        if (nothing) log.success('🎉 Everything is pushed! Nothing pending.');
        else log.warn('⚠️  Some items are NOT pushed. See sections above.');
    } catch (err) {
        if (AS_JSON) console.log(JSON.stringify({ error: err.message }, null, 2));
        else log.error(`Failed: ${err.message}`);
        process.exit(1);
    }
}

run();