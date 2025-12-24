import { replaceDecimalDots } from "@/lib/utils";

describe("replaceDecimalDots", () => {
  it("replaces a single decimal dot between digits", () => {
    const input = "The value is 3.14 today.";
    const output = replaceDecimalDots(input);

    expect(output).toBe("The value is 3<<DECIMAL_DOT>>14 today.");
  });

  it("replaces multiple decimal dots in version numbers", () => {
    const input = "Current version is 2.1.3.";
    const output = replaceDecimalDots(input);

    expect(output).toBe(
      "Current version is 2<<DECIMAL_DOT>>1<<DECIMAL_DOT>>3."
    );
  });

  it("does not replace sentence-ending dots", () => {
    const input = "He scored 99. Then he left.";
    const output = replaceDecimalDots(input);

    expect(output).toBe(input);
  });

  it("does not replace dots not surrounded by digits", () => {
    const input = "Use config.json or visit example.com.";
    const output = replaceDecimalDots(input);

    expect(output).toBe(input);
  });

  it("handles numbers at the start and end of the string", () => {
    const input = "3.14 is pi. Pi is about 3.14";
    const output = replaceDecimalDots(input);

    expect(output).toBe(
      "3<<DECIMAL_DOT>>14 is pi. Pi is about 3<<DECIMAL_DOT>>14"
    );
  });
});
