# Git Workflow Guide — Prasang

Complete command reference for the `prasang_done` monorepo.

**Repo layout:**
- `db/` — Node automation (Drizzle + libSQL)
- `web/` — Next.js 16 frontend
- `docs/` — documentation

**Branch model:**
```
main   ← production (protected)
test   ← staging / QA
dev    ← daily integration
feature/*, fix/*, chore/* ← per-task branches off dev
```

Flow: `feature/*` → `dev` → `test` → `main`

---

## 🚀 One-Time Setup

```powershell
# Move to repo root
cd "D:\Sachin Chakrawarti\Learn\Done\prasang_done"

# Verify remotes
git remote -v

# Set identity (if not already)
git config user.name "Sachin Chakrawarti"
git config user.email "your@email.com"

# Recommended for Windows
git config --global core.autocrlf true
```

---

## 🌿 Initial Branch Creation (Run Once)

```powershell
# From clean main
git checkout main
git pull origin main

# Create dev
git checkout -b dev
git push -u origin dev

# Create test
git checkout -b test
git push -u origin test

# Return to dev (daily driver)
git checkout dev
```

---

## 🔍 Inspect State

```powershell
git status                    # working tree status
git branch                    # local branches
git branch -a                 # local + remote
git branch -r                 # remote only
git tag                       # all tags
git log --oneline -10         # last 10 commits
git log --oneline --graph --all   # visual history
git remote -v                 # remotes
git diff                      # unstaged changes
git diff --staged             # staged changes
git diff <file>               # one file
```

---

## 🔄 Daily Development Flow

### Start a new task

```powershell
git checkout dev
git pull origin dev
git checkout -b feature/short-name
```

Naming:
- `feature/poem-detail-redesign`
- `fix/navbar-mobile-overflow`
- `chore/upgrade-next`
- `refactor/api-routes`

### Save work

```powershell
git status
git add <file>                # one file
git add .                     # everything
git commit -m "feat: add bookmark API"
git push -u origin feature/short-name
```

### Commit message convention

```
feat:      new feature
fix:       bug fix
chore:     deps / config / build
refactor:  no behavior change
docs:      docs only
style:     formatting only
test:      tests
perf:      performance
```

---

## 🔀 Merging (Local Fast Path)

### feature → dev

```powershell
git checkout dev
git pull origin dev
git merge feature/short-name
git push origin dev
git branch -d feature/short-name
git push origin --delete feature/short-name
```

### dev → test (staging)

```powershell
git checkout test
git pull origin test
git merge dev
git push origin test
```

### test → main (production)

```powershell
git checkout main
git pull origin main
git merge test
git push origin main
```

---

## 🔀 Merging (PR Flow — Recommended)

```powershell
# 1. Push feature branch
git push -u origin feature/short-name

# 2. Open PR on GitHub:
#    feature/short-name → dev
#
# 3. After approval + merge on GitHub, clean up locally:
git checkout dev
git pull origin dev
git branch -d feature/short-name
```

---

## 🏷️ Releases (Tags)

```powershell
# On main, after merge
git checkout main
git pull origin main
git tag -a v1.0.0 -m "First production release"
git push origin v1.0.0

# List tags
git tag

# Delete a tag (local + remote)
git tag -d v1.0.0
git push origin --delete v1.0.0
```

Semantic versioning: `v<major>.<minor>.<patch>`
- breaking → `v2.0.0`
- feature → `v1.1.0`
- fix → `v1.0.1`

---

## 🚨 Hotfix Flow (Prod is broken)

```powershell
# Branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# Fix, commit, push
git add .
git commit -m "fix: critical bug in prod"
git push -u origin hotfix/critical-bug

# Merge to main
git checkout main
git merge hotfix/critical-bug
git push origin main

# Also merge to dev (so fix isn't lost)
git checkout dev
git merge hotfix/critical-bug
git push origin dev

# Optionally tag
git tag -a v1.0.1 -m "Hotfix 1.0.1"
git push origin v1.0.1

# Cleanup
git branch -d hotfix/critical-bug
git push origin --delete hotfix/critical-bug
```

---

## 🧹 Undo / Fix Mistakes

### Discard unstaged changes to a file
```powershell
git restore path/to/file
```

### Discard ALL unstaged changes
```powershell
git restore .
```

### Unstage a file (keep changes)
```powershell
git restore --staged path/to/file
```

### Amend last commit message
```powershell
git commit --amend -m "new message"
```

### Amend last commit (add forgotten file)
```powershell
git add forgotten-file
git commit --amend --no-edit
```

### Undo last commit (keep changes staged)
```powershell
git reset --soft HEAD~1
```

### Undo last commit (keep changes unstaged)
```powershell
git reset HEAD~1
```

### Undo last commit (DISCARD changes — dangerous)
```powershell
git reset --hard HEAD~1
```

### Revert a commit (safe for pushed history)
```powershell
git revert <commit-hash>
git push origin <branch>
```

