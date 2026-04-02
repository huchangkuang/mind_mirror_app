import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/tokens";

export function AppLoadingView() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.hint}>加载中…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    gap: 12,
  },
  hint: {
    fontSize: 15,
    color: colors.muted,
    fontWeight: "500",
  },
});
