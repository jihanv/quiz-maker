import { generateLookupVariants } from "@/lib/server/generateLookupVariants";
describe("generateLookupVariants", () => {
  it("includes the cleaned lowercase word", () => {
    expect(generateLookupVariants(" Dogs ")).toContain("dogs");
  });

  it("adds a simple singular variant for trailing s", () => {
    expect(generateLookupVariants("dogs")).toContain("dog");
  });

  it("adds an ies to y variant", () => {
    expect(generateLookupVariants("studies")).toContain("study");
  });

  it("adds ves variants", () => {
    const variants = generateLookupVariants("wolves");

    expect(variants).toContain("wolf");
    expect(variants).toContain("wolfe");
  });

  it("adds an ied to y variant", () => {
    expect(generateLookupVariants("studied")).toContain("study");
  });

  it("adds an ing to e variant", () => {
    expect(generateLookupVariants("making")).toContain("make");
  });

  it("adds a generic ed variant that restores trailing e when needed", () => {
    expect(generateLookupVariants("closed")).toContain("close");
  });

  it("adds a generic ed variant that removes ed when needed", () => {
    expect(generateLookupVariants("worked")).toContain("work");
  });
});
