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

const loginSchema = z.object({
  account: z.string().min(1, "请输入账号"),
  password: z.string().min(1, "请输入密码"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const {
    control,
    setError: setFormError,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      account: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (key === "account" || key === "password") {
          setFormError(key, { message: issue.message });
        }
      });
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await login({ account: parsed.data.account.trim(), password: parsed.data.password });
      router.replace("/(main)");
    } catch {
      setError("登录失败，请检查账号或密码");
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
          <Text style={styles.subtitle}>登录后可以长期保存测试数据，随时查看历史记录。</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>登录账号</Text>

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
            {!!error && <Text style={styles.bannerError}>{error}</Text>}

            <Pressable
              style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryPressed, submitting && styles.disabled]}
              onPress={onSubmit}
              disabled={submitting}
            >
              <Text style={styles.primaryButtonText}>{submitting ? "登录中…" : "登录"}</Text>
            </Pressable>
          </View>

          <Link href="/(auth)/register" asChild>
            <Pressable style={styles.linkWrap}>
              <Text style={styles.link}>还没有账号？去注册</Text>
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
    justifyContent: "center",
    paddingHorizontal: space.lg,
    paddingVertical: space.xl,
    gap: space.md,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    marginBottom: space.sm,
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
