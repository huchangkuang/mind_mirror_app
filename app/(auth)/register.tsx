import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";
import { BrandMark } from "@/components/BrandMark";
import { ScreenBackground } from "@/components/ScreenBackground";
import { useAuthStore } from "@/stores/auth-store";
import { colors, radii, shadows, space } from "@/theme/tokens";

const registerSchema = z
  .object({
    account: z.string().min(1, "账号不能为空"),
    nickname: z.string().optional(),
    password: z.string().min(6, "密码至少 6 位"),
    confirmPassword: z.string().min(1, "请确认密码"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "两次密码输入不一致",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const {
    control,
    setError: setFormError,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      account: "",
      nickname: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (
          key === "account" ||
          key === "nickname" ||
          key === "password" ||
          key === "confirmPassword"
        ) {
          setFormError(key, { message: issue.message });
        }
      });
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await register({
        account: parsed.data.account.trim(),
        password: parsed.data.password,
        nickname: parsed.data.nickname?.trim() || undefined,
      });
      router.replace("/(main)");
    } catch {
      setError("注册失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <ScreenBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <BrandMark />
          <Text style={styles.subtitle}>创建账号后即可同步测试记录与历史数据。</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>创建账号</Text>

            <Controller
              control={control}
              name="account"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  placeholder="账号"
                  placeholderTextColor={colors.mutedLight}
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  style={styles.input}
                />
              )}
            />
            {!!errors.account?.message && <Text style={styles.fieldError}>{errors.account.message}</Text>}

            <Controller
              control={control}
              name="nickname"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  placeholder="昵称（可选）"
                  placeholderTextColor={colors.mutedLight}
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  placeholder="密码"
                  placeholderTextColor={colors.mutedLight}
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                />
              )}
            />
            {!!errors.password?.message && <Text style={styles.fieldError}>{errors.password.message}</Text>}

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  placeholder="确认密码"
                  placeholderTextColor={colors.mutedLight}
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                />
              )}
            />
            {!!errors.confirmPassword?.message && (
              <Text style={styles.fieldError}>{errors.confirmPassword.message}</Text>
            )}
            {!!error && <Text style={styles.bannerError}>{error}</Text>}

            <Pressable
              style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryPressed, submitting && styles.disabled]}
              onPress={onSubmit}
              disabled={submitting}
            >
              <Text style={styles.primaryButtonText}>{submitting ? "注册中…" : "注册"}</Text>
            </Pressable>
          </View>

          <Link href="/(auth)/login" asChild>
            <Pressable style={styles.linkWrap}>
              <Text style={styles.link}>已有账号？返回登录</Text>
            </Pressable>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: space.lg,
    paddingVertical: space.xl,
    gap: space.md,
    paddingBottom: 40,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    marginBottom: space.xs,
    paddingHorizontal: space.sm,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    padding: space.lg,
    gap: space.sm,
    ...shadows.card,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 4,
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
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  fieldError: {
    color: colors.destructive,
    fontSize: 13,
  },
  bannerError: {
    color: colors.destructive,
    fontSize: 14,
    textAlign: "center",
  },
  primaryButton: {
    marginTop: space.xs,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: "center",
    ...shadows.soft,
  },
  primaryPressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  linkWrap: {
    alignItems: "center",
    paddingVertical: space.sm,
  },
  link: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
});
