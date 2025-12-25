import { protectPunctuationClusters } from "@/lib/utils";

describe("protectPunctuationClusters", () => {
  it('protects period before comma: "Cal.,"', () => {
    expect(protectPunctuationClusters("Cal., ")).toBe("Cal<<DOT>>, ");
  });

  it("protects period before semicolon", () => {
    expect(protectPunctuationClusters("Inc.; next")).toBe("Inc<<DOT>>; next");
  });

  it("protects period before colon", () => {
    expect(protectPunctuationClusters("See Sec.: IV")).toBe(
      "See Sec<<DOT>>: IV"
    );
  });

  it("protects period before closing parenthesis", () => {
    expect(protectPunctuationClusters("(Ltd.)")).toBe("(Ltd<<DOT>>)");
  });

  it("protects period before closing bracket", () => {
    expect(protectPunctuationClusters("Ref.]")).toBe("Ref<<DOT>>]");
  });

  it("protects period before closing brace", () => {
    expect(protectPunctuationClusters("X.}")).toBe("X<<DOT>>}");
  });

  it("does not change decimals (digit-dot-digit)", () => {
    expect(protectPunctuationClusters("Value is 3.14, ok.")).toBe(
      "Value is 3.14, ok."
    );
  });

  it("does not change plain sentence-ending period", () => {
    expect(protectPunctuationClusters("Hello world. Next")).toBe(
      "Hello world. Next"
    );
  });

  it("handles multiple clusters in the same string", () => {
    expect(protectPunctuationClusters("Cal., Inc.; (Ltd.) Ref.] Done.")).toBe(
      "Cal<<DOT>>, Inc<<DOT>>; (Ltd<<DOT>>) Ref<<DOT>>] Done."
    );
  });

  it("handles quotes around cluster when punctuation is inside the quotes", () => {
    // Only period directly followed by one of the cluster chars is protected.
    // Here the period is followed by a quote, so this function should not touch it.
    expect(protectPunctuationClusters('He said "Cal.," and left.')).toBe(
      'He said "Cal<<DOT>>," and left.'
    );
  });
});
