#!/usr/bin/env node
/**
 * find-unpushed.js
 * Finds everything that is NOT pushed to the remote.
 * READ-ONLY — never commits, stages, or pushes anything.
 *
 * Usage:
 *   node find-unpushed.js              # full report
 *   node find-unpushed.js --json       # machine-readable output
 *   node find-unpushed.js --short      # compact summary
 */

const simpleGit = require('simple-git');
const chalk = require('chalk');
const path = require('path');

const args = process.argv.slice(2);
const AS_JSON = args.includes('--json');
const SHORT = args.includes('--short');

const git = simpleGit();

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

async function run() {
    const report = {
        cwd: process.cwd(),
        branch: null,
        upstream: null,
        uncommitted: { modified: [], staged: [], untracked: [], deleted: [], renamed: [] },
        unpushedCommits: [],
        branches: [],
        stashes: [],
        unpushedTags: [],
        summary: {},
    };

    try {
        // ---------- Basic info ----------
        const branch = (await git.revparse(['--abbrev-ref', 'HEAD'])).trim();
        report.branch = branch;

        let upstream = null;
        try {
            upstream = (await git.revparse(['--abbrev-ref', '--symbolic-full-name', '@{u}'])).trim();
        } catch {
            upstream = null;
        }
        report.upstream = upstream;

        if (!AS_JSON) {
            log.header('🔍 UNPUSHED FINDER');
            log.dim(`Repo: ${process.cwd()}`);
            log.dim(`Branch: ${branch}`);
            log.dim(`Upstream: ${upstream || chalk.yellow('(none)')}`);
        }

        // ---------- 1. Uncommitted changes ----------
        const status = await git.status();
        report.uncommitted.modified = status.modified || [];
        report.uncommitted.staged = status.staged || [];
        report.uncommitted.untracked = status.not_added || [];
        report.uncommitted.deleted = status.deleted || [];
        report.uncommitted.renamed = (status.renamed || []).map(r => `${r.from} → ${r.to}`);

        if (!AS_JSON) {
            log.section('📝 UNCOMMITTED CHANGES');
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

        // ---------- 2. Unpushed commits on current branch ----------
        if (upstream) {
            try {
                const logOut = await git.log({ from: `${upstream}..${branch}`, '--max-count': 100 });
                report.unpushedCommits = logOut.all.map(c => ({
                    hash: c.hash.substring(0, 7),
                    date: c.date,
                    message: c.message,
                    author: c.author_name,
                }));
            } catch (e) { /* branch has no remote counterpart yet */ }
        }

        // If no upstream, treat all local commits as "unpushed candidates"
        if (!upstream) {
            try {
                const all = await git.log({ maxCount: 20 });
                report.unpushedCommits = all.all.map(c => ({
                    hash: c.hash.substring(0, 7),
                    date: c.date,
                    message: c.message,
                    author: c.author_name,
                    note: 'no upstream'
                }));
            } catch (e) {}
        }

        if (!AS_JSON) {
            log.section(`⬆️  UNPUSHED COMMITS (${branch})`);
            if (report.unpushedCommits.length === 0) {
                log.success('No unpushed commits');
            } else {
                log.item(chalk.yellow(`${report.unpushedCommits.length} commit(s) not on remote:`));
                report.unpushedCommits.forEach(c => {
                    log.dim(`${c.hash}  ${c.date}  ${c.author}`);
                    log.dim(`         ${c.message}`);
                });
            }
        }

        // ---------- 3. All local branches vs their remotes ----------
        const branchSummary = await git.branch(['-vv']);
        report.branches = branchSummary.all.map(line => {
            // Format from simple-git like: "* dev   abc1234 [origin/dev: ahead 2] msg"
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

        if (!AS_JSON) {
            log.section('🌿 BRANCHES vs REMOTE');
            const pendingBranches = report.branches.filter(b => b.ahead > 0 || !b.hasUpstream);
            if (pendingBranches.length === 0) {
                log.success('All branches up to date with remote');
            } else {
                report.branches.forEach(b => {
                    if (b.ahead > 0 && b.hasUpstream) {
                        log.warn(`${b.name}  →  ahead ${b.ahead} commit(s) of ${b.track}`);
                    } else if (!b.hasUpstream) {
                        log.warn(`${b.name}  →  no upstream (never pushed)`);
                    } else if (b.behind > 0) {
                        log.dim(`${b.name}  →  behind ${b.behind} (incoming)`);
                    } else {
                        log.dim(`${b.name}  →  up to date`);
                    }
                });
            }
        }

        // ---------- 4. Stashes ----------
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
        const totalUncommitted =
            report.uncommitted.modified.length +
            report.uncommitted.staged.length +
            report.uncommitted.untracked.length +
            report.uncommitted.deleted.length +
            report.uncommitted.renamed.length;

        const branchesAhead = report.branches.filter(b => b.ahead > 0).length;
        const branchesNoUpstream = report.branches.filter(b => !b.hasUpstream).length;

        report.summary = {
            totalUncommitted,
            unpushedCommitsCurrent: report.unpushedCommits.length,
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
            console.log(chalk.bold.cyan('\n📊 SUMMARY'));
            console.log(`  Uncommitted:      ${totalUncommitted}`);
            console.log(`  Unpushed commits: ${report.unpushedCommits.length} (${branch})`);
            console.log(`  Branches ahead:   ${branchesAhead}`);
            console.log(`  No-upstream:      ${branchesNoUpstream}`);
            console.log(`  Stashes:          ${report.stashes.length}`);
            console.log(`  Unpushed tags:    ${report.unpushedTags.length}`);
            return;
        }

        console.log(chalk.bold.cyan('\n═══════════════════════════════════════════════════════════════════════'));
        console.log(chalk.bold.cyan('                       📊 SUMMARY                                       '));
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