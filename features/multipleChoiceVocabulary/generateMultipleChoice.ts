import { dividePassage } from "./pipeline/dividePassage";
import {
  createTestData,
  MultipleChoiceSection,
} from "./pipeline/pickDifficultWord";

// const text =
//   "Huge crowds of protesters have been marching through Iran's capital and other cities, videos show, in what is said to be the largest show of force by opponents of the clerical establishment in years.\n\nThe peaceful demonstrations in Tehran and the second city of Mashhad on Thursday evening, which were not dispersed by security forces, can be seen in footage verified by BBC Persian.\n\nLater, a monitoring group reported a nationwide internet blackout.\n\nProtesters can be heard in the footage calling for the overthrow of Iran's Supreme Leader Ayatollah Ali Khamenei and the return of Reza Pahlavi, the exiled son of the late former shah, who had urged his supporters to take to the streets.\n\nIt was the 12th consecutive day of unrest that has been sparked by anger over the collapse of the Iranian currency and has spread to more than 100 cities and towns across all 31 of Iran's provinces, according to human rights groups.\n\nThe US-based Human Rights Activist News Agency (HRANA) has said at least 34 protesters - five of them children - and eight security personnel have been killed, and that 2,270 other protesters have been arrested.\n\nNorway-based monitor Iran Human Rights (IHR) has said at least 45 protesters, including eight children, have been killed by security forces.";

// console.log(text);

//pnpm tsx features/multipleChoiceVocabulary/generateMultipleChoice.ts

//divide passage
// const sections: string[] = dividePassage(text);
// console.log(sections);

// const testData: MultipleChoiceSection[] = createTestData(sections);

// console.log(testData);

// let newText = "";

// const vocabularyRows = testData.map((row) => ({
//   choices: row.answerChoices,
//   answer: row.answerIndex,
// }));
// //Reconstruct the text but blank out the vocabulary word
// for (const question of testData) {
//   const temp = question.sectionText.replace(
//     question.difficultWord!,
//     `[${question.order}]`
//   );
//   newText = newText + temp;
// }

export function generateMultipleChoice(passage: string) {
  //divide passage
  const sections: string[] = dividePassage(passage);

  // //make test data
  const testData: MultipleChoiceSection[] = createTestData(sections);
  let newText = "";
  for (const question of testData) {
    const temp = question.sectionText.replace(
      question.difficultWord!,
      `[${question.order}]`
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
