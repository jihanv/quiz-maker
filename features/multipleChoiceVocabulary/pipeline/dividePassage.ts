import { countWords } from "@/lib/utils";

function splitIntoSentences(passage: string): string[] {
  // Captures: "sentence punctuation + trailing whitespace"
  // So paragraph breaks (\n\n) stay attached to the sentence before them.
  const matches = passage.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g);
  return matches ?? [];
}

export function dividePassage(passage: string) {
  const text = passage.trim();
  if (!text) return [];

  console.log(splitIntoSentences(passage));

  const passageCount = countWords(passage);
  const numberOfSections = Math.floor(passageCount / 36);
  console.log(numberOfSections);

  const tokens = text.split(/(\s+)/);

  const chunks: string[] = [];
  let currentTokens: string[] = [];
  let currentWordCount = 0;

  const isWord = (t: string) => /[A-Za-z0-9]+(?:'[A-Za-z0-9]+)?/.test(t);

  for (const tok of tokens) {
    // Add token
    currentTokens.push(tok);

    // If it's a "word" token, increment
    if (isWord(tok)) currentWordCount++;

    // If we've hit the target, close the chunk
    if (currentWordCount >= 36) {
      const chunk = currentTokens.join("");
      if (chunk) chunks.push(chunk);

      currentTokens = [];
      currentWordCount = 0;
    }
  }

  // Remainder
  const remainder = currentTokens.join("").trim();
  if (remainder) chunks.push(remainder);

  console.log(chunks);
  return numberOfSections;
}
