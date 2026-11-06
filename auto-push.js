const chokidar = require('chokidar');
const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');
const notifier = require('node-notifier');
const cliProgress = require('cli-progress');
const chalk = require('chalk');
const ora = require('ora');
const readline = require('readline');

const git = simpleGit();

// ============ CONFIGURATION ============
const DEBOUNCE_MS = 5000;
const BATCH_INTERVAL_MS = 60000;
const FORCE_PUSH_INTERVAL = 120000;

// ===== BRANCH CONFIG =====
const BRANCHES = ['main', 'dev', 'test'];
const DEFAULT_BRANCH = 'dev';               // always pushed here
const AUTO_BRANCH_TIMEOUT_MS = 60 * 1000;   // 60s then auto dev

let timeoutId = null;
let isPushing = false;
let pushCount = 0;
let todayPushes = 0;
let totalFilesChanged = 0;
let startTime = new Date();
let xpPoints = 0;
let achievements = [];
let pendingChanges = new Set();
let isProcessing = false;
let lastPushTime = Date.now();

// Color-coded logging
const log = {
    success: (msg) => console.log(chalk.green(`✅ ${msg}`)),
    warning: (msg) => console.log(chalk.yellow(`⚠️  ${msg}`)),
    error: (msg) => console.log(chalk.red(`❌ ${msg}`)),
    info: (msg) => console.log(chalk.blue(`ℹ️  ${msg}`)),
    highlight: (msg) => console.log(chalk.magenta(`✨ ${msg}`)),
    dim: (msg) => console.log(chalk.dim(msg))
};

// ============ ASK BRANCH (with 60s auto-dev fallback) ============
function askBranch(reason = 'auto push') {
    return new Promise((resolve) => {
        // Non-interactive: go straight to default
        if (!process.stdin.isTTY) {
            log.warning(`Non-interactive terminal — using default branch: ${DEFAULT_BRANCH}`);
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
            log.warning(`⏰ No answer in ${AUTO_BRANCH_TIMEOUT_MS / 1000}s — auto-pushing to ${DEFAULT_BRANCH}`);
            resolve(DEFAULT_BRANCH);
        }, AUTO_BRANCH_TIMEOUT_MS);

        const promptText =
            chalk.cyan(`\n🌿 Branch for ${reason} `) +
            chalk.dim(`[${BRANCHES.join(' / ')}]`) +
            chalk.yellow(` (auto -> ${DEFAULT_BRANCH} in ${AUTO_BRANCH_TIMEOUT_MS / 1000}s): `);

        rl.question(promptText, (answer) => {
            if (answered) return;
            answered = true;
            clearTimeout(timer);
            rl.close();

            const clean = (answer || '').trim().toLowerCase();
            if (!clean) {
                log.warning(`Empty answer — using ${DEFAULT_BRANCH}`);
                return resolve(DEFAULT_BRANCH);
            }
            if (BRANCHES.includes(clean)) return resolve(clean);

            log.warning(`Unknown branch "${clean}" — using ${DEFAULT_BRANCH}`);
            resolve(DEFAULT_BRANCH);
        });
    });
}

// ============ SWITCH BRANCH ============
async function switchBranch(branch) {
    try {
        const current = await git.revparse(['--abbrev-ref', 'HEAD']);
        if (current.trim() === branch) return true;

        // Check for uncommitted changes that might block checkout
        const status = await git.status();
        if (status.files.length > 0) {
            log.warning(`You have uncommitted changes. Stashing before switching to ${branch}...`);
            await git.stash(['push', '-u', '-m', `auto-stash before switch to ${branch}`]);
        }

        await git.checkout(branch);
        log.success(`Switched to branch: ${chalk.cyan(branch)}`);

        // Restore stashed changes (if we stashed)
        try {
            const stashList = await git.stashList();
            if (stashList.total > 0 && stashList.all[0] && stashList.all[0].message.includes('auto-stash before switch')) {
                await git.stash(['pop']);
                log.info('Restored stashed changes');
            }
        } catch (e) { /* nothing to pop */ }

        return true;
    } catch (err) {
        log.error(`Failed to switch to ${branch}: ${err.message}`);
        return false;
    }
}

