import { restoreNumericPunctuation } from "@/lib/utils";

describe("restoreNumericPunctuation", () => {
  it("restores decimal dots", () => {
    const input = "The value is 3<<NUM_DOT>>14.";
    expect(restoreNumericPunctuation(input)).toBe("The value is 3.14.");
  });

  it("restores multiple numeric dots in version numbers", () => {
    const input = "Current version is v2<<NUM_DOT>>10<<NUM_DOT>>3";
    expect(restoreNumericPunctuation(input)).toBe("Current version is v2.10.3");
  });

  it("restores dots in IP addresses", () => {
    const input =
      "Server at 192<<NUM_DOT>>168<<NUM_DOT>>0<<NUM_DOT>>1 is online";
    expect(restoreNumericPunctuation(input)).toBe(
      "Server at 192.168.0.1 is online"
    );
  });

  it("restores commas used as thousand separators", () => {
    const input = "The budget was 1<<NUM_COMMA>>234<<NUM_COMMA>>567 dollars";
    expect(restoreNumericPunctuation(input)).toBe(
      "The budget was 1,234,567 dollars"
    );
  });

  it("restores european-style decimal commas", () => {
    const input = "The price is 3<<NUM_COMMA>>14 euros";
    expect(restoreNumericPunctuation(input)).toBe("The price is 3,14 euros");
  });

  it("handles mixed numeric formats in the same string", () => {
    const input =
      "v1<<NUM_DOT>>2<<NUM_DOT>>3 costs 1<<NUM_COMMA>>234<<NUM_DOT>>56 and IP 10<<NUM_DOT>>0<<NUM_DOT>>0<<NUM_DOT>>1";
    expect(restoreNumericPunctuation(input)).toBe(
      "v1.2.3 costs 1,234.56 and IP 10.0.0.1"
    );
  });

  it("does not alter text without numeric tokens", () => {
    const input = "Nothing to restore here.";
    expect(restoreNumericPunctuation(input)).toBe(input);
  });

  it("handles mixed restored and untouched punctuation", () => {
    const input = "Value 3<<NUM_DOT>>14... approx.";
    expect(restoreNumericPunctuation(input)).toBe("Value 3.14... approx.");
  });

  it("restores multiple occurrences correctly", () => {
    const input =
      "v2<<NUM_DOT>>0 and v3<<NUM_DOT>>1 both cost 1<<NUM_COMMA>>000 units";
    expect(restoreNumericPunctuation(input)).toBe(
      "v2.0 and v3.1 both cost 1,000 units"
    );
  });
});
