import { API_ENDPOINTS } from "@/api/endpoints";
import { httpClient } from "@/api/http-client";

export type HistoryRecord = {
  id: number;
  test_id: string;
  title: string;
  href: string | null;
  result: unknown;
  result_summary: string;
  created_at: string;
};

type HistoryListResponse = {
  history?: HistoryRecord[];
};

type CreateHistoryPayload = {
  testId: string;
  result: unknown;
  resultSummary?: string;
};

type CreateHistoryResponse = {
  record?: HistoryRecord;
};

export async function listHistory(testId?: string): Promise<HistoryRecord[]> {
  const { data } = await httpClient.get<HistoryListResponse>(API_ENDPOINTS.tests.history, {
    params: testId ? { test_id: testId } : undefined,
  });
  return data.history ?? [];
}

export async function createHistory(payload: CreateHistoryPayload): Promise<HistoryRecord | null> {
  const { data } = await httpClient.post<CreateHistoryResponse>(API_ENDPOINTS.tests.history, payload);
  return data.record ?? null;
}
