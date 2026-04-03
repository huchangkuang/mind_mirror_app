import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { normalizeApiError } from "@/api/errors";

/** 后端统一结构 { code, data, message }；需三者齐全才解包，避免与普通 JSON 混淆 */
function isApiEnvelope(payload: unknown): payload is { code: number; data: unknown; message: unknown } {
  if (typeof payload !== "object" || payload === null) return false;
  const o = payload as Record<string, unknown>;
  return typeof o.code === "number" && "data" in o && "message" in o;
}

type AuthHandlers = {
  getAccessToken: () => string | null;
  refreshSession: () => Promise<boolean>;
  onAuthFailed: () => Promise<void> | void;
};

declare module "axios" {
  interface AxiosRequestConfig {
    authPublic?: boolean;
    _retry?: boolean;
  }
}

let authHandlers: AuthHandlers = {
  getAccessToken: () => null,
  refreshSession: async () => false,
  onAuthFailed: async () => undefined,
};

let refreshPromise: Promise<boolean> | null = null;

export function setHttpAuthHandlers(handlers: Partial<AuthHandlers>) {
  authHandlers = { ...authHandlers, ...handlers };
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api/v1";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.authPublic) {
    const token = authHandlers.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  if (typeof __DEV__ !== "undefined" && __DEV__) {
    const method = (config.method ?? "get").toUpperCase();
    const fullUrl = `${config.baseURL ?? ""}${config.url ?? ""}`;
    console.log("[HTTP]", method, fullUrl, config.authPublic ? "public" : "protected");
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => {
    const payload = response.data;
    if (isApiEnvelope(payload)) {
      if (payload.code !== 0) {
        const envelopeMessage =
          typeof payload.message === "string"
            ? payload.message
            : payload.message == null
              ? "Request failed"
              : String(payload.message);
        return Promise.reject(
          new AxiosError(
            envelopeMessage,
            "ERR_BAD_RESPONSE",
            response.config,
            response.request,
            {
              ...response,
              status: 400,
              data: { message: envelopeMessage, code: payload.code },
            },
          ),
        );
      }
      response.data = payload.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const responseStatus = error.response?.status;
    const originalRequest = error.config as AxiosRequestConfig | undefined;

    if (!originalRequest || originalRequest.authPublic) {
      throw normalizeApiError(error);
    }

    if (responseStatus !== 401 || originalRequest._retry) {
      throw normalizeApiError(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = authHandlers
        .refreshSession()
        .catch(() => false)
        .finally(() => {
          refreshPromise = null;
        });
    }

    const refreshOk = await refreshPromise;

    if (!refreshOk) {
      // 访客无 refresh token 时 refresh 失败属预期；onAuthFailed 在 auth-store 中对纯访客会话短路，避免无意义 clear
      await authHandlers.onAuthFailed();
      throw normalizeApiError(error);
    }

    return httpClient(originalRequest);
  },
);
