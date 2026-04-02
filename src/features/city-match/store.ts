import { create } from "zustand";
import { CityMatchResult, CityQuestionBank } from "@/features/city-match/types";

type CityMatchState = {
  bank: CityQuestionBank | null;
  currentIndex: number;
  answers: Record<string, string>;
  result: CityMatchResult | null;
  setBank: (bank: CityQuestionBank) => void;
  answerQuestion: (questionId: string, value: string) => void;
  next: () => void;
  prev: () => void;
  setResult: (result: CityMatchResult) => void;
  resetFlow: () => void;
};

export const useCityMatchStore = create<CityMatchState>((set, get) => ({
  bank: null,
  currentIndex: 0,
  answers: {},
  result: null,

  setBank: (bank) => set({ bank, currentIndex: 0, answers: {}, result: null }),
  answerQuestion: (questionId, value) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: value } })),
  next: () =>
    set((state) => {
      const questions = state.bank?.questions ?? [];
      const current = questions[state.currentIndex];
      if (!current || !state.answers[current.id]) return state;
      return { currentIndex: Math.min(state.currentIndex + 1, questions.length - 1) };
    }),
  prev: () => set((state) => ({ currentIndex: Math.max(0, state.currentIndex - 1) })),
  setResult: (result) => set({ result }),
  resetFlow: () => {
    const bank = get().bank;
    set({ bank, currentIndex: 0, answers: {}, result: null });
  },
}));