---

## 📦 Stashing

```powershell
git stash                       # save current work
git stash -u                    # include untracked files
git stash list                  # list stashes
git stash pop                   # apply + drop latest
git stash apply                 # apply, keep stash
git stash drop                  # drop latest
git stash clear                 # drop all
```

---

## 🔄 Sync with Remote

```powershell
git fetch origin                # download, don't merge
git pull origin <branch>        # fetch + merge
git pull --rebase origin <branch>   # fetch + rebase (cleaner)
git push origin <branch>
```

### If push rejected (remote has new commits)
```powershell
git pull --rebase origin <branch>
git push origin <branch>
```

---

## 🗑️ Branch Cleanup

```powershell
# Delete local branch
git branch -d feature/short-name       # safe (must be merged)
git branch -D feature/short-name       # force

# Delete remote branch
git push origin --delete feature/short-name

# Prune stale remote refs
git fetch --prune
```

---

## 🔍 Searching History

```powershell
git log --oneline --all --grep="poem"        # search commit messages
git log -S "functionName" --oneline          # search code changes
git log -- path/to/file                      # history of a file
git blame path/to/file                       # who changed what
git show <commit-hash>                       # show a commit
```

---

## 🧾 .gitignore (Recommended)

```
# Node
node_modules/
.next/
out/
dist/
build/

# Env
.env
.env.local
.env*.local

# Logs
*.log
npm-debug.log*
yarn-error.log*
lint-baseline.txt

# OS
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/
```

---

## 📄 .gitattributes (Line Endings)

Create at repo root:

```gitattributes
* text=auto

package-lock.json text eol=lf
**/package-lock.json text eol=lf

*.bat text eol=crlf
*.cmd text eol=crlf

*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.woff binary
*.woff2 binary
```

Then normalize:
```powershell
git add --renormalize .
git commit -m "chore: normalize line endings"
```

---

## 🧩 Monorepo — Install & Build

```powershell
# db/
cd db
npm install
npm run sync:stats
npm run test:db

# web/
cd ..\web
npm install
npm run dev
npm run build
npm run lint
```

---

## ✅ Pre-Commit Checklist

Before every commit:

```powershell
git status                    # review what's staged
git diff --staged             # review the actual diff
npm run lint                  # in web/
npm run build                 # in web/ (if code changed)
```

Then:
```powershell
git commit -m "type: short description"
git push
```

---

## 🎯 Typical Day — Cheat Sheet

```powershell
# Morning
git checkout dev
git pull origin dev

# New task
git checkout -b feature/cool-thing

# Work...
git add .
git commit -m "feat: cool thing"
git push -u origin feature/cool-thing

# PR on GitHub → merge to dev

# End of day
git checkout dev
git pull origin dev
```

---

## 🛡️ Branch Protection (GitHub UI)

Settings → Branches → Add rule:

**`main`:**
- ✅ Require pull request
- ✅ Require approvals (1+)
- ✅ Require status checks
- ❌ Allow force pushes
- ❌ Allow deletions

**`test`:** same, looser approvals.

**`dev`:** at minimum, no force push.

---

## 🆘 Emergency — Recover Lost Work

```powershell
# Find lost commits
git reflog

# Recover a commit
git checkout <hash-from-reflog>
git checkout -b recovered-branch

# Recover a deleted branch
git checkout -b recovered-branch <hash>
```

---

## 🏷️ Tag Reference (This Project)

```powershell
# Baseline before refactor (already created)
pre-refactor

# Release tags (create as you ship)
v0.1.0    # initial
v0.2.0    # after Phase 1-3
v1.0.0    # production-ready
```

---

## 📊 Branch Roles Summary

| Branch | Purpose | Deploys | Merge from | Merge to |
|---|---|---|---|---|
| `main` | Production | prod | `test`, `hotfix/*` | — |
| `test` | Staging / QA | staging | `dev`, `hotfix/*` | `main` |
| `dev` | Integration | dev preview | `feature/*`, `fix/*`, `chore/*`, `hotfix/*` | `test` |
| `feature/*` | One task | preview | — | `dev` |
| `fix/*` | Bug fix | preview | — | `dev` |
| `chore/*` | Maintenance | preview | — | `dev` |
| `hotfix/*` | Prod emergency | — | `main` | `main` + `dev` |

---

## 🧠 Golden Rules

1. **Never commit directly to `main`.** Always PR.
2. **Pull before you branch.** `git checkout dev && git pull`
3. **One task per branch.** No mixing features.
4. **Small, frequent commits.** Not one giant "done" commit.
5. **Push your branch daily.** Don't lose work.
6. **Delete merged branches.** Both local and remote.
7. **Tag every production release.** `v1.2.3`
8. **Hotfix from `main`, merge back to `dev`.** Don't skip this.
9. **Never `git reset --hard` on shared branches.**
10. **Read `git diff --staged` before committing.**

---

*Last updated: 2026-09-15*