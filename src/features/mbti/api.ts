import { API_ENDPOINTS } from "@/api/endpoints";
import { createHistory, listHistory } from "@/api/history";
import { httpClient } from "@/api/http-client";
import { MbtiMode, MbtiQuestionBank, MbtiResult } from "@/features/mbti/types";

export const MBTI_TEST_ID = "mbti";

export async function fetchMbtiQuestions(mode: MbtiMode): Promise<MbtiQuestionBank> {
  const { data } = await httpClient.get<MbtiQuestionBank>(API_ENDPOINTS.mbti.questions, {
    params: { mode },
  });
  return data;
}

export async function submitMbti(input: {
  version: string;
  mode: MbtiMode;
  answers: Record<string, string | number>;
}): Promise<MbtiResult> {
  const { data } = await httpClient.post<MbtiResult>(API_ENDPOINTS.mbti.submit, input);
  await createHistory({
    testId: MBTI_TEST_ID,
    result: data,
    resultSummary: data.type,
  });
  return data;
}

export async function fetchMbtiHistory() {
  return listHistory(MBTI_TEST_ID);
}
