import { API_ENDPOINTS } from "@/api/endpoints";
import { listHistory } from "@/api/history";
import { httpClient } from "@/api/http-client";

export type ProfileUser = {
  id: number;
  username: string;
  nickname?: string | null;
};

type MeResponse = {
  authenticated: boolean;
  user: ProfileUser | null;
};

type UpdateProfileResponse = {
  user: ProfileUser;
};

export async function fetchMe(): Promise<ProfileUser | null> {
  const { data } = await httpClient.get<MeResponse>(API_ENDPOINTS.auth.me);
  return data.user;
}

export async function updateNickname(nickname: string): Promise<ProfileUser> {
  const { data } = await httpClient.patch<UpdateProfileResponse>(API_ENDPOINTS.auth.updateProfile, {
    nickname,
  });
  return data.user;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await httpClient.post(API_ENDPOINTS.auth.changePassword, {
    currentPassword,
    newPassword,
  });
}

export async function fetchProfileHistorySummary() {
  const history = await listHistory();
  return {
    total: history.length,
    latest: history[0] ?? null,
  };
}
