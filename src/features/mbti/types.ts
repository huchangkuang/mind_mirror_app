export type MbtiMode = "quick" | "deep";

export type MbtiQuestionOption = {
  value: string;
  label: string;
};

export type MbtiQuestion = {
  id: string;
  text: string;
  options: MbtiQuestionOption[];
};

export type MbtiQuestionBank = {
  version: string;
  mode: MbtiMode;
  questionCount: number;
  estimatedMinutes: number;
  questionType: "binary" | "likert5";
  questions: MbtiQuestion[];
};

export type MbtiResult = {
  type: string;
  dimensionScores: Record<"EI" | "SN" | "TF" | "JP", number>;
  dimensionStrength: Record<"EI" | "SN" | "TF" | "JP", number>;
  summary?: string;
  mode?: MbtiMode;
};
