import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { saveCityMatchResult } from "@/features/city-match/api";
import { computeCityMatchResult } from "@/features/city-match/scoring";
import { useCityMatchStore } from "@/features/city-match/store";

export default function CityMatchTestScreen() {
  const router = useRouter();
  const { bank, currentIndex, answers, answerQuestion, next, prev, setResult } = useCityMatchStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!bank || bank.questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>题库未加载，请返回城市匹配介绍页重试。</Text>
      </View>
    );
  }

  const current = bank.questions[currentIndex];
  const selected = answers[current.id];
  const isLast = currentIndex === bank.questions.length - 1;

  const onSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const result = computeCityMatchResult({
        questions: bank.questions,
        answers,
      });
      setResult(result);
      await saveCityMatchResult(result);
      router.replace("/(main)/city-match/result");
    } catch {
      setError("提交失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        第 {currentIndex + 1} / {bank.questions.length} 题
      </Text>
      <Text style={styles.question}>{current.text}</Text>
      {current.options.map((opt) => (
        <Pressable
          key={opt.value}
          style={[styles.option, selected === opt.value && styles.optionSelected]}
          onPress={() => answerQuestion(current.id, opt.value)}
        >
          <Text style={styles.optionText}>{opt.label}</Text>
        </Pressable>
      ))}
      {!!error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.actions}>
        <Pressable onPress={prev} style={styles.secondaryButton} disabled={currentIndex === 0}>
          <Text>上一题</Text>
        </Pressable>
        {!isLast ? (
          <Pressable onPress={next} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>下一题</Text>
          </Pressable>
        ) : (
          <Pressable onPress={onSubmit} style={styles.primaryButton} disabled={submitting}>
            <Text style={styles.primaryButtonText}>{submitting ? "提交中..." : "提交"}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  progress: { color: "#6b7280" },
  question: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  option: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 12 },
  optionSelected: { borderColor: "#2563eb", backgroundColor: "#eff6ff" },
  optionText: { fontSize: 15 },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  secondaryButton: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#d1d5db" },
  primaryButton: { padding: 10, borderRadius: 8, backgroundColor: "#111827" },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
  error: { color: "#dc2626" },
});
