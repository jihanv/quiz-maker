import { removeAbbreviations } from "@/lib/utils";

describe("removeAbbreviations", () => {
  it("removes periods from common abbreviations like Mr. and Dr.", () => {
    const input = "Mr. Smith met Dr. Adams.";
    const result = removeAbbreviations(input);

    expect(result).toBe("Mr Smith met Dr Adams.");
  });

  it("It does not remove anything when there are no abbreviations.", () => {
    const input = "I love apples and oranges.";
    const result = removeAbbreviations(input);

    expect(result).toBe("I love apples and oranges.");
  });

  it("replaces repeated abbreviations", () => {
    const input = "Mr. A saw Mr. B.";
    expect(removeAbbreviations(input)).toBe("Mr A saw Mr B.");
  });

  it("works when abbreviation is at the start", () => {
    const input = "Dr. Who";
    expect(removeAbbreviations(input)).toBe("Dr Who");
  });

  it("works when abbreviation is at the end", () => {
    const input = "Talk to Mr.";
    expect(removeAbbreviations(input)).toBe("Talk to Mr");
  });
});
