import * as Sentry from "@sentry/react-native";

let initialized = false;

export function initSentry() {
  if (initialized) {
    return;
  }

  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    enabled: Boolean(process.env.EXPO_PUBLIC_SENTRY_DSN),
    tracesSampleRate: 0.2,
  });

  initialized = true;
}