// ============ AUTO COMMIT MESSAGE GENERATOR ============
function generateCommitMessage(files, pushNumber) {
    const fileTypes = {
        '.md': '📝 Update documentation',
        '.js': '⚡ Update JavaScript code',
        '.jsx': '⚛️ Update React component',
        '.ts': '📘 Update TypeScript code',
        '.tsx': '⚛️ Update TypeScript React component',
        '.css': '🎨 Update styles',
        '.scss': '🎨 Update SCSS styles',
        '.html': '🌐 Update HTML',
        '.json': '📦 Update configuration',
        '.yml': '🔧 Update YAML config',
        '.yaml': '🔧 Update YAML config',
        '.py': '🐍 Update Python code',
        '.java': '☕ Update Java code',
        '.cpp': '⚙️ Update C++ code',
        '.c': '⚙️ Update C code',
        '.go': '🐹 Update Go code',
        '.rs': '🦀 Update Rust code',
        '.rb': '💎 Update Ruby code',
        '.php': '🐘 Update PHP code',
        '.sh': '🐚 Update shell script',
        '.bat': '🪟 Update batch script',
        '.ps1': '🖥️ Update PowerShell script',
        '.png': '🖼️ Update image',
        '.jpg': '🖼️ Update image',
        '.jpeg': '🖼️ Update image',
        '.svg': '🎨 Update SVG',
        '.pdf': '📄 Update PDF',
        '.txt': '📄 Update text file',
        '.env': '🔐 Update environment variables',
        '.gitignore': '🚫 Update gitignore',
        'Dockerfile': '🐳 Update Dockerfile',
        'docker-compose.yml': '🐳 Update Docker Compose',
        'package.json': '📦 Update npm dependencies',
        'package-lock.json': '📦 Update npm lockfile',
        'README.md': '📖 Update README'
    };

    const types = {};
    const fileNames = [];

    files.forEach(file => {
        const ext = path.extname(file);
        const base = path.basename(file);
        const key = ext || base;
        types[key] = (types[key] || 0) + 1;
        fileNames.push(base);
    });

    let maxCount = 0;
    let mainType = '📁 Update files';
    for (const [ext, count] of Object.entries(types)) {
        if (count > maxCount) {
            maxCount = count;
            mainType = fileTypes[ext] || `📁 Update ${ext || 'files'}`;
        }
    }

    const total = files.length;
    let message = '';

    if (total === 1) {
        const singleFile = fileNames[0];
        const ext = path.extname(singleFile);
        message = fileTypes[ext] || `📁 Update ${singleFile}`;
    } else if (total >= 10) {
        message = `📦 Bulk update ${total} files`;
    } else if (total >= 5) {
        message = `📚 Update ${total} files`;
    } else {
        const countText = ` (${total} files)`;
        message = mainType.includes('Update')
            ? mainType.replace('Update', `Update ${total}`)
            : `${mainType}${countText}`;
    }

    return `[#${pushNumber}] ${message}`;
}

// Achievements configuration
const ACHIEVEMENTS = {
    FIRST_PUSH: { id: 'first_push', name: 'First Push', icon: '🏆', condition: (count) => count === 1 },
    TEN_PUSHES: { id: 'ten_pushes', name: '10 Pushes', icon: '🥈', condition: (count) => count === 10 },
    FIFTY_PUSHES: { id: 'fifty_pushes', name: '50 Pushes', icon: '🥇', condition: (count) => count === 50 },
    HUNDRED_PUSHES: { id: 'hundred_pushes', name: '100 Pushes', icon: '👑', condition: (count) => count === 100 },
    NIGHT_OWL: { id: 'night_owl', name: 'Night Owl', icon: '🦉', condition: (count, hour) => hour >= 0 && hour < 5 },
    EARLY_BIRD: { id: 'early_bird', name: 'Early Bird', icon: '🐦', condition: (count, hour) => hour >= 5 && hour < 8 },
    PRODUCTIVE_DAY: { id: 'productive_day', name: 'Productive Day', icon: '📈', condition: (count, hour, todayCount) => todayCount >= 10 },
};

const IGNORED_PATHS = [
    /(^|[\/\\])\../,
    /node_modules/,
    /\.git/,
    /build/,
    /dist/,
    /\.docusaurus/,
    /\.cache/,
    /package-lock\.json/,
    /Out-Null/,
    /logs/,
    /reports/
];

function getFormattedDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    return { date, time, full: `${date} ${time}`, hour: now.getHours() };
}

function printSeparator(char = '═', length = 70) {
    console.log(chalk.dim(char.repeat(length)));
}

function checkAchievements(count, hour, todayCount) {
    const unlocked = [];
    for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
        if (!achievements.includes(key)) {
            let condition = false;
            if (key === 'NIGHT_OWL' || key === 'EARLY_BIRD') condition = achievement.condition(count, hour);
            else if (key === 'PRODUCTIVE_DAY') condition = achievement.condition(count, hour, todayCount);
            else condition = achievement.condition(count);
            if (condition) {
                achievements.push(key);
                unlocked.push(achievement);
            }
        }
    }
    return unlocked;
}

