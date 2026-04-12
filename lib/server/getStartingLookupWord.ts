import { TJapaneseLookupSchema } from "@/lib/types";

export async function getStartingLookupWord(
  word: string,
  partOfSpeech: TJapaneseLookupSchema["partOfSpeech"],
) {
  if (partOfSpeech !== "verb") {
    return word;
  }

  const { default: lemmatize } = await import("wink-lemmatizer");
  return lemmatize.verb(word);
}
