import { create } from "zustand";

type SentenceFillerStore = {
  passage: string;
  setPassage: (text: string) => void;
};

export const useSentenceFillerStore = create<SentenceFillerStore>((set) => ({
  passage: "TESTING",
  setPassage: (text) => set({ passage: text }),
}));
