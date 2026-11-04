# Graph Report - wartel-front  (2026-11-04)

## Corpus Check
- 354 files · ~184,992 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .ico 2, (none) 1, .css 1)

## Summary
- 1791 nodes · 5173 edges · 109 communities (98 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `db1bb0e9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- student.types.ts
- sonner
- Button
- cn
- ExcuseForm.tsx
- Waratel LMS — Project Reference
- teacher.service.ts
- teacher/children/page.tsx
- enums.ts
- Warattel Academy: Enterprise Auditing & Before-and-After Enhancement Report
- ParentChildrenJoinSection.tsx
- dependencies
- ChatRoom.tsx
- SeoContentPage.tsx
- AudioUploadField.tsx
- useRole
- my-groups/page.tsx
- buildPageMetadata
- TicketConversation.tsx
- MobileSidebar.tsx
- result/page.tsx
- api.types.ts
- useAuth.ts
- [locale]/layout.tsx
- components.json
- lucide-react
- devDependencies
- package.json
- auth.types.ts
- useStudentQueries.ts
- sessions/page.tsx
- FormSelect.tsx
- group.service.ts
- dark
- light
- [locale]/page.tsx
- teacher/messages/page.tsx
- [locale]/layout.tsx
- compilerOptions
- [...path]/route.ts
- ContactUsView.tsx
- ParentAuthGuard.tsx
- ForgotPasswordForm.tsx
- LoginForm.tsx
- branding
- store/index.ts
- student/werd/[werdId]/page.tsx
- teacher/page.tsx
- DashboardShell.tsx
- 🚀 7-Step Testing & Enhancement Roadmap
- (dashboard)/student/[userId]/profile-details/page.tsx
- useAdsQueries.ts
- AvailableGroupsView.tsx
- Skeleton
- feature_flags
- TicketConversation.tsx
- vitest
- saas_tenant_config.json
- contact_and_support
- paytabs
- GlobalNotificationsPage.tsx
- manifest.json
- AvailableTimeForm.tsx
- enrollmentSlice.ts
- localization
- tenant_metadata
- seo.ts
- [examId]/page.tsx
- @tanstack/react-query
- teacher/grades/page.tsx
- seo_and_metadata
- api-client.ts
- integrations
- scripts
- react
- Warattel Academy - Development Guidelines & Enhancements Reference
- next.config.mjs
- faq/page.tsx
- NotificationType
- StudentDetailsSidebar.tsx
- ActionType
- ExcuseStatus
- TamamStatus
- vercel.json
- README.md
- firebase-messaging-sw.js
- AGENTS.md
- postcss.config.mjs
- dropdown-menu.tsx
- next
- student/messages/page.tsx
- middleware.ts
- FaqBrowser.tsx
- AddChildModal.tsx
- format.ts
- badge.tsx
- logos
- typography
- WarningLevel
- @vitejs/plugin-react
- student/page.tsx
- ParentAuthGuard
- ExamDifficulty
- CLAUDE.md
- .claude/CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `cn()` - 248 edges
2. `next-intl` - 165 edges
3. `lucide-react` - 140 edges
4. `react` - 123 edges
5. `next` - 110 edges
6. `useAuth()` - 73 edges
7. `Button()` - 51 edges
8. `Skeleton()` - 48 edges
9. `sonner` - 45 edges
10. `@tanstack/react-query` - 33 edges

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

## Communities (109 total, 11 thin omitted)

### Community 0 - "student.types.ts"
Cohesion: 0.06
Nodes (46): AttendanceRecord, AttendanceStatusItem, AvailableTimeSubmission, DashboardBuddy, DashboardExam, DashboardGroup, DashboardSession, DashboardSessionDay (+38 more)

### Community 1 - "sonner"
Cohesion: 0.14
Nodes (18): sonner, AdmissionPanel(), AdmissionPanelProps, initialValues, ParentRegisterForm(), initialValues, RegisterForm(), ScrollToFieldError() (+10 more)

### Community 2 - "Button"
Cohesion: 0.15
Nodes (30): Topbar (Dashboard) Action Row, yup, ReactivationRequestDialog(), ReactivationRequestDialogProps, ResetPasswordDialog(), ResetPasswordDialogProps, ErrorBoundary(), NotFound() (+22 more)

### Community 3 - "cn"
Cohesion: 0.09
Nodes (31): RoleCard(), VIDEO_DATA, VideoDetailPage(), SettingsForm(), SettingsPage(), LoadingSpinner(), LoadingSpinnerProps, sizeMap (+23 more)

### Community 4 - "ExcuseForm.tsx"
Cohesion: 0.10
Nodes (25): ExcuseForm(), FieldError(), ExcusesTable(), StatusBadge(), ExcusesPage(), FieldError(), RequestForm(), RequestLeaveRecord (+17 more)

### Community 5 - "Waratel LMS — Project Reference"
Cohesion: 0.11
Nodes (18): Adding a New Dashboard Page, Adding a New Landing Section, Brand Colors, Button Standards (established), Conventions & Patterns, Design System, Directory Structure, Glassmorphism Aesthetic (preserve always) (+10 more)

### Community 6 - "teacher.service.ts"
Cohesion: 0.10
Nodes (26): PaginatedResponse, AttendanceStatus, ABSENT, EXCUSED, PRESENT, RequestStatus, APPROVED, PENDING (+18 more)

### Community 7 - "teacher/children/page.tsx"
Cohesion: 0.08
Nodes (42): AddChildModal(), ChildCard(), ChildCardProps, ChildInfo, ChildCardSkeleton(), ParentHeader(), ParentHeaderProps, ParentTodaySession (+34 more)

### Community 8 - "enums.ts"
Cohesion: 0.15
Nodes (15): emptySubscribe(), RegisterPage(), emptySubscribe(), ParentRegisterPage(), OngoingLoginModalProps, DashboardConfig, dashboardConfigs, UserRole (+7 more)

### Community 9 - "Warattel Academy: Enterprise Auditing & Before-and-After Enhancement Report"
Cohesion: 0.07
Nodes (29): 1.1 Form Validation & Smooth Error Focusing, 1.2 Context-Aware Submission Feedback, 1. UI/UX: Interactive Forms & Accessibility, 2.1 Tailwind CSS v4 Logical Properties, 2.2 Mobile Touch-Target Safety & Floating Sheets, 2. Responsive & Bidirectional RTL/LTR Adaptation, 3.1 Next.js Dynamic Multi-Tenant Metadata API, 3.2 Dynamic Multi-Tenant robots.txt and sitemap.ts (+21 more)

### Community 10 - "ParentChildrenJoinSection.tsx"
Cohesion: 0.25
Nodes (16): AuthJoinSection(), AuthJoinSectionProps, DirectJoinApiError, extractDirectJoinError(), isParentRole(), isSonRole(), isStudentRole(), resolveGroupRoles() (+8 more)

### Community 11 - "dependencies"
Cohesion: 0.07
Nodes (28): dependencies, @base-ui/react@^1.4.0, clsx@^2.1.1, firebase@^12.13.0, formik@^2.4.9, js-cookie@^3.0.5, lucide-react@^1.8.0, next@16.2.3 (+20 more)

### Community 12 - "ChatRoom.tsx"
Cohesion: 0.18
Nodes (17): AudioMessagePlayer(), ChatRoom(), ChatRoomProps, MessageItem, POPULAR_EMOJIS, RosterStudent, DialogFooter(), DropdownMenu() (+9 more)

### Community 13 - "SeoContentPage.tsx"
Cohesion: 0.05
Nodes (60): GET(), GET(), BlogPostPage(), generateMetadata(), postKey(), Props, generateMetadata(), Page() (+52 more)

### Community 14 - "AudioUploadField.tsx"
Cohesion: 0.29
Nodes (9): AudioFileWithDuration, AudioUploadField(), getAudioContextConstructor(), RegisterValues, WindowWithWebkitAudio, compressAudio(), audioBufferToMp3(), downsampleAudioBuffer() (+1 more)

### Community 15 - "useRole"
Cohesion: 0.39
Nodes (6): react-redux, StudentSessionPage(), MockState, useRole(), selectRole(), selectUser()

### Community 16 - "my-groups/page.tsx"
Cohesion: 0.14
Nodes (19): TamamStatsCard(), TamamStatsCardProps, BuddyCard(), BuddyCardProps, MyGroupsPage(), BuddyInfoCard(), BuddyInfoCardProps, WhatsAppLink() (+11 more)

### Community 17 - "buildPageMetadata"
Cohesion: 0.13
Nodes (8): generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), buildPageMetadata()

### Community 18 - "TicketConversation.tsx"
Cohesion: 0.32
Nodes (8): TicketListProps, contactKeys, contactService, ContactMessage, ContactThread, ContactThreadsData, CreateContactThreadPayload, ReplyContactThreadPayload

### Community 19 - "MobileSidebar.tsx"
Cohesion: 0.08
Nodes (50): PreviousSessionsTableProps, SessionDetailsModal(), SessionDetailsModalProps, ALLOWED_IMAGE_TYPES, CreateTicketModal(), CreateTicketModalProps, LandingNavbar(), MobileSidebar() (+42 more)

### Community 20 - "result/page.tsx"
Cohesion: 0.35
Nodes (8): ExamResultPage(), resolveMediaUrl(), ExamList(), ScoreBanner(), GradesPage(), ExamResult, formatMark(), scoreToPercent()

### Community 21 - "api.types.ts"
Cohesion: 0.27
Nodes (7): faqKeys, ApiCallOptions, adService, faqService, GetAdsParams, ApiResponse, PaginationMeta

### Community 22 - "useAuth.ts"
Cohesion: 0.10
Nodes (23): js-cookie, api, failedQueue, API_BASE_URL, APP_NAME, BRAND_COLORS, DEFAULT_LOCALE, DEFAULT_PAGE_SIZE (+15 more)

### Community 23 - "[locale]/layout.tsx"
Cohesion: 0.18
Nodes (10): inter, LocaleLayout(), tajawal, viewport, CookieConsentBanner(), FloatingWhatsApp(), FloatingWhatsAppProps, PWAInstallPrompt() (+2 more)

### Community 24 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 25 - "lucide-react"
Cohesion: 0.17
Nodes (19): lucide-react, PreviousSessionsTable(), PreviousSessionsPage(), TamamActionCard(), TamamActionCardProps, isStatusAbsent(), TamamHistoryTable(), TamamHistoryTableProps (+11 more)

### Community 26 - "devDependencies"
Cohesion: 0.10
Nodes (20): eslintConfig, devDependencies, eslint@^9, eslint-config-next@16.2.3, jimp@^1.6.1, jsdom@^29.1.1, @testing-library/dom@^10.4.1, @types/node@^20 (+12 more)

### Community 27 - "package.json"
Cohesion: 0.09
Nodes (22): class-variance-authority@^0.7.1, input-otp@^1.4.2, lamejs@^1.2.1, redux-persist@^6.0.0, shadcn@^4.2.0, tailwindcss@^4, @tailwindcss/postcss@^4, name (+14 more)

### Community 28 - "auth.types.ts"
Cohesion: 0.19
Nodes (13): AppDataResponse, EnrollmentSubmitResponse, FormDataPendingGroup, FormDataSessionDay, FormDataUserRole, InitiatePasswordResetResponse, LoginRequest, RefreshTokenResponse (+5 more)

### Community 29 - "useStudentQueries.ts"
Cohesion: 0.16
Nodes (9): formatAlertDate(), formatAlertTime(), parseDate(), WarningsCard(), WarningsCardProps, studentKeys, useStudentWarnings(), QueryParams (+1 more)

### Community 30 - "sessions/page.tsx"
Cohesion: 0.16
Nodes (20): ConfirmSubmitModal(), ConfirmSubmitModalProps, SessionHeader(), SessionRosterTable(), SessionRosterTableProps, StudentRecord, AttendanceDecision, getGradeLabel() (+12 more)

### Community 31 - "FormSelect.tsx"
Cohesion: 0.23
Nodes (12): FormSelect(), FormSelectProps, SelectOption, SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton() (+4 more)

### Community 32 - "group.service.ts"
Cohesion: 0.16
Nodes (12): axios@^1.15.0, axios, GroupInfoCardProps, group, otherGroup, AvailableGroup, DirectJoinGroup, DirectJoinGroupRole (+4 more)

### Community 33 - "dark"
Cohesion: 0.10
Nodes (20): accent, accent_foreground, background, border, card, card_foreground, foreground, input (+12 more)

### Community 34 - "light"
Cohesion: 0.10
Nodes (20): accent, accent_foreground, background, border, card, card_foreground, foreground, input (+12 more)

### Community 35 - "[locale]/page.tsx"
Cohesion: 0.20
Nodes (13): next-intl, Home(), Props, AboutSection(), AchievementsSection(), CtaSection(), FeaturesSection(), GuidesSection() (+5 more)

### Community 36 - "teacher/messages/page.tsx"
Cohesion: 0.18
Nodes (10): firebase, TeacherGroupStudent, TeacherGroupWithStudents, app, db, firebaseConfig, initialState, Notification (+2 more)

### Community 37 - "[locale]/layout.tsx"
Cohesion: 0.14
Nodes (14): DynamicAnalyticsProvider(), Props, Props, TenantThemeProvider(), BrandingConfig, FeatureFlags, IntegrationKeys, LocalizationConfig (+6 more)

### Community 38 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 39 - "[...path]/route.ts"
Cohesion: 0.16
Nodes (16): 1. Upstream API Proxy Route, 2. Client-side reCAPTCHA Utility, 3. Disclaimers Rendering, Reversing reCAPTCHA Bypass Logic, ALLOWED_METHODS, AllowedMethod, DELETE(), GET() (+8 more)

### Community 40 - "ContactUsView.tsx"
Cohesion: 0.27
Nodes (7): metadata, ParentContactUsPage(), metadata, StudentContactUsPage(), metadata, TeacherContactUsPage(), ContactUsView()

### Community 41 - "ParentAuthGuard.tsx"
Cohesion: 0.29
Nodes (7): StudentAuthGuard(), metadata, StudentLayout(), TeacherAuthGuard(), metadata, TeacherLayout(), DashboardSkeleton()

### Community 42 - "ForgotPasswordForm.tsx"
Cohesion: 0.17
Nodes (20): ForgotPasswordForm(), ForgotPasswordPage(), ChildrenPage(), PlaceholderPage(), PlaceholderPageProps, Card(), CardAction(), CardContent() (+12 more)

### Community 43 - "LoginForm.tsx"
Cohesion: 0.16
Nodes (28): LoginForm(), LoginPage(), DirectJoinLoginModal(), DirectJoinLoginModalProps, GuestJoinForm(), GuestJoinFormProps, TabKey, ChildInfo (+20 more)

### Community 44 - "branding"
Cohesion: 0.33
Nodes (6): branding, theme_colors, visual_settings, border_radius, dashboard_layout_variant, glassmorphism_intensity

### Community 45 - "store/index.ts"
Cohesion: 0.29
Nodes (8): FirebaseNotificationListener(), STALE_TIME, createQueryClient(), getQueryClient(), queryConfig, store, Providers(), ProvidersProps

### Community 46 - "student/werd/[werdId]/page.tsx"
Cohesion: 0.15
Nodes (16): ImageLightbox(), ImageLightboxProps, getMediaIcon(), getMediaTypeBg(), MediaCard(), MediaCardProps, FormattedText(), SectionCard() (+8 more)

### Community 47 - "teacher/page.tsx"
Cohesion: 0.24
Nodes (10): formatSessionDays(), MyGroups(), MyGroupsProps, TeacherHero(), TeacherHeroProps, TodaySessions(), TodaySessionsProps, TeacherDashboardPage() (+2 more)

### Community 48 - "DashboardShell.tsx"
Cohesion: 0.22
Nodes (10): GeneralContactUsPage(), generateMetadata(), DashboardLayout(), metadata, DashboardShell(), DashboardShellProps, LiveSessionBanner(), cleanLink() (+2 more)

### Community 49 - "🚀 7-Step Testing & Enhancement Roadmap"
Cohesion: 0.15
Nodes (12): 1. UI/UX (User Interface & User Experience), 2. Responsive & RTL (Right-to-Left) Adaptation, 3. SEO & GEO (Search Engine Optimization & Geographic Optimization), 4. Performance (Core Web Vitals Optimization), 5. Automated Testing (Unit, Integration & E2E), 6. Robust Security Policy, 7. Google Tag Manager (GTM) & GA4 Multi-Tenant Integration, 🚀 7-Step Testing & Enhancement Roadmap (+4 more)

### Community 50 - "(dashboard)/student/[userId]/profile-details/page.tsx"
Cohesion: 0.39
Nodes (3): isStatusCompleted(), resolveMediaUrl(), StudentProfileDetailsPage()

### Community 51 - "useAdsQueries.ts"
Cohesion: 0.10
Nodes (48): dismissAd(), getAdDismissKey(), getSafeHref(), getYoutubeEmbedUrl(), hasAdMedia(), isAdDismissed(), isHttpUrl(), isRelativePath() (+40 more)

### Community 52 - "AvailableGroupsView.tsx"
Cohesion: 0.13
Nodes (18): metadata, ParentAvailableGroupsPage(), metadata, StudentAvailableGroupsPage(), metadata, TeacherAvailableGroupsPage(), SessionHeaderProps, AvailableGroupCard() (+10 more)

### Community 53 - "Skeleton"
Cohesion: 0.16
Nodes (13): NotificationModalData, NotificationsView(), NotificationsViewProps, TEACHER_VIEWING_KEY, TeacherSwitchToStudentModalProps, teacherKeys, useTeacherGroupsWithStudents(), useTeacherLoginAsStudent() (+5 more)

### Community 54 - "feature_flags"
Cohesion: 0.18
Nodes (11): feature_flags, allow_student_self_registration, enable_dark_mode_toggle, enable_digital_library, enable_exams_module, enable_grade_entry, enable_notifications_bell, enable_parent_portal (+3 more)

### Community 55 - "TicketConversation.tsx"
Cohesion: 0.26
Nodes (11): ContactUsViewInner(), ALLOWED_IMAGE_TYPES, TicketConversation(), TicketConversationProps, TicketList(), TicketStatusBadge(), TicketStatusBadgeProps, useContactThreadDetail() (+3 more)

### Community 56 - "vitest"
Cohesion: 0.22
Nodes (9): @testing-library/react@^16.3.2, vitest@^4.1.6, @testing-library/react, vitest, EnrollmentSuccessView(), EnrollmentSuccessViewProps, sanitizeTelegramUrl(), TelegramIcon() (+1 more)

### Community 57 - "saas_tenant_config.json"
Cohesion: 0.20
Nodes (9): description, quotas_and_limits, max_cloud_storage_bytes, max_simultaneous_video_rooms, max_students, max_supervisors, max_teachers, $schema (+1 more)

### Community 58 - "contact_and_support"
Cohesion: 0.20
Nodes (10): contact_and_support, contact_phone, social_links, support_email, telegram_channel, whatsapp_number, facebook, instagram (+2 more)

### Community 59 - "paytabs"
Cohesion: 0.20
Nodes (10): payment_gateways, paytabs, stripe, currency_supported, enabled, merchant_id, profile_id, currency_supported (+2 more)

### Community 60 - "GlobalNotificationsPage.tsx"
Cohesion: 0.33
Nodes (7): NotificationsPage(), NotificationsPage(), GlobalNotificationsPage(), GlobalNotification, GlobalNotificationsResponse, useGlobalNotifications(), apiGet()

### Community 61 - "manifest.json"
Cohesion: 0.14
Nodes (13): background_color, categories, description, dir, display, icons, id, lang (+5 more)

### Community 62 - "AvailableTimeForm.tsx"
Cohesion: 0.33
Nodes (8): AvailableTimeForm(), AvailableTimeFormProps, DAY_MAP, mapSavedTimesToSlots(), normalizeDay(), normalizeTimeTo24h(), AvailableBuddyTime, AvailableTimeSlot

### Community 63 - "enrollmentSlice.ts"
Cohesion: 0.18
Nodes (9): @reduxjs/toolkit@^2.11.2, @reduxjs/toolkit, AppDispatch, rootReducer, RootState, EnrollmentData, enrollmentSlice, EnrollmentState (+1 more)

### Community 64 - "localization"
Cohesion: 0.22
Nodes (9): localization, currency_code, currency_symbol, date_format, default_locale, direction_default, number_format, supported_locales (+1 more)

### Community 65 - "tenant_metadata"
Cohesion: 0.22
Nodes (9): tenant_metadata, academy_name, created_at, custom_domain, legal_name, slug, status, subscription_tier (+1 more)

### Community 66 - "seo.ts"
Cohesion: 0.15
Nodes (19): generateMetadata(), privatePaths, robots(), sitemap(), AI_BOTS, BLOCKED_BOTS, buildAlternates(), buildLanguages() (+11 more)

### Community 67 - "[examId]/page.tsx"
Cohesion: 0.50
Nodes (7): resolveMediaUrl(), TakeExamPage(), clearExamDraft(), ExamDraft, getExamDraft(), getKey(), saveExamDraft()

### Community 68 - "@tanstack/react-query"
Cohesion: 0.18
Nodes (14): @tanstack/react-query, FilterType, getEmbedUrl(), getYoutubeId(), isPdf(), LibraryPage(), ResourceCard(), VideoModal() (+6 more)

### Community 69 - "teacher/grades/page.tsx"
Cohesion: 0.18
Nodes (12): GradeEntryForm(), GradeEntryFormProps, GradeRecord, GradeRecord, TeacherGradesPage(), GroupBanner(), GroupBannerProps, GroupStudentsTable() (+4 more)

### Community 70 - "seo_and_metadata"
Cohesion: 0.25
Nodes (8): seo_and_metadata, default_keywords, default_meta_description, default_share_image_url, global_meta_title_suffix, google_site_verification_id, robots_directives, sitemap_frequency

### Community 71 - "api-client.ts"
Cohesion: 0.28
Nodes (10): apiDelete(), apiPatch(), apiPost(), apiPut(), apiUpload(), buildConfig(), LoginResponse, ChildCard (+2 more)

### Community 72 - "integrations"
Cohesion: 0.29
Nodes (7): integrations, facebook_pixel_id, google_analytics_id, google_meet_client_id, google_tag_manager_id, sentry_dsn, zoom_client_id

### Community 73 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, start, test, test:watch

### Community 75 - "Warattel Academy - Development Guidelines & Enhancements Reference"
Cohesion: 0.33
Nodes (5): 1. Form Submissions & UX, 2. API Feedback & Toast Notifications, 3. Localization & Translation, 4. API Proxy & Security (Next.js Route Handlers), Warattel Academy - Development Guidelines & Enhancements Reference

### Community 76 - "next.config.mjs"
Cohesion: 0.33
Nodes (5): nextConfig, withNextIntl, withPWA, @ducanh2912/next-pwa@^10.2.9, @ducanh2912/next-pwa

### Community 77 - "faq/page.tsx"
Cohesion: 0.43
Nodes (5): FaqHeader(), FaqHeaderProps, FaqSupportCards(), StudentFaqPage(), useFaqs()

### Community 78 - "NotificationType"
Cohesion: 0.40
Nodes (5): NotificationType, DANGER, INFO, SUCCESS, WARNING

### Community 79 - "StudentDetailsSidebar.tsx"
Cohesion: 0.33
Nodes (6): AttendanceFilter, StudentDetailsSidebar(), StudentDetailsSidebarProps, StudentRecord, useTeacherStudentPreviousAttendance(), PreviousAttendanceRecord

### Community 80 - "ActionType"
Cohesion: 0.40
Nodes (5): ActionType, DELETE, EXCLUDE, FREEZE, RETURN

### Community 81 - "ExcuseStatus"
Cohesion: 0.40
Nodes (5): ExcuseStatus, APPROVED, PENDING, REJECTED, ExcuseRecord

### Community 82 - "TamamStatus"
Cohesion: 0.40
Nodes (5): TamamStatus, ABSENT, COMPLETED, PENDING, TamamCard

### Community 83 - "vercel.json"
Cohesion: 0.40
Nodes (4): buildCommand, framework, installCommand, $schema

### Community 84 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 91 - "dropdown-menu.tsx"
Cohesion: 0.15
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 92 - "next"
Cohesion: 0.19
Nodes (6): next, ALLOWED_DOMAINS, GET(), isAllowedHost(), InstructionsContent(), InstructionsPage()

### Community 93 - "student/messages/page.tsx"
Cohesion: 0.18
Nodes (5): GroupChatMetadata, MessagesPage(), TeacherMessagesPage(), ChatSkeleton(), ChatSkeletonProps

### Community 94 - "middleware.ts"
Cohesion: 0.29
Nodes (7): routing, LOCALES, aiBotHits, aiBotRetryAfter(), config, intlMiddleware, middleware()

### Community 95 - "FaqBrowser.tsx"
Cohesion: 0.29
Nodes (10): FaqBrowser(), FaqBrowserProps, highlight(), FaqSection(), Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger() (+2 more)

### Community 96 - "AddChildModal.tsx"
Cohesion: 0.13
Nodes (23): formik, AudioSyncController(), AudioSyncControllerProps, DAY_KEY_MAP, getTrackInfo(), PathSelectionField(), RegisterValues, AddChildModalProps (+15 more)

### Community 97 - "format.ts"
Cohesion: 0.46
Nodes (6): formatDate(), formatNumber(), formatPercentage(), formatRelativeTime(), formatTime(), truncate()

### Community 99 - "badge.tsx"
Cohesion: 0.70
Nodes (3): ProgramsSection(), Badge(), badgeVariants

### Community 100 - "logos"
Cohesion: 0.40
Nodes (5): logos, collapsed_sidebar_logo_url, dark_mode_logo_url, favicon_url, light_mode_logo_url

### Community 101 - "typography"
Cohesion: 0.40
Nodes (5): typography, font_arabic, font_heading, font_sans_latin, font_weights

### Community 102 - "WarningLevel"
Cohesion: 0.40
Nodes (5): WarningLevel, FINAL, FIRST, SECOND, THIRD

### Community 104 - "student/page.tsx"
Cohesion: 0.21
Nodes (10): AcademyDecisionModal(), AcademyDecisionModalProps, ActiveExamCard(), ActiveExamCardProps, LatestGradeCard(), LatestGradeCardProps, NextSessionCard(), NextSessionCardProps (+2 more)

### Community 105 - "ParentAuthGuard"
Cohesion: 0.67
Nodes (3): ParentAuthGuard(), metadata, ParentLayout()

### Community 106 - "ExamDifficulty"
Cohesion: 0.50
Nodes (4): ExamDifficulty, EASY, HARD, MEDIUM

## Knowledge Gaps
- **30 isolated node(s):** `STUDENT`, `TEACHER`, `PARENT`, `PENDING`, `APPROVED` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 618 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next-intl` connect `[locale]/page.tsx` to `sonner`, `Button`, `cn`, `ExcuseForm.tsx`, `teacher/children/page.tsx`, `enums.ts`, `ParentChildrenJoinSection.tsx`, `dependencies`, `ChatRoom.tsx`, `SeoContentPage.tsx`, `AudioUploadField.tsx`, `useRole`, `my-groups/page.tsx`, `buildPageMetadata`, `TicketConversation.tsx`, `MobileSidebar.tsx`, `result/page.tsx`, `api.types.ts`, `useAuth.ts`, `[locale]/layout.tsx`, `lucide-react`, `package.json`, `useStudentQueries.ts`, `sessions/page.tsx`, `group.service.ts`, `teacher/messages/page.tsx`, `ForgotPasswordForm.tsx`, `LoginForm.tsx`, `student/werd/[werdId]/page.tsx`, `teacher/page.tsx`, `DashboardShell.tsx`, `(dashboard)/student/[userId]/profile-details/page.tsx`, `useAdsQueries.ts`, `AvailableGroupsView.tsx`, `Skeleton`, `TicketConversation.tsx`, `vitest`, `GlobalNotificationsPage.tsx`, `AvailableTimeForm.tsx`, `seo.ts`, `[examId]/page.tsx`, `@tanstack/react-query`, `teacher/grades/page.tsx`, `react`, `next.config.mjs`, `faq/page.tsx`, `StudentDetailsSidebar.tsx`, `next`, `student/messages/page.tsx`, `middleware.ts`, `FaqBrowser.tsx`, `AddChildModal.tsx`, `badge.tsx`, `student/page.tsx`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **What connects `STUDENT`, `TEACHER`, `PARENT` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `student.types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05851063829787234 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `sonner`, `Button`, `cn`, `teacher/children/page.tsx`, `enums.ts`, `dependencies`, `SeoContentPage.tsx`, `useRole`, `my-groups/page.tsx`, `buildPageMetadata`, `MobileSidebar.tsx`, `result/page.tsx`, `[locale]/layout.tsx`, `lucide-react`, `package.json`, `useStudentQueries.ts`, `sessions/page.tsx`, `[locale]/page.tsx`, `teacher/messages/page.tsx`, `[locale]/layout.tsx`, `[...path]/route.ts`, `ContactUsView.tsx`, `ParentAuthGuard.tsx`, `ForgotPasswordForm.tsx`, `LoginForm.tsx`, `student/werd/[werdId]/page.tsx`, `teacher/page.tsx`, `DashboardShell.tsx`, `(dashboard)/student/[userId]/profile-details/page.tsx`, `useAdsQueries.ts`, `AvailableGroupsView.tsx`, `Skeleton`, `TicketConversation.tsx`, `vitest`, `seo.ts`, `[examId]/page.tsx`, `@tanstack/react-query`, `teacher/grades/page.tsx`, `react`, `faq/page.tsx`, `middleware.ts`, `badge.tsx`, `student/page.tsx`, `ParentAuthGuard`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `sonner` be split into smaller, more focused modules?**
  _Cohesion score 0.14039408866995073 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `sonner`, `Button`, `ExcuseForm.tsx`, `teacher/children/page.tsx`, `ParentChildrenJoinSection.tsx`, `ChatRoom.tsx`, `useRole`, `my-groups/page.tsx`, `MobileSidebar.tsx`, `result/page.tsx`, `[locale]/layout.tsx`, `lucide-react`, `sessions/page.tsx`, `FormSelect.tsx`, `group.service.ts`, `teacher/messages/page.tsx`, `ForgotPasswordForm.tsx`, `LoginForm.tsx`, `student/werd/[werdId]/page.tsx`, `DashboardShell.tsx`, `(dashboard)/student/[userId]/profile-details/page.tsx`, `useAdsQueries.ts`, `AvailableGroupsView.tsx`, `Skeleton`, `TicketConversation.tsx`, `vitest`, `AvailableTimeForm.tsx`, `[examId]/page.tsx`, `@tanstack/react-query`, `StudentDetailsSidebar.tsx`, `dropdown-menu.tsx`, `next`, `student/messages/page.tsx`, `FaqBrowser.tsx`, `AddChildModal.tsx`, `badge.tsx`, `student/page.tsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.1450719822812846 - nodes in this community are weakly interconnected._