import nlp from "compromise/two";
import { zipfFrequency } from "nodewordfreq";
import fs from "node:fs";
import { generateChoices } from "./createWordChoices";
import { clean, startsWithUppercase } from "@/lib/utils";
import { stemmer } from "stemmer";

const data = JSON.parse(fs.readFileSync("./data/dictionary.json", "utf8"));
const dict = new Set(data.dictionary); // Set = fast lookup

const temporaryDifficultWords: string[] = [];
const stem = new Set<string>();

export type MultipleChoiceSection = {
  order: number;
  sectionText: string;
  difficultWord: string | null;
  difficultWordTokenIndex: number | null;
  answerChoices: string[] | undefined;
  answerIndex: number | undefined;
};

export function createTestData(
  passageSections: string[]
): MultipleChoiceSection[] {
  const object = passageSections.map((sectionText, i) => {
    const targetWord = pickDifficultWord(sectionText);
    let choices = generateChoices(sectionText, targetWord.difficultWord);
    const answerIndex = choices?.indexOf(targetWord.difficultWord);

    if (startsWithUppercase(targetWord.difficultWord)) {
      choices = choices?.map((s) =>
        s.length ? s[0].toUpperCase() + s.slice(1) : s
      );
    }

    return {
      order: i + 1,
      sectionText,
      difficultWord: targetWord.difficultWord,
      difficultWordTokenIndex: targetWord.wordIndex,
      answerChoices: choices,
      answerIndex: answerIndex,
    };
  });
  // console.log(object);
  return object;
}

export function pickDifficultWord(sectionText: string) {
  // console.log(sectionText);
  let difficultyLevel = 100;
  let difficultWordIndex = 0;
  let word = "";
  const doc = nlp(sectionText);
  const properNouns = doc.match("#ProperNoun");
  const properNounArray1 = tokenizeWords(properNouns.text());
  const properNounArray = properNounArray1.map((word: string) =>
    word.replace(/[^a-z]/gi, "")
  );
  // console.log(properNounArray);
  // tokenize
  const wordTokens = tokenizeWords(sectionText);
  // for each thing in tokenized version, normalize, retrieve, zipF find max
  for (let i = 0; i < wordTokens.length; i++) {
    const tempWord = wordTokens[i].replace(/[^a-z]/gi, "");
    if (
      isInDictionary(normalizeForLookup(wordTokens[i])) &&
      !properNounArray.includes(tempWord)
    ) {
      // console.log(getZipf(wordTokens[i]), wordTokens[i]);
      if (
        getZipf(tempWord) < difficultyLevel &&
        !temporaryDifficultWords.includes(tempWord) &&
        !stem.has(stemmer(tempWord))
      ) {
        difficultyLevel = getZipf(tempWord);
        difficultWordIndex = i;
        word = tempWord;
      }
    }
  }
  stem.add(stemmer(clean(word)));
  temporaryDifficultWords.push(word);
  console.log(temporaryDifficultWords);
  console.log(stem);

  return {
    wordIndex: difficultWordIndex,
    difficultWord: word.replace(/[^a-z]/gi, ""),
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
