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
  const validQuestions = testData.filter(
    (row) =>
      row.difficultWord &&
      row.answerChoices?.length === 4 &&
      row.answerIndex !== undefined &&
      row.answerIndex >= 0,
  );
  let editedPassage = "";
  for (const question of validQuestions) {
    const sectionWithPlaceholder = question.sectionText.replace(
      question.difficultWord!,
      ` ${toCircledNumber(question.order)} `,
    );
    editedPassage = editedPassage + sectionWithPlaceholder;
  }
  const answerChoices = validQuestions.map((row) => ({
    choices: row.answerChoices!,
    answer: row.answerIndex!,
    partOfSpeech: row.partOfSpeech,
  }));

  return {
    editedPassage: editedPassage,
    answerChoices: answerChoices,
  };
}
