---
name: release-notes
description: Use when asked for Waratel release notes, a changelog, "what did we ship", a status update for the lead/volunteer team, or a summary of a branch/merge/date range for QA or stakeholders.
---

# Release notes

Audience: non-technical lead / academy stakeholders. They want what changed for students, teachers and parents — not how.

## Gather
1. Range: since a date, tag/commit, branch vs `main`, or "today".
   - `git log --since="<date>" --no-merges --pretty="%h %ad %s" --date=short`
   - `git log main..<branch> --no-merges --pretty="%h %s"`
2. Vague messages ("w o memory issue", "issue of attendence fixed") → `git show --stat <hash>` and skim to name the **user-facing** effect.
3. Group by feature/screen; drop refactors/lint/config unless visible (speed, stability, build fixes that unblocked deploys → one "Stability" line).

## Write
```
**Release Notes — <Date>**
**Status:** Ready for QA | In Review | Released

### New Features
- <What a user can now do>

### Enhancements & Fixes
- <What was broken/awkward → now works>

### Stability & Performance
- <only if user-visible>
```
- Arabic or English — match what the user asks (default: the language they asked in).
- Name users by role (الطالب، المعلم، ولي الأمر) and screens as they see them (صفحة الورد، الجلسات السابقة، الدعم الفني).
- Never mention files, components, libraries, hashes or branch names.
- Omit empty sections; add "Known issues / Next" only if something is explicitly unfinished.

## Deliver
In chat, ready to paste. If they want a shareable doc/page, publish it as asked.
