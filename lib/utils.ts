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

  // 1) Protect abbreviation dots: "Mr." -> "Mr"
  for (const abbr of ABBREVIATIONS) {
    const escaped = abbr.replace(".", "\\."); // escape the dot for regex
    safe = safe.replace(new RegExp(escaped, "g"), abbr.replace(".", ""));
  }

  return safe;
}
