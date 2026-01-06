import { pickDifficultWord } from "@/features/multipleChoiceVocabulary/pipeline/pickDifficultWord";

describe("pickDifficultWord", () => {
  it("selects difficult word", () => {
    const input = pickDifficultWord(
      "I am just writing some random words here."
    );
    expect(input).toBe(input);
  });
});

// pnpm test -- pickDifficultWord
// pnpm vitest -t "pickDifficultWord"
