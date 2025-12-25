import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ABBREVIATIONS, INITIALS_RE } from "./constants";
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

export function encodeWs(ws: string): string {
  let out = "";
  for (const ch of ws) {
    if (ch === " ") out += "s";
    else if (ch === "\t") out += "t";
    else if (ch === "\n") out += "n";
    else if (ch === "\r") out += "r";
    else out += `u${ch.codePointAt(0)!.toString(16).padStart(4, "0")}`;
  }
  return out;
}

export function decodeWs(enc: string): string {
  let out = "";
  for (let i = 0; i < enc.length; i++) {
    const c = enc[i];
    if (c === "s") out += " ";
    else if (c === "t") out += "\t";
    else if (c === "n") out += "\n";
    else if (c === "r") out += "\r";
    else if (c === "u") {
      const hex = enc.slice(i + 1, i + 5);
      if (/^[0-9a-fA-F]{4}$/.test(hex)) {
        out += String.fromCharCode(parseInt(hex, 16));
        i += 4;
      } else {
        // If somehow malformed, keep literal
        out += "u";
      }
    } else {
      // If somehow malformed, keep literal
      out += c;
    }
  }
  return out;
}

/**
 * Replaces sequences of initials (with dots) so sentence splitting on "." won't break.
 * Example:
 *   "J. K. Rowling" -> "<<INITIALS:J-K|s>> Rowling"
 *   "T.S. Eliot"    -> "<<INITIALS:T-S|>> Eliot"
 *   "A.  B. C."     -> "<<INITIALS:A-B-C|ss, s?>>" (exact whitespace preserved)
 */
export function replaceInitials(passage: string) {
  return passage.replace(INITIALS_RE, (match) => {
    // Capture letters and the whitespace AFTER each initial.
    // Example match: "J. K." -> [("J"," "), ("K","")]
    const parts: Array<{ letter: string; wsAfter: string }> = [];
    const partRe = /([A-Za-z])\.(\s*)/g;
    let m: RegExpExecArray | null;
    while ((m = partRe.exec(match)) !== null) {
      parts.push({ letter: m[1], wsAfter: m[2] ?? "" });
    }

    // Must be at least 2 initials to be worth replacing
    if (parts.length < 2) return match;

    const letters = parts.map((p) => p.letter).join("-");

    // Gaps are the whitespace between initials (after each initial except the last)
    const gaps = parts
      .slice(0, -1)
      .map((p) => encodeWs(p.wsAfter))
      .join(",");

    return `<<INITIALS:${letters}|${gaps}>>`;
  });
}
