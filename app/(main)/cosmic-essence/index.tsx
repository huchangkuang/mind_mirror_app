import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { ScreenBackground } from "@/components/ScreenBackground";
import { useCosmicStore } from "@/features/cosmic-essence/store";
import { colors, radii, shadows, space } from "@/theme/tokens";

export default function CosmicEssenceIntroScreen() {
  const router = useRouter();
  const resetFlow = useCosmicStore((s) => s.resetFlow);

  const start = () => {
    resetFlow();
    router.push("/(main)/cosmic-essence/test");
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>宇宙精神原色测试</Text>
        <Text style={styles.desc}>
          8 道宇宙情境单选题，为你的精神光谱匹配一种原色。题目与计分与 Web 端一致。
        </Text>
        <Pressable style={({ pressed }) => [styles.primary, pressed && styles.pressed]} onPress={start}>
          <Text style={styles.primaryText}>开始测试</Text>
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
  primary: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: space.sm,
    ...shadows.soft,
  },
  pressed: { opacity: 0.92 },
  primaryText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
