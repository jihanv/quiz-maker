import { restoreAcronyms } from "@/lib/utils";

describe("restoreAcronyms", () => {
  it("restores a 3-letter acronym with trailing dash: [U-S-A-] -> U.S.A.", () => {
    const input = "I live in the [U-S-A-]";
    expect(restoreAcronyms(input)).toBe("I live in the U.S.A.");
  });

  it("restores a 3-letter acronym without trailing dash: [U-S-A] -> U.S.A", () => {
    const input = "I live in the [U-S-A]";
    expect(restoreAcronyms(input)).toBe("I live in the U.S.A");
  });

  it("restores a 3-letter acronym without trailing dash: [U-S-A] -> U.S.A", () => {
    const input = "I live in the [U-S-A] today.";
    expect(restoreAcronyms(input)).toBe("I live in the U.S.A today.");
  });

  it("restores multiple acronyms in the same string", () => {
    const input = "[U-S-A-] and [U-K-] are different.";
    expect(restoreAcronyms(input)).toBe("U.S.A. and U.K. are different.");
  });

  it("does not modify abbreviations like Mr. or Dr. (since they aren't bracketed)", () => {
    const input = "Mr. Smith met Dr. Adams.";
    expect(restoreAcronyms(input)).toBe("Mr. Smith met Dr. Adams.");
  });

  it("does not modify normal words or all-caps words without brackets", () => {
    const input = "USA is not bracketed. NBA is not bracketed.";
    expect(restoreAcronyms(input)).toBe(
      "USA is not bracketed. NBA is not bracketed."
    );
  });

  it("works when bracketed acronym is next to punctuation", () => {
    const input = "Wow! [U-S-A-], really? [U-K-]; yes.";
    expect(restoreAcronyms(input)).toBe("Wow! U.S.A., really? U.K.; yes.");
  });

  it("restores single-letter bracketed forms too: [A-] -> A.", () => {
    const input = "Grade [A-] is not an acronym.";
    expect(restoreAcronyms(input)).toBe("Grade A. is not an acronym.");
  });

  it("restores lowercase acronyms", () => {
    const input = "[e-g-] i love rice";
    expect(restoreAcronyms(input)).toBe("e.g. i love rice");
  });

  it("restores lowercase acronyms", () => {
    const input = "[p-m-]";
    expect(restoreAcronyms(input)).toBe("p.m.");
  });
});
