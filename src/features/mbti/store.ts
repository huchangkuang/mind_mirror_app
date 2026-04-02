import { create } from "zustand";
import { MbtiQuestion, MbtiQuestionBank, MbtiResult } from "@/features/mbti/types";

type MbtiState = {
  bank: MbtiQuestionBank | null;
  currentIndex: number;
  answers: Record<string, string>;
  result: MbtiResult | null;
  setBank: (bank: MbtiQuestionBank) => void;
  answerQuestion: (questionId: string, value: string) => void;
  next: () => void;
  prev: () => void;
  resetFlow: () => void;
  setResult: (result: MbtiResult) => void;
};

function getCurrentQuestion(questions: MbtiQuestion[], index: number) {
  return questions[Math.max(0, Math.min(index, questions.length - 1))];
}

export const useMbtiStore = create<MbtiState>((set, get) => ({
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
      const current = getCurrentQuestion(questions, state.currentIndex);
      if (!current || !state.answers[current.id]) {
        return state;
      }
      return { currentIndex: Math.min(state.currentIndex + 1, questions.length - 1) };
    }),
  prev: () => set((state) => ({ currentIndex: Math.max(0, state.currentIndex - 1) })),
  resetFlow: () => {
    const bank = get().bank;
    set({ bank, currentIndex: 0, answers: {}, result: null });
  },
  setResult: (result) => set({ result }),
}));
