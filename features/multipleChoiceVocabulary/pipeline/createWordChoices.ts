import nlp from "compromise";
import fs from "node:fs";
import wordListPath from "word-list";
export type View = ReturnType<typeof nlp>;

export const COARSE = [
  "#Verb",
  "#Noun",
  "#Adjective",
  "#Adverb",
  "#Pronoun",
  "#Preposition",
  "#Conjunction",
  "#Determiner",
];

export type CoarsePOS =
  | "Noun"
  | "Verb"
  | "Adjective"
  | "Adverb"
  | "Pronoun"
  | "Determiner"
  | "Preposition"
  | "Conjunction"
  | "Unknown";

const COARSE_TAGS: Array<[CoarsePOS, string]> = [
  ["Verb", "#Verb"],
  ["Noun", "#Noun"],
  ["Adjective", "#Adjective"],
  ["Adverb", "#Adverb"],
  ["Pronoun", "#Pronoun"],
  ["Determiner", "#Determiner"],
  ["Preposition", "#Preposition"],
  ["Conjunction", "#Conjunction"],
];

export type WordForm =
  // nouns
  | "Singular"
  | "Plural"
  | "Uncountable"
  // verbs
  | "Gerund"
  | "Past"
  | "Present3rd"
  | "BaseVerb"
  // adjectives
  | "Comparative"
  | "Superlative"
  | "BaseAdj"
  // other/unknown
  | "Other";

// const COARSE_TAGS: Array<[CoarsePOS, string]> = [
//   ["Verb", "#Verb"],
//   ["Noun", "#Noun"],
//   ["Adjective", "#Adjective"],
//   ["Adverb", "#Adverb"],
//   ["Pronoun", "#Pronoun"],
//   ["Determiner", "#Determiner"],
//   ["Preposition", "#Preposition"],
//   ["Conjunction", "#Conjunction"],
// ];

const POS_TO_TAG: Record<Exclude<CoarsePOS, "Unknown">, string> = {
  Noun: "#Noun",
  Verb: "#Verb",
  Adjective: "#Adjective",
  Adverb: "#Adverb",
  Pronoun: "#Pronoun",
  Determiner: "#Determiner",
  Preposition: "#Preposition",
  Conjunction: "#Conjunction",
};

/** Minimal shape we need from a compromise selection */
type TaggableSelection = {
  found: boolean;
  has: (pattern: string) => boolean;
  text: () => string;
};

export function getCoarsePOS(hit: TaggableSelection): CoarsePOS {
  for (const [label, tag] of COARSE_TAGS) {
    if (hit.has(tag)) return label;
  }
  return "Unknown";
}

export function getFormInSentence(
  sentence: string,
  word: string,
  occurrence = 0
): { pos: CoarsePOS; form: WordForm } | null {
  const doc = nlp(sentence);
  const hit = doc.match(word).terms().eq(occurrence); // TS will accept this as TaggableSelection structurally
  if (!hit.found) return null;

  const pos = getCoarsePOS(hit);
  const surface = hit.text().trim();

  if (pos === "Noun") {
    if (hit.has("#Uncountable")) return { pos, form: "Uncountable" };
    if (hit.has("#Plural")) return { pos, form: "Plural" };
    if (hit.has("#Singular")) return { pos, form: "Singular" };
    return {
      pos,
      form: surface.toLowerCase().endsWith("s") ? "Plural" : "Singular",
    };
  }

  if (pos === "Verb") {
    if (hit.has("#Gerund") || surface.toLowerCase().endsWith("ing"))
      return { pos, form: "Gerund" };
    if (hit.has("#PastTense") || surface.toLowerCase().endsWith("ed"))
      return { pos, form: "Past" };
    if (surface.toLowerCase().endsWith("s")) return { pos, form: "Present3rd" };
    return { pos, form: "BaseVerb" };
  }

  if (pos === "Adjective") {
    if (hit.has("#Superlative") || surface.toLowerCase().endsWith("est"))
      return { pos, form: "Superlative" };
    if (hit.has("#Comparative") || surface.toLowerCase().endsWith("er"))
      return { pos, form: "Comparative" };
    return { pos, form: "BaseAdj" };
  }

  return { pos, form: "Other" };
}
console.log(getFormInSentence("I saw two octopi.", "octopi"));
// -> { pos: "Noun", form: "Plural" } (likely)

