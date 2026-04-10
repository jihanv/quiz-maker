export const runtime = "nodejs";

import { JapaneseLookupFallbackEntry, japaneseLookupSchema } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body: unknown = await request.json();
    const result = japaneseLookupSchema.safeParse(body)

    if (!result.success) return NextResponse.json({ success: false }, { status: 400 })

    const [firstWord] = result.data.words;
    const fallbackEntries: JapaneseLookupFallbackEntry[] = [];
    const url = `https://api.excelapi.org/dictionary/enja?word=${encodeURIComponent(firstWord)}`;
    try {
        const response = await fetch(url, { headers: { Accept: "text/plain", "User-Agent": "Mozilla/5.0" } });
        const text = (await response.text()).trim();
        if (!response.ok || !text) {
            return NextResponse.json({ success: false, word: firstWord, error: text || "No definition found" }, { status: response.ok ? 404 : response.status });
        }
        return NextResponse.json({
            success: true,
            word: firstWord,
            definition: text,
            fallbackEntries: fallbackEntries,
        });
    } catch (error) {
        return NextResponse.json({ success: false, word: firstWord, error: error instanceof Error ? error.message : "Lookup failed" }, { status: 500 });
    }
}