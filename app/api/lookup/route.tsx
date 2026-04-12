export const runtime = "nodejs";

import { JapaneseLookupErrorResponse, JapaneseLookupSuccessResponse, japaneseLookupSchema } from "@/lib/types";
import { runJapaneseLookup } from "@/lib/server/runJapaneseLookup";
import { generateLookupVariants } from "@/lib/server/generateLookupVariants";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body: unknown = await request.json();
    const result = japaneseLookupSchema.safeParse(body)

    if (!result.success) {
        const errorBody: JapaneseLookupErrorResponse = { success: false };
        return NextResponse.json(errorBody, { status: 400 });
    }

    const [firstWord] = result.data.words;
    let finalLookup = await runJapaneseLookup(firstWord);
    let lookupWord = firstWord;

    if (!finalLookup.definition && finalLookup.fallbackEntries.length === 0) {
        const retryWords = generateLookupVariants(firstWord).filter((variant) => variant !== firstWord);

        for (const retryWord of retryWords) {
            const retryLookup = await runJapaneseLookup(retryWord);

            if (retryLookup.definition || retryLookup.fallbackEntries.length > 0) {
                finalLookup = retryLookup;
                lookupWord = retryWord;
                break;
            }
        }
    }

    const responseBody: JapaneseLookupSuccessResponse = {
        success: true,
        originalWord: firstWord,
        lookupWord,
        definition: finalLookup.definition,
        fallbackEntries: [...finalLookup.fallbackEntries],
    };
    return NextResponse.json(responseBody);
}