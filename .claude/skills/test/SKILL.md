---
name: test
description: Use when asked to test, verify, or check that changes work in Waratel — before committing, after resolving merge conflicts, before merging, or when adding/fixing unit tests (Vitest + Testing Library). Runs the checks in order and reports exactly what passed.
---

# Test (verify changes)

Tools: **Vitest 4** (jsdom, `src/test/setup.ts` mocks `next/navigation`, `next-intl`, `matchMedia`), ESLint 9, `tsc`. Note `next build` skips type errors (`ignoreBuildErrors: true`) — so `tsc` is the only type gate.

Run in order. Stop at the first failing step, report the exact output, fix only if asked (or the task was "test and fix").

## 1. Scope
`git status --short`; changed files: `git diff --name-only HEAD` (+ `--staged`); branch: `git diff --name-only main...HEAD`.

## 2. Leftovers
`grep -rnE "^(<<<<<<<|=======|>>>>>>>)( |$)" src` → empty. No `console.log`/`debugger` added in the diff.

## 3. Translations
`node .claude/skills/i18n/scripts/check-keys.js` → 0 missing (both files must parse).

## 4. Types
`npx tsc --noEmit` → 0 errors (baseline is 0 — keep it).

## 5. Lint (changed files only)
`npx eslint <changed .ts/.tsx>` → no **new** errors. The repo has ~440 pre-existing problems; compare with `git stash`-free judgement: errors on lines you touched are yours to fix.

## 6. Unit tests
`yarn test` (≈70s, 9 files / 64 tests at baseline) or targeted `yarn vitest run <path>`. All must pass.
Writing tests:
- Pure utils → `src/utils/__tests__/<name>.test.ts`; hooks → `src/hooks/__tests/` (note: no trailing underscores); services → `src/services/__tests__/` mocking `@/lib/api-client`.
- `useTranslations` is mocked to return `"ns.key"` — assert on keys, not Arabic text.
- Test behavior (inputs → outputs, rendered text/roles), not implementation details.

## 7. Build (when routes, layouts, server components, config, middleware, proxy or deps changed)
`yarn build` in the background (several minutes, memory-capped). Exit 0 required. On failure read the **first** error.

## Report
```
Leftovers ok | i18n ok | tsc 0 | eslint: 0 new | tests 64/64 | build ok/skipped
Not verified: <flows that need a manual run in yarn dev — ar/en, light/dark, mobile>
```
Never claim a UI "works" from these checks alone.
