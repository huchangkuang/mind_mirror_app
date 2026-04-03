import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useMbtiStore } from "@/features/mbti/store";

export default function MbtiResultScreen() {
  const router = useRouter();
  const result = useMbtiStore((state) => state.result);
  const resetFlow = useMbtiStore((state) => state.resetFlow);

  if (!result) {
    return (
      <View style={styles.container}>
        <Text>暂无结果，请先完成 MBTI 测试。</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>你的 MBTI：{result.type}</Text>
      <Text style={styles.subtitle}>维度强度</Text>
      {Object.entries(result.dimensionStrength).map(([k, v]) => (
        <Text key={k}>
          {k}: {v}%
        </Text>
      ))}
      <Pressable
        style={styles.button}
        onPress={() => {
          resetFlow();
          router.replace("/(main)/mbti");
        }}
      >
        <Text style={styles.buttonText}>重新测试</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/(main)/mbti/history")}>
        <Text style={styles.link}>查看历史</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, gap: 8 },
  title: { fontSize: 24, fontWeight: "700" },
  subtitle: { marginTop: 6, fontWeight: "600" },
  button: { marginTop: 10, backgroundColor: "#111827", borderRadius: 8, padding: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
  link: { color: "#2563eb", marginTop: 8 },
});
