---
name: merge-conflicts
description: Use when merging main into a feature branch (or a branch into main), pulling with conflicts, resolving git merge/rebase conflicts, or when git status shows "both modified" files in Waratel.
---

# Merging & resolving conflicts

## Before
1. `git status` — tree must be clean; otherwise ask to commit or stash (never discard).
2. `git fetch` then `git merge origin/main` (or the named branch). Don't rebase shared branches unless asked.

## Resolve
List: `git diff --name-only --diff-filter=U`. For each file understand both sides first (`git log --oneline -3 <side> -- <file>`).

- **`src/i18n/messages/ar.json` / `en.json`** (most common): union of keys. Same key, different value → prefer main's wording unless the branch changed it deliberately. Fix commas/braces, then `node .claude/skills/i18n/scripts/check-keys.js`.
- **`src/config/navigation.ts`**: keep items from both sides, no duplicates, keep order sensible per role.
- **`src/hooks/api/*` / `src/services/*`**: keep all methods; check key factories don't diverge.
- **`src/store/index.ts`**: keep every reducer.
- **`src/middleware.ts`**: union of CSP hosts / Permissions-Policy entries.
- **`src/app/globals.css`**: union of tokens; same token, different value → ask.
- **Components**: combine intents; if they truly conflict, stop and describe both sides.
- **`yarn.lock`**: take main's, then `yarn install`. Never create `package-lock.json`.
- Never blanket `git checkout --ours/--theirs .`.

## After
1. `git diff --check` + grep for `<<<<<<<|>>>>>>>`.
2. Run the `test` skill (i18n, tsc, eslint on conflicted files, `yarn test`; build if config/middleware conflicted).
3. `git add` resolved files, show a summary, wait for OK before `git commit`. Don't push unless asked.

## Report
Files conflicted and how each was resolved (union / main / branch / combined) + anything needing a manual check.
