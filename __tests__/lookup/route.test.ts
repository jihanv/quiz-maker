import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/lookup/route";
import { generateLookupVariants } from "@/lib/server/generateLookupVariants";
import { runJapaneseLookup } from "@/lib/server/runJapaneseLookup";
import lemmatize from "wink-lemmatizer";

vi.mock("@/lib/server/generateLookupVariants", () => ({
  generateLookupVariants: vi.fn(),
}));

vi.mock("@/lib/server/runJapaneseLookup", () => ({
  runJapaneseLookup: vi.fn(),
}));

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

describe("POST /api/lookup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retries with a generated variant after a full lookup failure for a noun", async () => {
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
      body: JSON.stringify({ word: "dogs", partOfSpeech: "noun" }),
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

  it("lemmatizes a verb before the first lookup", async () => {
    vi.mocked(lemmatize.verb).mockReturnValue("run");

    vi.mocked(runJapaneseLookup).mockResolvedValueOnce({
      word: "run",
      definition: "走る",
      fallbackEntries: [],
    });

    const request = new Request("http://localhost/api/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: "running", partOfSpeech: "verb" }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(lemmatize.verb).toHaveBeenCalledWith("running");
    expect(runJapaneseLookup).toHaveBeenCalledTimes(1);
    expect(runJapaneseLookup).toHaveBeenCalledWith("run");
    expect(generateLookupVariants).not.toHaveBeenCalled();
    expect(json).toEqual({
      success: true,
      originalWord: "running",
      lookupWord: "run",
      definition: "走る",
      fallbackEntries: [],
    });
  });

  it("returns 400 for an invalid part of speech", async () => {
    const request = new Request("http://localhost/api/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: "running", partOfSpeech: "particle" }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(runJapaneseLookup).not.toHaveBeenCalled();
    expect(generateLookupVariants).not.toHaveBeenCalled();
    expect(lemmatize.verb).not.toHaveBeenCalled();
    expect(json).toEqual({
      success: false,
    });
  });

  it("falls back to the original verb flow when the lemmatized lookup fully fails", async () => {
    vi.mocked(lemmatize.verb).mockReturnValue("run");

    vi.mocked(runJapaneseLookup)
      .mockResolvedValueOnce({
        word: "run",
        definition: null,
        fallbackEntries: [],
      })
      .mockResolvedValueOnce({
        word: "running",
        definition: "走っている",
        fallbackEntries: [],
      });

    vi.mocked(generateLookupVariants)
      .mockReturnValueOnce(["run"])
      .mockReturnValueOnce(["running", "runn", "run"]);

    const request = new Request("http://localhost/api/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: "running", partOfSpeech: "verb" }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(lemmatize.verb).toHaveBeenCalledWith("running");
    expect(generateLookupVariants).toHaveBeenCalledTimes(2);
    expect(generateLookupVariants).toHaveBeenNthCalledWith(1, "run");
    expect(generateLookupVariants).toHaveBeenNthCalledWith(2, "running");
    expect(runJapaneseLookup).toHaveBeenCalledTimes(2);
    expect(runJapaneseLookup).toHaveBeenNthCalledWith(1, "run");
    expect(runJapaneseLookup).toHaveBeenNthCalledWith(2, "running");
    expect(json).toEqual({
      success: true,
      originalWord: "running",
      lookupWord: "running",
      definition: "走っている",
      fallbackEntries: [],
    });
  });
});
