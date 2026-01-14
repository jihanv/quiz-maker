import { create } from "zustand";

export type WordObj = {
  word: string;
  position: number; // 0, 1, 2...
  paragraphIndex: number; // which paragraph this word is in
  selected: boolean; // clicked or not
};
export type ParagraphObj = {
  paragraphIndex: number;
  words: WordObj[];
};

type CustomGeneratorStore = {
  words: WordObj[];
  paragraphs: ParagraphObj[];

  // actions (functions that change the state)
  setWords: (words: WordObj[]) => void;
  clearWords: () => void;
  toggleWord: (position: number) => void;
  setParagraphs: (paragraphs: ParagraphObj[]) => void;
  clearParagraphs: () => void;
};

export const UseCustomGeneratorStore = create<CustomGeneratorStore>((set) => ({
  words: [],

  setWords: (words) => set({ words }),
  clearWords: () => set({ words: [] }),

  paragraphs: [],

  setParagraphs: (paragraphs) => set({ paragraphs }),
  clearParagraphs: () => set({ paragraphs: [] }),

  toggleWord: (position) =>
    set((state) => ({
      paragraphs: state.paragraphs.map((p) => ({
        ...p,
        words: p.words.map((w) =>
          w.position === position ? { ...w, selected: !w.selected } : w
        ),
      })),
    })),
}));
