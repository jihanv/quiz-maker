import type { MultipleChoiceData } from "./fileDownloader";

export function getCorrectAnswerWords(item: MultipleChoiceData) {
  return item.questions.map((q) => q.choices[q.answer]);
}

export function getAllChoiceWords(item: MultipleChoiceData) {
  return item.questions.flatMap((q) => q.choices);
}
