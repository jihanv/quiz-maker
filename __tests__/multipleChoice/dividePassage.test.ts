import { dividePassage } from "@/features/multipleChoiceVocabulary/pipeline/dividePassage";

describe("dividePassage", () => {
  it("counts properly", () => {
    const input =
      "Now cram 14,000 people in this space. It’s dark. The edges of the hold are steel walls. There’s no source of heat in the winter cold except what’s emitted by the mass of people. The place reeks of human waste, piling up at the feet of everyone around. And your pregnant mother is standing shoulder-to-shoulder on one of those floors, with contractions signaling your impending arrival on this earth.But you’re not the only one coming into this world in the mass of humanity, floating in a cargo ship in the frigid East Sea. You’ve got four siblings – by circumstance, not bloodline. Your birthdays are in late December 1950, six months into a war that has engulfed the Korean Peninsula.";

    const output = dividePassage(input);

    expect(output).toBe(Math.floor(121 / 36));
  });
});

// pnpm test -- dividePassage
// pnpm jest __tests__/multipleChoice
