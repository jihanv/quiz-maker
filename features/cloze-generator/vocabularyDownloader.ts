import type { MultipleChoiceData } from "./fileDownloader";

export function getCorrectAnswerWords(item: MultipleChoiceData) {
  return item.questions.map((q) => q.choices[q.answer]);
}
