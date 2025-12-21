import { create } from "zustand";

type PassageStore = {
  passage: string;
  setPassage: (text: string) => void;
};

export const usePassageStore = create<PassageStore>((set) => ({
  passage: "TESTING",
  setPassage: (text) => set({ passage: text }),
}));
