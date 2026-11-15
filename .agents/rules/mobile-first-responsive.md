---
trigger: always_on
---

# Mobile-First Responsive Design (Mandatory)

90% of this project's users access the platform from **mobile phones**, not laptops. Every UI feature, page, component, table, modal, form, and navigation element MUST be designed and implemented **mobile-first** with top-tier mobile UX.

## Core Requirements

1. **Mobile-First Layout & Breakpoints**:
   - Design for small screens (`360px`–`430px`) first, then progressively enhance for `sm:`, `md:`, `lg:`, and `xl:` breakpoints.
   - Never rely on horizontal page overflow (`overflow-x-hidden` issues or clipped content on mobile). Every page must fit cleanly within `100vw` on mobile.
2. **Tables & Data-Heavy Views**:
   - Wide multi-column desktop tables MUST NOT be crammed onto mobile screens.
   - Always provide a dedicated **mobile card view** (`md:hidden`) alongside the desktop table (`hidden md:block`), or ensure `DataTable` / custom tables stack cleanly with clear labels, readable spacing, and zero horizontal clipping.
3. **Touch Targets & Spacing**:
   - All interactive elements (buttons, tabs, links, icon buttons, form inputs, checkboxes) must have comfortable touch targets (minimum `40px`–`44px` height/tap area) and adequate spacing (`gap-2` / `gap-3`) to prevent accidental taps.
   - Place primary actions within easy thumb reach; stack action button groups cleanly (`flex-wrap` or full-width on mobile `w-full sm:w-auto`).
4. **Typography, Padding & Cards**:
   - Scale headings, badges, and container padding appropriately on mobile (e.g., `p-4 sm:p-6`, `text-xl sm:text-2xl`, `rounded-2xl sm:rounded-3xl`) so content has breathing room without wasting vertical space.
   - Long text, emails, URLs, and Arabic/English mixed strings must wrap gracefully (`break-words`, `min-w-0`) without breaking flex/grid layouts.
5. **Modals, Drawers & Navigation**:
   - Modals and dialogs must fit mobile viewports (`max-h-[90vh] overflow-y-auto`, `w-[calc(100%-2rem)]` or full-width sheet behavior on small screens).
   - Tabs and filter bars must wrap cleanly or scroll horizontally inside a contained strip (`overflow-x-auto`) without pushing the page wider.
6. **RTL & Bilingual Support (`ar` / `en`)**:
   - Always use logical CSS properties (`ps-`, `pe-`, `ms-`, `me-`, `text-start`, `text-end`) so mobile layouts work identically in both Arabic (RTL) and English (LTR).
7. **Verification**:
   - Before considering any UI task complete, review the mobile layout (`375px` width) mentally or via browser inspection to confirm there is no overflow, overlap, unreadable text, or cramped controls.
