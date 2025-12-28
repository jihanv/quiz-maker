export const ABBREVIATIONS = [
  // Honorifics / titles
  "Mr.",
  "Mrs.",
  "Ms.",
  "Mx.",
  "Dr.",
  "Prof.",
  "Rev.",
  "Hon.",
  "Pres.",
  "Gov.",
  "Sen.",
  "Rep.",
  "Amb.",
  "Treas.",
  "Sec.",

  // Suffixes
  "Jr.",
  "Sr.",
  "Ph.D.",
  "M.D.",
  "D.D.S.",
  "D.O.",
  "Esq.",

  // Academic / professional
  "Assoc.",
  "Asst.",
  "Dept.",
  "Univ.",
  "Inst.",
  "Acad.",
  "Coll.",
  "Ph.D.",
  "Ph.D",

  // Military / ranks
  "Gen.",
  "Col.",
  "Maj.",
  "Capt.",
  "Cmdr.",
  "Lt.",
  "Sgt.",
  "Cpl.",

  // Time
  "a.m.",
  "p.m.",

  // Latin / common abbreviations
  "e.g.",
  "i.e.",
  "etc.",
  "vs.",
  "cf.",
  "al.",
  "ca.",
  "approx.",

  // Business / orgs
  "Inc.",
  "Ltd.",
  "Co.",
  "Corp.",
  "LLC.",
  "PLC.",
  "AG.",
  "GmbH.",

  // Addresses / places
  "St.",
  "Ave.",
  "Blvd.",
  "Rd.",
  "Dr.",
  "Ln.",
  "Mt.",
  "Ft.",

  // Months (common in dates)
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "Jun.",
  "Jul.",
  "Aug.",
  "Sep.",
  "Sept.",
  "Oct.",
  "Nov.",
  "Dec.",

  // Misc
  "No.",
  "Fig.",
  "Eq.",
  "Ref.",
  "Refs.",
  "Vol.",
  "Ch.",
  "pp.",
  "p.",
  "Fig.",
  "Figs.",
  "Eq.",
  "Eqs.",
  "Ref.",
  "Refs.",
  "Ch.",
  "Sec.",
  "Secs.",
  "pp.",
  "p.",
  "Vol.",
  "No.",
  "ed.",
  "eds.",
  "et al.",
  "Sec.",
  "Chap.",
  "Int’l",
  "Conf.",
];

export const INITIALS_RE = /\b([A-Za-z]\.)(\s*[A-Za-z]\.)+/g;

export const INITIALS_TOKEN_RE = /<<INITIALS:([A-Za-z-]+)\|([^>]*)>>/g;

export const TARGET_LENGTH = 36;

export const MIN_SECTION_WORDS = Math.floor(TARGET_LENGTH * 0.8);
