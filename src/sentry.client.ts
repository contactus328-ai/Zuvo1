import * as Sentry from "@sentry/react";
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    tracesSampleRate: 0.1,
    release: import.meta.env.VITE_RELEASE || undefined,
    environment: import.meta.env.MODE || undefined,
  });
}
