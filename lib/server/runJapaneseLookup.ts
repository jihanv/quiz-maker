import { JapaneseLookupFallbackEntry } from "@/lib/types";
import fallbackWords from "@/data/fallback.json";
import fallbackDictionary from "@/data/fallbackdictionary.json";

export type JapaneseLookupPassResult = {
  word: string;
  definition: string | null;
  fallbackEntries: JapaneseLookupFallbackEntry[];
};

export async function runJapaneseLookup(
  word: string,
  includeFallback = true,
): Promise<JapaneseLookupPassResult> {
      let definition: string | null = null;
      const fallbackEntries: JapaneseLookupFallbackEntry[] = [];
          const normalizedWord = word.trim().toLowerCase();
          const isFallbackWord =
            fallbackWords.dictionary.includes(normalizedWord);
            const fallbackEntry = isFallbackWord
              ? fallbackDictionary.find(
                  (entry) => entry.word.toLowerCase() === normalizedWord,
                )
              : undefined;
            const fallbackDefinitionJa =
              fallbackEntry?.meanings?.[0]?.definitions?.[0]?.definition_ja ??
              null;
            if (fallbackDefinitionJa) definition = fallbackDefinitionJa;

            const url = `https://api.excelapi.org/dictionary/enja?word=${encodeURIComponent(word)}`;

    if (!isFallbackWord) {
      try {
        const response = await fetch(url, {
          headers: { Accept: "text/plain", "User-Agent": "Mozilla/5.0" },
        });
        const text = (await response.text()).trim();
        if (response.ok && text) definition = text;
      } catch {}
    }

  if (!definition && includeFallback) {
    try {
      const jotobaResponse = await fetch("https://jotoba.de/api/search/words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: word,
          no_english: false,
          language: "English",
        }),
      });

      if (jotobaResponse.ok) {
        const jotobaData = await jotobaResponse.json();
        for (const entry of jotobaData.words?.slice(0, 5) ?? []) {
          fallbackEntries.push({
            headword: entry.reading.kanji ?? entry.reading.kana,
            summary: "",
            definitions: [],
          });
        }
      }

      if (!fallbackEntries.length) {
        const searchUrl = `https://ja.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(word)}&srlimit=5&format=json`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
        const searchResults = searchData.query?.search ?? [];
        const lowerWord = word.toLowerCase();
        const preferredKatakana = searchResults.find(
          (result: { title: string; snippet?: string }) => {
            const plainSnippet =
              result.snippet?.replace(/<[^>]+>/g, "").toLowerCase() ?? "";
            return (
              /^[ァ-ヶー・ヴ]+$/.test(result.title) &&
              (plainSnippet.includes(`(${lowerWord})`) ||
                plainSnippet.includes(`（${lowerWord}）`))
            );
          },
        );
        const katakanaTitle =
          preferredKatakana?.title ??
          searchResults.find((result: { title: string }) =>
            /^[ァ-ヶー・ヴ]+$/.test(result.title),
          )?.title;

        if (katakanaTitle) {
          fallbackEntries.push({
            headword: katakanaTitle,
            summary: "",
            definitions: [],
          });
        }
      }

      for (const fallbackEntry of fallbackEntries) {
        const wikiUrl = `https://ja.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&redirects=1&titles=${encodeURIComponent(fallbackEntry.headword)}&format=json`;
        const wikiResponse = await fetch(wikiUrl);
        const wikiData = await wikiResponse.json();
        const page = Object.values(wikiData.query?.pages ?? {})[0] as
          | { extract?: string }
          | undefined;
        const summary = page?.extract?.trim() ?? "";
        const [intro, extraText] = summary.split("\n\n", 2);
        const extraDefinitions =
          extraText
            ?.split("\n")
            .map((line) => line.replace(/\[\d+\]/g, "").trim())
            .filter(Boolean) ?? [];
        fallbackEntry.summary = summary;
        fallbackEntry.definitions = summary
          ? [intro.replace(/\[\d+\]/g, "").trim(), ...extraDefinitions].filter(
              Boolean,
            )
          : [];
      }
    } catch {}
  }

  return {
    word,
    definition,
    fallbackEntries,
  };
}
