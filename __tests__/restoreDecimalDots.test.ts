import { restoreDecimalDots } from "@/lib/utils";

describe("restoreDecimalDots", () => {
  it("restores decimal dots correctly", () => {
    const input =
      "Value: 3<<DECIMAL_DOT>>14 and 2<<DECIMAL_DOT>>1<<DECIMAL_DOT>>3";
    const output = restoreDecimalDots(input);

    expect(output).toBe("Value: 3.14 and 2.1.3");
  });

  it("is idempotent when no placeholders are present", () => {
    const input = "No decimals here.";
    const output = restoreDecimalDots(input);

    expect(output).toBe(input);
  });

  it("restores multiple decimal placeholders in the same number", () => {
    const input = "Version 1<<DECIMAL_DOT>>2<<DECIMAL_DOT>>3 is stable";
    const output = restoreDecimalDots(input);

    expect(output).toBe("Version 1.2.3 is stable");
  });

  it("restores decimal placeholders across multiple numbers", () => {
    const input =
      "Values are 3<<DECIMAL_DOT>>14, 2<<DECIMAL_DOT>>71, and 1<<DECIMAL_DOT>>0";
    const output = restoreDecimalDots(input);

    expect(output).toBe("Values are 3.14, 2.71, and 1.0");
  });

  it("does not affect similar-looking tokens", () => {
    const input = "This token <<DECIMAL_DOTS>> should remain unchanged";
    const output = restoreDecimalDots(input);

    expect(output).toBe(input);
  });

  it("handles adjacent placeholders correctly", () => {
    const input = "Odd case: 1<<DECIMAL_DOT>><<DECIMAL_DOT>>2";
    const output = restoreDecimalDots(input);

    expect(output).toBe("Odd case: 1..2");
  });

  it("works correctly when placeholder appears at start of string", () => {
    const input = "<<DECIMAL_DOT>>5 is invalid but should restore";
    const output = restoreDecimalDots(input);

    expect(output).toBe(".5 is invalid but should restore");
  });

  it("works correctly when placeholder appears at end of string", () => {
    const input = "Ends with decimal<<DECIMAL_DOT>>";
    const output = restoreDecimalDots(input);

    expect(output).toBe("Ends with decimal.");
  });

  it("is safe to call multiple times (idempotent)", () => {
    const input = "Pi is 3<<DECIMAL_DOT>>14";
    const once = restoreDecimalDots(input);
    const twice = restoreDecimalDots(once);

    expect(once).toBe("Pi is 3.14");
    expect(twice).toBe("Pi is 3.14");
  });

  it("does not modify normal punctuation", () => {
    const input = "This sentence ends normally.";
    const output = restoreDecimalDots(input);

    expect(output).toBe(input);
  });

  it("handles empty string", () => {
    expect(restoreDecimalDots("")).toBe("");
  });
});
