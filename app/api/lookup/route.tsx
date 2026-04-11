export const runtime = "nodejs";

import { JapaneseLookupFallbackEntry, japaneseLookupSchema } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body: unknown = await request.json();
    const result = japaneseLookupSchema.safeParse(body)

    if (!result.success) return NextResponse.json({ success: false }, { status: 400 })

    const [firstWord] = result.data.words;
    let definition: string | null = null;

    const fallbackEntries: JapaneseLookupFallbackEntry[] = [];
    const url = `https://api.excelapi.org/dictionary/enja?word=${encodeURIComponent(firstWord)}`;
    try {
        const response = await fetch(url, { headers: { Accept: "text/plain", "User-Agent": "Mozilla/5.0" } });
        const text = (await response.text()).trim();
        if (response.ok && text) definition = text;
    } catch { }

    if (!definition) {
        // Jotoba fallback will go here next.
    }

    return NextResponse.json({
        success: true,
        word: firstWord,
        definition,
        fallbackEntries: fallbackEntries,
    });
}