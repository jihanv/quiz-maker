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
  const validTestData = testData.filter(
    (row) => row.answerChoices && row.answerIndex !== undefined,
  );
  let newText = "";
  for (const question of validTestData) {
    const temp = question.sectionText.replace(
      question.difficultWord!,
      ` ${toCircledNumber(question.order)} `,
    );
    newText = newText + temp;
  }
  const vocabularyRows = validTestData.map((row) => ({
    choices: row.answerChoices!,
    answer: row.answerIndex!,
    partOfSpeech: row.partOfSpeech,
  }));

  return {
    editedPassage: newText,
    answerChoices: vocabularyRows,
  };
}
