import { create } from "zustand";
import {
  clearRefreshTokenFromStore,
  getRefreshTokenFromStore,
  setRefreshTokenToStore,
} from "@/api/token-storage";
import { setHttpAuthHandlers } from "@/api/http-client";
import { loginApi, logoutApi, refreshTokenApi, registerApi } from "@/features/auth/api";
import { AuthStatus, LoginPayload, RegisterPayload, TokenPair } from "@/types/auth";

type AuthState = {
  status: AuthStatus;
  accessToken: string | null;
  refreshToken: string | null;
  bootstrapSession: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  clearSession: () => Promise<void>;
};

function assignSession(set: (state: Partial<AuthState>) => void, pair: TokenPair) {
  set({
    status: "authenticated",
    accessToken: pair.accessToken,
    refreshToken: pair.refreshToken,
  });
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "loading",
  accessToken: null,
  refreshToken: null,

  bootstrapSession: async () => {
    const storedRefresh = await getRefreshTokenFromStore();
    if (!storedRefresh) {
      set({ status: "unauthenticated" });
      return;
    }
    set({ refreshToken: storedRefresh });
    const ok = await get().refreshSession();
    if (!ok) {
      set({ status: "unauthenticated" });
    }
  },

  login: async (payload) => {
    const tokenPair = await loginApi(payload);
    await setRefreshTokenToStore(tokenPair.refreshToken);
    assignSession(set, tokenPair);
  },

  register: async (payload) => {
    const tokenPair = await registerApi(payload);
    await setRefreshTokenToStore(tokenPair.refreshToken);
    assignSession(set, tokenPair);
  },

  logout: async () => {
    const refreshToken = get().refreshToken ?? (await getRefreshTokenFromStore());
    if (refreshToken) {
      try {
        await logoutApi(refreshToken);
      } catch {
        // If backend logout fails we still clear local session to avoid stale auth state.
      }
    }
    await get().clearSession();
  },

  refreshSession: async () => {
    const currentRefreshToken = get().refreshToken ?? (await getRefreshTokenFromStore());
    if (!currentRefreshToken) {
      await get().clearSession();
      return false;
    }

    try {
      const tokenPair = await refreshTokenApi(currentRefreshToken);
      await setRefreshTokenToStore(tokenPair.refreshToken);
      assignSession(set, tokenPair);
      return true;
    } catch {
      await get().clearSession();
      return false;
    }
  },

  clearSession: async () => {
    await clearRefreshTokenFromStore();
    set({
      status: "unauthenticated",
      accessToken: null,
      refreshToken: null,
    });
  },
}));

setHttpAuthHandlers({
  getAccessToken: () => useAuthStore.getState().accessToken,
  refreshSession: () => useAuthStore.getState().refreshSession(),
  onAuthFailed: () => {
    const s = useAuthStore.getState();
    if (s.status === "unauthenticated" && !s.accessToken && !s.refreshToken) {
      return;
    }
    return s.clearSession();
  },
});
