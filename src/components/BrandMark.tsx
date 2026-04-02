import { StyleSheet, Text, View } from "react-native";
import { colors, radii, shadows } from "@/theme/tokens";

export function BrandMark() {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Text style={styles.iconGlyph}>✦</Text>
      </View>
      <Text style={styles.wordmark}>Mind Mirror</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 8,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft,
  },
  iconGlyph: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  wordmark: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.foreground,
    letterSpacing: -0.3,
  },
});
