import { TARGET_LENGTH } from "@/lib/constants";
import { countWords, revertPassage, normalizePassage } from "@/lib/utils";

function splitIntoSentences(passage: string): string[] {
  // Captures: "sentence punctuation + trailing whitespace"
  // So paragraph breaks (\n\n) stay attached to the sentence before them.
  const matches = passage.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g);
  return matches ?? [];
}

export function dividePassage(passage: string) {
  // If passage is all whitespace, return empty
  if (!passage || !/\S/.test(passage)) return [];

  const sentenceArray = splitIntoSentences(normalizePassage(passage));
  if (sentenceArray.length === 0) return [];
  // console.log(sentenceArray);

  const counts = sentenceArray.map((sentence) => countWords(sentence));

  // const passageCount = countWords(passage);
  // const numberOfSections = Math.floor(passageCount / TARGET_LENGTH);
  // console.log(numberOfSections);

  const sections: string[] = [];
  let i = 0;

  while (i < sentenceArray.length) {
    const sectionPieces: string[] = [];
    let sectionWordCount = 0;

    while (
      i < sentenceArray.length &&
      sectionWordCount + counts[i] <= TARGET_LENGTH
    ) {
      sectionPieces.push(revertPassage(sentenceArray[i]));
      sectionWordCount += counts[i];
      i++;
    }

    if (i >= sentenceArray.length) {
      sections.push(sectionPieces.join("")); // preserve formatting
      break;
    }

    const before = sectionWordCount;
    const after = sectionWordCount + counts[i];

    const diffBefore = Math.abs(TARGET_LENGTH - before);
    const diffAfter = Math.abs(TARGET_LENGTH - after);

    // If the next "sentence" alone is longer than target and we have nothing yet,
    // take it to avoid an infinite loop.
    if (sectionPieces.length === 0) {
      sections.push(revertPassage(sentenceArray[i]));
      i++;
      continue;
    }

    if (diffAfter < diffBefore) {
      sectionPieces.push(revertPassage(sentenceArray[i]));
      sectionWordCount += counts[i];
      i++;
    }

    sections.push(sectionPieces.join("")); // preserve formatting
  }
  // console.log(sections);
  return sections;
}

// pnpm test -- dividePassage
// pnpm vitest __tests__/multipleChoice/dividePassage.test.ts
