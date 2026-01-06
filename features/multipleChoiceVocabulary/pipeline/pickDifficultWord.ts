import nlp from "compromise";
import { zipfFrequency } from "nodewordfreq";

type MultipleChoiceSection = {
  order: number;
  sectionText: string;
  // difficultWord: string | null;
  // difficultWordTokenIndex: number | null;
  // difficultWordSpan: { start: number; end: number } | null;
};

export function createTestData(
  passageSections: string[]
): MultipleChoiceSection[] {
  const object = passageSections.map((sectionText, i) => ({
    order: i + 1,
    sectionText,
    // difficultWord: null,
    // difficultWordTokenIndex: null,
    // difficultWordSpan: null,
  }));
  console.log(object);
  return object;
}

export function pickDifficultWord(sectionText: string) {
  console.log(sectionText);
  const doc = nlp("she sells seashells by the seashore.");
  console.log(doc.verbs().toPastTense());
  console.log(doc.text());
  getZipf("boulder");
}

export function tokenizeWords(sentence: string) {
  // returns an array of word-strings in reading order
  // example: "Hi there, Bob!" -> ["Hi", "there", "Bob"]
  return nlp(sentence).terms().out("array");
}

export function normalizeForLookup(token: string) {
  return token.toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g, ""); // strip non-letters at edges
}

export function getZipf(word: string): number {
  const z = zipfFrequency(word, "en");
  return Number.isFinite(z) ? z : 10; // unknown => treat as very common/easy
}

export function isProperNoun(word: string) {
  const doc = nlp(word);
  if (doc.wordCount() !== 1) return false; // optional guard
  return doc.has("#ProperNoun");
}
//export const runtime = "nodejs"; add this in route.ts
