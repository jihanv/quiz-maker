import { beforeEach, describe, expect, it, vi } from "vitest";
import { getRetryLookupWords } from "@/lib/server/getRetryLookupWords";
import { generateLookupVariants } from "@/lib/server/generateLookupVariants";

vi.mock("@/lib/server/generateLookupVariants", () => ({
  generateLookupVariants: vi.fn(),
}));

describe("getRetryLookupWords", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns noun retry variants and excludes the starting word", () => {
    vi.mocked(generateLookupVariants).mockReturnValue(["dogs", "dog"]);

    const result = getRetryLookupWords("dogs", "dogs", "noun");

    expect(generateLookupVariants).toHaveBeenCalledTimes(1);
    expect(generateLookupVariants).toHaveBeenCalledWith("dogs");
    expect(result).toEqual(["dog"]);
  });

  it("returns verb retry variants from both words and excludes the starting word", () => {
    vi.mocked(generateLookupVariants)
      .mockReturnValueOnce(["run"])
      .mockReturnValueOnce(["runn", "run"]);

    const result = getRetryLookupWords("running", "run", "verb");

    expect(generateLookupVariants).toHaveBeenCalledTimes(2);
    expect(generateLookupVariants).toHaveBeenNthCalledWith(1, "run");
    expect(generateLookupVariants).toHaveBeenNthCalledWith(2, "running");
    expect(result).toEqual(["runn", "running"]);
  });
});
