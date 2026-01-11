import { pickDifficultWord } from "@/features/clozeGenerator/pipeline/pickDifficultWord";

describe("pickDifficultWord", () => {
  it("selects difficult word", () => {
    const input = pickDifficultWord(
      "I am just writing some random words here."
    );
    expect(input).toBe(input);
  });
});

// pnpm test -- pickDifficultWord
// pnpm vitest __tests__/multipleChoice/pickDifficultWord.test.ts
