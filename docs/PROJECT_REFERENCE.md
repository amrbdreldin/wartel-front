# Waratel LMS — Project Reference

> **Purpose:** Living reference to avoid re-exploring the codebase from scratch each session.
> Update this file whenever a significant architectural change is made.
> Last updated: 2026-04-25

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js** (App Router) — read `node_modules/next/dist/docs/` before writing Next.js code |
| Language | **TypeScript** |
| Styling | **Tailwind CSS v4** (via `@import "tailwindcss"`) — use CSS variables, NOT hardcoded colors |
| Component Library | **shadcn/ui** — style: `base-nova`, uses **Base UI** primitives |
| Icons | **Lucide React** |
| State Management | **Redux Toolkit** + React-Redux |
| i18n | **next-intl** — AR (RTL) + EN (LTR), messages in `src/i18n/messages/` |
| Fonts | **Tajawal** (Arabic, `--font-arabic`) + **Inter** (Latin, `--font-sans`) |
| Package Manager | **Yarn** (always use `yarn`, never `npm`) |
| Dev Server | `yarn dev` → `http://localhost:3000` |

---

## Directory Structure

```
src/
├── app/
│   ├── globals.css              ← Design system (CSS variables, utilities)
│   ├── layout.tsx               ← Root layout (minimal)
│   └── [locale]/
│       ├── layout.tsx           ← Locale root: fonts, metadata, RTL dir, Providers
│       ├── page.tsx             ← Landing page (assembles landing/* components)
│       ├── (auth)/
│       │   ├── login/
│       │   └── register/
│       └── (dashboard)/
│           ├── layout.tsx       ← Dashboard shell (DashboardShell)
│           ├── student/         ← page.tsx + excuses/ grades/ library/ messages/ notifications/ settings/ tamam/
│           ├── teacher/         ← page.tsx + sessions/ requests/ grades/ exams/
│           ├── supervisor/      ← page.tsx + messages/ reports/ support/ tracks/ warnings/
│           ├── manager/         ← page.tsx + audit-log/ content/ exams/ reports/ substitutes/ system-settings/ teacher-files/ users/
│           └── parent/
│
├── components/
│   ├── common/
│   │   ├── LanguageSwitcher.tsx ← Landing page locale toggle (ghost button style, Languages icon)
│   │   ├── LocaleSwitcher.tsx   ← Dashboard locale toggle (Button ghost, Languages icon)
│   │   ├── Logo.tsx
│   │   ├── ThemeToggle.tsx      ← Moon/Sun toggle via Redux uiSlice
│   │   ├── LoadingSpinner.tsx
│   │   ├── PlaceholderPage.tsx
│   │   └── ScrollToTop.tsx
│   ├── landing/
│   │   ├── LandingNavbar.tsx    ← Fixed nav, glassmorphism on scroll
│   │   ├── LandingFooter.tsx    ← Footer with SVG social icons (TG/WA/YT/X)
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── TimelineSection.tsx
│   │   ├── ProgramsSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── CtaSection.tsx
│   │   └── FaqSection.tsx
│   ├── layout/
│   │   ├── DashboardShell.tsx   ← Main dashboard wrapper (Sidebar + Topbar)
│   │   ├── Sidebar.tsx          ← Desktop sidebar (role-aware via getNavigationByRole)
│   │   ├── MobileSidebar.tsx    ← Mobile drawer sidebar
│   │   └── Topbar.tsx           ← Dashboard top bar (LocaleSwitcher, ThemeToggle, Notifications, User menu)
│   ├── forms/
│   └── ui/                      ← shadcn/ui components (button, badge, card, dialog, etc.)
│
├── config/
│   ├── navigation.ts            ← getNavigationByRole(role) → NavGroup[] per role
│   └── dashboard.ts
│
├── hooks/
│   ├── useAuth.ts               ← { user, logout } from authSlice
│   ├── useRole.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   └── api/                     ← API query hooks
│
├── i18n/
│   ├── routing.ts               ← next-intl routing config (locales: ar, en)
│   ├── request.ts
│   └── messages/
│       ├── ar.json              ← Arabic translations (~45KB)
│       └── en.json              ← English translations (~35KB)
│
├── services/
│   ├── auth.service.ts
│   ├── student.service.ts
│   ├── teacher.service.ts
│   ├── supervisor.service.ts
│   ├── manager.service.ts
│   └── parent.service.ts
│
├── store/
│   ├── index.ts                 ← RootState, AppDispatch
│   ├── provider.tsx             ← Redux Provider wrapper
│   └── slices/
│       ├── authSlice.ts         ← user, token, login/logout
│       ├── notificationSlice.ts ← unread count, selectUnreadCount
│       └── uiSlice.ts           ← theme (light/dark), selectTheme, setTheme
│
├── types/
│   └── enums.ts                 ← UserRole enum (STUDENT, TEACHER, SUPERVISOR, MANAGER, PARENT)
│
├── lib/
│   ├── utils.ts                 ← cn() helper
│   └── constants.ts             ← RTL_LOCALES, Locale type
│
└── utils/
```

---

## Design System

All color values live in **CSS variables** in `src/app/globals.css`. **Never hardcode colors.**

