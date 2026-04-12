import { describe, expect, it, vi } from "vitest";
import { getStartingLookupWord } from "@/lib/server/getStartingLookupWord";
import lemmatize from "wink-lemmatizer";

vi.mock("wink-lemmatizer", () => ({
  default: {
    noun: vi.fn(),
    verb: vi.fn(),
    adjective: vi.fn(),
    lemmatizeNoun: vi.fn(),
    lemmatizeVerb: vi.fn(),
    lemmatizeAdjective: vi.fn(),
  },
}));

describe("getStartingLookupWord", () => {
  it("returns the original word for a noun", async () => {
    const result = await getStartingLookupWord("dogs", "noun");

    expect(result).toBe("dogs");
    expect(lemmatize.verb).not.toHaveBeenCalled();
  });

  it("lemmatizes a verb", async () => {
    vi.mocked(lemmatize.verb).mockReturnValue("run");

    const result = await getStartingLookupWord("running", "verb");

    expect(lemmatize.verb).toHaveBeenCalledWith("running");
    expect(result).toBe("run");
  });
});
