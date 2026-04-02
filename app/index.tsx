import { Redirect } from "expo-router";
import { AppLoadingView } from "@/components/AppLoadingView";
import { useAuthStore } from "@/stores/auth-store";

export default function IndexScreen() {
  const status = useAuthStore((state) => state.status);

  if (status === "loading") {
    return <AppLoadingView />;
  }

  if (status === "authenticated") {
    return <Redirect href="/(main)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
