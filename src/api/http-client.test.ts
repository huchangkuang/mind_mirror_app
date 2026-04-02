import MockAdapter from "axios-mock-adapter";
import { httpClient, setHttpAuthHandlers } from "@/api/http-client";

describe("httpClient auth interceptors", () => {
  const mock = new MockAdapter(httpClient);

  afterEach(() => {
    mock.reset();
  });

  it("injects access token for protected requests", async () => {
    setHttpAuthHandlers({
      getAccessToken: () => "token-123",
      refreshSession: async () => false,
      onAuthFailed: async () => undefined,
    });

    mock.onGet("/protected").reply((config) => [
      200,
      { authHeader: config.headers?.Authorization ?? "" },
    ]);

    const response = await httpClient.get<{ authHeader: string }>("/protected");
    expect(response.data.authHeader).toBe("Bearer token-123");
  });

  it("retries request after 401 refresh success", async () => {
    const refreshSession = jest.fn(async () => true);
    setHttpAuthHandlers({
      getAccessToken: () => "token-123",
      refreshSession,
      onAuthFailed: async () => undefined,
    });

    mock.onGet("/needs-refresh").replyOnce(401).onGet("/needs-refresh").reply(200, { ok: true });

    const response = await httpClient.get<{ ok: boolean }>("/needs-refresh");
    expect(response.data.ok).toBe(true);
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });

  it("uses single-flight refresh for concurrent 401", async () => {
    const refreshSession = jest.fn(async () => true);
    setHttpAuthHandlers({
      getAccessToken: () => "token-123",
      refreshSession,
      onAuthFailed: async () => undefined,
    });

    mock
      .onGet("/batch")
      .replyOnce(401)
      .onGet("/batch")
      .replyOnce(401)
      .onGet("/batch")
      .reply(200, { ok: true });

    const [a, b] = await Promise.all([httpClient.get("/batch"), httpClient.get("/batch")]);
    expect(a.status).toBe(200);
    expect(b.status).toBe(200);
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });

  it("clears session after 401 refresh failure", async () => {
    const onAuthFailed = jest.fn(async () => undefined);
    setHttpAuthHandlers({
      getAccessToken: () => "token-123",
      refreshSession: async () => false,
      onAuthFailed,
    });

    mock.onGet("/refresh-fail").reply(401, { message: "Unauthorized" });

    await expect(httpClient.get("/refresh-fail")).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    expect(onAuthFailed).toHaveBeenCalledTimes(1);
  });
});
