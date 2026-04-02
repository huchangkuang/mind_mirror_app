import { Stack } from "expo-router";
import { Redirect } from "expo-router";
import { AppLoadingView } from "@/components/AppLoadingView";
import { useAuthStore } from "@/stores/auth-store";
import { colors } from "@/theme/tokens";

export default function MainLayout() {
  const status = useAuthStore((state) => state.status);

  if (status === "loading") {
    return <AppLoadingView />;
  }

  if (status !== "authenticated") {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 17,
          color: colors.foreground,
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "测试列表" }} />
      <Stack.Screen name="mbti/index" options={{ title: "MBTI 介绍" }} />
      <Stack.Screen name="mbti/test" options={{ title: "MBTI 答题" }} />
      <Stack.Screen name="mbti/result" options={{ title: "MBTI 结果" }} />
      <Stack.Screen name="mbti/history" options={{ title: "MBTI 历史" }} />
      <Stack.Screen name="city-match/index" options={{ title: "城市匹配介绍" }} />
      <Stack.Screen name="city-match/test" options={{ title: "城市匹配答题" }} />
      <Stack.Screen name="city-match/result" options={{ title: "城市匹配结果" }} />
      <Stack.Screen name="city-match/history" options={{ title: "城市匹配历史" }} />
      <Stack.Screen name="cosmic-essence/index" options={{ title: "宇宙精神原色" }} />
      <Stack.Screen name="cosmic-essence/test" options={{ title: "宇宙精神原色" }} />
      <Stack.Screen name="cosmic-essence/result" options={{ title: "你的精神原色" }} />
      <Stack.Screen name="profile" options={{ title: "个人中心" }} />
    </Stack>
  );
}
