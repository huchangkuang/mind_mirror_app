import { citiesData } from "@/features/city-match/cities-data";
import { CityMatchResult, CityQuestion, DimensionScores } from "@/features/city-match/types";

const DIMENSION_KEYS: Array<keyof DimensionScores> = ["lifestyle", "social", "environment", "pace"];

export function computeCityMatchResult(input: {
  questions: CityQuestion[];
  answers: Record<string, string>;
}): CityMatchResult {
  const { questions, answers } = input;
  const rawScores: DimensionScores = { lifestyle: 0, social: 0, environment: 0, pace: 0 };

  for (const q of questions) {
    const selected = answers[q.id];
    const option = q.options.find((o) => o.value === selected);
    if (!option) continue;
    for (const key of DIMENSION_KEYS) {
      const weight = option.dimensionWeights[key];
      if (typeof weight === "number") {
        rawScores[key] += weight;
      }
    }
  }

  const maxAbs: DimensionScores = { lifestyle: 0, social: 0, environment: 0, pace: 0 };
  for (const q of questions) {
    for (const opt of q.options) {
      for (const key of DIMENSION_KEYS) {
        const weight = opt.dimensionWeights[key];
        if (typeof weight === "number") {
          maxAbs[key] = Math.max(maxAbs[key], Math.abs(weight));
        }
      }
    }
  }

  const normalized: DimensionScores = { lifestyle: 0, social: 0, environment: 0, pace: 0 };
  for (const key of DIMENSION_KEYS) {
    const maxPossible = maxAbs[key] * questions.length;
    normalized[key] =
      maxPossible === 0 ? 0 : Math.max(-100, Math.min(100, Math.round((rawScores[key] / maxPossible) * 100)));
  }

  const matches = citiesData
    .map((city) => ({
      city,
      matchPercentage: similarityToPercentage(cosineSimilarity(normalized, city.dimensionProfile)),
    }))
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 3);

  return {
    dimensionScores: normalized,
    matches,
    timestamp: Date.now(),
  };
}

function cosineSimilarity(a: DimensionScores, b: DimensionScores): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const key of DIMENSION_KEYS) {
    dot += a[key] * b[key];
    normA += a[key] * a[key];
    normB += b[key] * b[key];
  }
  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function similarityToPercentage(sim: number): number {
  return Math.round(((sim + 1) / 2) * 100);
}
