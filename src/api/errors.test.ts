import { normalizeApiError } from "@/api/errors";

describe("normalizeApiError", () => {
  it("maps 401 to UNAUTHORIZED", () => {
    const error = {
      isAxiosError: true,
      response: { status: 401, data: { message: "Unauthorized" } },
    };
    expect(normalizeApiError(error)).toEqual({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
      status: 401,
    });
  });

  it("maps 422 to VALIDATION with field errors", () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 422,
        data: {
          message: "Validation failed",
          errors: { username: ["required"] },
        },
      },
    };
    expect(normalizeApiError(error)).toEqual({
      code: "VALIDATION",
      message: "Validation failed",
      status: 422,
      fields: { username: ["required"] },
    });
  });

  it("maps missing response to NETWORK", () => {
    const error = { isAxiosError: true };
    expect(normalizeApiError(error)).toEqual({
      code: "NETWORK",
      message: "Network request failed",
    });
  });
});
