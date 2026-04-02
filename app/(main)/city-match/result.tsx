import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useCityMatchStore } from "@/features/city-match/store";

export default function CityMatchResultScreen() {
  const router = useRouter();
  const result = useCityMatchStore((state) => state.result);
  const resetFlow = useCityMatchStore((state) => state.resetFlow);

  if (!result) {
    return (
      <View style={styles.container}>
        <Text>暂无结果，请先完成城市匹配测试。</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TOP 城市匹配</Text>
      {result.matches.map((match, idx) => (
        <View key={match.city.id} style={styles.card}>
          <Text style={styles.rank}>#{idx + 1}</Text>
          <Text style={styles.city}>{match.city.name}</Text>
          <Text style={styles.percent}>{match.matchPercentage}%</Text>
        </View>
      ))}
      <Pressable
        style={styles.button}
        onPress={() => {
          resetFlow();
          router.replace("/(main)/city-match");
        }}
      >
        <Text style={styles.buttonText}>重新测试</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/(main)/city-match/history")}>
        <Text style={styles.link}>查看历史</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, gap: 10 },
  title: { fontSize: 24, fontWeight: "700" },
  card: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, padding: 12, gap: 3 },
  rank: { color: "#6b7280" },
  city: { fontSize: 18, fontWeight: "600" },
  percent: { color: "#2563eb", fontWeight: "700" },
  button: { marginTop: 10, backgroundColor: "#111827", borderRadius: 8, padding: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
  link: { color: "#2563eb", marginTop: 6 },
});
