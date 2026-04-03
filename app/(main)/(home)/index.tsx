import { Link, Redirect, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenBackground } from "@/components/ScreenBackground";
import { fetchAssessments } from "@/features/assessments/api";
import { useAuthStore } from "@/stores/auth-store";
import { colors, radii, shadows, space } from "@/theme/tokens";

export default function MainIndexScreen() {
  const router = useRouter();
  const status = useAuthStore((state) => state.status);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["tests", "list"],
    queryFn: fetchAssessments,
  });

  if (status !== "authenticated") {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heroTitle}>测试列表</Text>
        <Text style={styles.heroDesc}>选择测评开始探索，数据可在登录后长期保存。</Text>

        {isLoading && <Text style={styles.muted}>加载中…</Text>}
        {isError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>加载失败，请重试</Text>
            <Pressable style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>重试</Text>
            </Pressable>
          </View>
        )}
        {!isLoading && !isError && (data?.length ?? 0) === 0 && (
          <Text style={styles.muted}>暂无可用测试</Text>
        )}
        {!isLoading &&
          !isError &&
          (data ?? []).map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => {
                const id = String(item.id).toLowerCase();
                if (id.includes("mbti")) {
                  router.push("/(main)/mbti");
                  return;
                }
                if (id.includes("city")) {
                  router.push("/(main)/city-match");
                  return;
                }
                if (id.includes("cosmic")) {
                  router.push("/(main)/cosmic-essence");
                }
              }}
            >
              <View style={styles.cardAccent} />
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.id}</Text>
            </Pressable>
          ))}

        <Text style={styles.sectionLabel}>快捷入口</Text>
        <Pressable
          style={({ pressed }) => [styles.quickPrimary, pressed && styles.quickPressed]}
          onPress={() => router.push("/(main)/mbti")}
        >
          <Text style={styles.quickPrimaryText}>进入 MBTI 测试</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.quickSecondary, pressed && styles.quickPressed]}
          onPress={() => router.push("/(main)/city-match")}
        >
          <Text style={styles.quickSecondaryText}>进入城市匹配测试</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.quickSecondary, pressed && styles.quickPressed]}
          onPress={() => router.push("/(main)/cosmic-essence")}
        >
          <Text style={styles.quickSecondaryText}>宇宙精神原色测试</Text>
        </Pressable>

        <Link href="/(main)/profile" style={styles.link}>
          个人中心 →
        </Link>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: space.lg,
    paddingBottom: 40,
    gap: space.md,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.foreground,
    letterSpacing: -0.4,
  },
  heroDesc: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    marginBottom: space.xs,
  },
  muted: {
    color: colors.muted,
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.md,
    overflow: "hidden",
    ...shadows.card,
  },
  cardPressed: {
    opacity: 0.94,
  },
  cardAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
    borderTopLeftRadius: radii.lg,
    borderBottomLeftRadius: radii.lg,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.foreground,
    paddingLeft: 8,
  },
  cardDesc: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
    paddingLeft: 8,
  },
  errorBox: {
    gap: space.sm,
    padding: space.md,
    borderRadius: radii.md,
    backgroundColor: "rgba(254, 226, 226, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(252, 165, 165, 0.6)",
  },
  errorText: {
    color: colors.destructive,
    fontWeight: "600",
  },
  retryButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  sectionLabel: {
    marginTop: space.sm,
    fontSize: 13,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  quickPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: 14,
    paddingHorizontal: space.md,
    alignItems: "center",
    ...shadows.soft,
  },
  quickSecondary: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingVertical: 14,
    paddingHorizontal: space.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickPressed: {
    opacity: 0.9,
  },
  quickPrimaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  quickSecondaryText: {
    color: colors.foreground,
    fontWeight: "700",
    fontSize: 16,
  },
  link: {
    color: colors.primary,
    marginTop: space.sm,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: space.md,
  },
});
