/**
 * 与 mind_mirror Web（globals.css / tailwind.config）对齐的语义色与间距。
 */
export const colors = {
  background: "#f8fafc",
  foreground: "#0f172a",
  muted: "#64748b",
  mutedLight: "#94a3b8",
  border: "#e2e8f0",
  borderStrong: "#cbd5e1",
  card: "#ffffff",
  primary: "#2563eb",
  primaryLight: "#3b82f6",
  primaryDark: "#1d4ed8",
  violet: "#7c3aed",
  destructive: "#dc2626",
  success: "#047857",
  slate50: "#f8fafc",
  slate100: "#f1f5f9",
  slate200: "#e2e8f0",
  slate700: "#334155",
  slate800: "#1e293b",
  orange: "#f97316",
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  card: 24,
} as const;

export const space = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
} as const;

export const shadows = {
  card: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  soft: {
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
} as const;
