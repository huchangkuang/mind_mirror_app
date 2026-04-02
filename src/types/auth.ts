export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type LoginPayload = {
  account: string;
  password: string;
};

export type RegisterPayload = {
  account: string;
  password: string;
  nickname?: string;
};
