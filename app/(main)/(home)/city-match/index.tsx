import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenBackground } from "@/components/ScreenBackground";
import { fetchCityMatchQuestions } from "@/features/city-match/api";
import { useCityMatchStore } from "@/features/city-match/store";
import { colors, radii, shadows, space } from "@/theme/tokens";

export default function CityMatchIntroScreen() {
  const router = useRouter();
  const setBank = useCityMatchStore((state) => state.setBank);
  const [loadingMode, setLoadingMode] = useState<"quick" | "full" | null>(null);
  const [error, setError] = useState("");

  const start = async (mode: "quick" | "full") => {
    setError("");
    setLoadingMode(mode);
    try {
      const bank = await fetchCityMatchQuestions(mode);
      setBank(bank);
      router.push("/(main)/city-match/test");
    } catch {
      setError("加载题目失败，请稍后重试");
    } finally {
      setLoadingMode(null);
    }
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>城市匹配测试</Text>
        <Text style={styles.desc}>根据你的偏好计算更匹配的城市组合。</Text>
        {!!error && (
          <View style={styles.errorBanner}>
            <Text style={styles.error}>{error}</Text>
          </View>
        )}
        <Pressable
          style={({ pressed }) => [styles.primary, pressed && styles.pressed, !!loadingMode && styles.disabled]}
          onPress={() => start("quick")}
          disabled={!!loadingMode}
        >
          <Text style={styles.primaryText}>{loadingMode === "quick" ? "加载中…" : "快速模式"}</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.primary, pressed && styles.pressed, !!loadingMode && styles.disabled]}
          onPress={() => start("full")}
          disabled={!!loadingMode}
        >
          <Text style={styles.primaryText}>{loadingMode === "full" ? "加载中…" : "完整模式"}</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/(main)/city-match/history")} style={styles.linkWrap}>
          <Text style={styles.link}>查看历史 →</Text>
        </Pressable>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: space.lg,
    justifyContent: "center",
    gap: space.md,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.foreground,
    letterSpacing: -0.3,
  },
  desc: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  errorBanner: {
    padding: space.sm,
    borderRadius: radii.md,
    backgroundColor: "rgba(254, 226, 226, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(252, 165, 165, 0.7)",
  },
  error: { color: colors.destructive, fontWeight: "600" },
  primary: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: "center",
    ...shadows.soft,
  },
  pressed: { opacity: 0.92 },
  disabled: { opacity: 0.55 },
  primaryText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  linkWrap: { alignItems: "center", paddingVertical: space.sm },
  link: { color: colors.primary, fontWeight: "700", fontSize: 16 },
});
