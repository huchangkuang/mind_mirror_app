import { create } from "zustand";
import { COSMIC_QUESTIONS } from "@/features/cosmic-essence/questions";
import type { CosmicDimension, CosmicResultId } from "@/features/cosmic-essence/types";

type CosmicState = {
  currentIndex: number;
  answers: Record<number, CosmicDimension>;
  resultId: CosmicResultId | null;
  resetFlow: () => void;
  answerQuestion: (questionId: number, dimension: CosmicDimension) => void;
  next: () => void;
  prev: () => void;
  setResultId: (id: CosmicResultId) => void;
};

export const useCosmicStore = create<CosmicState>((set) => ({
  currentIndex: 0,
  answers: {},
  resultId: null,

  resetFlow: () => set({ currentIndex: 0, answers: {}, resultId: null }),

  answerQuestion: (questionId, dimension) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: dimension },
    })),

  next: () =>
    set((state) => {
      const current = COSMIC_QUESTIONS[state.currentIndex];
      if (!current || !state.answers[current.id]) {
        return state;
      }
      return {
        currentIndex: Math.min(state.currentIndex + 1, COSMIC_QUESTIONS.length - 1),
      };
    }),

  prev: () => set((state) => ({ currentIndex: Math.max(0, state.currentIndex - 1) })),

  setResultId: (id) => set({ resultId: id }),
}));
