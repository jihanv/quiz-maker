import {
  protectPunctuationClusters,
  restorePunctuationClusters,
} from "@/lib/utils";

describe("restorePunctuationClusters", () => {
  it("restores a single protected cluster dot", () => {
    expect(restorePunctuationClusters("Cal<<DOT>>, ")).toBe("Cal., ");
  });

  it("restores multiple protected cluster dots in one string", () => {
    expect(
      restorePunctuationClusters(
        "Cal<<DOT>>, Inc<<DOT>>; (Ltd<<DOT>>) Ref<<DOT>>] X<<DOT>>}"
      )
    ).toBe("Cal., Inc.; (Ltd.) Ref.] X.}");
  });

  it("is a no-op when there are no <<DOT>> tokens", () => {
    expect(restorePunctuationClusters("Hello world. Next")).toBe(
      "Hello world. Next"
    );
  });

  it("round-trips with protectPunctuationClusters for common cases", () => {
    const input = "Cal., Inc.; (Ltd.) Ref.] X.} Done.";
    const protectedText = protectPunctuationClusters(input);
    const restored = restorePunctuationClusters(protectedText);
    expect(restored).toBe(input);
  });

  it("restores tokens even if they appear consecutively", () => {
    expect(restorePunctuationClusters("<<DOT>><<DOT>>")).toBe("..");
  });

  it("restores inside larger text without affecting other content", () => {
    expect(
      restorePunctuationClusters("A<<DOT>>, B<<DOT>>; C<<DOT>>) end")
    ).toBe("A., B.; C.) end");
  });
});
