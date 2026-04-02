import { API_ENDPOINTS } from "@/api/endpoints";
import { createHistory, listHistory } from "@/api/history";
import { httpClient } from "@/api/http-client";
import { CityMatchResult, CityQuestionBank } from "@/features/city-match/types";

export const CITY_MATCH_TEST_ID = "city-match";

export async function fetchCityMatchQuestions(mode: "quick" | "full"): Promise<CityQuestionBank> {
  const { data } = await httpClient.get<CityQuestionBank>(API_ENDPOINTS.cityMatch.questions, {
    params: { mode },
  });
  return data;
}

export async function saveCityMatchResult(result: CityMatchResult): Promise<void> {
  await createHistory({
    testId: CITY_MATCH_TEST_ID,
    result,
    resultSummary: result.matches[0]?.city.name ?? "城市匹配",
  });
}

export async function fetchCityMatchHistory() {
  return listHistory(CITY_MATCH_TEST_ID);
}
