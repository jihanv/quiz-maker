import {
  replaceSingleLetterPeriodCombos,
  restoreSingleLetterPeriodCombos,
} from "@/lib/utils";

describe("restoreSingleLetterPeriodCombos", () => {
  it("restores a single initial token back to letter + dot", () => {
    const input = "<<SINGLE_INITIAL:J>> Edgar Hoover is American.";
    const out = restoreSingleLetterPeriodCombos(input);
    expect(out).toBe("J. Edgar Hoover is American.");
  });

  it("restores multiple tokens in a passage", () => {
    const input =
      "She gave it to Person <<SINGLE_INITIAL:B>> The suspect <<SINGLE_INITIAL:D>> ran.";
    const out = restoreSingleLetterPeriodCombos(input);
    expect(out).toBe("She gave it to Person B. The suspect D. ran.");
  });

  it("is a no-op when no tokens exist", () => {
    const input = "Nothing to restore here.";
    const out = restoreSingleLetterPeriodCombos(input);
    expect(out).toBe(input);
  });

  it("round-trip: replace then restore returns original for non-sequence single initials", () => {
    const input = "J. Edgar Hoover met Person B. Then left.";
    const replaced = replaceSingleLetterPeriodCombos(input);
    const restored = restoreSingleLetterPeriodCombos(replaced);
    expect(restored).toBe(input);
  });

  it("round-trip: does not affect acronym/initial sequences (U.S.A., J. K.)", () => {
    const input =
      "He moved to the U.S. in 2010. J. K. Rowling visited the U.S.A.";
    const replaced = replaceSingleLetterPeriodCombos(input);
    const restored = restoreSingleLetterPeriodCombos(replaced);
    expect(restored).toBe(input);
  });

  it("replaces standalone initial before closing parenthesis", () => {
    const input = "See Appendix B.) for details.";
    const replaced = replaceSingleLetterPeriodCombos(input);
    expect(replaced).toBe("See Appendix <<SINGLE_INITIAL:B>>) for details.");
  });

  it("does not replace when letter-dot is embedded in a larger token (e.g., A1. or AA.)", () => {
    const input =
      "Plan A1. is odd. The label AA. should not match as single letter.";
    const replaced = replaceSingleLetterPeriodCombos(input);
    expect(replaced).toBe(input);
  });

  it("replaces multiple standalone initials in one sentence", () => {
    const input = "Take A. then go to B. then stop at C.";
    const replaced = replaceSingleLetterPeriodCombos(input);
    expect(replaced).toBe(
      "Take <<SINGLE_INITIAL:A>> then go to <<SINGLE_INITIAL:B>> then stop at <<SINGLE_INITIAL:C>>"
    );
  });

  it("restore works when tokens appear adjacent to punctuation", () => {
    const input = `He said "<<SINGLE_INITIAL:B>>," then left.`;
    const restored = restoreSingleLetterPeriodCombos(input);
    expect(restored).toBe(`He said "B.," then left.`);
  });

  it("restore ignores malformed tokens (wrong case / wrong format)", () => {
    const input =
      "Bad token <<SINGLE_INITIAL:b>> and <<SINGLE_INITIAL:BB>> should stay, but <<SINGLE_INITIAL:X>> restores.";
    const restored = restoreSingleLetterPeriodCombos(input);
    expect(restored).toBe(
      "Bad token <<SINGLE_INITIAL:b>> and <<SINGLE_INITIAL:BB>> should stay, but X. restores."
    );
  });

  it("round-trip stability with tricky punctuation", () => {
    const input = `("J. Edgar") met Person B. Then: Person C.`;
    const replaced = replaceSingleLetterPeriodCombos(input);
    const restored = restoreSingleLetterPeriodCombos(replaced);
    expect(restored).toBe(input);
  });

  it("does not replace sequences that include trailing punctuation after each initial (rare but possible)", () => {
    // Here the actual text is weird, but the rule is: if it looks like a sequence, leave it.
    const input = "He wrote U. S. A. today.";
    const replaced = replaceSingleLetterPeriodCombos(input);
    expect(replaced).toBe(input);
  });
});
