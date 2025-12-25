import { countSentences } from "@/lib/utils";

describe("countSentences", () => {
  it("counts sentences with Abbreviations correctly", () => {
    const input =
      "Dr. A. B. Smith, Ph.D., of the Univ. of Cal., presented his findings at the Int’l Conf. on Data Science (Vol. 3, No. 2).";

    const count = countSentences(input);

    expect(count).toBe(1);
  });

  it("counts sentences with nothing to be normalized correctly", () => {
    const input =
      "The people gathered at the conference, hosted by the London-based think tank the Royal United Services Institute (RUSI), were not warmongers; they were people in the know. Current and former members of the armed forces, government and NATO officials, researchers and defense industry professionals whose thinking is based on the widely accepted intelligence assessment that Russia is preparing for the possibility of a direct conflict with Europe.";

    const count = countSentences(input);

    expect(count).toBe(2);
  });

  it("counts sentences with ellipses correctly", () => {
    const input = "I told her to wait...because...";

    const count = countSentences(input);

    expect(count).toBe(1);
  });

  it("counts sentences with Roman numerals", () => {
    const input =
      "The report stated: “These results, while preliminary, suggest a strong upward trend… However, further validation is required.” Fig. 3(a) illustrates this clearly. In contrast, earlier work (e.g., Brown et al., 2018) showed a decline of −0.5%. As noted in Sec. IV.B, this discrepancy may be due to sampling bias.";

    const count = countSentences(input);

    expect(count).toBe(4);
  });

  it("counts sentences with nummbers with decimal places", () => {
    const input =
      "Job growth was at 3.2%, 5.4%, and 1.2% the last three months.";
    const count = countSentences(input);

    expect(count).toBe(1);
  });

  it("counts sentences with nummbers with decimal places in multiple sentences", () => {
    const input =
      "Job growth was at 3.2%, 5.4%, and 1.2% the last three months. However, it is not enough to reach the targeted 2.8% GDP growth for the quarter.";
    const count = countSentences(input);

    expect(count).toBe(2);
  });

  it("counts sentences with web domains and emails correctllu", () => {
    const input =
      "Additional details are available at https://www.example.org/research/ai.trends or by contacting the author at j.smith@example.edu. Seats are available until next month. Spots are limited, so make sure to bring mr. John.";
    const count = countSentences(input);

    expect(count).toBe(3);
  });
});
