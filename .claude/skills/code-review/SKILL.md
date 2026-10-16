---
name: code-review
description: Use when the user asks to review changes, a diff, a branch, a commit, or "my code" in Waratel before committing/merging. Read-only review of the git diff against this project's rules — never edits files.
---

# Code review (read-only)

## Scope
1. `git status`, `git diff`, `git diff --staged`; branch: `git diff main...HEAD`; commit: `git show <hash>`.
2. Review **changed hunks only**; open surrounding lines only when needed.
3. Don't edit. Allowed: `npx eslint <changed files>`, `npx tsc --noEmit`, `node .claude/skills/i18n/scripts/check-keys.js`.

## Check order
1. **Bugs** — nullable API fields, empty arrays, loading vs error branches, missing effect deps/stale closures, query key missing params, missing invalidation, Formik name ≠ schema key, un-awaited `params`, `useSearchParams` without Suspense, wrong token (parent vs child).
2. **Data layer** — direct axios/fetch in components, double toasts (`onError` + interceptor), `isSubmitting` instead of `isPending`, backend URL exposed via `NEXT_PUBLIC_`, proxy header handling changed.
3. **Design system** — hex or raw palette colors instead of tokens (breaks tenant theming + dark mode), physical `pl/pr/ml/mr/left/right`, raw `<button>`, missing loading/empty/error states, inconsistent radius/spacing vs siblings (see `ui-design`).
4. **i18n** — hard-coded strings, key added to only one locale, namespaced `t` used for `validation.*`.
5. **Types** — new `any`, types not matching API, missing `className` passthrough on shared components.
6. **A11y** — icon buttons without `aria-label`, div-buttons, dialogs without title.
7. **Perf** — heavy imports not dynamic, polling never stops, raw `<img>`.
8. **Consistency** — reinvented primitive from `components/ui`/`forms`/`common`, leftover `console.log`, dead code.

## Output
```
### Must fix
- src/…/X.tsx:42 — problem → one-line fix

### Should fix
- …

### Nit
- …
```
Omit empty sections. Nothing wrong → "No issues found" + at most 2 nits. No praise, no diff summary.
