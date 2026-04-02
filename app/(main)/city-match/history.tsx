import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import { fetchCityMatchHistory } from "@/features/city-match/api";

export default function CityMatchHistoryScreen() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["city-match", "history"],
    queryFn: fetchCityMatchHistory,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>城市匹配历史记录</Text>
      {isLoading && <Text>加载中...</Text>}
      {isError && <Text style={styles.error}>加载失败，请稍后重试</Text>}
      {!isLoading && !isError && (data?.length ?? 0) === 0 && <Text>暂无历史记录</Text>}
      {!isLoading &&
        !isError &&
        (data ?? []).map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.result_summary || "城市匹配结果"}</Text>
            <Text style={styles.cardDesc}>{new Date(item.created_at).toLocaleString()}</Text>
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 10 },
  title: { fontSize: 22, fontWeight: "700" },
  error: { color: "#dc2626" },
  card: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, padding: 12 },
  cardTitle: { fontWeight: "600" },
  cardDesc: { marginTop: 4, color: "#6b7280", fontSize: 12 },
});
