import { create } from "zustand";

type ClozerStore = {
  passage: string;
  setPassage: (text: string) => void;
};

export const useSentenceFillerStore = create<ClozerStore>((set) => ({
  passage: "TESTING",
  setPassage: (text) => set({ passage: text }),
}));
