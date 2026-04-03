import { Redirect } from "expo-router";
import { AppLoadingView } from "@/components/AppLoadingView";
import { useAuthStore } from "@/stores/auth-store";

export default function IndexScreen() {
  const status = useAuthStore((state) => state.status);

  if (status === "loading") {
    return <AppLoadingView />;
  }

  return <Redirect href="/(main)" />;
}
