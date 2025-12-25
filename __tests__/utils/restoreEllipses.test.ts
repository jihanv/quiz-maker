import { replaceEllipses, restoreEllipses } from "@/lib/utils";

describe("restoreEllipses", () => {
  it("restores <<ELLIPSIS>> tokens to three dots", () => {
    const input = "Wait<<ELLIPSIS>> what?";
    expect(restoreEllipses(input)).toBe("Wait... what?");
  });

  it("round-trip: replaceEllipses then restoreEllipses yields normalized dots", () => {
    const input = "A… B.... C.....";
    const roundTrip = restoreEllipses(replaceEllipses(input));
    // unicode ellipsis becomes "..." after normalization; dot runs become "..."
    expect(roundTrip).toBe("A... B... C...");
  });

  it("restoring a string without tokens returns it unchanged", () => {
    const input = "Hello... world"; // note: actual dots, not token
    expect(restoreEllipses(input)).toBe(input);
  });
  it("restores multiple tokens in the same string", () => {
    const input = "<<ELLIPSIS>>Hello<<ELLIPSIS>>World<<ELLIPSIS>>";
    expect(restoreEllipses(input)).toBe("...Hello...World...");
  });

  it("handles adjacent ellipsis tokens correctly", () => {
    const input = "<<ELLIPSIS>><<ELLIPSIS>>";
    expect(restoreEllipses(input)).toBe("......");
  });

  it("does not affect text without ellipsis tokens", () => {
    const input = "No ellipsis here.";
    expect(restoreEllipses(input)).toBe("No ellipsis here.");
  });

  it("preserves surrounding punctuation", () => {
    const input = `"Wait<<ELLIPSIS>>!"`;
    expect(restoreEllipses(input)).toBe('"Wait...!"');
  });

  it("handles ellipsis tokens at string boundaries", () => {
    expect(restoreEllipses("<<ELLIPSIS>>Start")).toBe("...Start");
    expect(restoreEllipses("End<<ELLIPSIS>>")).toBe("End...");
  });

  it("handles multiline strings correctly", () => {
    const input = `First line<<ELLIPSIS>>
Second line<<ELLIPSIS>>`;
    const expected = `First line...
Second line...`;
    expect(restoreEllipses(input)).toBe(expected);
  });
});
