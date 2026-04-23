import nlp from "compromise/two";
import { zipfFrequency } from "nodewordfreq";
import {
  generateChoicesFromWordInfo,
  getFormInSentence,
  toLookupPartOfSpeech,
} from "./createWordChoices";
import { clean, startsWithUppercase } from "@/lib/utils";
import { stemmer } from "stemmer";
import { LookupPartOfSpeech } from "@/lib/types";
import { DICT as dict } from "@/lib/server/lexicons";

const temporaryDifficultWords: string[] = [];
const stem = new Set<string>();

export type MultipleChoiceSection = {
  order: number;
  sectionText: string;
  difficultWord: string | null;
  difficultWordTokenIndex: number | null;
  answerChoices: string[] | undefined;
  answerIndex: number | undefined;
  partOfSpeech?: LookupPartOfSpeech | null;
};

export function createTestData(
  passageSections: string[],
): MultipleChoiceSection[] {
  temporaryDifficultWords.length = 0;
  stem.clear();

  const object = passageSections.map((sectionText, i) => {
    const targetWord = pickDifficultWord(sectionText);
    const difficultWord = targetWord.difficultWord;

    const wordInfo = targetWord.difficultWord
      ? getFormInSentence(sectionText, targetWord.difficultWord)
      : null;

    let choices =
      targetWord.difficultWord && wordInfo
        ? generateChoicesFromWordInfo(wordInfo, targetWord.difficultWord)
        : undefined;
    const answerIndex =
      targetWord.difficultWord && choices
        ? choices.indexOf(targetWord.difficultWord)
        : undefined;
    const partOfSpeech = wordInfo ? toLookupPartOfSpeech(wordInfo.pos) : null;

    if (difficultWord && startsWithUppercase(difficultWord)) {
      choices = choices?.map((s) =>
        s.length ? s[0].toUpperCase() + s.slice(1) : s,
      );
    }

    return {
      order: i + 1,
      sectionText,
      difficultWord: difficultWord,
      difficultWordTokenIndex: targetWord.wordIndex,
      answerChoices: choices,
      answerIndex: answerIndex,
      partOfSpeech: partOfSpeech,
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
    word.replace(/[^a-z]/gi, ""),
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
  if (word) {
    stem.add(stemmer(clean(word)));
    temporaryDifficultWords.push(word);
  }
  // console.log(temporaryDifficultWords);
  // console.log(stem);

  return {
    wordIndex: word ? difficultWordIndex : null,
    difficultWord: word ? word.replace(/[^a-z]/gi, "") : null,
  };
}

function tokenizeWords(passage: string) {
  // returns an array of word-strings in reading order
  // example: "Hi there, Bob!" -> ["Hi", "there", "Bob"]
  return nlp(passage).terms().out("array");
}

function normalizeForLookup(token: string) {
  const word = token.toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g, "");
  if (dict.has(word)) return word;
  if (word.endsWith("ies") && dict.has(word.slice(0, -3) + "y"))
    return word.slice(0, -3) + "y";
  if (word.endsWith("es") && dict.has(word.slice(0, -2)))
    return word.slice(0, -2);
  if (word.endsWith("s") && dict.has(word.slice(0, -1)))
    return word.slice(0, -1);
  return word;
}
function getZipf(word: string): number {
  const z = zipfFrequency(word, "en");
  return Number.isFinite(z) ? z : 100; // unknown => treat as very common/easy
}

function isInDictionary(word: string) {
  return dict.has(word.toLowerCase());
}

// export const runtime = "nodejs"; add this in route.ts
