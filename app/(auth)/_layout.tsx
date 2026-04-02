import { Stack } from "expo-router";

/** 与 Web 端 auth 页一致：全屏内容区自管标题，不重复系统顶栏 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
