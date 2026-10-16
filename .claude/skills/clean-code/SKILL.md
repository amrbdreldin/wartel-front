---
name: clean-code
description: Use when the user asks to refactor, clean up, simplify, split a large component, extract a hook or shared component, remove duplication or dead code, fix lint errors/any types, or rename things in Waratel — changes meant to improve structure without changing behavior.
---

# Refactoring in Waratel

## Ground rules
- **Behavior must not change**: same rendered output, API calls/payloads, Redux actions, translations, query keys.
- Refactor only what was asked; keep it separate from feature work.
- Small steps, each passing `npx tsc --noEmit` + eslint on touched files. Run `yarn test` if utils/hooks/services moved.
- Finish with the list of screens the user should click through.

## Signals (not laws)
- Component > ~250 lines or > 3 responsibilities → split into `_components/`.
- Inline `useQuery` with an ad-hoc key in a page → move to `src/hooks/api/use<Domain>Queries.ts` with a key factory.
- Same markup in 3+ places → shared component (`src/components/common/`); 2 places → leave unless they must stay in sync.
- Known duplication: `ScrollToFieldError` (forms/ vs register/_components/); hand-rolled status pills/stat cards across features; long skeleton blocks inline in pages.

## Where things go
- Pure helpers → `src/utils/<area>.ts` (+ test in `src/utils/__tests__/`).
- Hooks → `src/hooks/` (data hooks in `src/hooks/api/`). Return an object; no JSX.
- Types → `src/types/<domain>.types.ts`. Constants → `src/lib/constants.ts` or a local `constants.ts`.

## Lint debt
The repo has ~440 lint problems (mostly `no-explicit-any`, unused vars). When touching a file, fix the ones in lines you touch: replace `any` with real types or `unknown` + narrowing (`isAxiosError(err)`), delete unused imports. Don't mass-fix unrelated files unless asked.

## Naming
Components `PascalCase.tsx`, hooks `useX.ts`, constants `UPPER_SNAKE`, booleans `is/has/can`, handlers `handleX`, props `onX`. Name by domain (`pendingExcuses`), not type (`arr`, `data2`).

## Finish
1. `npx tsc --noEmit`, `npx eslint <changed>`, `yarn test` if relevant.
2. Grep old names/paths — nothing still imports them.
3. Report: what moved where (one line each) + manual verification steps.
