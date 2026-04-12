import { TJapaneseLookupSchema } from "@/lib/types";
import { generateLookupVariants } from "@/lib/server/generateLookupVariants";

export function getRetryLookupWords(
  originalWord: string,
  startingWord: string,
  partOfSpeech: TJapaneseLookupSchema["partOfSpeech"],
): string[] {
  const retryWords = new Set<string>();

  if (partOfSpeech === "verb") {
    generateLookupVariants(startingWord).forEach((variant) => {
      retryWords.add(variant);
    });

    generateLookupVariants(originalWord).forEach((variant) => {
      retryWords.add(variant);
    });

    retryWords.add(originalWord);
  } else {
    generateLookupVariants(originalWord).forEach((variant) => {
      retryWords.add(variant);
    });
  }

  retryWords.delete(startingWord);

  return Array.from(retryWords);
}