function sendNotification(title, message) {
    try {
        notifier.notify({ title, message, sound: true, wait: false });
    } catch (e) {}
}

function saveToLog(data) {
    try {
        const logDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

        const logFile = path.join(logDir, `push-log-${new Date().toISOString().split('T')[0]}.txt`);
        const logEntry = `${new Date().toISOString()} | Push #${pushCount} | ${data.branch} | ${data.filesChanged} files | ${data.commitHash} | ${data.commitMessage}\n`;
        fs.appendFileSync(logFile, logEntry);

        const jsonLog = path.join(logDir, 'push-history.json');
        let history = [];
        if (fs.existsSync(jsonLog)) history = JSON.parse(fs.readFileSync(jsonLog, 'utf8'));
        history.push({
            timestamp: new Date().toISOString(),
            pushNumber: pushCount,
            branch: data.branch,
            filesChanged: data.filesChanged || 0,
            commitHash: data.commitHash || '',
            commitMessage: data.commitMessage || '',
            xpEarned: data.xpEarned || 0
        });
        fs.writeFileSync(jsonLog, JSON.stringify(history, null, 2));
    } catch (e) {}
}

function generateReport() {
    const { date, time } = getFormattedDateTime();
    const uptime = Math.floor((new Date() - startTime) / 1000);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;

    return `
╔═══════════════════════════════════════════════════════════════╗
║                    📊 PUSH REPORT                           ║
╚═══════════════════════════════════════════════════════════════╝

📅 Date: ${date}
⏰ Time: ${time}
⏱️  Uptime: ${hours}h ${minutes}m ${seconds}s
🌿 Default Branch: ${DEFAULT_BRANCH}

📊 Statistics:
   • Total Pushes: ${pushCount}
   • Today's Pushes: ${todayPushes}
   • Total Files Changed: ${totalFilesChanged}
   • XP Points: ${xpPoints} ⭐

🏆 Achievements Unlocked: ${achievements.length}
   ${achievements.map(a => `   ${ACHIEVEMENTS[a]?.icon || '🏅'} ${ACHIEVEMENTS[a]?.name || a}`).join('\n   ') || '   None yet'}

📈 Performance:
   • Average Files per Push: ${pushCount > 0 ? (totalFilesChanged / pushCount).toFixed(1) : 0}
   • Push Rate: ${pushCount > 0 ? (pushCount / (uptime / 3600)).toFixed(1) : 0} pushes/hour

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
}

// ============ MAIN PUSH FUNCTION ============
async function pushChanges(trigger = 'auto', forcedBranch = null) {
    if (isPushing || isProcessing) {
        log.warning('Already pushing, skipping...');
        return;
    }
    isProcessing = true;

    try {
        const status = await git.status();

        if (status.files.length === 0 && status.staging.length === 0) {
            const { time } = getFormattedDateTime();
            log.warning(`No changes to commit (${time})`);
            isProcessing = false;
            return;
        }

        // ===== ASK FOR BRANCH =====
        const triggerText =
            trigger === 'timer' ? '⏰ Scheduled' :
            trigger === 'force' ? '💪 Force' :
            trigger === 'final' ? '🛑 Final' :
            trigger === 'initial' ? '🚀 Initial' : '📦 Batch';

        const chosenBranch = forcedBranch || await askBranch(triggerText);

        const switched = await switchBranch(chosenBranch);
        if (!switched) {
            log.error(`Cannot push — failed to switch to ${chosenBranch}`);
            isProcessing = false;
            return;
        }

        isPushing = true;

        const progressBar = new cliProgress.SingleBar({
            format: '📤 Push Progress |' + chalk.cyan('{bar}') + '| {percentage}% | {value}/{total} steps',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true,
            clearOnComplete: true
        });

        // Re-check status after checkout (branch may have different state)
        const status2 = await git.status();
        const filePaths = status2.files.map(f => f.path);
        const uniqueFiles = pendingChanges.size || filePaths.length;

        pushCount++;
        todayPushes++;
        totalFilesChanged += filePaths.length;

        const { full, hour } = getFormattedDateTime();
        const commitMessage = generateCommitMessage(filePaths, pushCount);

        printSeparator('═');
        log.highlight(`📦 BATCH PUSH #${pushCount} — ${triggerText} — ${full}`);
        printSeparator('─');
        log.info(`🌿 Branch: ${chalk.cyan(chosenBranch)}`);
        log.info(`📄 Total files changed: ${filePaths.length}`);
        log.info(`📄 Unique files: ${uniqueFiles}`);
        log.info(`📝 Commit message: ${chalk.yellow(commitMessage)}`);

        if (filePaths.length > 0 && filePaths.length <= 20) {
            filePaths.forEach(file => {
                if (!file.includes('logs/') && !file.includes('reports/')) {
                    console.log(`   📄 ${chalk.cyan(file)}`);
                }
            });
        } else if (filePaths.length > 20) {
            log.info(`Showing first 20 of ${filePaths.length} files:`);
            let count = 0;
            filePaths.forEach(file => {
                if (!file.includes('logs/') && !file.includes('reports/') && count < 20) {
                    console.log(`   📄 ${chalk.cyan(file)}`);
                    count++;
                }
            });
            log.dim(`   ... and ${filePaths.length - count} more`);
        }

        printSeparator('─');
        progressBar.start(4, 0);

        progressBar.update(1);
        log.info('📤 Staging all files...');
        await git.add('.');

        progressBar.update(2);
        log.info('📝 Committing batch...');
        const commitResult = await git.commit(commitMessage);

        if (commitResult.commit) {
            progressBar.update(3);
            log.info(`📤 Pushing ${chosenBranch} to origin/${chosenBranch}...`);
            await git.push('origin', chosenBranch);

            progressBar.update(4);
            progressBar.stop();

            const xpEarned = Math.floor(filePaths.length * 2) + 15;
            xpPoints += xpEarned;

            log.success(`✅ Batch push #${pushCount} successful!`);
            log.success(`✅ Branch: ${chosenBranch}`);
            log.success(`✅ Committed: ${commitResult.commit.substring(0, 7)}`);
            console.log(chalk.magenta(`⭐ +${xpEarned} XP (Total: ${xpPoints} XP)`));

            pendingChanges.clear();
            lastPushTime = Date.now();

            const uptime = Math.floor((new Date() - startTime) / 1000);
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = uptime % 60;
            log.info(`⏱️  Uptime: ${hours}h ${minutes}m ${seconds}s`);

            const unlockedAchievements = checkAchievements(pushCount, hour, todayPushes);
            if (unlockedAchievements.length > 0) {
                printSeparator('─');
                log.highlight('🏆 ACHIEVEMENT UNLOCKED! 🏆');
                unlockedAchievements.forEach(ach => {
                    console.log(chalk.magenta(`   ${ach.icon} ${ach.name}`));
                    sendNotification(`🏆 Achievement Unlocked!`, `${ach.icon} ${ach.name}`);
                });
            }

            sendNotification(
                `✅ Push #${pushCount} → ${chosenBranch}`,
                `${filePaths.length} files pushed | ⭐ +${xpEarned} XP`
            );

            saveToLog({
                branch: chosenBranch,
                filesChanged: filePaths.length,
                commitHash: commitResult.commit.substring(0, 7),
                commitMessage,
                xpEarned
            });

            printSeparator('═');
            log.highlight(`✨ Batch #${pushCount} complete!\n`);
        } else {
            progressBar.stop();
            log.warning('Nothing to commit');
            printSeparator('─');
        }
    } catch (error) {
        log.error(`Error: ${error.message}`);
        if (error.message.includes('Authentication failed')) {
            log.warning('💡 Please check your Git credentials');
            sendNotification('❌ Push Failed', 'Authentication error');
        }
        printSeparator('─');
    } finally {
        isPushing = false;
        isProcessing = false;
    }
}

