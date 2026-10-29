# Graph Report - wartel-front  (2026-10-29)

## Corpus Check
- 308 files · ~158,291 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .ico 2, (none) 1, .css 1)

## Summary
- 1565 nodes · 4409 edges · 91 communities (85 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- student.types.ts
- useAuth
- [locale]/layout.tsx
- cn
- FieldError
- Topbar.tsx
- teacher.service.ts
- teacher/children/page.tsx
- enums.ts
- Warattel Academy: Enterprise Auditing & Before-and-After Enhancement Report
- Button
- dependencies
- teacher/messages/page.tsx
- lucide-react
- DirectJoinLoginModal.tsx
- useAuth.ts
- my-groups/page.tsx
- next
- TicketConversation.tsx
- responsive-dialog.tsx
- result/page.tsx
- FaqAccordionList.tsx
- constants.ts
- utils.ts
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
- MobileSidebar.tsx
- ChatRoom.tsx
- compilerOptions
- [...path]/route.ts
- next-intl
- ParentAuthGuard.tsx
- useAuthMutations.ts
- LoginForm.tsx
- branding
- Locale
- student/werd/[werdId]/page.tsx
- teacher/page.tsx
- parent.service.ts
- 🚀 7-Step Testing & Enhancement Roadmap
- DashboardShell.tsx
- vitest
- react
- TeacherSwitchToStudentModal.tsx
- feature_flags
- group.service.ts
- useTeacherQueries.ts
- saas_tenant_config.json
- contact_and_support
- paytabs
- useMediaQuery.ts
- manifest.json
- ContactUsView
- provider.tsx
- localization
- tenant_metadata
- (dashboard)/student/[userId]/profile-details/page.tsx
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
- loading-button.tsx
- StudentDetailsSidebar.tsx
- badge.tsx
- WarningLevel
- phone.ts
- vercel.json
- README.md
- firebase-messaging-sw.js
- AGENTS.md
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 229 edges
2. `next-intl` - 147 edges
3. `lucide-react` - 134 edges
4. `react` - 116 edges
5. `next` - 91 edges
6. `useAuth()` - 71 edges
7. `Button()` - 49 edges
8. `Skeleton()` - 48 edges
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

## Communities (91 total, 6 thin omitted)

### Community 0 - "student.types.ts"
Cohesion: 0.04
Nodes (60): ExcuseStatus, APPROVED, PENDING, REJECTED, NotificationType, DANGER, INFO, SUCCESS (+52 more)

### Community 1 - "useAuth"
Cohesion: 0.14
Nodes (29): formik, AdmissionPanel(), AdmissionPanelProps, initialValues, ParentRegisterForm(), initialValues, RegisterForm(), ScrollToFieldError() (+21 more)

### Community 2 - "[locale]/layout.tsx"
Cohesion: 0.07
Nodes (31): generateMetadata(), inter, LocaleLayout(), tajawal, viewport, blockedUserAgents, robots(), CookieConsentBanner() (+23 more)

### Community 3 - "cn"
Cohesion: 0.08
Nodes (32): @base-ui/react, RoleCard(), ScrollToTop(), AvatarBadge(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), CardAction() (+24 more)

### Community 4 - "FieldError"
Cohesion: 0.08
Nodes (30): AudioUploadField(), RegisterValues, FieldError(), RequestForm(), RequestLeaveRecord, RequestsTable(), StatusBadge(), TeacherRequestsPage() (+22 more)

### Community 5 - "Topbar.tsx"
Cohesion: 0.07
Nodes (32): Adding a New Dashboard Page, Adding a New Landing Section, Brand Colors, Button Standards (established), Conventions & Patterns, Design System, Directory Structure, Glassmorphism Aesthetic (preserve always) (+24 more)

### Community 6 - "teacher.service.ts"
Cohesion: 0.09
Nodes (30): GroupStudentsTableProps, AttendanceStatus, ABSENT, EXCUSED, PRESENT, RequestStatus, APPROVED, PENDING (+22 more)

### Community 7 - "teacher/children/page.tsx"
Cohesion: 0.16
Nodes (21): AddChildModal(), ChildCard(), ChildCardProps, ChildInfo, ChildCardSkeleton(), ParentHeader(), ParentHeaderProps, TodaySessionCard() (+13 more)

### Community 8 - "enums.ts"
Cohesion: 0.08
Nodes (26): OngoingLoginModalProps, DashboardConfig, dashboardConfigs, NavGroup, NavItem, parentNavigation, studentNavigation, teacherNavigation (+18 more)

### Community 9 - "Warattel Academy: Enterprise Auditing & Before-and-After Enhancement Report"
Cohesion: 0.07
Nodes (29): 1.1 Form Validation & Smooth Error Focusing, 1.2 Context-Aware Submission Feedback, 1. UI/UX: Interactive Forms & Accessibility, 2.1 Tailwind CSS v4 Logical Properties, 2.2 Mobile Touch-Target Safety & Floating Sheets, 2. Responsive & Bidirectional RTL/LTR Adaptation, 3.1 Next.js Dynamic Multi-Tenant Metadata API, 3.2 Dynamic Multi-Tenant robots.txt and sitemap.ts (+21 more)

### Community 10 - "Button"
Cohesion: 0.17
Nodes (21): sonner, AuthJoinSection(), AuthJoinSectionProps, GroupInfoCard(), GuestJoinForm(), GuestJoinFormProps, TabKey, ParentChildrenJoinSection() (+13 more)

### Community 11 - "dependencies"
Cohesion: 0.07
Nodes (29): dependencies, @base-ui/react@^1.4.0, firebase@^12.13.0, formik@^2.4.9, input-otp@^1.4.2, lamejs@^1.2.1, lucide-react@^1.8.0, next@16.2.3 (+21 more)

### Community 12 - "teacher/messages/page.tsx"
Cohesion: 0.11
Nodes (15): firebase, GroupChatMetadata, MessagesPage(), TeacherGroupStudent, TeacherGroupWithStudents, TeacherMessagesPage(), ChatSkeleton(), ChatSkeletonProps (+7 more)

### Community 13 - "lucide-react"
Cohesion: 0.14
Nodes (20): lucide-react, @tanstack/react-query, AcademyDecisionModal(), AcademyDecisionModalProps, ActiveExamCard(), ActiveExamCardProps, NextSessionCard(), NextSessionCardProps (+12 more)

### Community 14 - "DirectJoinLoginModal.tsx"
Cohesion: 0.21
Nodes (22): yup, ReactivationRequestDialog(), ReactivationRequestDialogProps, ResetPasswordDialog(), ResetPasswordDialogProps, DirectJoinLoginModal(), DirectJoinLoginModalProps, LogoutConfirmDialog() (+14 more)

### Community 15 - "useAuth.ts"
Cohesion: 0.14
Nodes (18): js-cookie@^3.0.5, js-cookie, react-redux, StudentSessionPage(), SidebarProps, useRole(), USER_KEY, AppDispatch (+10 more)

### Community 16 - "my-groups/page.tsx"
Cohesion: 0.14
Nodes (22): TamamStatsCard(), TamamStatsCardProps, AvailableTimeForm(), AvailableTimeFormProps, DAY_MAP, mapSavedTimesToSlots(), normalizeDay(), normalizeTimeTo24h() (+14 more)

### Community 17 - "next"
Cohesion: 0.08
Nodes (9): next, ALLOWED_DOMAINS, GET(), isAllowedHost(), metadata, metadata, metadata, metadata (+1 more)

### Community 18 - "TicketConversation.tsx"
Cohesion: 0.17
Nodes (19): ContactUsViewInner(), ALLOWED_IMAGE_TYPES, TicketConversation(), TicketConversationProps, TicketList(), TicketListProps, TicketStatusBadge(), TicketStatusBadgeProps (+11 more)

### Community 19 - "responsive-dialog.tsx"
Cohesion: 0.20
Nodes (21): SessionDetailsModal(), ALLOWED_IMAGE_TYPES, CreateTicketModal(), CreateTicketModalProps, DialogClose(), DialogTrigger(), Label(), ResponsiveDialog() (+13 more)

### Community 20 - "result/page.tsx"
Cohesion: 0.18
Nodes (17): LatestGradeCard(), LatestGradeCardProps, ExamResultPage(), resolveMediaUrl(), ExamList(), ScoreBanner(), GradesPage(), DashboardLastGrade (+9 more)

### Community 21 - "FaqAccordionList.tsx"
Cohesion: 0.19
Nodes (16): FaqAccordionList(), FaqAccordionListProps, FaqHeader(), FaqHeaderProps, FaqSearch(), FaqSearchProps, FaqSupportCards(), StudentFaqPage() (+8 more)

### Community 22 - "constants.ts"
Cohesion: 0.10
Nodes (18): axios@^1.15.0, axios, faqKeys, api, failedQueue, API_BASE_URL, APP_NAME, BRAND_COLORS (+10 more)

### Community 23 - "utils.ts"
Cohesion: 0.12
Nodes (14): VIDEO_DATA, VideoDetailPage(), SettingsForm(), SettingsPage(), LoadingSpinner(), LoadingSpinnerProps, sizeMap, PhoneInput() (+6 more)

### Community 24 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 25 - "Skeleton"
Cohesion: 0.20
Nodes (14): PreviousSessionsTableProps, SessionDetailsModalProps, WarningsPage(), WerdTable(), WerdTableProps, WerdPage(), TeacherWarningsPage(), Column (+6 more)

### Community 26 - "devDependencies"
Cohesion: 0.10
Nodes (20): eslintConfig, devDependencies, eslint@^9, eslint-config-next@16.2.3, jimp@^1.6.1, jsdom@^29.1.1, @testing-library/dom@^10.4.1, @types/node@^20 (+12 more)

### Community 27 - "package.json"
Cohesion: 0.10
Nodes (20): class-variance-authority@^0.7.1, clsx@^2.1.1, tailwindcss@^4, @tailwindcss/postcss@^4, @tanstack/react-query-devtools@^5.99.0, @types/js-cookie@^3.0.6, name, overrides (+12 more)

### Community 28 - "auth.types.ts"
Cohesion: 0.14
Nodes (18): DAY_KEY_MAP, getTrackInfo(), PathSelectionField(), RegisterValues, AppDataResponse, FormDataEnrollmentType, FormDataPendingGroup, FormDataSessionDay (+10 more)

### Community 29 - "useStudentQueries.ts"
Cohesion: 0.15
Nodes (11): formatAlertDate(), formatAlertTime(), parseDate(), WarningsCard(), WarningsCardProps, PreviousSessionsTable(), PreviousSessionsPage(), studentKeys (+3 more)

### Community 30 - "sessions/page.tsx"
Cohesion: 0.20
Nodes (17): ConfirmSubmitModal(), ConfirmSubmitModalProps, SessionRosterTable(), AttendanceDecision, getGradeLabel(), StudentRecord, TeacherSessionsPage(), useTeacherSessionAttendance() (+9 more)

### Community 31 - "FormSelect.tsx"
Cohesion: 0.16
Nodes (16): FormSelect(), FormSelectProps, SelectOption, FormTextarea(), FormTextareaProps, FieldWrapper(), FieldWrapperProps, SelectContent() (+8 more)

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
Cohesion: 0.19
Nodes (10): Home(), AboutSection(), AchievementsSection(), CtaSection(), FeaturesSection(), HeroSection(), LandingFooter(), StatsSection() (+2 more)

### Community 36 - "MobileSidebar.tsx"
Cohesion: 0.25
Nodes (16): LandingNavbar(), MobileSidebar(), MobileSidebarProps, Sidebar(), Avatar(), AvatarFallback(), Separator(), Sheet() (+8 more)

### Community 37 - "ChatRoom.tsx"
Cohesion: 0.20
Nodes (15): AudioMessagePlayer(), ChatRoom(), ChatRoomProps, MessageItem, POPULAR_EMOJIS, RosterStudent, DropdownMenuItem(), getAbsoluteMediaUrl() (+7 more)

### Community 38 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 39 - "[...path]/route.ts"
Cohesion: 0.16
Nodes (16): 1. Upstream API Proxy Route, 2. Client-side reCAPTCHA Utility, 3. Disclaimers Rendering, Reversing reCAPTCHA Bypass Logic, ALLOWED_METHODS, AllowedMethod, DELETE(), GET() (+8 more)

### Community 40 - "next-intl"
Cohesion: 0.18
Nodes (11): next-intl, StudentHeroProps, BuddyInfoCard(), BuddyInfoCardProps, TamamActionCard(), TamamActionCardProps, isStatusAbsent(), TamamHistoryTable() (+3 more)

### Community 41 - "ParentAuthGuard.tsx"
Cohesion: 0.19
Nodes (11): ParentAuthGuard(), metadata, ParentLayout(), StudentAuthGuard(), metadata, StudentLayout(), TeacherAuthGuard(), metadata (+3 more)

### Community 42 - "useAuthMutations.ts"
Cohesion: 0.22
Nodes (10): ForgotPasswordForm(), ForgotPasswordPage(), InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, LiveSessionLinks, useForgotPasswordMutation() (+2 more)

### Community 43 - "LoginForm.tsx"
Cohesion: 0.29
Nodes (11): LoginForm(), LoginPage(), ChildrenPage(), PlaceholderPage(), PlaceholderPageProps, Card(), CardContent(), CardFooter() (+3 more)

### Community 44 - "branding"
Cohesion: 0.12
Nodes (16): branding, logos, theme_colors, typography, visual_settings, collapsed_sidebar_logo_url, dark_mode_logo_url, favicon_url (+8 more)

### Community 45 - "Locale"
Cohesion: 0.14
Nodes (9): @reduxjs/toolkit, Locale, EnrollmentData, enrollmentSlice, EnrollmentState, initialState, initialState, uiSlice (+1 more)

### Community 46 - "student/werd/[werdId]/page.tsx"
Cohesion: 0.24
Nodes (9): ImageLightbox(), ImageLightboxProps, FormattedText(), SectionCard(), WerdDetailsContent(), WerdDetailsContentProps, WerdHero(), WerdHeroProps (+1 more)

### Community 47 - "teacher/page.tsx"
Cohesion: 0.24
Nodes (10): formatSessionDays(), MyGroups(), MyGroupsProps, TeacherHero(), TeacherHeroProps, TodaySessions(), TodaySessionsProps, TeacherDashboardPage() (+2 more)

### Community 48 - "parent.service.ts"
Cohesion: 0.21
Nodes (10): ApiCallOptions, ApiError, ApiResponse, PaginatedResponse, PaginationMeta, QueryParams, LoginResponse, ChildCard (+2 more)

### Community 49 - "🚀 7-Step Testing & Enhancement Roadmap"
Cohesion: 0.15
Nodes (12): 1. UI/UX (User Interface & User Experience), 2. Responsive & RTL (Right-to-Left) Adaptation, 3. SEO & GEO (Search Engine Optimization & Geographic Optimization), 4. Performance (Core Web Vitals Optimization), 5. Automated Testing (Unit, Integration & E2E), 6. Robust Security Policy, 7. Google Tag Manager (GTM) & GA4 Multi-Tenant Integration, 🚀 7-Step Testing & Enhancement Roadmap (+4 more)

### Community 50 - "DashboardShell.tsx"
Cohesion: 0.24
Nodes (9): GeneralContactUsPage(), metadata, DashboardLayout(), DashboardShell(), DashboardShellProps, LiveSessionBanner(), cleanLink(), useLiveSessionLinkQuery() (+1 more)

### Community 51 - "vitest"
Cohesion: 0.17
Nodes (4): @vitejs/plugin-react@^6.0.2, vitest@^4.1.6, @vitejs/plugin-react, vitest

### Community 52 - "react"
Cohesion: 0.21
Nodes (5): react, InstructionsContent(), InstructionsPage(), SessionRosterTableProps, StudentRecord

### Community 53 - "TeacherSwitchToStudentModal.tsx"
Cohesion: 0.23
Nodes (10): TEACHER_VIEWING_KEY, TeacherSwitchToStudentModal(), TeacherSwitchToStudentModalProps, GradientBar(), GradientBarProps, heightMap, variantMap, useTeacherGroupsWithStudents() (+2 more)

### Community 54 - "feature_flags"
Cohesion: 0.18
Nodes (11): feature_flags, allow_student_self_registration, enable_dark_mode_toggle, enable_digital_library, enable_exams_module, enable_grade_entry, enable_notifications_bell, enable_parent_portal (+3 more)

### Community 55 - "group.service.ts"
Cohesion: 0.25
Nodes (8): GroupInfoCardProps, groupKeys, DirectJoinGroup, groupService, GroupSessionDay, JoinGroupRequest, JoinGroupResponse, SonRequestItem

### Community 56 - "useTeacherQueries.ts"
Cohesion: 0.25
Nodes (7): NotificationModalData, NotificationsView(), NotificationsViewProps, teacherKeys, useTeacherNotifications(), useTeacherWarnings(), WarningListItem

### Community 57 - "saas_tenant_config.json"
Cohesion: 0.20
Nodes (9): description, quotas_and_limits, max_cloud_storage_bytes, max_simultaneous_video_rooms, max_students, max_supervisors, max_teachers, $schema (+1 more)

### Community 58 - "contact_and_support"
Cohesion: 0.20
Nodes (10): contact_and_support, contact_phone, social_links, support_email, telegram_channel, whatsapp_number, facebook, instagram (+2 more)

### Community 59 - "paytabs"
Cohesion: 0.20
Nodes (10): payment_gateways, paytabs, stripe, currency_supported, enabled, merchant_id, profile_id, currency_supported (+2 more)

### Community 60 - "useMediaQuery.ts"
Cohesion: 0.29
Nodes (6): @testing-library/react@^16.3.2, @testing-library/react, useDebounce(), useIsDesktop(), useIsTablet(), useMediaQuery()

### Community 61 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 62 - "ContactUsView"
Cohesion: 0.27
Nodes (7): metadata, ParentContactUsPage(), metadata, StudentContactUsPage(), metadata, TeacherContactUsPage(), ContactUsView()

### Community 63 - "provider.tsx"
Cohesion: 0.29
Nodes (8): FirebaseNotificationListener(), createQueryClient(), getQueryClient(), queryConfig, store, Providers(), ProvidersProps, Notification

### Community 64 - "localization"
Cohesion: 0.22
Nodes (9): localization, currency_code, currency_symbol, date_format, default_locale, direction_default, number_format, supported_locales (+1 more)

### Community 65 - "tenant_metadata"
Cohesion: 0.22
Nodes (9): tenant_metadata, academy_name, created_at, custom_domain, legal_name, slug, status, subscription_tier (+1 more)

### Community 66 - "(dashboard)/student/[userId]/profile-details/page.tsx"
Cohesion: 0.39
Nodes (3): isStatusCompleted(), resolveMediaUrl(), StudentProfileDetailsPage()

### Community 67 - "[examId]/page.tsx"
Cohesion: 0.50
Nodes (7): resolveMediaUrl(), TakeExamPage(), clearExamDraft(), ExamDraft, getExamDraft(), getKey(), saveExamDraft()

### Community 68 - "library/page.tsx"
Cohesion: 0.42
Nodes (8): FilterType, getEmbedUrl(), getYoutubeId(), isPdf(), LibraryPage(), ResourceCard(), VideoModal(), LibraryResource

### Community 69 - "teacher/grades/page.tsx"
Cohesion: 0.31
Nodes (6): GradeEntryForm(), GradeEntryFormProps, GradeRecord, GradeRecord, TeacherGradesPage(), useTeacherGroups()

### Community 70 - "seo_and_metadata"
Cohesion: 0.25
Nodes (8): seo_and_metadata, default_keywords, default_meta_description, default_share_image_url, global_meta_title_suffix, google_site_verification_id, robots_directives, sitemap_frequency

### Community 71 - "api-client.ts"
Cohesion: 0.46
Nodes (7): apiDelete(), apiGet(), apiPatch(), apiPost(), apiPut(), apiUpload(), buildConfig()

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

### Community 78 - "loading-button.tsx"
Cohesion: 0.47
Nodes (4): SessionHeader(), SessionHeaderProps, LoadingButton, LoadingButtonProps

### Community 79 - "StudentDetailsSidebar.tsx"
Cohesion: 0.40
Nodes (5): AttendanceFilter, StudentDetailsSidebar(), StudentDetailsSidebarProps, StudentRecord, useTeacherStudentPreviousAttendance()

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

## Knowledge Gaps
- **30 isolated node(s):** `STUDENT`, `TEACHER`, `PARENT`, `PENDING`, `APPROVED` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 578 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `useAuth`, `[locale]/layout.tsx`, `FieldError`, `teacher/children/page.tsx`, `Button`, `teacher/messages/page.tsx`, `lucide-react`, `DirectJoinLoginModal.tsx`, `useAuth.ts`, `my-groups/page.tsx`, `TicketConversation.tsx`, `responsive-dialog.tsx`, `result/page.tsx`, `FaqAccordionList.tsx`, `utils.ts`, `Skeleton`, `auth.types.ts`, `useStudentQueries.ts`, `sessions/page.tsx`, `FormSelect.tsx`, `MobileSidebar.tsx`, `ChatRoom.tsx`, `next-intl`, `useAuthMutations.ts`, `LoginForm.tsx`, `student/werd/[werdId]/page.tsx`, `DashboardShell.tsx`, `react`, `TeacherSwitchToStudentModal.tsx`, `useTeacherQueries.ts`, `(dashboard)/student/[userId]/profile-details/page.tsx`, `[examId]/page.tsx`, `library/page.tsx`, `MediaCard.tsx`, `loading-button.tsx`, `StudentDetailsSidebar.tsx`, `badge.tsx`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **What connects `STUDENT`, `TEACHER`, `PARENT` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `student.types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04389212057112639 - nodes in this community are weakly interconnected._
- **Why does `next-intl` connect `next-intl` to `useAuth`, `[locale]/layout.tsx`, `FieldError`, `Topbar.tsx`, `teacher/children/page.tsx`, `Button`, `dependencies`, `teacher/messages/page.tsx`, `lucide-react`, `DirectJoinLoginModal.tsx`, `useAuth.ts`, `my-groups/page.tsx`, `TicketConversation.tsx`, `responsive-dialog.tsx`, `result/page.tsx`, `FaqAccordionList.tsx`, `constants.ts`, `utils.ts`, `Skeleton`, `package.json`, `auth.types.ts`, `useStudentQueries.ts`, `sessions/page.tsx`, `[locale]/page.tsx`, `MobileSidebar.tsx`, `ChatRoom.tsx`, `useAuthMutations.ts`, `LoginForm.tsx`, `student/werd/[werdId]/page.tsx`, `teacher/page.tsx`, `DashboardShell.tsx`, `react`, `TeacherSwitchToStudentModal.tsx`, `group.service.ts`, `useTeacherQueries.ts`, `(dashboard)/student/[userId]/profile-details/page.tsx`, `[examId]/page.tsx`, `library/page.tsx`, `teacher/grades/page.tsx`, `[groupId]/page.tsx`, `next.config.mjs`, `MediaCard.tsx`, `loading-button.tsx`, `StudentDetailsSidebar.tsx`, `badge.tsx`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.13510520487264674 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `useAuth`, `[locale]/layout.tsx`, `Topbar.tsx`, `teacher.service.ts`, `teacher/children/page.tsx`, `Button`, `dependencies`, `teacher/messages/page.tsx`, `lucide-react`, `DirectJoinLoginModal.tsx`, `useAuth.ts`, `TicketConversation.tsx`, `responsive-dialog.tsx`, `result/page.tsx`, `FaqAccordionList.tsx`, `utils.ts`, `Skeleton`, `package.json`, `useStudentQueries.ts`, `sessions/page.tsx`, `[locale]/page.tsx`, `MobileSidebar.tsx`, `[...path]/route.ts`, `next-intl`, `ParentAuthGuard.tsx`, `useAuthMutations.ts`, `LoginForm.tsx`, `student/werd/[werdId]/page.tsx`, `teacher/page.tsx`, `DashboardShell.tsx`, `react`, `TeacherSwitchToStudentModal.tsx`, `useTeacherQueries.ts`, `ContactUsView`, `(dashboard)/student/[userId]/profile-details/page.tsx`, `[examId]/page.tsx`, `library/page.tsx`, `[groupId]/page.tsx`, `MediaCard.tsx`, `badge.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `[locale]/layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07308970099667775 - nodes in this community are weakly interconnected._