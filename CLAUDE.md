## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.

## Mobile-First Responsive Design (Mandatory)

90% of this project's users access the platform from **mobile phones**, not laptops. Every UI feature, page, component, table, modal, and form MUST be built **mobile-first** with top-tier mobile UX:
- Design for `360px`–`430px` mobile screens first, then enhance for `sm:`, `md:`, `lg:`, `xl:`. Never cause horizontal page overflow on mobile.
- Wide tables must provide a dedicated mobile card layout (`md:hidden`) alongside the desktop table (`hidden md:block`).
- Ensure comfortable touch targets (min `40px`–`44px`), responsive padding/typography (`p-4 sm:p-6`, `w-full sm:w-auto` for primary buttons), `min-w-0` / `break-words` for long text, and logical RTL/LTR classes (`ps-`, `pe-`, `ms-`, `me-`, `text-start`).
- Full rule details: `.agents/rules/mobile-first-responsive.md`.

