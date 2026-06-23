import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? "https://12b9b58e23b2bb311d1600cbc2afe1b5@o4505710840709120.ingest.us.sentry.io/4511419343044608",

  sendDefaultPii: true,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // Attach local variable values to stack frames
  includeLocalVariables: true,

  enableLogs: true,
});
