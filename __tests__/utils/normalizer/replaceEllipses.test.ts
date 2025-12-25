import { replaceEllipses } from "@/lib/utils";

describe("replaceEllipses", () => {
  it("returns input unchanged when there are no ellipses", () => {
    const input = "Hello. World!";
    expect(replaceEllipses(input)).toBe(input);
  });

  it("replaces exactly three dots with <<ELLIPSIS>>", () => {
    const input = "Wait... what?";
    expect(replaceEllipses(input)).toBe("Wait<<ELLIPSIS>> what?");
  });

  it("replaces runs longer than three dots with a single <<ELLIPSIS>>", () => {
    const input = "Wait.... really.....";
    expect(replaceEllipses(input)).toBe("Wait<<ELLIPSIS>> really<<ELLIPSIS>>");
  });

  it("normalizes unicode ellipsis (… U+2026) to <<ELLIPSIS>>", () => {
    const input = "Wait… what?";
    expect(replaceEllipses(input)).toBe("Wait<<ELLIPSIS>> what?");
  });

  it("handles multiple ellipses in the same string", () => {
    const input = "Well... maybe... not… sure....";
    expect(replaceEllipses(input)).toBe(
      "Well<<ELLIPSIS>> maybe<<ELLIPSIS>> not<<ELLIPSIS>> sure<<ELLIPSIS>>"
    );
  });

  it("preserves surrounding punctuation and whitespace", () => {
    const input = `He said: "Wait..."  Then left…`;
    expect(replaceEllipses(input)).toBe(
      `He said: "Wait<<ELLIPSIS>>"  Then left<<ELLIPSIS>>`
    );
  });

  it("replaces ellipses at the start and end of a string", () => {
    expect(replaceEllipses("...Hello")).toBe("<<ELLIPSIS>>Hello");
    expect(replaceEllipses("Goodbye...")).toBe("Goodbye<<ELLIPSIS>>");
  });

  it("does not replace single or double dots", () => {
    expect(replaceEllipses("No.. not yet.")).toBe("No.. not yet.");
    expect(replaceEllipses("Just one.")).toBe("Just one.");
  });
});
