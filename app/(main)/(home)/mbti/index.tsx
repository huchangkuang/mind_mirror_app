import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenBackground } from "@/components/ScreenBackground";
import { fetchMbtiQuestions } from "@/features/mbti/api";
import { useMbtiStore } from "@/features/mbti/store";
import { MbtiMode } from "@/features/mbti/types";
import { colors, radii, shadows, space } from "@/theme/tokens";

export default function MbtiIntroScreen() {
  const router = useRouter();
  const setBank = useMbtiStore((state) => state.setBank);
  const [loadingMode, setLoadingMode] = useState<MbtiMode | null>(null);
  const [error, setError] = useState("");

  const start = async (mode: MbtiMode) => {
    setError("");
    setLoadingMode(mode);
    try {
      const bank = await fetchMbtiQuestions(mode);
      setBank(bank);
      router.push("/(main)/mbti/test");
    } catch {
      setError("加载题目失败，请稍后重试");
    } finally {
      setLoadingMode(null);
    }
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>MBTI 人格测试</Text>
        <Text style={styles.desc}>选择测试模式开始答题，可随时在历史中查看记录。</Text>
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
          onPress={() => start("deep")}
          disabled={!!loadingMode}
        >
          <Text style={styles.primaryText}>{loadingMode === "deep" ? "加载中…" : "深度模式"}</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/(main)/mbti/history")} style={styles.linkWrap}>
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
