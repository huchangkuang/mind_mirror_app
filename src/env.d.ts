/** Expo 会将 EXPO_PUBLIC_* 注入 bundle，见 https://docs.expo.dev/guides/environment-variables/ */
declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_BASE_URL?: string;
    EXPO_PUBLIC_SENTRY_DSN?: string;
  }
}
