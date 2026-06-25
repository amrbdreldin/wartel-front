import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "https://12b9b58e23b2bb311d1600cbc2afe1b5@o4505710840709120.ingest.us.sentry.io/4511419343044608",

  sendDefaultPii: true,

  // 100% in dev, 1% in production
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.01,

  // Session Replay: 1% of all sessions, 100% of sessions with errors
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,

  enableLogs: true,

  integrations: [
    Sentry.replayIntegration(),
  ],
});

// Hook into App Router navigation transitions (App Router only)
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
