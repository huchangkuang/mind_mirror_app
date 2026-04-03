import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { AppLoadingView } from "@/components/AppLoadingView";
import { useAuthStore } from "@/stores/auth-store";
import { colors } from "@/theme/tokens";

export default function MainLayout() {
  const status = useAuthStore((state) => state.status);

  if (status === "loading") {
    return <AppLoadingView />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "测试首页",
          tabBarLabel: "测试首页",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(mine)"
        options={{
          title: "我的",
          tabBarLabel: "我的",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={size ?? 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
