import {
  replaceSingleLetterPeriodCombos,
  restoreSingleLetterPeriodCombos,
} from "@/lib/utils";

describe("restoreSingleLetterPeriodCombos", () => {
  test("restores a single initial token back to letter + dot", () => {
    const input = "<<SINGLE_INITIAL:J>> Edgar Hoover is American.";
    const out = restoreSingleLetterPeriodCombos(input);
    expect(out).toBe("J. Edgar Hoover is American.");
  });

  test("restores multiple tokens in a passage", () => {
    const input =
      "She gave it to Person <<SINGLE_INITIAL:B>> The suspect <<SINGLE_INITIAL:D>> ran.";
    const out = restoreSingleLetterPeriodCombos(input);
    expect(out).toBe("She gave it to Person B. The suspect D. ran.");
  });

  test("is a no-op when no tokens exist", () => {
    const input = "Nothing to restore here.";
    const out = restoreSingleLetterPeriodCombos(input);
    expect(out).toBe(input);
  });

  test("round-trip: replace then restore returns original for non-sequence single initials", () => {
    const input = "J. Edgar Hoover met Person B. Then left.";
    const replaced = replaceSingleLetterPeriodCombos(input);
    const restored = restoreSingleLetterPeriodCombos(replaced);
    expect(restored).toBe(input);
  });

  test("round-trip: does not affect acronym/initial sequences (U.S.A., J. K.)", () => {
    const input =
      "He moved to the U.S. in 2010. J. K. Rowling visited the U.S.A.";
    const replaced = replaceSingleLetterPeriodCombos(input);
    const restored = restoreSingleLetterPeriodCombos(replaced);
    expect(restored).toBe(input);
  });
});
