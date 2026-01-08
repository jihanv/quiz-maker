import nlp from "compromise/two";
import { zipfFrequency } from "nodewordfreq";
import fs from "node:fs";
import { determinePartOfSpeech } from "./createWordChoices";
// import { determinePartOfSpeech } from "./createWordChoices";

const data = JSON.parse(fs.readFileSync("./data/dictionary.json", "utf8"));
const dict = new Set(data.dictionary); // Set = fast lookup

export type MultipleChoiceSection = {
  order: number;
  sectionText: string;
  difficultWord: string | null;
  difficultWordTokenIndex: number | null;
  grammarLabel: string | null;
  // difficultWordSpan: { start: number; end: number } | null;
};

export function createTestData(
  passageSections: string[]
): MultipleChoiceSection[] {
  const object = passageSections.map((sectionText, i) => {
    const targetWord = pickDifficultWord(sectionText);
    return {
      order: i + 1,
      sectionText,
      difficultWord: targetWord.difficultWord,
      difficultWordTokenIndex: targetWord.wordIndex,
      grammarLabel: determinePartOfSpeech(
        sectionText,
        normalizeForLookup(targetWord.difficultWord)
      ),
    };
  });
  console.log(object);
  return object;
}

export function pickDifficultWord(sectionText: string) {
  console.log(sectionText);
  let difficultyLevel = 100;
  let difficultWordIndex = 0;
  let word = "";
  const doc = nlp(sectionText);
  console.log("Type of DOC is" + typeof doc);
  const properNouns = doc.match("#ProperNoun");
  const properNounArray = tokenizeWords(properNouns.text());
  console.log(properNounArray);
  // tokenize
  const wordTokens = tokenizeWords(sectionText);

  // for each thing in tokenized version, normalize, retrieve, zipF find max
  for (let i = 0; i < wordTokens.length; i++) {
    // console.log(isProperNounPhrase(wordTokens[i]), wordTokens[i]);

    if (
      isInDictionary(normalizeForLookup(wordTokens[i])) &&
      !properNounArray.includes(wordTokens[i])
    ) {
      console.log(getZipf(wordTokens[i]), wordTokens[i]);
      if (getZipf(wordTokens[i]) < difficultyLevel) {
        difficultyLevel = getZipf(wordTokens[i]);
        difficultWordIndex = i;
        word = wordTokens[i];
      }
    }
  }

  return {
    wordIndex: difficultWordIndex,
    difficultWord: word,
    // isProperNoun: isProperNounPhrase(word),
  };
}

function tokenizeWords(passage: string) {
  // returns an array of word-strings in reading order
  // example: "Hi there, Bob!" -> ["Hi", "there", "Bob"]
  return nlp(passage).terms().out("array");
}

function normalizeForLookup(token: string) {
  return token.toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g, ""); // strip non-letters at edges
  // return token.toLowerCase().replace(/[^a-z]/g, "");
}

function getZipf(word: string): number {
  const z = zipfFrequency(word, "en");
  return Number.isFinite(z) ? z : 100; // unknown => treat as very common/easy
}

function isInDictionary(word: string) {
  return dict.has(word.toLowerCase());
}

// export const runtime = "nodejs"; add this in route.ts
