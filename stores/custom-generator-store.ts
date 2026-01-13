import { create } from "zustand";

export type WordObj = {
  word: string;
  position: number; // 0, 1, 2...
  selected: boolean; // clicked or not
};

type CustomGeneratorStore = {
  words: WordObj[];

  // actions (functions that change the state)
  setWords: (words: WordObj[]) => void;
  clearWords: () => void;
};

export const UseCustomGeneratorStore = create<CustomGeneratorStore>((set) => ({
  words: [],

  setWords: (words) => set({ words }),
  clearWords: () => set({ words: [] }),
}));
