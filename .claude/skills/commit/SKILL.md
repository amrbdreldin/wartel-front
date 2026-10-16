---
name: commit
description: Use when asked to commit, write a commit message, or "commit my changes" in Waratel. Writes a Conventional Commit message from the staged diff and commits after confirmation.
model: haiku
---

# Commit

1. `git status --short` and `git diff --staged --stat`.
   - Nothing staged → ask whether to stage all (`git add -A`) or specific files. Never stage `.env*`, `.claude/settings.local.json`, `tsconfig.tsbuildinfo`, generated `public/sw.js`/`public/workbox-*.js`.
2. Read the staged diff (`git diff --staged`); if > 500 lines, read the key files and rely on `--stat`.
3. Message (match repo history, e.g. `feat: add …`, `fix(build): …`, `refactor: …`):
   - `type(scope): summary` — feat, fix, refactor, style, perf, test, docs, chore
   - imperative, lowercase, no period, ≤ 72 chars; scope = feature (`contact`, `teacher-sessions`) when clear
   - optional body: 1–3 bullets on *why*
   - unrelated changes → suggest separate commits
4. Show the message and wait for OK unless told "commit directly".
5. `git commit -m "…"`. Don't push unless asked.
