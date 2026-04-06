import { Stack } from "expo-router";
import { useEffect } from "react";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { AppProviders } from "@/components/AppProviders";
import { useAuthStore } from "@/stores/auth-store";

export function ErrorBoundary(props: Parameters<typeof AppErrorBoundary>[0]) {
  return <AppErrorBoundary {...props} />;
}

export default function RootLayout() {
  const bootstrapSession = useAuthStore((state) => state.bootstrapSession);

  useEffect(() => {
    bootstrapSession().catch(() => undefined);
  }, [bootstrapSession]);

  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
      </Stack>
    </AppProviders>
  );
}