// ============ FILE WATCHER ============
const watcher = chokidar.watch('.', {
    ignored: (p) => IGNORED_PATHS.some(rx => rx.test(p)),
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 100 }
});

const spinner = ora({
    text: 'Watching for file changes...',
    color: 'cyan',
    spinner: 'dots12'
}).start();

watcher
    .on('change', (filePath) => {
        if (filePath.includes('logs/') || filePath.includes('reports/')) return;
        const { time } = getFormattedDateTime();
        pendingChanges.add(filePath);
        spinner.text = `📝 Collecting: ${path.basename(filePath)} (${pendingChanges.size} files) (${time})`;
        spinner.color = 'yellow';
        schedulePush();
    })
    .on('add', (filePath) => {
        if (filePath.includes('logs/') || filePath.includes('reports/')) return;
        const { time } = getFormattedDateTime();
        pendingChanges.add(filePath);
        spinner.text = `➕ Added: ${path.basename(filePath)} (${pendingChanges.size} files) (${time})`;
        spinner.color = 'green';
        schedulePush();
    })
    .on('unlink', (filePath) => {
        if (filePath.includes('logs/') || filePath.includes('reports/')) return;
        const { time } = getFormattedDateTime();
        pendingChanges.add(filePath);
        spinner.text = `➖ Deleted: ${path.basename(filePath)} (${pendingChanges.size} files) (${time})`;
        spinner.color = 'red';
        schedulePush();
    })
    .on('error', (error) => {
        spinner.text = `⚠️  Watcher error: ${error.message}`;
        spinner.color = 'red';
    });

