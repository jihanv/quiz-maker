export const runtime = "nodejs";

import { JapaneseLookupErrorResponse, JapaneseLookupSuccessResponse, japaneseLookupSchema } from "@/lib/types";
import { runJapaneseLookup } from "@/lib/server/runJapaneseLookup";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body: unknown = await request.json();
    const result = japaneseLookupSchema.safeParse(body)

    if (!result.success) {
        const errorBody: JapaneseLookupErrorResponse = { success: false };
        return NextResponse.json(errorBody, { status: 400 });
    }

    const [firstWord] = result.data.words;
    const initialLookup = await runJapaneseLookup(firstWord);
    const definition = initialLookup.definition;
    const fallbackEntries = [...initialLookup.fallbackEntries];
    const responseBody: JapaneseLookupSuccessResponse = {
        success: true,
        originalWord: firstWord,
        lookupWord: firstWord,
        definition,
        fallbackEntries,
    };

    return NextResponse.json(responseBody);
}