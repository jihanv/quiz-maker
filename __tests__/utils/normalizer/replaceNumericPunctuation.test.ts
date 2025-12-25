import { replaceNumericPunctuation } from "@/lib/utils";

describe("replaceNumericPunctuation", () => {
  it("replaces decimal dots between digits", () => {
    const input = "The value is 3.14.";
    expect(replaceNumericPunctuation(input)).toBe(
      "The value is 3<<NUM_DOT>>14."
    );
  });

  it("replaces multiple numeric dots in version numbers", () => {
    const input = "Current version is v2.10.3";
    expect(replaceNumericPunctuation(input)).toBe(
      "Current version is v2<<NUM_DOT>>10<<NUM_DOT>>3"
    );
  });

  it("replaces dots in IP addresses", () => {
    const input = "Server at 192.168.0.1 is online";
    expect(replaceNumericPunctuation(input)).toBe(
      "Server at 192<<NUM_DOT>>168<<NUM_DOT>>0<<NUM_DOT>>1 is online"
    );
  });

  it("replaces commas used as thousand separators", () => {
    const input = "The budget was 1,234,567 dollars";
    expect(replaceNumericPunctuation(input)).toBe(
      "The budget was 1<<NUM_COMMA>>234<<NUM_COMMA>>567 dollars"
    );
  });

  it("replaces european-style decimal commas", () => {
    const input = "The price is 3,14 euros";
    expect(replaceNumericPunctuation(input)).toBe(
      "The price is 3<<NUM_COMMA>>14 euros"
    );
  });

  it("does not replace commas not between digits", () => {
    const input = "Items: apples, oranges, and bananas";
    expect(replaceNumericPunctuation(input)).toBe(input);
  });

  it("does not replace dots that are not between digits", () => {
    const input = "End of sentence.";
    expect(replaceNumericPunctuation(input)).toBe(input);
  });

  it("handles mixed numeric formats in the same string", () => {
    const input = "v1.2.3 costs 1,234.56 and IP 10.0.0.1";
    expect(replaceNumericPunctuation(input)).toBe(
      "v1<<NUM_DOT>>2<<NUM_DOT>>3 costs 1<<NUM_COMMA>>234<<NUM_DOT>>56 and IP 10<<NUM_DOT>>0<<NUM_DOT>>0<<NUM_DOT>>1"
    );
  });

  it("leaves non-numeric punctuation untouched", () => {
    const input = "Wait... what? Really?!";
    expect(replaceNumericPunctuation(input)).toBe(input);
  });
});
