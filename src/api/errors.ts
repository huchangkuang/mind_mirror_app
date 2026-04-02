import axios from "axios";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION"
  | "NETWORK"
  | "SERVER"
  | "UNKNOWN";

export type ApiError = {
  code: ApiErrorCode;
  message: string;
  status?: number;
  fields?: Record<string, string[]>;
};

export function normalizeApiError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    return { code: "UNKNOWN", message: "Unexpected error" };
  }

  if (!error.response) {
    return { code: "NETWORK", message: "Network request failed" };
  }

  const status = error.response.status;
  const data = error.response.data as
    | { message?: string; errors?: Record<string, string[]> }
    | undefined;

  if (status === 401) {
    return { code: "UNAUTHORIZED", message: data?.message ?? "Unauthorized", status };
  }
  if (status === 403) {
    return { code: "FORBIDDEN", message: data?.message ?? "Forbidden", status };
  }
  if (status === 422) {
    return {
      code: "VALIDATION",
      message: data?.message ?? "Validation failed",
      status,
      fields: data?.errors,
    };
  }
  if (status >= 500) {
    return { code: "SERVER", message: data?.message ?? "Server error", status };
  }

  return { code: "UNKNOWN", message: data?.message ?? "Request failed", status };
}
