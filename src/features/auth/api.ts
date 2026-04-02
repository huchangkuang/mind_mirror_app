import { httpClient } from "@/api/http-client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { LoginPayload, RegisterPayload, TokenPair } from "@/types/auth";

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function loginApi(payload: LoginPayload): Promise<TokenPair> {
  const { data } = await httpClient.post<AuthResponse>(
    API_ENDPOINTS.auth.login,
    {
      username: payload.account,
      password: payload.password,
    },
    { authPublic: true },
  );
  return { accessToken: data.accessToken, refreshToken: data.refreshToken };
}

export async function registerApi(payload: RegisterPayload): Promise<TokenPair> {
  const { data } = await httpClient.post<AuthResponse>(
    API_ENDPOINTS.auth.register,
    {
      username: payload.account,
      password: payload.password,
    },
    { authPublic: true },
  );
  return { accessToken: data.accessToken, refreshToken: data.refreshToken };
}

export async function refreshTokenApi(refreshToken: string): Promise<TokenPair> {
  const { data } = await httpClient.post<AuthResponse>(
    API_ENDPOINTS.auth.refresh,
    { refreshToken },
    { authPublic: true },
  );
  return { accessToken: data.accessToken, refreshToken: data.refreshToken };
}

export async function logoutApi(refreshToken: string): Promise<void> {
  await httpClient.post(
    API_ENDPOINTS.auth.logout,
    { refreshToken },
    {
      authPublic: true,
    },
  );
}
