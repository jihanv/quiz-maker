import { replaceAcronyms } from "@/lib/utils";

describe("replaceAcronyms", () => {
  it("replaces a 3-letter acronym with trailing dot: U.S.A. -> [U-S-A-]", () => {
    const input = "I live in the U.S.A.";
    expect(replaceAcronyms(input)).toBe("I live in the [U-S-A-]");
  });

  it("replaces a 3-letter acronym without trailing dot: U.S.A -> [U-S-A]", () => {
    const input = "I live in the U.S.A";
    expect(replaceAcronyms(input)).toBe("I live in the [U-S-A]");
  });

  it("replaces a 2-letter acronym: U.K. -> [U-K-] and U.K -> [U-K]", () => {
    expect(replaceAcronyms("From the U.K.")).toBe("From the [U-K-]");
    expect(replaceAcronyms("From the U.K")).toBe("From the [U-K]");
  });

  it("replaces multiple acronyms in the same string", () => {
    const input = "U.S.A. and U.K. are different.";
    expect(replaceAcronyms(input)).toBe("[U-S-A-] and [U-K-] are different.");
  });

  it("does not replace abbreviations like Mr. or Dr.", () => {
    const input = "Mr. Smith met Dr. Adams.";
    expect(replaceAcronyms(input)).toBe("Mr. Smith met Dr. Adams.");
  });

  it("does not replace normal words or all-caps words without dots", () => {
    const input = "USA is not dotted. NBA is not dotted.";
    expect(replaceAcronyms(input)).toBe(
      "USA is not dotted. NBA is not dotted."
    );
  });

  it("works when acronym is next to punctuation", () => {
    const input = "Wow! U.S.A., really? U.K.; yes.";
    expect(replaceAcronyms(input)).toBe("Wow! [U-S-A-], really? [U-K-]; yes.");
  });

  it("works when acronym is next to punctuation", () => {
    const input = "Wow! U.S.A, really? U.K.; yes.";
    expect(replaceAcronyms(input)).toBe("Wow! [U-S-A], really? [U-K-]; yes.");
  });

  it("does not replace single-letter dotted forms (A.)", () => {
    const input = "Grade A. is not an acronym.";
    expect(replaceAcronyms(input)).toBe("Grade A. is not an acronym.");
  });
});