console.log(getFormInSentence("I am running late.", "running"));
// -> { pos: "Verb", form: "Gerund" }

console.log(getFormInSentence("This is bigger than that.", "bigger"));
// -> { pos: "Adjective", form: "Comparative" }
// ----- word pool -----
const WORDS: string[] = fs
  .readFileSync(wordListPath, "utf8")
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

// ----- form application -----
function applyForm(base: string, pos: CoarsePOS, form: WordForm): string {
  const doc = nlp(base);

  if (pos === "Noun") {
    if (form === "Plural") return doc.nouns().toPlural().text();
    if (form === "Singular") return doc.nouns().toSingular().text();
    return doc.text();
  }

  if (pos === "Verb") {
    // Keep it intentionally simple for now (no conjugate())
    if (form === "Gerund") {
      // compromise usually handles many cases via transform rules
      // fallback: naive add ing
      const t = doc.verbs().toGerund?.().text?.();
      return t && t.length ? t : base.endsWith("ing") ? base : `${base}ing`;
    }
    if (form === "Past") {
      const t = doc.verbs().toPastTense?.().text?.();
      return t && t.length ? t : base.endsWith("ed") ? base : `${base}ed`;
    }
    if (form === "Present3rd") {
      const t = doc.verbs().toPresentTense?.().text?.();
      // toPresentTense isn't always “3rd person s”, so fallback to suffix:
      return t && t.length ? t : base.endsWith("s") ? base : `${base}s`;
    }
    return doc.text();
  }

  if (pos === "Adjective") {
    if (form === "Comparative") {
      const t = doc.adjectives().toComparative?.().text?.();
      return t && t.length ? t : base.endsWith("er") ? base : `${base}er`;
    }
    if (form === "Superlative") {
      const t = doc.adjectives().toSuperlative?.().text?.();
      return t && t.length ? t : base.endsWith("est") ? base : `${base}est`;
    }
    return doc.text();
  }

  return doc.text();
}

// ----- matching -----
function matchesPos(word: string, pos: CoarsePOS): boolean {
  if (pos === "Unknown") return false;
  const tag = POS_TO_TAG[pos];
  return nlp(word).has(tag);
}

function isSingleWord(w: string): boolean {
  return w.length > 0 && !w.includes(" ") && /^[A-Za-z'-]+$/.test(w);
}

// ----- main generator -----
export function randomSamePosSameFormFromContext(
  pos: CoarsePOS,
  form: WordForm,
  originalSurface: string,
  count = 3,
  maxTries = 6000
): string[] {
  const out = new Set<string>();
  let tries = 0;

  while (out.size < count && tries < maxTries) {
    tries++;

    const base = WORDS[(Math.random() * WORDS.length) | 0];
    if (!base || base.length < 2) continue;
    if (!matchesPos(base, pos)) continue;

    const formed = applyForm(base, pos, form);
    if (!formed) continue;

    const candidate = formed.trim();
    if (!isSingleWord(candidate)) continue;
    if (candidate.toLowerCase() === originalSurface.toLowerCase()) continue;

    // sanity: still matches POS after transformation
    if (!matchesPos(candidate, pos)) continue;

    out.add(candidate);
  }

  return [...out];
}

// const info = getFormInSentence("I saw two octopi.", "octopi");
// if (info) {
//   const choices = randomSamePosSameFormFromContext(
//     info.pos,
//     info.form,
//     "octopi"
//   );
//   console.log(choices);
// }
// pnpm ts-node features/multipleChoiceVocabulary/pipeline/createWordChoices.ts
