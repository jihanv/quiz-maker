import nlp from "compromise/two";
const COARSE = [
  "#Verb",
  "#Noun",
  "#Adjective",
  "#Adverb",
  "#Pronoun",
  "#Preposition",
  "#Conjunction",
  "#Determiner",
];
// determine difficultWord's part of speech
export function determinePartOfSpeech(
  sentence: string,
  word: string,
  occurrence = 0
) {
  const doc = nlp(sentence);
  const hit = doc.match(word).terms().eq(occurrence);
  if (!hit.found) return null;

  for (const tag of COARSE) {
    if (hit.has(tag)) return tag.slice(1); // remove '#'
  }
  return "Unknown";
}
