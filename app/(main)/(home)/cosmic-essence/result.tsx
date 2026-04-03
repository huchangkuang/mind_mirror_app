import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenBackground } from "@/components/ScreenBackground";
import { COSMIC_RESULTS } from "@/features/cosmic-essence/results";
import { useCosmicStore } from "@/features/cosmic-essence/store";
import { colors, radii, shadows, space } from "@/theme/tokens";

export default function CosmicEssenceResultScreen() {
  const router = useRouter();
  const resultId = useCosmicStore((s) => s.resultId);
  const resetFlow = useCosmicStore((s) => s.resetFlow);

  if (!resultId) {
    return (
      <ScreenBackground>
        <View style={styles.center}>
          <Text style={styles.muted}>暂无结果，请先完成测试。</Text>
          <Pressable style={styles.linkBtn} onPress={() => router.replace("/(main)/cosmic-essence")}>
            <Text style={styles.linkText}>返回介绍</Text>
          </Pressable>
        </View>
      </ScreenBackground>
    );
  }

  const r = COSMIC_RESULTS[resultId];

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.swatch, { backgroundColor: r.primaryHex }]} />
        <Text style={styles.name}>{r.name}</Text>
        <Text style={styles.rarity}>{r.rarityLabel}</Text>
        <View style={styles.tags}>
          {r.keywords.map((k) => (
            <View key={k} style={styles.tag}>
              <Text style={styles.tagText}>{k}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.soul}>{r.soul}</Text>
        <Text style={styles.affinity}>共鸣色：{r.affinityName}</Text>
        <Pressable
          style={({ pressed }) => [styles.primary, pressed && { opacity: 0.92 }]}
          onPress={() => {
            resetFlow();
            router.replace("/(main)/cosmic-essence");
          }}
        >
          <Text style={styles.primaryText}>再测一次</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/(main)")}>
          <Text style={styles.backLink}>返回测试列表</Text>
        </Pressable>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    padding: space.lg,
    gap: space.md,
  },
  muted: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 15,
  },
  linkBtn: {
    alignSelf: "center",
  },
  linkText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 16,
  },
  scroll: {
    padding: space.lg,
    paddingBottom: 48,
    gap: space.md,
  },
  swatch: {
    height: 120,
    borderRadius: radii.lg,
    ...shadows.card,
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.foreground,
  },
  rarity: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: colors.slate100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: {
    color: colors.slate700,
    fontWeight: "600",
    fontSize: 13,
  },
  soul: {
    fontSize: 16,
    lineHeight: 26,
    color: colors.slate700,
  },
  affinity: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: "600",
  },
  primary: {
    marginTop: space.sm,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: "center",
    ...shadows.soft,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  backLink: {
    textAlign: "center",
    color: colors.primary,
    fontWeight: "600",
    paddingVertical: space.md,
  },
});
