import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenBackground } from "@/components/ScreenBackground";
import { COSMIC_QUESTIONS } from "@/features/cosmic-essence/questions";
import { resolveCosmicResult } from "@/features/cosmic-essence/score";
import type { CosmicDimension } from "@/features/cosmic-essence/types";
import { useCosmicStore } from "@/features/cosmic-essence/store";
import { colors, radii, shadows, space } from "@/theme/tokens";

export default function CosmicEssenceTestScreen() {
  const router = useRouter();
  const { currentIndex, answers, answerQuestion, next, prev, setResultId } = useCosmicStore();
  const [error, setError] = useState("");

  const current = COSMIC_QUESTIONS[currentIndex];
  const selected = answers[current.id];
  const isLast = currentIndex === COSMIC_QUESTIONS.length - 1;

  const goNext = () => {
    if (!selected) {
      setError("请先选择一项");
      return;
    }
    setError("");
    next();
  };

  const onFinish = () => {
    if (!selected) {
      setError("请先选择一项");
      return;
    }
    setError("");
    const dimensions = COSMIC_QUESTIONS.map((q) => answers[q.id]).filter(Boolean) as CosmicDimension[];
    if (dimensions.length !== COSMIC_QUESTIONS.length) {
      setError("请完成全部 8 题");
      return;
    }
    const resultId = resolveCosmicResult(dimensions);
    setResultId(resultId);
    router.replace("/(main)/cosmic-essence/result");
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.progress}>
          第 {currentIndex + 1} / {COSMIC_QUESTIONS.length} 题
        </Text>
        <Text style={styles.question}>{current.prompt}</Text>
        {current.options.map((opt) => (
          <Pressable
            key={opt.letter}
            style={[
              styles.option,
              selected === opt.dimension && styles.optionSelected,
            ]}
            onPress={() => answerQuestion(current.id, opt.dimension)}
          >
            <Text style={styles.optionLetter}>{opt.letter}.</Text>
            <Text style={styles.optionText}>{opt.text}</Text>
          </Pressable>
        ))}
        {!!error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.actions}>
          <Pressable onPress={prev} style={styles.secondaryButton} disabled={currentIndex === 0}>
            <Text style={styles.secondaryText}>上一题</Text>
          </Pressable>
          {!isLast ? (
            <Pressable onPress={goNext} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>下一题</Text>
            </Pressable>
          ) : (
            <Pressable onPress={onFinish} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>查看原色</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: space.lg,
    paddingBottom: 40,
    gap: space.sm,
  },
  progress: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  question: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: space.sm,
    lineHeight: 26,
  },
  option: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: space.md,
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: "rgba(239, 246, 255, 0.95)",
  },
  optionLetter: {
    fontWeight: "800",
    color: colors.primary,
    width: 22,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.foreground,
  },
  error: {
    color: colors.destructive,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: space.md,
    gap: space.sm,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: space.md,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  secondaryText: {
    color: colors.foreground,
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.primary,
    alignItems: "center",
    ...shadows.soft,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
