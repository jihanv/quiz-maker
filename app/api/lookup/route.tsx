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
        try {
            const jotobaResponse = await fetch("https://jotoba.de/api/search/words", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ query: firstWord, no_english: false, language: "English" }),
            });
            if (jotobaResponse.ok) {
                const jotobaData = await jotobaResponse.json();
                for (const entry of jotobaData.words?.slice(0, 5) ?? []) {
                    fallbackEntries.push({ headword: entry.reading.kanji ?? entry.reading.kana, summary: "" });
                }
            }
        } catch { }
    }

    return NextResponse.json({
        success: true,
        word: firstWord,
        definition,
        fallbackEntries: fallbackEntries,
    });
}