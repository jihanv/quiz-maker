export const runtime = "nodejs";

import {
  JapaneseLookupErrorResponse,
  JapaneseLookupSuccessResponse,
  japaneseLookupSchema,
} from "@/lib/types";
import { runJapaneseLookup } from "@/lib/server/runJapaneseLookup";
import { getRetryLookupWords } from "@/lib/server/getRetryLookupWords";

import { getStartingLookupWord } from "@/lib/server/getStartingLookupWord";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const result = japaneseLookupSchema.safeParse(body);

  if (!result.success) {
    const errorBody: JapaneseLookupErrorResponse = { success: false };
    return NextResponse.json(errorBody, { status: 400 });
  }

  const { word, partOfSpeech } = result.data;
  const originalWord = word;

  const startingWord = await getStartingLookupWord(originalWord, partOfSpeech);

  let finalLookup = await runJapaneseLookup(startingWord, false);
  let lookupWord = startingWord;

  if (!finalLookup.definition) {
    const retryWords = getRetryLookupWords(
      originalWord,
      startingWord,
      partOfSpeech,
    );

    for (const retryWord of retryWords) {
      const retryLookup = await runJapaneseLookup(retryWord, false);

      if (retryLookup.definition) {
        finalLookup = retryLookup;
        lookupWord = retryWord;
        break;
      }
    }
  }

  if (!finalLookup.definition)
    finalLookup = await runJapaneseLookup(lookupWord);

  const responseBody: JapaneseLookupSuccessResponse = {
    success: true,
    originalWord,
    lookupWord,
    definition: finalLookup.definition,
    fallbackEntries: [...finalLookup.fallbackEntries],
  };
  return NextResponse.json(responseBody);
}
