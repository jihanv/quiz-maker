import { removeAbbreviations } from "@/lib/utils";

describe("removeAbbreviations", () => {
  it("removes periods from common abbreviations like Mr. and Dr.", () => {
    const input = "Mr. Smith met Dr. Adams.";
    const result = removeAbbreviations(input);

    expect(result).toBe("Mr<<DOT>> Smith met Dr<<DOT>> Adams.");
  });

  it("It does not remove anything when there are no abbreviations.", () => {
    const input = "I love apples and oranges.";
    const result = removeAbbreviations(input);

    expect(result).toBe("I love apples and oranges.");
  });

  it("replaces repeated abbreviations", () => {
    const input = "Mr. A saw Mr. B.";
    expect(removeAbbreviations(input)).toBe("Mr<<DOT>> A saw Mr<<DOT>> B.");
  });

  it("works when abbreviation is at the start", () => {
    const input = "Dr. Who";
    expect(removeAbbreviations(input)).toBe("Dr<<DOT>> Who");
  });

  it("works when abbreviation is at the end", () => {
    const input = "Talk to Mr.";
    expect(removeAbbreviations(input)).toBe("Talk to Mr<<DOT>>");
  });

  it("handles multiple abbreviations in the same passage", () => {
    const input = "Mr. A met Mrs. B and Dr. C.";
    expect(removeAbbreviations(input)).toBe(
      "Mr<<DOT>> A met Mrs<<DOT>> B and Dr<<DOT>> C."
    );
  });

  it("handles lower case abbreviations", () => {
    const input = "mr. A met mrs. B and mr. C.";
    expect(removeAbbreviations(input)).toBe(
      "mr<<DOT>> A met mrs<<DOT>> B and mr<<DOT>> C."
    );
  });
});
