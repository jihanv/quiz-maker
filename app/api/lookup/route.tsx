export const runtime = "nodejs";

import { JapaneseLookupFallbackEntry, JapaneseLookupSuccessResponse, japaneseLookupSchema } from "@/lib/types"; import { NextResponse } from "next/server";

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
                if (!fallbackEntries.length) {
                    const searchUrl = `https://ja.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(firstWord)}&srlimit=5&format=json`;
                    const searchResponse = await fetch(searchUrl);
                    const searchData = await searchResponse.json();
                    const searchResults = searchData.query?.search ?? [];
                    const lowerWord = firstWord.toLowerCase();
                    const preferredKatakana = searchResults.find((result: { title: string; snippet?: string }) => {
                        const plainSnippet = result.snippet?.replace(/<[^>]+>/g, "").toLowerCase() ?? "";
                        return /^[ァ-ヶー・ヴ]+$/.test(result.title) && (plainSnippet.includes(`(${lowerWord})`) || plainSnippet.includes(`（${lowerWord}）`));
                    });
                    const katakanaTitle = preferredKatakana?.title
                        ?? searchResults.find((result: { title: string }) => /^[ァ-ヶー・ヴ]+$/.test(result.title))?.title;
                    if (katakanaTitle) fallbackEntries.push({ headword: katakanaTitle, summary: "" });
                }
                for (const fallbackEntry of fallbackEntries) {
                    const wikiUrl = `https://ja.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&redirects=1&titles=${encodeURIComponent(fallbackEntry.headword)}&format=json`;
                    const wikiResponse = await fetch(wikiUrl);
                    const wikiData = await wikiResponse.json();
                    const page = Object.values(wikiData.query?.pages ?? {})[0] as { extract?: string } | undefined;
                    fallbackEntry.summary = page?.extract?.trim() ?? "";
                }
            }
        } catch { }
    }

    const responseBody: JapaneseLookupSuccessResponse = {
        success: true,
        word: firstWord,
        definition,
        fallbackEntries,
    };

    return NextResponse.json(responseBody);
}