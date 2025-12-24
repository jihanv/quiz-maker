import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ABBREVIATIONS } from "./constants";
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

export function restoreAbbreviations(passage: string) {
  return passage.replace(/<<DOT>>/g, ".");
}

export function switchQuotedEndings(passage: string) {
  return passage
    .replace(/\."/g, "<<SWITCH PERIOD>>.")
    .replace(/!"/g, "<<SWITCH EX>>!")
    .replace(/\?"/g, "<<SWITCH QU>>?");
}

export function restoreQuotedEndings(passage: string) {
  return passage
    .replace(/<<SWITCH PERIOD>>\./g, '."')
    .replace(/<<SWITCH EX>>!/g, '!"')
    .replace(/<<SWITCH QU>>\?/g, '?"');
}

export function replaceAcronyms(passage: string) {
  const ACRONYM_RE = /\b(?:[A-Za-z]\.){1,}[A-Za-z](?:\.)?(?=$|[^\w])/g;

  return passage.replace(ACRONYM_RE, (match) => {
    const hasTrailingDot = match.endsWith(".");

    // Remove dots and split letters
    const letters = match.replaceAll(".", "").split("");

    const joined = letters.join("-");

    return hasTrailingDot ? `[${joined}-]` : `[${joined}]`;
  });
}

export function restoreAcronyms(passage: string) {
  return passage.replace(/\[[A-Za-z-]+\]/g, (match) => {
    const inner = match.slice(1, -1); // remove [ and ]
    const hasTrailingDash = inner.endsWith("-");

    const letters = inner.replace(/-$/, "").split("-");
    const acronym = letters.join(".");

    return hasTrailingDash ? `${acronym}.` : acronym;
  });
}

export function replaceDecimalDots(passage: string) {
  // Replace dots that are BETWEEN digits (e.g., 3.14, 2.1.3) so they don't look like sentence endings
  return passage.replace(/(?<=\d)\.(?=\d)/g, "<<DECIMAL_DOT>>");
}

export function restoreDecimalDots(passage: string) {
  return passage.replace(/<<DECIMAL_DOT>>/g, ".");
}
