import MockAdapter from "axios-mock-adapter";
import { httpClient } from "@/api/http-client";
import { changePassword, fetchMe, updateNickname } from "@/features/profile/api";

describe("profile api", () => {
  const mock = new MockAdapter(httpClient);

  afterEach(() => {
    mock.reset();
  });

  it("fetchMe returns user info", async () => {
    mock.onGet("/auth/me").reply(200, {
      authenticated: true,
      user: { id: 1, username: "alice", nickname: "Alice" },
    });
    await expect(fetchMe()).resolves.toEqual({ id: 1, username: "alice", nickname: "Alice" });
  });

  it("updateNickname sends payload and returns updated user", async () => {
    mock.onPatch("/auth/profile", { nickname: "NewName" }).reply(200, {
      user: { id: 1, username: "alice", nickname: "NewName" },
    });
    await expect(updateNickname("NewName")).resolves.toEqual({
      id: 1,
      username: "alice",
      nickname: "NewName",
    });
  });

  it("changePassword throws normalized validation error", async () => {
    mock.onPost("/auth/change-password").reply(422, {
      message: "Validation failed",
      errors: { newPassword: ["too weak"] },
    });
    await expect(changePassword("old123", "123")).rejects.toMatchObject({
      code: "VALIDATION",
    });
  });
});
