import { MultipleChoiceData } from "@/features/cloze-generator/fileDownloader";
import { create } from "zustand";

type ClozeStore = {
  data: MultipleChoiceData;
  setData: (data: MultipleChoiceData) => void;
};

export const useClozeStore = create<ClozeStore>((set) => ({
  data: {
    passage: "",
    questions: [],
  },
  setData: (data: MultipleChoiceData) => set({ data: data }),
}));
