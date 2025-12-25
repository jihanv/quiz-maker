import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ABBREVIATIONS, INITIALS_RE, INITIALS_TOKEN_RE } from "./constants";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sentenceCounter(passage: string) {
  if (!passage.trim()) return 0;

  //TODO add more normalizers before counting.
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
export function restoreInitials(passage: string) {
  return passage.replace(INITIALS_TOKEN_RE, (_whole, lettersRaw, gapsRaw) => {
    const letters = String(lettersRaw).split("-").filter(Boolean);
    if (letters.length < 2) return _whole;

    const gapsEnc = String(gapsRaw).length ? String(gapsRaw).split(",") : [];
    const gapsDec = gapsEnc.map(decodeWs);

    let out = "";
    for (let i = 0; i < letters.length; i++) {
      out += `${letters[i]}.`;
      if (i < letters.length - 1) out += gapsDec[i] ?? "";
    }
    return out;
  });
}

export function replaceSingleLetterPeriodCombos(passage: string) {
  const RE = /\b([A-Z])\./g;

  return passage.replace(
    RE,
    (whole, letter: string, offset: number, str: string) => {
      const dotIndex = offset + 1;

      // Guard: avoid decimals like "3.14" (extra safety)
      const prevChar = offset > 0 ? str[offset - 1] : "";
      const nextChar = dotIndex + 1 < str.length ? str[dotIndex + 1] : "";
      if (/\d/.test(prevChar) && /\d/.test(nextChar)) return whole;

      // Check if this is part of a multi-initial sequence:
      // - preceded by "<Letter>.<spaces>"
      // - followed by "<spaces><Letter>."
      const before = str.slice(0, offset);
      const after = str.slice(dotIndex + 1);

      const isPrecededByInitial = /[A-Za-z]\.\s*$/.test(before);
      const isFollowedByInitial = /^\s*[A-Za-z]\./.test(after);

      if (isPrecededByInitial || isFollowedByInitial) {
        return whole; // leave initials sequences alone
      }

      return `<<SINGLE_INITIAL:${letter}>>`;
    }
  );
}

export function restoreSingleLetterPeriodCombos(passage: string) {
  return passage.replace(
    /<<SINGLE_INITIAL:([A-Z])>>/g,
    (_whole, letter: string) => {
      return `${letter}.`;
    }
  );
}

export function replaceEllipses(passage: string) {
  // Normalize unicode ellipsis to three dots
  const normalized = passage.replace(/\u2026/g, "...");

  // Replace "..." (and longer runs like "....") with a token
  return normalized.replace(/\.{3,}/g, "<<ELLIPSIS>>");
}

export function restoreEllipses(passage: string) {
  return passage.replace(/<<ELLIPSIS>>/g, "...");
}

export function replaceNumericPunctuation(passage: string) {
  return (
    passage
      // Dots between digits (covers decimals, versions, IPs, section refs)
      .replace(/(?<=\d)\.(?=\d)/g, "<<NUM_DOT>>")
      // Commas between digits (covers thousands separators and EU decimal comma)
      .replace(/(?<=\d),(?=\d)/g, "<<NUM_COMMA>>")
  );
}

export function restoreNumericPunctuation(passage: string) {
  return passage.replace(/<<NUM_DOT>>/g, ".").replace(/<<NUM_COMMA>>/g, ",");
}

// utils/urlNormalization.ts (or wherever you keep utils)

/**
 * Protect dots inside URLs / emails / domains so sentence splitting on "." won't break.
 *
 * Examples:
 * - "example.com"        -> "example<<URL_DOT>>com"
 * - "foo.co.uk)"         -> "foo<<URL_DOT>>co<<URL_DOT>>uk)"
 * - "name@example.com."  -> "name@example<<URL_DOT>>com."
 * - "https://a.b/c.d"    -> "https://a<<URL_DOT>>b/c<<URL_DOT>>d"
 * Bonus: preserves trailing punctuation like ")., \"" etc.
 */
export function replaceUrlEmailDomainDots(passage: string) {
  const RE =
    /\bhttps?:\/\/[^\s<>()]+|\bwww\.[^\s<>()]+|\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\b(?:[A-Z0-9-]+\.)+[A-Z]{2,}(?:\/[^\s<>()]*)?/gi;

  return passage.replace(RE, (match, offset: number, str: string) => {
    // Avoid matching the domain-part inside emails twice if the domain regex hits after the email regex
    // (email alternative should win, but this is extra safety).
    const prevChar = offset > 0 ? str[offset - 1] : "";
    if (prevChar === "@") return match;

    // Strip common trailing punctuation that often follows URLs/emails in prose
    // Keep it outside the transformed core so it isn't tokenized.
    const m = match.match(/^(.*?)([)\]\}"'.,!?;:]+)?$/);
    const core = m?.[1] ?? match;
    const trailing = m?.[2] ?? "";

    return core.replace(/\./g, "<<URL_DOT>>") + trailing;
  });
}

export function restoreUrlEmailDomainDots(passage: string) {
  return passage.replace(/<<URL_DOT>>/g, ".");
}

export function replaceEnumerationMarkers(passage: string) {
  let out = passage;

  // 1) Line-start numeric enumerations (start of string or after newline)
  //    "  12. First" -> "  12<<ENUM_DOT>> First"
  out = out.replace(/(^|\n)(\s*)(\d+)\.(?=\s+)/g, "$1$2$3<<ENUM_DOT>>");

  // 2) Inline dot enumerations: "a. item", "2. item"
  //    Note: we intentionally require whitespace after the dot to avoid decimals/versions.
  out = out.replace(/\b([A-Za-z]|\d+)\.(?=\s+)/g, "$1<<ENUM_DOT>>");

  return out;
}

export function restoreEnumerationMarkers(passage: string) {
  return passage.replace(/<<ENUM_DOT>>/g, ".");
}
