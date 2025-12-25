import {
  replaceEnumerationMarkers,
  restoreEnumerationMarkers,
} from "@/lib/utils";

describe("restoreEnumerationMarkers", () => {
  it("round-trips: restore(replace(x)) equals original", () => {
    const input = "Outline:\n1. One\n2. Two\nPick a) yes, b) no, or c. maybe.";
    expect(restoreEnumerationMarkers(replaceEnumerationMarkers(input))).toBe(
      input
    );
  });

  it("does not alter text without tokens", () => {
    const input = "Nothing to restore here.";
    expect(restoreEnumerationMarkers(input)).toBe(input);
  });

  it("restores line-start numeric enumeration dots", () => {
    const input = "1<<ENUM_DOT>> First\n2<<ENUM_DOT>> Second";
    expect(restoreEnumerationMarkers(input)).toBe("1. First\n2. Second");
  });

  it("restores inline letter and number enumeration dots", () => {
    const input = "Choose a<<ENUM_DOT>> alpha or 2<<ENUM_DOT>> beta.";
    expect(restoreEnumerationMarkers(input)).toBe(
      "Choose a. alpha or 2. beta."
    );
  });

  it("does not touch parentheses enumerations like a) / 1) (since we no longer tokenize them)", () => {
    const input = "Pick a) alpha, b) beta, 1) one, 2) two";
    expect(restoreEnumerationMarkers(input)).toBe(input);
  });

  it("restores only the ENUM_DOT token and leaves other tokens unchanged", () => {
    const input =
      "1<<ENUM_DOT>> One and example<<URL_DOT>>com plus 3<<NUM_DOT>>14";
    expect(restoreEnumerationMarkers(input)).toBe(
      "1. One and example<<URL_DOT>>com plus 3<<NUM_DOT>>14"
    );
  });

  it("handles multiple occurrences across lines with indentation", () => {
    const input = "  10<<ENUM_DOT>> Ten\n    11<<ENUM_DOT>> Eleven";
    expect(restoreEnumerationMarkers(input)).toBe("  10. Ten\n    11. Eleven");
  });

  it("does not alter text without ENUM_DOT tokens", () => {
    const input = "Nothing to restore here.";
    expect(restoreEnumerationMarkers(input)).toBe(input);
  });

  it("round-trips: restore(replace(x)) equals original for dot-only enumeration markers", () => {
    const original = "Outline:\n1. One\n2. Two\nChoose a. alpha or b. beta.";
    expect(restoreEnumerationMarkers(replaceEnumerationMarkers(original))).toBe(
      original
    );
  });
});
