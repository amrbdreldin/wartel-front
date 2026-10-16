---
name: i18n
description: Use when adding, renaming, or removing UI text / translation keys in Waratel, touching src/i18n/messages/ar.json or en.json, fixing next-intl "MISSING_MESSAGE" errors, auditing hard-coded Arabic/English strings, formatting dates/numbers per locale, or checking that ar and en are in sync.
---

# Translations (next-intl v4)

## Setup
- Locales `ar` (default, RTL) and `en` — `src/lib/constants.ts` (`LOCALES`, `RTL_LOCALES`), routing `src/i18n/routing.ts`, loader `src/i18n/request.ts`.
- Messages: `src/i18n/messages/ar.json`, `en.json` (~1600 keys each). Top-level namespaces: `common, auth, student, teacher, parent, validation, nav, landing, studentBoard, teacherBoard, instructions, notifications, unread, warningsTable, directJoin, contactUs`.
- Client: `useTranslations("ns")`; server: `await getTranslations("ns")`. Locale: `useLocale()`.

## Rules
- Every new key goes into **both** files in the same edit, same nesting. Write Arabic natively (not literal translation); keep English concise.
- Put keys in the feature's namespace (`teacher.requests.*`), shared words in `common.*` (`save`, `cancel`, `retry`, `search`, `noData`, `errorOccurred`, `sending`…) — check `common` before adding a duplicate.
- Validation messages are `validation.*` keys used by Yup; resolve them with the root translator (`useTranslations()`), not a namespaced one.
- Interpolation/plural: ICU — `"{count, plural, =0 {لا توجد جلسات} one {جلسة واحدة} two {جلستان} few {# جلسات} many {# جلسة} other {# جلسة}}"`. Arabic needs `two/few/many`.
- Rich text: `t.rich("key", { b: (c) => <strong>{c}</strong> })` — don't concatenate translated fragments.
- No hard-coded user-visible strings (incl. `aria-label`, `placeholder`, toasts, `alt`). Backend `message` strings are already localized via `Accept-Language`.
- Dates/numbers: `src/utils/format.ts` (`formatDate`, `formatTime`, `formatRelativeTime`, `formatNumber`) with the current locale. Show Western digits unless the design asks otherwise; wrap in `dir="ltr"` inside Arabic text when mixing.
- Keys are static strings so they're greppable; for enums use a map (`STATUS_LABEL[status]`) or `t(\`status.${status}\`)` only when all variants exist in both files.

## Check parity
```bash
node .claude/skills/i18n/scripts/check-keys.js            # all
node .claude/skills/i18n/scripts/check-keys.js contactUs  # one namespace
```
Exit code 1 = missing keys. Also make sure both files still parse (the script will throw if not).

## Find hard-coded strings
```bash
LC_ALL=C.UTF-8 grep -rnP "[\x{0600}-\x{06FF}]" src --include=*.tsx | grep -vE ":[0-9]+:\s*(//|\*|\{/\*)"   # skip comments
grep -rnE ">[A-Z][a-z]+( [a-z]+)*<" src --include=*.tsx
```
~440 hits today: Quran verses/basmala are intentionally hard-coded (keep them); page `metadata.title` strings in route `layout.tsx` files and `PlaceholderPage.tsx` are real offenders.

## Removing keys
Grep the key (and its parent for dynamic usage) across `src` before deleting from both files.
