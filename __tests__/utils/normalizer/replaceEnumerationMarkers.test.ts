import { replaceEnumerationMarkers } from "@/lib/utils";

describe("replaceEnumerationMarkers", () => {
  it("protects line-start numeric enumerations", () => {
    const input = "1. First item\n2. Second item";
    expect(replaceEnumerationMarkers(input)).toBe(
      "1<<ENUM_DOT>> First item\n2<<ENUM_DOT>> Second item"
    );
  });

  it("protects line-start numeric enumerations with indentation", () => {
    const input = "  12. Item twelve";
    expect(replaceEnumerationMarkers(input)).toBe(
      "  12<<ENUM_DOT>> Item twelve"
    );
  });

  it("protects inline dot enumerations like a. and 1.", () => {
    const input = "Use a. option one or 2. option two.";
    expect(replaceEnumerationMarkers(input)).toBe(
      "Use a<<ENUM_DOT>> option one or 2<<ENUM_DOT>> option two."
    );
  });

  it("does not change decimals or versions (dot not followed by whitespace)", () => {
    const input = "Pi is 3.14 and version is 2.1.3";
    expect(replaceEnumerationMarkers(input)).toBe(input);
  });

  it("does not change plain sentence periods", () => {
    const input = "This is a sentence. This is another.";
    expect(replaceEnumerationMarkers(input)).toBe(input);
  });
});
