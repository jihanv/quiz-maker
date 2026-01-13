import { toCircledNumber } from "@/lib/utils";
import { dividePassage } from "./pipeline/dividePassage";
import {
  createTestData,
  MultipleChoiceSection,
} from "./pipeline/pickDifficultWord";

export function generateMultipleChoice(passage: string) {
  //divide passage
  const sections: string[] = dividePassage(passage);

  // //make test data
  const testData: MultipleChoiceSection[] = createTestData(sections);
  let newText = "";
  for (const question of testData) {
    const temp = question.sectionText.replace(
      question.difficultWord!,
      ` ${toCircledNumber(question.order)} `
    );
    newText = newText + temp;
  }
  // make answer choices
  const vocabularyRows = testData.map((row) => ({
    choices: row.answerChoices,
    answer: row.answerIndex,
  }));

  return {
    editedPassage: newText,
    answerChoices: vocabularyRows,
  };
}
