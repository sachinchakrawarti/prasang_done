// app_start.js
// D:\Sachin Chakrawarti\Learn\done\prasang_done\app_start.js
// Starts [SERVER] (Node API) and [WEB] (Next.js) together.

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT     = __dirname;
const WEB_DIR  = path.join(ROOT, 'web');
const SERVER   = path.join(ROOT, 'server.js');
const isWin    = process.platform === 'win32';

const procs = [];
let shuttingDown = false;

function start(label, cmd, args, cwd) {
  console.log(`\x1b[36m[${label}]\x1b[0m ${cmd} ${args.join(' ')}  (cwd=${cwd})`);
  const child = spawn(cmd, args, {
    cwd,
    stdio: 'inherit',
    windowsHide: true,
    env: { ...process.env, FORCE_COLOR: '1' },
  });
  child.on('exit', (code) => {
    console.log(`\x1b[33m[${label}]\x1b[0m exited (code=${code})`);
    if (!shuttingDown) shutdown(code ?? 0);
  });
  child.on('error', (err) =>
    console.error(`\x1b[31m[${label}]\x1b[0m ${err.message}`));
  procs.push({ label, child });
}

function startServer() {
  if (!fs.existsSync(SERVER)) {
    console.error(`\x1b[31m[SERVER]\x1b[0m missing ${SERVER}`);
    process.exit(1);
  }
  start('SERVER', process.execPath, [SERVER], ROOT);
}

function startWeb() {
  if (!fs.existsSync(path.join(WEB_DIR, 'package.json'))) {
    console.error(`\x1b[31m[WEB]\x1b[0m no package.json at ${WEB_DIR}`);
    process.exit(1);
  }
  if (isWin) {
    // Explicit cmd.exe — no shell:true, no EINVAL, no DEP0190.
    start('WEB', 'cmd.exe', ['/d', '/s', '/c', 'npm run dev'], WEB_DIR);
  } else {
    start('WEB', 'npm', ['run', 'dev'], WEB_DIR);
  }
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log('\n\x1b[31mStopping server + web...\x1b[0m');
  for (const { child } of procs) {
    try {
      if (isWin && child.pid) {
        spawn('cmd.exe',
          ['/d', '/s', '/c', `taskkill /pid ${child.pid} /f /t`],
          { windowsHide: true });
      } else child.kill('SIGTERM');
    } catch {}
  }
  setTimeout(() => process.exit(code), 600);
}

process.on('SIGINT',  () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

startServer();
startWeb();