import { restoreAbbreviations, removeAbbreviations } from "@/lib/utils";

describe("restoreAbbreviations", () => {
  it("restores periods for common abbreviations like Mr. and Dr.", () => {
    const input = "Mr<<DOT>> Smith met Dr<<DOT>> Adams.";
    const result = restoreAbbreviations(input);

    expect(result).toBe("Mr. Smith met Dr. Adams.");
  });

  it("does not change anything when there are no abbreviation tokens.", () => {
    const input = "I love apples and oranges.";
    const result = restoreAbbreviations(input);

    expect(result).toBe("I love apples and oranges.");
  });

  it("restores repeated abbreviation tokens", () => {
    const input = "Mr<<DOT>> A saw Mr<<DOT>> B.";
    expect(restoreAbbreviations(input)).toBe("Mr. A saw Mr. B.");
  });

  it("works when abbreviation token is at the start", () => {
    const input = "Dr<<DOT>> Who";
    expect(restoreAbbreviations(input)).toBe("Dr. Who");
  });

  it("works when abbreviation token is at the end", () => {
    const input = "Talk to Mr<<DOT>>";
    expect(restoreAbbreviations(input)).toBe("Talk to Mr.");
  });

  it("handles multiple abbreviations in the same passage", () => {
    const input = "Mr<<DOT>> A met Mrs<<DOT>> B and Dr<<DOT>> C.";
    expect(restoreAbbreviations(input)).toBe("Mr. A met Mrs. B and Dr. C.");
  });

  it("handles lower case abbreviations", () => {
    const input = "mr<<DOT>> A met mrs<<DOT>> B and mr<<DOT>> C.";
    expect(restoreAbbreviations(input)).toBe("mr. A met mrs. B and mr. C.");
  });
});

describe("removeAbbreviations + restoreAbbreviations", () => {
  it("round-trips cleanly", () => {
    const input = "Mr. Smith met Dr. Adams.";
    expect(restoreAbbreviations(removeAbbreviations(input))).toBe(input);
  });

  it("round-trips with multiple abbreviations and case variations", () => {
    const input = "mr. A met Mrs. B and DR. C. Talk to Mr.";
    expect(restoreAbbreviations(removeAbbreviations(input))).toBe(input);
  });
});
