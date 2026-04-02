import { API_ENDPOINTS } from "@/api/endpoints";
import { httpClient } from "@/api/http-client";
import { AssessmentItem } from "@/features/assessments/types";

type TestsListResponse = {
  tests?: Array<{
    /** Prisma `@map("test_id")`，JSON 一般为 camelCase `testId` */
    test_id?: string;
    testId?: string;
    id?: string | number;
    title?: string;
    href?: string | null;
  }>;
};

export async function fetchAssessments(): Promise<AssessmentItem[]> {
  const { data } = await httpClient.get<TestsListResponse>(API_ENDPOINTS.tests.list);
  return (data.tests ?? [])
    .map((item) => {
      const slug = item.test_id ?? item.testId;
      const id = slug != null && slug !== "" ? String(slug) : String(item.id ?? "");
      return {
        id,
        title: item.title ?? id,
        href: item.href ?? null,
      };
    })
    .filter((item) => Boolean(item.id));
}
