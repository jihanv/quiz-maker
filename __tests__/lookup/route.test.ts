import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/lookup/route";
import { generateLookupVariants } from "@/lib/server/generateLookupVariants";
import { runJapaneseLookup } from "@/lib/server/runJapaneseLookup";

vi.mock("@/lib/server/generateLookupVariants", () => ({
  generateLookupVariants: vi.fn(),
}));

vi.mock("@/lib/server/runJapaneseLookup", () => ({
  runJapaneseLookup: vi.fn(),
}));

describe("POST /api/lookup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retries with a generated variant after a full lookup failure", async () => {
    vi.mocked(runJapaneseLookup)
      .mockResolvedValueOnce({
        word: "dogs",
        definition: null,
        fallbackEntries: [],
      })
      .mockResolvedValueOnce({
        word: "dog",
        definition: "犬",
        fallbackEntries: [],
      });

    vi.mocked(generateLookupVariants).mockReturnValue(["dogs", "dog"]);

    const request = new Request("http://localhost/api/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ words: ["dogs"] }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(runJapaneseLookup).toHaveBeenCalledTimes(2);
    expect(runJapaneseLookup).toHaveBeenNthCalledWith(1, "dogs");
    expect(runJapaneseLookup).toHaveBeenNthCalledWith(2, "dog");
    expect(json).toEqual({
      success: true,
      originalWord: "dogs",
      lookupWord: "dog",
      definition: "犬",
      fallbackEntries: [],
    });
  });
});
