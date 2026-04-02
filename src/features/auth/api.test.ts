import MockAdapter from "axios-mock-adapter";
import { httpClient } from "@/api/http-client";
import { loginApi, registerApi } from "@/features/auth/api";

describe("auth api", () => {
  const mock = new MockAdapter(httpClient);

  afterEach(() => {
    mock.reset();
  });

  it("loginApi sends username/password and returns tokens", async () => {
    mock.onPost("/auth/login", { username: "alice", password: "secret" }).reply(200, {
      accessToken: "access-a",
      refreshToken: "refresh-a",
    });

    await expect(loginApi({ account: "alice", password: "secret" })).resolves.toEqual({
      accessToken: "access-a",
      refreshToken: "refresh-a",
    });
  });

  it("registerApi sends username/password and returns tokens", async () => {
    mock.onPost("/auth/register", { username: "bob", password: "password123" }).reply(200, {
      accessToken: "access-b",
      refreshToken: "refresh-b",
    });

    await expect(registerApi({ account: "bob", password: "password123" })).resolves.toEqual({
      accessToken: "access-b",
      refreshToken: "refresh-b",
    });
  });

  it("throws normalized error when auth API fails", async () => {
    mock.onPost("/auth/login").reply(401, { message: "Invalid credentials" });

    await expect(loginApi({ account: "wrong", password: "wrong" })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
      message: "Invalid credentials",
    });
  });
});
