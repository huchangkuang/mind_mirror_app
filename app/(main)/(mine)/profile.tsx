import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { z } from "zod";
import { ScreenBackground } from "@/components/ScreenBackground";
import {
  changePassword,
  fetchMe,
  fetchProfileHistorySummary,
  updateNickname,
} from "@/features/profile/api";
import { useAuthStore } from "@/stores/auth-store";
import { colors, radii, shadows, space } from "@/theme/tokens";

const nicknameSchema = z.string().min(2, "昵称至少 2 个字符").max(20, "昵称最多 20 个字符");
const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "当前密码至少 6 位"),
    newPassword: z.string().min(6, "新密码至少 6 位"),
    confirmPassword: z.string().min(6, "确认密码至少 6 位"),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "两次新密码不一致",
  });

export default function ProfileScreen() {
  const router = useRouter();
  const status = useAuthStore((state) => state.status);
  const logout = useAuthStore((state) => state.logout);
  const isAuthed = status === "authenticated";
  const [nicknameInput, setNicknameInput] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const meQuery = useQuery({
    queryKey: ["profile", "me"],
    queryFn: fetchMe,
    enabled: isAuthed,
  });

  const summaryQuery = useQuery({
    queryKey: ["profile", "history-summary"],
    queryFn: fetchProfileHistorySummary,
    enabled: isAuthed,
  });

  useEffect(() => {
    if (meQuery.data?.nickname) {
      setNicknameInput(meQuery.data.nickname);
    }
  }, [meQuery.data?.nickname]);

  const nicknameMutation = useMutation({
    mutationFn: updateNickname,
    onSuccess: (user) => {
      setNicknameMessage("昵称更新成功");
      setNicknameError("");
      setNicknameInput(user.nickname ?? "");
      meQuery.refetch().catch(() => undefined);
    },
    onError: () => {
      setNicknameError("昵称更新失败");
      setNicknameMessage("");
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      changePassword(payload.currentPassword, payload.newPassword),
    onSuccess: () => {
      setPasswordMessage("密码修改成功");
      setPasswordError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: () => {
      setPasswordError("密码修改失败");
      setPasswordMessage("");
    },
  });

  const onNicknameSave = () => {
    const value = nicknameInput.trim();
    const parsed = nicknameSchema.safeParse(value);
    if (!parsed.success) {
      setNicknameError(parsed.error.issues[0]?.message ?? "昵称格式不正确");
      setNicknameMessage("");
      return;
    }
    nicknameMutation.mutate(parsed.data);
  };

  const onPasswordSave = () => {
    const parsed = passwordSchema.safeParse({ currentPassword, newPassword, confirmPassword });
    if (!parsed.success) {
      setPasswordError(parsed.error.issues[0]?.message ?? "密码输入不正确");
      setPasswordMessage("");
      return;
    }
    passwordMutation.mutate({
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.newPassword,
    });
  };

  if (!isAuthed) {
    return (
      <ScreenBackground>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.lead}>登录后可同步账号信息、查看测评历史摘要并管理密码。</Text>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>访客模式</Text>
            <Text style={styles.label}>
              不登录也可以使用「测试首页」的测评入口。需要账号与历史数据时，请登录或注册。
            </Text>
            <Pressable style={styles.secondaryButton} onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.secondaryButtonText}>登录</Text>
            </Pressable>
            <Pressable style={styles.outlineButton} onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.outlineButtonText}>注册账号</Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.lead}>管理账号信息与测评历史摘要。</Text>

        {meQuery.isLoading ? (
          <Text style={styles.muted}>加载用户信息…</Text>
        ) : (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>账号信息</Text>
            <Text style={styles.label}>账号：{meQuery.data?.username ?? "—"}</Text>
            <Text style={styles.label}>昵称：{meQuery.data?.nickname ?? "—"}</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>历史摘要</Text>
          <Text style={styles.label}>总记录数：{summaryQuery.data?.total ?? 0}</Text>
          <Text style={styles.label}>
            最近一条：
            {summaryQuery.data?.latest ? summaryQuery.data.latest.result_summary : "暂无"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>修改昵称</Text>
          <TextInput
            style={styles.input}
            placeholder="输入新昵称"
            placeholderTextColor={colors.mutedLight}
            value={nicknameInput}
            onChangeText={setNicknameInput}
          />
          {!!nicknameError && <Text style={styles.error}>{nicknameError}</Text>}
          {!!nicknameMessage && <Text style={styles.success}>{nicknameMessage}</Text>}
          <Pressable style={styles.secondaryButton} onPress={onNicknameSave}>
            <Text style={styles.secondaryButtonText}>保存昵称</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>修改密码</Text>
          <TextInput
            style={styles.input}
            placeholder="当前密码"
            placeholderTextColor={colors.mutedLight}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="新密码"
            placeholderTextColor={colors.mutedLight}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="确认新密码"
            placeholderTextColor={colors.mutedLight}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {!!passwordError && <Text style={styles.error}>{passwordError}</Text>}
          {!!passwordMessage && <Text style={styles.success}>{passwordMessage}</Text>}
          <Pressable style={styles.secondaryButton} onPress={onPasswordSave}>
            <Text style={styles.secondaryButtonText}>保存密码</Text>
          </Pressable>
        </View>

        <Pressable style={styles.dangerButton} onPress={() => logout().catch(() => undefined)}>
          <Text style={styles.dangerButtonText}>退出登录</Text>
        </Pressable>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: space.lg,
    paddingBottom: 40,
    gap: space.md,
  },
  lead: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    marginBottom: space.xs,
  },
  muted: {
    color: colors.muted,
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.md,
    gap: space.sm,
    ...shadows.card,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.foreground,
    marginBottom: 4,
  },
  label: {
    color: colors.slate700,
    fontSize: 15,
    lineHeight: 22,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: space.md,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.foreground,
    backgroundColor: colors.slate50,
  },
  secondaryButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.slate800,
    borderRadius: radii.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  outlineButton: {
    alignSelf: "flex-start",
    marginTop: space.sm,
    backgroundColor: "transparent",
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  outlineButtonText: {
    color: colors.foreground,
    fontWeight: "700",
    fontSize: 15,
  },
  dangerButton: {
    marginTop: space.xs,
    backgroundColor: "rgba(220, 38, 38, 0.08)",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(252, 165, 165, 0.8)",
    paddingVertical: 14,
    alignItems: "center",
  },
  dangerButtonText: {
    color: colors.destructive,
    fontWeight: "700",
    fontSize: 16,
  },
  error: {
    color: colors.destructive,
    fontSize: 14,
  },
  success: {
    color: colors.success,
    fontSize: 14,
    fontWeight: "600",
  },
});
