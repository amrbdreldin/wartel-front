# Graph Report - wartel-front  (2026-10-29)

## Corpus Check
- 315 files · ~161,725 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .ico 2, (none) 1, .css 1)

## Summary
- 1612 nodes · 4536 edges · 109 communities (100 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8c447fb6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- student.types.ts
- RegisterForm.tsx
- types/saas.ts
- cn
- FieldError
- Waratel LMS — Project Reference
- teacher.service.ts
- teacher/children/page.tsx
- enums.ts
- Warattel Academy: Enterprise Auditing & Before-and-After Enhancement Report
- useAuth
- dependencies
- ChatRoom.tsx
- lucide-react
- ReactivationRequestDialog.tsx
- MobileSidebar.tsx
- my-groups/page.tsx
- buildPageMetadata
- TicketConversation.tsx
- Button
- result/page.tsx
- useFaqQueries.ts
- useAuth.ts
- LoadingSpinner.tsx
- components.json
- Skeleton
- devDependencies
- package.json
- auth.types.ts
- useStudentQueries.ts
- sessions/page.tsx
- FormSelect.tsx
- validation.ts
- dark
- light
- [locale]/page.tsx
- Topbar.tsx
- [locale]/layout.tsx
- compilerOptions
- [...path]/route.ts
- seo.ts
- ParentAuthGuard.tsx
- useAuthMutations.ts
- LoginForm.tsx
- branding
- Locale
- student/werd/[werdId]/page.tsx
- teacher/page.tsx
- parent.service.ts
- 🚀 7-Step Testing & Enhancement Roadmap
- [slug]/page.tsx
- vitest
- next-intl
- TeacherSwitchToStudentModal.tsx
- feature_flags
- group.service.ts
- student.service.ts
- saas_tenant_config.json
- contact_and_support
- paytabs
- @testing-library/react
- manifest.json
- ContactUsView
- index.ts
- localization
- tenant_metadata
- llms.ts
- [examId]/page.tsx
- library/page.tsx
- teacher/grades/page.tsx
- seo_and_metadata
- api-client.ts
- integrations
- scripts
- [groupId]/page.tsx
- Warattel Academy - Development Guidelines & Enhancements Reference
- next.config.mjs
- MediaCard.tsx
- OngoingLoginModal.tsx
- StudentDetailsSidebar.tsx
- badge.tsx
- WarningLevel
- phone.ts
- vercel.json
- README.md
- firebase-messaging-sw.js
- AGENTS.md
- postcss.config.mjs
- dropdown-menu.tsx
- GlobalNotificationsPage.tsx
- AvailableTimeForm.tsx
- middleware.ts
- FaqBrowser.tsx
- format.ts
- faq.service.ts
- tabs.tsx
- NotificationType
- logos
- typography
- ExcuseStatus
- TamamStatus
- download/route.ts
- StudentPreviousSession
- CLAUDE.md
- .claude/CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `cn()` - 231 edges
2. `next-intl` - 156 edges
3. `lucide-react` - 133 edges
4. `react` - 116 edges
5. `next` - 95 edges
6. `useAuth()` - 71 edges
7. `Button()` - 49 edges
8. `Skeleton()` - 46 edges
9. `sonner` - 44 edges
10. `@tanstack/react-query` - 31 edges

## Surprising Connections (you probably didn't know these)
- `Routing / Auth (dev mode)` --references--> `getNavigationByRole()`  [INFERRED]
  docs/PROJECT_REFERENCE.md → src/config/navigation.ts
- `5. Automated Testing (Unit, Integration & E2E)` --references--> `useAuth()`  [INFERRED]
  docs/testing_and_enhancement_plan.md → src/hooks/useAuth.ts
- `5. Automated Testing (Unit, Integration & E2E)` --references--> `useRole()`  [INFERRED]
  docs/testing_and_enhancement_plan.md → src/hooks/useRole.ts
- `1. Upstream API Proxy Route` --references--> `verifyRecaptcha()`  [INFERRED]
  docs/reverse_recaptcha.md → src/app/api/proxy/[...path]/route.ts
- `Topbar (Dashboard) Action Row` --references--> `LocaleSwitcher()`  [INFERRED]
  docs/PROJECT_REFERENCE.md → src/components/common/LocaleSwitcher.tsx

## Import Cycles
- None detected.

## Communities (109 total, 9 thin omitted)

### Community 0 - "student.types.ts"
Cohesion: 0.07
Nodes (29): AttendanceRecord, AttendanceStatusItem, DashboardBuddy, DashboardExam, DashboardGroup, DashboardSession, DashboardSessionDay, DashboardSessionStudent (+21 more)

### Community 1 - "RegisterForm.tsx"
Cohesion: 0.29
Nodes (10): AudioUploadField(), PathSelectionField(), initialValues, RegisterForm(), ScrollToFieldError(), RegisterPage(), AddChildModal(), AddChildModalProps (+2 more)

### Community 2 - "types/saas.ts"
Cohesion: 0.18
Nodes (11): Props, TenantThemeProvider(), BrandingConfig, FeatureFlags, LocalizationConfig, QuotasLimits, SaasBrandingPayload, SEOConfig (+3 more)

### Community 3 - "cn"
Cohesion: 0.13
Nodes (21): RoleCard(), VideoDetailPage(), BuddyAssignModal(), AvatarBadge(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), CardAction() (+13 more)

### Community 4 - "FieldError"
Cohesion: 0.10
Nodes (25): @tanstack/react-query, ExcuseForm(), FieldError(), ExcusesTable(), StatusBadge(), ExcusesPage(), FieldError(), RequestForm() (+17 more)

### Community 5 - "Waratel LMS — Project Reference"
Cohesion: 0.11
Nodes (18): Adding a New Dashboard Page, Adding a New Landing Section, Brand Colors, Button Standards (established), Conventions & Patterns, Design System, Directory Structure, Glassmorphism Aesthetic (preserve always) (+10 more)

### Community 6 - "teacher.service.ts"
Cohesion: 0.09
Nodes (29): ApiError, PaginatedResponse, PaginationMeta, QueryParams, AttendanceStatus, ABSENT, EXCUSED, PRESENT (+21 more)

### Community 7 - "teacher/children/page.tsx"
Cohesion: 0.16
Nodes (20): ChildCard(), ChildCardProps, ChildInfo, ChildCardSkeleton(), ParentHeader(), ParentHeaderProps, TodaySessionCard(), TodaySessionCardProps (+12 more)

### Community 8 - "enums.ts"
Cohesion: 0.08
Nodes (26): OngoingLoginModalProps, DashboardConfig, dashboardConfigs, NavGroup, NavItem, parentNavigation, studentNavigation, teacherNavigation (+18 more)

### Community 9 - "Warattel Academy: Enterprise Auditing & Before-and-After Enhancement Report"
Cohesion: 0.07
Nodes (29): 1.1 Form Validation & Smooth Error Focusing, 1.2 Context-Aware Submission Feedback, 1. UI/UX: Interactive Forms & Accessibility, 2.1 Tailwind CSS v4 Logical Properties, 2.2 Mobile Touch-Target Safety & Floating Sheets, 2. Responsive & Bidirectional RTL/LTR Adaptation, 3.1 Next.js Dynamic Multi-Tenant Metadata API, 3.2 Dynamic Multi-Tenant robots.txt and sitemap.ts (+21 more)

### Community 10 - "useAuth"
Cohesion: 0.18
Nodes (23): sonner, AdmissionPanel(), AdmissionPanelProps, initialValues, ParentRegisterForm(), ParentRegisterPage(), DirectJoinLoginModal(), DirectJoinLoginModalProps (+15 more)

### Community 11 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react@^1.4.0, class-variance-authority@^0.7.1, clsx@^2.1.1, firebase@^12.13.0, formik@^2.4.9, js-cookie@^3.0.5, lucide-react@^1.8.0 (+22 more)

### Community 12 - "ChatRoom.tsx"
Cohesion: 0.08
Nodes (32): firebase, GroupChatMetadata, MessagesPage(), TeacherGroupStudent, TeacherGroupWithStudents, TeacherMessagesPage(), AudioMessagePlayer(), ChatRoom() (+24 more)

### Community 13 - "lucide-react"
Cohesion: 0.23
Nodes (11): lucide-react, AcademyDecisionModal(), AcademyDecisionModalProps, ActiveExamCard(), ActiveExamCardProps, LatestGradeCard(), LatestGradeCardProps, NextSessionCard() (+3 more)

### Community 14 - "ReactivationRequestDialog.tsx"
Cohesion: 0.14
Nodes (20): formik, yup, ReactivationRequestDialog(), ReactivationRequestDialogProps, RegisterValues, FormDatePicker(), FormDatePickerProps, FormFieldProps (+12 more)

### Community 15 - "MobileSidebar.tsx"
Cohesion: 0.16
Nodes (21): react-redux, DashboardLayout(), metadata, StudentSessionPage(), DashboardShell(), DashboardShellProps, LiveSessionBanner(), MobileSidebar() (+13 more)

### Community 16 - "my-groups/page.tsx"
Cohesion: 0.17
Nodes (18): TamamStatsCard(), TamamStatsCardProps, BuddyCard(), MyGroupsPage(), BuddyInfoCard(), BuddyInfoCardProps, TamamActionCard(), TamamActionCardProps (+10 more)

### Community 17 - "buildPageMetadata"
Cohesion: 0.11
Nodes (10): generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata() (+2 more)

### Community 18 - "TicketConversation.tsx"
Cohesion: 0.22
Nodes (14): ContactUsViewInner(), ALLOWED_IMAGE_TYPES, TicketConversation(), TicketConversationProps, TicketList(), TicketStatusBadge(), contactKeys, useContactThreadDetail() (+6 more)

### Community 19 - "Button"
Cohesion: 0.08
Nodes (52): @base-ui/react, ResetPasswordDialog(), ResetPasswordDialogProps, SessionDetailsModal(), SettingsForm(), SettingsPage(), isStatusCompleted(), resolveMediaUrl() (+44 more)

### Community 20 - "result/page.tsx"
Cohesion: 0.35
Nodes (8): ExamResultPage(), resolveMediaUrl(), ExamList(), ScoreBanner(), GradesPage(), ExamResult, formatMark(), scoreToPercent()

### Community 21 - "useFaqQueries.ts"
Cohesion: 0.29
Nodes (7): FaqHeader(), FaqHeaderProps, FaqSupportCards(), StudentFaqPage(), FaqSection(), faqKeys, useFaqs()

### Community 22 - "useAuth.ts"
Cohesion: 0.09
Nodes (24): js-cookie, ParentAuthGuard(), metadata, ParentLayout(), api, failedQueue, API_BASE_URL, APP_NAME (+16 more)

### Community 23 - "LoadingSpinner.tsx"
Cohesion: 0.50
Nodes (3): LoadingSpinner(), LoadingSpinnerProps, sizeMap

### Community 24 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 25 - "Skeleton"
Cohesion: 0.16
Nodes (18): isStatusAbsent(), TamamHistoryTable(), TamamHistoryTableProps, WarningsPage(), WerdTable(), WerdPage(), GroupStudentsTableProps, TeacherWarningsPage() (+10 more)

### Community 26 - "devDependencies"
Cohesion: 0.10
Nodes (20): eslintConfig, devDependencies, eslint@^9, eslint-config-next@16.2.3, jimp@^1.6.1, jsdom@^29.1.1, @testing-library/dom@^10.4.1, @types/node@^20 (+12 more)

### Community 27 - "package.json"
Cohesion: 0.09
Nodes (22): axios@^1.15.0, input-otp@^1.4.2, lamejs@^1.2.1, react-dom@19.2.4, redux-persist@^6.0.0, @tailwindcss/postcss@^4, @tanstack/react-query-devtools@^5.99.0, name (+14 more)

### Community 28 - "auth.types.ts"
Cohesion: 0.13
Nodes (20): DAY_KEY_MAP, getTrackInfo(), RegisterValues, authService, AuthState, AppDataResponse, FormDataEnrollmentType, FormDataPendingGroup (+12 more)

### Community 29 - "useStudentQueries.ts"
Cohesion: 0.14
Nodes (11): formatAlertDate(), formatAlertTime(), parseDate(), WarningsCard(), WarningsCardProps, PreviousSessionsTable(), PreviousSessionsPage(), studentKeys (+3 more)

### Community 30 - "sessions/page.tsx"
Cohesion: 0.20
Nodes (17): ConfirmSubmitModal(), ConfirmSubmitModalProps, SessionRosterTable(), AttendanceDecision, getGradeLabel(), StudentRecord, TeacherSessionsPage(), useTeacherSessionAttendance() (+9 more)

### Community 31 - "FormSelect.tsx"
Cohesion: 0.23
Nodes (12): FormSelect(), FormSelectProps, SelectOption, SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton() (+4 more)

### Community 32 - "validation.ts"
Cohesion: 0.12
Nodes (19): addSingleSonSchema, emailSchema, EnrollmentType, excuseSchema, guestJoinSchema, loginSchema, loginWithRecaptchaSchema, messageSchema (+11 more)

### Community 33 - "dark"
Cohesion: 0.10
Nodes (20): accent, accent_foreground, background, border, card, card_foreground, foreground, input (+12 more)

### Community 34 - "light"
Cohesion: 0.10
Nodes (20): accent, accent_foreground, background, border, card, card_foreground, foreground, input (+12 more)

### Community 35 - "[locale]/page.tsx"
Cohesion: 0.14
Nodes (13): next, Home(), Props, AboutSection(), AchievementsSection(), CtaSection(), FeaturesSection(), HeroSection() (+5 more)

### Community 36 - "Topbar.tsx"
Cohesion: 0.20
Nodes (18): Topbar (Dashboard) Action Row, LocaleSwitcher(), ThemeToggle(), LandingNavbar(), Topbar(), TopbarProps, Avatar(), AvatarFallback() (+10 more)

### Community 37 - "[locale]/layout.tsx"
Cohesion: 0.15
Nodes (14): inter, LocaleLayout(), tajawal, viewport, CookieConsentBanner(), FloatingWhatsApp(), PWAInstallPrompt(), ScrollToTop() (+6 more)

### Community 38 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 39 - "[...path]/route.ts"
Cohesion: 0.16
Nodes (16): 1. Upstream API Proxy Route, 2. Client-side reCAPTCHA Utility, 3. Disclaimers Rendering, Reversing reCAPTCHA Bypass Logic, ALLOWED_METHODS, AllowedMethod, DELETE(), GET() (+8 more)

### Community 40 - "seo.ts"
Cohesion: 0.17
Nodes (17): generateMetadata(), privatePaths, robots(), LAST_MODIFIED, sitemap(), LOCALES, AI_BOTS, BLOCKED_BOTS (+9 more)

### Community 41 - "ParentAuthGuard.tsx"
Cohesion: 0.29
Nodes (7): StudentAuthGuard(), metadata, StudentLayout(), TeacherAuthGuard(), metadata, TeacherLayout(), DashboardSkeleton()

### Community 42 - "useAuthMutations.ts"
Cohesion: 0.24
Nodes (9): ForgotPasswordForm(), ForgotPasswordPage(), InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, LiveSessionLinks, useForgotPasswordMutation() (+1 more)

### Community 43 - "LoginForm.tsx"
Cohesion: 0.23
Nodes (13): LoginForm(), LoginPage(), ChildrenPage(), PlaceholderPage(), PlaceholderPageProps, Card(), CardContent(), CardFooter() (+5 more)

### Community 44 - "branding"
Cohesion: 0.33
Nodes (6): branding, theme_colors, visual_settings, border_radius, dashboard_layout_variant, glassmorphism_intensity

### Community 45 - "Locale"
Cohesion: 0.29
Nodes (4): Locale, initialState, uiSlice, UIState

### Community 46 - "student/werd/[werdId]/page.tsx"
Cohesion: 0.20
Nodes (11): ImageLightbox(), ImageLightboxProps, FormattedText(), SectionCard(), WerdDetailsContent(), WerdDetailsContentProps, WerdHero(), WerdHeroProps (+3 more)

### Community 47 - "teacher/page.tsx"
Cohesion: 0.17
Nodes (12): formatSessionDays(), MyGroups(), MyGroupsProps, TeacherHero(), TeacherHeroProps, TodaySessions(), TodaySessionsProps, TeacherDashboardPage() (+4 more)

### Community 48 - "parent.service.ts"
Cohesion: 0.53
Nodes (4): LoginResponse, ChildCard, ParentDashboard, RegisterChildRequest

### Community 49 - "🚀 7-Step Testing & Enhancement Roadmap"
Cohesion: 0.15
Nodes (12): 1. UI/UX (User Interface & User Experience), 2. Responsive & RTL (Right-to-Left) Adaptation, 3. SEO & GEO (Search Engine Optimization & Geographic Optimization), 4. Performance (Core Web Vitals Optimization), 5. Automated Testing (Unit, Integration & E2E), 6. Robust Security Policy, 7. Google Tag Manager (GTM) & GA4 Multi-Tenant Integration, 🚀 7-Step Testing & Enhancement Roadmap (+4 more)

### Community 50 - "[slug]/page.tsx"
Cohesion: 0.19
Nodes (12): AuthJoinSection(), AuthJoinSectionProps, GroupInfoCard(), DirectJoinCoursePage(), ROLE_ID_MAP, Logo(), LogoProps, sizeMap (+4 more)

### Community 51 - "vitest"
Cohesion: 0.17
Nodes (4): @vitejs/plugin-react@^6.0.2, vitest@^4.1.6, @vitejs/plugin-react, vitest

### Community 52 - "next-intl"
Cohesion: 0.11
Nodes (16): next-intl, react, InstructionsContent(), InstructionsPage(), StudentHeroProps, VIDEO_DATA, SessionHeader(), SessionHeaderProps (+8 more)

### Community 53 - "TeacherSwitchToStudentModal.tsx"
Cohesion: 0.32
Nodes (7): TEACHER_VIEWING_KEY, TeacherSwitchToStudentModal(), TeacherSwitchToStudentModalProps, useTeacherGroupsWithStudents(), useTeacherLoginAsStudent(), TeacherGroupStudent, TeacherGroupWithStudents

### Community 54 - "feature_flags"
Cohesion: 0.18
Nodes (11): feature_flags, allow_student_self_registration, enable_dark_mode_toggle, enable_digital_library, enable_exams_module, enable_grade_entry, enable_notifications_bell, enable_parent_portal (+3 more)

### Community 55 - "group.service.ts"
Cohesion: 0.32
Nodes (6): GroupInfoCardProps, DirectJoinGroup, groupService, GroupSessionDay, JoinGroupResponse, SonRequestItem

### Community 56 - "student.service.ts"
Cohesion: 0.10
Nodes (20): BuddyCardProps, AvailableBuddy, AvailableTimeSubmission, ExamDetails, ExamGradesResponseData, ExamResultData, ExamSubmitResponse, ExcuseSubmission (+12 more)

### Community 57 - "saas_tenant_config.json"
Cohesion: 0.20
Nodes (9): description, quotas_and_limits, max_cloud_storage_bytes, max_simultaneous_video_rooms, max_students, max_supervisors, max_teachers, $schema (+1 more)

### Community 58 - "contact_and_support"
Cohesion: 0.20
Nodes (10): contact_and_support, contact_phone, social_links, support_email, telegram_channel, whatsapp_number, facebook, instagram (+2 more)

### Community 59 - "paytabs"
Cohesion: 0.20
Nodes (10): payment_gateways, paytabs, stripe, currency_supported, enabled, merchant_id, profile_id, currency_supported (+2 more)

### Community 60 - "@testing-library/react"
Cohesion: 0.50
Nodes (3): @testing-library/react@^16.3.2, @testing-library/react, useDebounce()

### Community 61 - "manifest.json"
Cohesion: 0.14
Nodes (13): background_color, categories, description, dir, display, icons, id, lang (+5 more)

### Community 62 - "ContactUsView"
Cohesion: 0.24
Nodes (8): GeneralContactUsPage(), metadata, ParentContactUsPage(), metadata, StudentContactUsPage(), metadata, TeacherContactUsPage(), ContactUsView()

### Community 63 - "index.ts"
Cohesion: 0.11
Nodes (16): @reduxjs/toolkit, STALE_TIME, createQueryClient(), getQueryClient(), queryConfig, AppDispatch, rootReducer, store (+8 more)

### Community 64 - "localization"
Cohesion: 0.22
Nodes (9): localization, currency_code, currency_symbol, date_format, default_locale, direction_default, number_format, supported_locales (+1 more)

### Community 65 - "tenant_metadata"
Cohesion: 0.22
Nodes (9): tenant_metadata, academy_name, created_at, custom_domain, legal_name, slug, status, subscription_tier (+1 more)

### Community 66 - "llms.ts"
Cohesion: 0.26
Nodes (10): GET(), GET(), achievements(), buildLlmsFullTxt(), buildLlmsTxt(), features(), Landing, programs() (+2 more)

### Community 67 - "[examId]/page.tsx"
Cohesion: 0.50
Nodes (7): resolveMediaUrl(), TakeExamPage(), clearExamDraft(), ExamDraft, getExamDraft(), getKey(), saveExamDraft()

### Community 68 - "library/page.tsx"
Cohesion: 0.50
Nodes (7): FilterType, getEmbedUrl(), getYoutubeId(), isPdf(), LibraryPage(), ResourceCard(), VideoModal()

### Community 69 - "teacher/grades/page.tsx"
Cohesion: 0.27
Nodes (7): GradeEntryForm(), GradeEntryFormProps, GradeRecord, GradeRecord, TeacherGradesPage(), useTeacherGroups(), SubmitGradesPayload

### Community 70 - "seo_and_metadata"
Cohesion: 0.25
Nodes (8): seo_and_metadata, default_keywords, default_meta_description, default_share_image_url, global_meta_title_suffix, google_site_verification_id, robots_directives, sitemap_frequency

### Community 71 - "api-client.ts"
Cohesion: 0.28
Nodes (10): TicketListProps, ApiCallOptions, apiDelete(), apiPatch(), apiPost(), apiPut(), apiUpload(), buildConfig() (+2 more)

### Community 72 - "integrations"
Cohesion: 0.29
Nodes (7): integrations, facebook_pixel_id, google_analytics_id, google_meet_client_id, google_tag_manager_id, sentry_dsn, zoom_client_id

### Community 73 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, start, test, test:watch

### Community 74 - "[groupId]/page.tsx"
Cohesion: 0.48
Nodes (5): GroupBanner(), GroupBannerProps, GroupStudentsTable(), GroupStudentsPage(), useTeacherGroupStudents()

### Community 75 - "Warattel Academy - Development Guidelines & Enhancements Reference"
Cohesion: 0.33
Nodes (5): 1. Form Submissions & UX, 2. API Feedback & Toast Notifications, 3. Localization & Translation, 4. API Proxy & Security (Next.js Route Handlers), Warattel Academy - Development Guidelines & Enhancements Reference

### Community 76 - "next.config.mjs"
Cohesion: 0.33
Nodes (5): nextConfig, withNextIntl, withPWA, @ducanh2912/next-pwa@^10.2.9, @ducanh2912/next-pwa

### Community 77 - "MediaCard.tsx"
Cohesion: 0.53
Nodes (5): getMediaIcon(), getMediaTypeBg(), MediaCard(), MediaCardProps, WerdMedia

### Community 78 - "OngoingLoginModal.tsx"
Cohesion: 0.28
Nodes (10): ChildInfo, LoginAsChildModal(), LoginAsChildModalProps, OngoingLoginModal(), FormField(), GradientBar(), GradientBarProps, heightMap (+2 more)

### Community 79 - "StudentDetailsSidebar.tsx"
Cohesion: 0.33
Nodes (6): AttendanceFilter, StudentDetailsSidebar(), StudentDetailsSidebarProps, StudentRecord, useTeacherStudentPreviousAttendance(), PreviousAttendanceRecord

### Community 80 - "badge.tsx"
Cohesion: 0.70
Nodes (3): ProgramsSection(), Badge(), badgeVariants

### Community 81 - "WarningLevel"
Cohesion: 0.40
Nodes (5): WarningLevel, FINAL, FIRST, SECOND, THIRD

### Community 82 - "phone.ts"
Cohesion: 0.50
Nodes (3): isValidPhoneByPattern(), phonePatterns, rawPhonePatterns

### Community 83 - "vercel.json"
Cohesion: 0.40
Nodes (4): buildCommand, framework, installCommand, $schema

### Community 84 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 91 - "dropdown-menu.tsx"
Cohesion: 0.17
Nodes (8): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent(), DropdownMenuSubTrigger()

### Community 92 - "GlobalNotificationsPage.tsx"
Cohesion: 0.33
Nodes (7): NotificationsPage(), NotificationsPage(), GlobalNotificationsPage(), GlobalNotification, GlobalNotificationsResponse, useGlobalNotifications(), apiGet()

### Community 93 - "AvailableTimeForm.tsx"
Cohesion: 0.33
Nodes (8): AvailableTimeForm(), AvailableTimeFormProps, DAY_MAP, mapSavedTimesToSlots(), normalizeDay(), normalizeTimeTo24h(), AvailableBuddyTime, AvailableTimeSlot

### Community 94 - "middleware.ts"
Cohesion: 0.33
Nodes (6): routing, aiBotHits, aiBotRetryAfter(), config, intlMiddleware, middleware()

### Community 95 - "FaqBrowser.tsx"
Cohesion: 0.57
Nodes (6): FaqBrowser(), highlight(), Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger()

### Community 96 - "format.ts"
Cohesion: 0.46
Nodes (6): formatDate(), formatNumber(), formatPercentage(), formatRelativeTime(), formatTime(), truncate()

### Community 97 - "faq.service.ts"
Cohesion: 0.33
Nodes (5): FaqBrowserProps, faqService, ApiResponse, FaqCategory, FaqItem

### Community 98 - "tabs.tsx"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 99 - "NotificationType"
Cohesion: 0.33
Nodes (6): NotificationType, DANGER, INFO, SUCCESS, WARNING, StudentNotification

### Community 100 - "logos"
Cohesion: 0.40
Nodes (5): logos, collapsed_sidebar_logo_url, dark_mode_logo_url, favicon_url, light_mode_logo_url

### Community 101 - "typography"
Cohesion: 0.40
Nodes (5): typography, font_arabic, font_heading, font_sans_latin, font_weights

### Community 102 - "ExcuseStatus"
Cohesion: 0.40
Nodes (5): ExcuseStatus, APPROVED, PENDING, REJECTED, ExcuseRecord

### Community 103 - "TamamStatus"
Cohesion: 0.40
Nodes (5): TamamStatus, ABSENT, COMPLETED, PENDING, TamamCard

### Community 104 - "download/route.ts"
Cohesion: 0.67
Nodes (3): ALLOWED_DOMAINS, GET(), isAllowedHost()

### Community 106 - "StudentPreviousSession"
Cohesion: 0.67
Nodes (3): PreviousSessionsTableProps, SessionDetailsModalProps, StudentPreviousSession

## Knowledge Gaps
- **30 isolated node(s):** `STUDENT`, `TEACHER`, `PARENT`, `PENDING`, `APPROVED` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 589 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `RegisterForm.tsx`, `FieldError`, `useAuth`, `ChatRoom.tsx`, `lucide-react`, `ReactivationRequestDialog.tsx`, `MobileSidebar.tsx`, `my-groups/page.tsx`, `TicketConversation.tsx`, `Button`, `result/page.tsx`, `LoadingSpinner.tsx`, `Skeleton`, `auth.types.ts`, `useStudentQueries.ts`, `sessions/page.tsx`, `FormSelect.tsx`, `Topbar.tsx`, `[locale]/layout.tsx`, `useAuthMutations.ts`, `LoginForm.tsx`, `student/werd/[werdId]/page.tsx`, `[slug]/page.tsx`, `next-intl`, `TeacherSwitchToStudentModal.tsx`, `[examId]/page.tsx`, `library/page.tsx`, `MediaCard.tsx`, `OngoingLoginModal.tsx`, `StudentDetailsSidebar.tsx`, `badge.tsx`, `dropdown-menu.tsx`, `AvailableTimeForm.tsx`, `FaqBrowser.tsx`, `tabs.tsx`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **What connects `STUDENT`, `TEACHER`, `PARENT` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `student.types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Why does `next-intl` connect `next-intl` to `RegisterForm.tsx`, `FieldError`, `teacher/children/page.tsx`, `useAuth`, `dependencies`, `ChatRoom.tsx`, `lucide-react`, `ReactivationRequestDialog.tsx`, `MobileSidebar.tsx`, `my-groups/page.tsx`, `buildPageMetadata`, `TicketConversation.tsx`, `Button`, `result/page.tsx`, `useFaqQueries.ts`, `useAuth.ts`, `Skeleton`, `package.json`, `auth.types.ts`, `useStudentQueries.ts`, `sessions/page.tsx`, `[locale]/page.tsx`, `Topbar.tsx`, `[locale]/layout.tsx`, `seo.ts`, `useAuthMutations.ts`, `LoginForm.tsx`, `student/werd/[werdId]/page.tsx`, `teacher/page.tsx`, `[slug]/page.tsx`, `TeacherSwitchToStudentModal.tsx`, `group.service.ts`, `[examId]/page.tsx`, `library/page.tsx`, `teacher/grades/page.tsx`, `[groupId]/page.tsx`, `next.config.mjs`, `MediaCard.tsx`, `OngoingLoginModal.tsx`, `StudentDetailsSidebar.tsx`, `badge.tsx`, `GlobalNotificationsPage.tsx`, `AvailableTimeForm.tsx`, `middleware.ts`, `FaqBrowser.tsx`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.12666666666666668 - nodes in this community are weakly interconnected._
- **Why does `next` connect `[locale]/page.tsx` to `RegisterForm.tsx`, `teacher/children/page.tsx`, `useAuth`, `dependencies`, `ChatRoom.tsx`, `lucide-react`, `MobileSidebar.tsx`, `my-groups/page.tsx`, `buildPageMetadata`, `TicketConversation.tsx`, `Button`, `result/page.tsx`, `useFaqQueries.ts`, `useAuth.ts`, `Skeleton`, `package.json`, `useStudentQueries.ts`, `sessions/page.tsx`, `Topbar.tsx`, `[locale]/layout.tsx`, `[...path]/route.ts`, `seo.ts`, `ParentAuthGuard.tsx`, `useAuthMutations.ts`, `LoginForm.tsx`, `student/werd/[werdId]/page.tsx`, `teacher/page.tsx`, `[slug]/page.tsx`, `next-intl`, `TeacherSwitchToStudentModal.tsx`, `ContactUsView`, `[examId]/page.tsx`, `library/page.tsx`, `[groupId]/page.tsx`, `MediaCard.tsx`, `OngoingLoginModal.tsx`, `badge.tsx`, `middleware.ts`, `download/route.ts`, `faq/layout.tsx`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Should `FieldError` be split into smaller, more focused modules?**
  _Cohesion score 0.10084033613445378 - nodes in this community are weakly interconnected._