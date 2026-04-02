export type CityMatchMode = "quick" | "full";

export type DimensionScores = {
  lifestyle: number;
  social: number;
  environment: number;
  pace: number;
};

export type CityQuestionOption = {
  value: string;
  label: string;
  dimensionWeights: Partial<DimensionScores>;
};

export type CityQuestion = {
  id: string;
  text: string;
  options: CityQuestionOption[];
};

export type CityQuestionBank = {
  meta: {
    version: string;
    questionCount: number;
    estimatedMinutes: number;
    mode: CityMatchMode;
  };
  questions: CityQuestion[];
};

export type CityProfile = {
  id: string;
  name: string;
  country: string;
  description: string;
  features: string[];
  dimensionProfile: DimensionScores;
};

export type CityMatchResult = {
  dimensionScores: DimensionScores;
  matches: Array<{
    city: CityProfile;
    matchPercentage: number;
  }>;
  timestamp: number;
};
