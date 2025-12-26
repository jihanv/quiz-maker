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

  it("restore a converted passage that had no change when normalized", () => {
    const input =
      "The people gathered at the conference, hosted by the London-based think tank the Royal United Services Institute (RUSI), were not warmongers; they were people in the know. Current and former members of the armed forces, government and NATO officials, researchers and defense industry professionals whose thinking is based on the widely accepted intelligence assessment that Russia is preparing for the possibility of a direct conflict with Europe.";

    const normalized = normalizePassage(input);
    expect(normalized).toBe(
      "The people gathered at the conference, hosted by the London-based think tank the Royal United Services Institute (RUSI), were not warmongers; they were people in the know. Current and former members of the armed forces, government and NATO officials, researchers and defense industry professionals whose thinking is based on the widely accepted intelligence assessment that Russia is preparing for the possibility of a direct conflict with Europe."
    );
    expect(revertPassage(normalized)).toBe(input);
  });

  it("restore a converted passage with ellipses", () => {
    const input = "I told her to wait...because...";

    const normalized = normalizePassage(input);
    expect(normalized).toBe(
      "I told her to wait<<ELLIPSIS>>because<<ELLIPSIS>>"
    );
    expect(revertPassage(normalized)).toBe(input);
  });

  it("restores a converted passage with roman numerals", () => {
    const input =
      "The report stated: “These results, while preliminary, suggest a strong upward trend... However, further validation is required.” Fig. 3(a) illustrates this clearly. In contrast, earlier work (e.g., Brown et al., 2018) showed a decline of −0.5%. As noted in Sec. IV.B, this discrepancy may be due to sampling bias.";

    const normalized = normalizePassage(input);
    expect(normalized).toBe(
      "The report stated: “These results, while preliminary, suggest a strong upward trend<<ELLIPSIS>> However, further validation is required.” Fig<<DOT>> 3(a) illustrates this clearly. In contrast, earlier work (e<<DOT>>g<<DOT>>, Brown et al<<DOT>>, 2018) showed a decline of −0<<NUM_DOT>>5%. As noted in Sec<<DOT>> IV<<SEC_DOT>>B, this discrepancy may be due to sampling bias."
    );
    expect(revertPassage(normalized)).toBe(input);
  });
});
