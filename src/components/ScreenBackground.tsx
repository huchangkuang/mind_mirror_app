import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "@/theme/tokens";

type Props = {
  children: ReactNode;
};

/**
 * 模拟 Web 端 auth 页的浅色渐变底与柔光色块（无需 linear-gradient 依赖）。
 */
export function ScreenBackground({ children }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.blobTopRight} />
      <View style={styles.blobMidLeft} />
      <View style={styles.blobBottom} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  blobTopRight: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(96, 165, 250, 0.22)",
  },
  blobMidLeft: {
    position: "absolute",
    top: "28%",
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(167, 139, 250, 0.16)",
  },
  blobBottom: {
    position: "absolute",
    bottom: -40,
    right: "18%",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(103, 232, 207, 0.12)",
  },
  content: {
    flex: 1,
  },
});
