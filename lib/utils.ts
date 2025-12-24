import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
const ABBREVIATIONS = [
  "Mr.",
  "Mrs.",
  "Ms.",
  "Dr.",
  "Prof.",
  "Sr.",
  "Jr.",
  "St.",
  "etc.",
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sentenceCounter(passage: string) {
  if (!passage.trim()) return 0;

  const count = removeAbbreviations(passage)
    .trim()
    .split(/[.!?]+/)
    .filter((sentence) => sentence.length > 0).length;
  return count;
}

export function removeAbbreviations(passage: string) {
  let safe = passage;

  for (const abbr of ABBREVIATIONS) {
    const escaped = abbr.replace(".", "\\.");
    const pattern = new RegExp(`\\b${escaped}`, "gi");

    safe = safe.replace(pattern, (match) => match.replace(".", "<<DOT>>"));
  }

  return safe;
}

export function switchQuotedEndings(passage: string) {
  return passage
    .replace(/\."/g, "<<SWITCH PERIOD>>.")
    .replace(/!"/g, "<<SWITCH EX>>!")
    .replace(/\?"/g, "<<SWITCH QU>>?");
}
