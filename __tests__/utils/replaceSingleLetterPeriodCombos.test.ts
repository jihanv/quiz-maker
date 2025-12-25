import { replaceSingleLetterPeriodCombos } from "@/lib/utils";

describe("replaceSingleLetterPeriodCombos", () => {
  test("replaces a single initial before a name when it is NOT part of a multi-initial sequence", () => {
    const input = "J. Edgar Hoover is American.";
    const out = replaceSingleLetterPeriodCombos(input);
    expect(out).toBe("<<SINGLE_INITIAL:J>> Edgar Hoover is American.");
  });

  test("replaces a single letter at sentence end (intentionally)", () => {
    const input =
      "She gave it to Person B. The suspect was then apprehended in the park.";
    const out = replaceSingleLetterPeriodCombos(input);
    expect(out).toBe(
      "She gave it to Person <<SINGLE_INITIAL:B>> The suspect was then apprehended in the park."
    );
  });

  test("does not replace inside acronym sequences like U.S.", () => {
    const input = "He moved to the U.S. in 2010.";
    const out = replaceSingleLetterPeriodCombos(input);
    expect(out).toBe(input);
  });

  test("does not replace inside acronym sequences like U.S.A.", () => {
    const input = "The U.S.A. is large.";
    const out = replaceSingleLetterPeriodCombos(input);
    expect(out).toBe(input);
  });

  test("does not replace initials sequences like J. K. Rowling (single-letter tokens inside a sequence)", () => {
    const input = "J. K. Rowling wrote books.";
    const out = replaceSingleLetterPeriodCombos(input);
    expect(out).toBe(input);
  });

  test("does not replace initials sequences with multiple spaces (A.  B.   C.)", () => {
    const input = "A.  B.   C. are letters.";
    const out = replaceSingleLetterPeriodCombos(input);
    expect(out).toBe(input);
  });

  test("does replace a standalone single initial elsewhere in the same string", () => {
    const input = "A. B. C. are letters. Person D. left.";
    const out = replaceSingleLetterPeriodCombos(input);
    expect(out).toBe("A. B. C. are letters. Person <<SINGLE_INITIAL:D>> left.");
  });

  test("does not replace lowercase single-letter dot", () => {
    const input = "Use x. as a variable, not X.";
    const out = replaceSingleLetterPeriodCombos(input);
    expect(out).toBe("Use x. as a variable, not <<SINGLE_INITIAL:X>>");
  });

  test("does not replace when dot is between digits (extra safety)", () => {
    const input = "Pi is 3.14 and e is 2.71.";
    const out = replaceSingleLetterPeriodCombos(input);
    expect(out).toBe(input);
  });

  test("handles punctuation after the dot (quotes) for standalone initials", () => {
    const input = `He said "B." then left.`;
    const out = replaceSingleLetterPeriodCombos(input);
    // Here B. is standalone (not followed by another initial), so it should replace.
    expect(out).toBe(`He said "<<SINGLE_INITIAL:B>>" then left.`);
  });
});
