import { normalizePassage, revertPassage } from "@/lib/utils";

describe("revertPassage", () => {
  it("restore a converted with abbreviations, acronyms, punctation clusters", () => {
    const input =
      "Dr. A. B. Smith, Ph.D., of the Univ. of Cal., presented his findings at the Int’l Conf. on Data Science (Vol. 3, No. 2).";

    const normalized = normalizePassage(input);
    expect(normalized).toBe(
      "Dr<<DOT>> <<INITIALS:A-B|s>> Smith, Ph<<DOT>>D<<DOT>>, of the Univ<<DOT>> of Cal<<DOT>>, presented his findings at the Int’l Conf<<DOT>> on Data Science (Vol<<DOT>> 3, No<<DOT>> 2)."
    );
    expect(revertPassage(normalized)).toBe(input);
  });

  it("restore a passage that had no change when normalized", () => {
    const input =
      "The people gathered at the conference, hosted by the London-based think tank the Royal United Services Institute (RUSI), were not warmongers; they were people in the know. Current and former members of the armed forces, government and NATO officials, researchers and defense industry professionals whose thinking is based on the widely accepted intelligence assessment that Russia is preparing for the possibility of a direct conflict with Europe.";

    const normalized = normalizePassage(input);
    expect(normalized).toBe(
      "The people gathered at the conference, hosted by the London-based think tank the Royal United Services Institute (RUSI), were not warmongers; they were people in the know. Current and former members of the armed forces, government and NATO officials, researchers and defense industry professionals whose thinking is based on the widely accepted intelligence assessment that Russia is preparing for the possibility of a direct conflict with Europe."
    );
    expect(revertPassage(normalized)).toBe(input);
  });

  it("restore a converted passage ellipses", () => {
    const input = "I told her to wait...because...";

    const normalized = normalizePassage(input);
    expect(normalized).toBe(
      "I told her to wait<<ELLIPSIS>>because<<ELLIPSIS>>"
    );
    expect(revertPassage(normalized)).toBe(input);
  });
});