function schedulePush() {
    if (timeoutId) clearTimeout(timeoutId);
    spinner.text = `⏳ Waiting for changes to settle... (${pendingChanges.size} files collected)`;
    spinner.color = 'yellow';
    timeoutId = setTimeout(() => {
        spinner.stop();
        if (pendingChanges.size > 0) {
            log.info(`📦 Pushing all ${pendingChanges.size} files together...`);
            pushChanges('batch');
        }
        spinner.start();
        timeoutId = null;
    }, DEBOUNCE_MS);
}

// Scheduled batch
setInterval(async () => {
    try {
        const status = await git.status();
        if (status.files.length > 0) {
            spinner.stop();
            log.info('⏰ Scheduled batch push triggered');
            await pushChanges('timer');
            spinner.start();
        }
    } catch (e) {}
}, BATCH_INTERVAL_MS);

// Force push
setInterval(async () => {
    try {
        const status = await git.status();
        if (status.files.length > 0) {
            spinner.stop();
            log.warning('💪 Force push triggered');
            await pushChanges('force');
            spinner.start();
        }
    } catch (e) {}
}, FORCE_PUSH_INTERVAL);

// Graceful shutdown
process.on('SIGINT', async () => {
    spinner.stop();
    printSeparator('═');
    log.info('\n👋 Shutting down auto-push...');
    log.info(`📅 Stopped at: ${getFormattedDateTime().full}`);
    log.info(`📊 Total batch pushes: ${pushCount}`);
    log.info(`📊 Total files pushed: ${totalFilesChanged}`);
    log.info(`⭐ Total XP: ${xpPoints}`);
    log.info(`🏆 Achievements: ${achievements.length}`);

    try {
        const status = await git.status();
        if (status.files.length > 0) {
            log.info('📤 Final push — choosing branch...');
            await pushChanges('final');
        }
    } catch (e) {}

    const report = generateReport();
    console.log(report);

    const reportDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir);
    const reportFile = path.join(reportDir, `report-${new Date().toISOString().split('T')[0]}.txt`);
    fs.writeFileSync(reportFile, report);
    log.info(`📊 Report saved: ${reportFile}`);

    await watcher.close();
    log.success('✅ Auto-push stopped');
    printSeparator('═');
    process.exit(0);
});

// Startup
console.log(chalk.bold.cyan('╔═══════════════════════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║   📦 BATCH AUTO-PUSH WATCHER STARTED                             ║'));
console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════════════════╝'));
console.log(`\n📁 Root: ${chalk.cyan(process.cwd())}`);
console.log(`🌿 Branches: ${chalk.cyan(BRANCHES.join(' / '))}`);
console.log(`🎯 Default: ${chalk.green(DEFAULT_BRANCH)}`);
console.log(`⏰ Auto-answer timeout: ${chalk.yellow(AUTO_BRANCH_TIMEOUT_MS / 1000)}s`);
console.log(`⏱️  Debounce: ${chalk.yellow(DEBOUNCE_MS / 1000)}s`);
console.log(`⏰ Scheduled Batch: ${chalk.yellow(BATCH_INTERVAL_MS / 60000)} min`);
console.log(`💪 Force Push: ${chalk.yellow(FORCE_PUSH_INTERVAL / 60000)} min`);
console.log(`📅 Started: ${chalk.green(getFormattedDateTime().full)}`);
console.log('🔒 Press Ctrl+C to stop\n');
printSeparator('─');

// Initial check
setTimeout(async () => {
    try {
        const status = await git.status();
        if (status.files.length > 0) {
            const { full } = getFormattedDateTime();
            log.info(`📄 Found ${status.files.length} uncommitted changes at ${full}`);
            spinner.stop();
            await pushChanges('initial');
            spinner.start();
        } else {
            log.success('✅ Repository clean');
            printSeparator('─');
        }
    } catch (e) {}
}, 1000);