### Brand Colors
| Token | Light | Dark |
|---|---|---|
| `--primary` | `#008F8F` (teal) | `#00B3B3` |
| `--accent` | `#ED8A22` (orange) | `#F5A94D` |
| `--background` | `#FAFBFC` | `#0F1117` |
| `--foreground` | `#1A1D23` | `#F1F5F9` |
| `--muted` | `#F1F5F9` | `#1E2130` |
| `--border` | `#E2E8F0` | `#2D3148` |
| `--destructive` | `#EF4444` | `#F87171` |

### Semantic Extended Colors
- `--success-{50,100,400,500,600}` — green shades
- `--warning-{50,100,400,500,600}` — amber shades
- `--info-{50,100,400,500,600}` — blue shades

### Utility Classes (globals.css)
- `.glass` — glassmorphism: `backdrop-blur(12px)` + semi-transparent card bg
- `.gradient-primary` — teal gradient
- `.gradient-secondary` — orange gradient
- `.gradient-brand` — teal → orange diagonal
- `.text-gradient-brand` — gradient text fill

---

## Conventions & Patterns

### Button Standards (established)
- **Primary action:** `bg-primary text-white` + `rounded-lg` + `h-9 px-6`
- **Outlined action:** `border border-primary bg-background text-primary` + `rounded-lg` + `h-9 px-5`
- **Ghost/icon buttons:** `hover:bg-muted` + `h-9 w-9` or `h-9 px-3`
- **Avoid:** `rounded-full` + `py-2` style (inconsistent vertical padding)

### Topbar (Dashboard) Action Row
Order: `Login As (dev)` → `LocaleSwitcher` → `ThemeToggle` → `Notifications Bell` → `User Avatar Menu`

### LandingNavbar Action Row
Order: `Login As (dev)` → `LanguageSwitcher` → `Register (outlined)` → `Login (solid)`

### i18n
- **Always** add keys to both `ar.json` AND `en.json` when adding new text
- Use `useTranslations("namespace")` in client components
- Use `getTranslations("namespace")` in server components
- Locale is read from URL param `[locale]` (ar/en)
- RTL layout: `html[dir="rtl"]` applies `font-arabic` automatically

### Routing / Auth (dev mode)
- The "Login As" dropdown in both Navbar and Topbar allows role-switching without real auth
- Routes: `/{locale}/student`, `/{locale}/teacher`, `/{locale}/supervisor`, `/{locale}/manager`
- Role-based navigation is configured in `src/config/navigation.ts` via `getNavigationByRole()`

### Adding a New Dashboard Page
1. Create `src/app/[locale]/(dashboard)/{role}/{page}/page.tsx`
2. Add nav item to `src/config/navigation.ts` under the role's array
3. Add i18n key to `ar.json` + `en.json`
4. Page uses `"use client"` — wrap in `<div className="space-y-8 animate-in fade-in duration-500">`

### Adding a New Landing Section
1. Create `src/components/landing/{SectionName}.tsx`
2. Import and place in `src/app/[locale]/page.tsx`
3. Add i18n keys under `landing.{section}` namespace

---

## User Roles & Pages

| Role | Base Route | Dashboard Page | Key Features |
|---|---|---|---|
| Student | `/student` | `student/page.tsx` (8KB) | Sessions, Tamam, Grades, Library, Excuses, Notifications |
| Teacher | `/teacher` | `teacher/page.tsx` (13KB) | Sessions mgmt, Grade entry (in sessions table), Requests |
| Supervisor | `/supervisor` | `supervisor/page.tsx` (31KB) | Red flags, Tracks, Warnings, Messages, Reports |
| Manager | `/manager` | `manager/page.tsx` (13KB) | Users, Settings, Exams, Teacher files, Content, Reports |
| Parent | `/parent` | `parent/page.tsx` | Children overview |

---

## Key Files Quick Reference

| What | Where |
|---|---|
| CSS variables / design tokens | `src/app/globals.css` |
| Navigation per role | `src/config/navigation.ts` |
| Arabic translations | `src/i18n/messages/ar.json` |
| English translations | `src/i18n/messages/en.json` |
| Global Redux store | `src/store/index.ts` |
| Auth state | `src/store/slices/authSlice.ts` |
| Theme toggle state | `src/store/slices/uiSlice.ts` |
| Dashboard shell | `src/components/layout/DashboardShell.tsx` |
| Landing page assembly | `src/app/[locale]/page.tsx` |
| shadcn config | `components.json` (style: base-nova) |

---

## shadcn/ui Notes
- Style: `base-nova` (NOT the standard shadcn style — APIs may differ from docs)
- Uses **Base UI** primitives from `@base-ui/react/*` under the hood
- Icon library: Lucide React
- RTL: configured (`"rtl": false` in components.json but `dir` is set dynamically)
- **Always check `node_modules/next/dist/docs/`** before assuming Next.js API behavior

---

## Glassmorphism Aesthetic (preserve always)
The app uses a premium glassmorphism design language:
- Cards: `bg-card rounded-3xl border border-border/50 shadow-sm`
- Hover: `hover:shadow-xl hover:-translate-y-2 transition-all duration-300`
- Navbar (scrolled): `bg-surface/85 backdrop-blur-md border-b border-primary/10`
- Modals/overlays: `bg-black/80 backdrop-blur-sm`
- Animate entry: `animate-in fade-in slide-in-from-bottom-4 duration-500`
