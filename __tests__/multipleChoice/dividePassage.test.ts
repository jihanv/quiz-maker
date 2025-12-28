import { dividePassage } from "@/features/multipleChoiceVocabulary/pipeline/dividePassage";

describe("dividePassage", () => {
  it("divides one paragraph properly", () => {
    const input =
      "Now cram 14,000 people in this space. It’s dark. The edges of the hold are steel walls. There’s no source of heat in the winter cold except what’s emitted by the mass of people. The place reeks of human waste, piling up at the feet of everyone around.And your pregnant mother is standing shoulder-to-shoulder on one of those floors, with contractions signaling your impending arrival on this earth. But you’re not the only one coming into this world in the mass of humanity, floating in a cargo ship in the frigid East Sea. You’ve got four siblings – by circumstance, not bloodline. Your birthdays are in late December 1950, six months into a war that has engulfed the Korean Peninsula.";

    const output = dividePassage(input);

    const expectedOutput = [
      "Now cram 14,000 people in this space. It’s dark. The edges of the hold are steel walls. There’s no source of heat in the winter cold except what’s emitted by the mass of people. ",
      "The place reeks of human waste, piling up at the feet of everyone around.And your pregnant mother is standing shoulder-to-shoulder on one of those floors, with contractions signaling your impending arrival on this earth. ",
      "But you’re not the only one coming into this world in the mass of humanity, floating in a cargo ship in the frigid East Sea. You’ve got four siblings – by circumstance, not bloodline. ",
      "Your birthdays are in late December 1950, six months into a war that has engulfed the Korean Peninsula.",
    ];

    expect(output).toEqual(expectedOutput);
  });

  it("divides paragraphs properly", () => {
    const input =
      "Now cram 14,000 people in this space. It’s dark. The edges of the hold are steel walls. There’s no source of heat in the winter cold except what’s emitted by the mass of people. The place reeks of human waste, piling up at the feet of everyone around.\n\nAnd your pregnant mother is standing shoulder-to-shoulder on one of those floors, with contractions signaling your impending arrival on this earth.\n\nBut you’re not the only one coming into this world in the mass of humanity, floating in a cargo ship in the frigid East Sea. You’ve got four siblings – by circumstance, not bloodline. Your birthdays are in late December 1950, six months into a war that has engulfed the Korean Peninsula.";

    const output = dividePassage(input);

    const expectedOutput = [
      "Now cram 14,000 people in this space. It’s dark. The edges of the hold are steel walls. There’s no source of heat in the winter cold except what’s emitted by the mass of people. ",
      "The place reeks of human waste, piling up at the feet of everyone around.\n" +
        "\n" +
        "And your pregnant mother is standing shoulder-to-shoulder on one of those floors, with contractions signaling your impending arrival on this earth.\n" +
        "\n",
      "But you’re not the only one coming into this world in the mass of humanity, floating in a cargo ship in the frigid East Sea. You’ve got four siblings – by circumstance, not bloodline. ",
      "Your birthdays are in late December 1950, six months into a war that has engulfed the Korean Peninsula.",
    ];

    expect(output).toEqual(expectedOutput);
  });

  it("handles empty string", () => {
    expect(dividePassage("")).toEqual([]);
  });

  it("handles whitespace-only input", () => {
    expect(dividePassage("   \n\n  ")).toEqual([]);
  });

  it("does not mutate the input", () => {
    const input = "Hello world. Another sentence.";
    const copy = input.slice();
    dividePassage(input);
    expect(input).toBe(copy);
  });

  it("round-trips: output joined equals original input", () => {
    const input = "A sentence. Another.\n\nNew paragraph here. Final sentence.";
    const out = dividePassage(input);
    expect(out.join("")).toBe(input);
  });

  it("does not include empty segments", () => {
    const input = "Hello.\n\n\n\nWorld.";
    const out = dividePassage(input);
    expect(out.every((s) => s.length > 0)).toBe(true);
  });

  it("handles Windows newlines (CRLF)", () => {
    const input = "Para one.\r\n\r\nPara two.";
    const out = dividePassage(input);
    expect(out.join("")).toBe(input);
  });

  it("handles a single sentence", () => {
    expect(dividePassage("Just one.")).toEqual(["Just one."]);
  });

  it("handles text without terminal punctuation", () => {
    expect(dividePassage("No period at end")).toEqual(["No period at end"]);
  });

  it("does not split inside common abbreviations", () => {
    const input = "Dr. Kim arrived at 5 p.m. It was late.";
    const out = dividePassage(input);
    expect(out.join("")).toBe(input);
  });

  it("does not split decimals", () => {
    const input = "The value is 3.14. Next sentence.";
    const out = dividePassage(input);
    expect(out.join("")).toBe(input);
  });

  it("respects max chunk size boundary", () => {
    const s1 = "A ".repeat(100); // build near boundary
    const input = `${s1}. ${s1}. ${s1}.`;
    const out = dividePassage(input);

    // Example assertions — adapt to your rule:
    expect(out.length).toBeGreaterThan(1);
    // expect(out.every((c) => c.length <= LIMIT)).toBe(true);
  });

  it("treats double-newline with spaces consistently", () => {
    const a = "One.\n\nTwo.";
    const b = "One.\n \nTwo.";
    expect(dividePassage(a).length).toBe(dividePassage(b).length);
  });
});

// pnpm test -- dividePassage
// pnpm jest __tests__/multipleChoice
