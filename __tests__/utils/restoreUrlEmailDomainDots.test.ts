import {
  replaceUrlEmailDomainDots,
  restoreUrlEmailDomainDots,
} from "@/lib/utils";

describe("restoreUrlEmailDomainDots", () => {
  it("restores dots in a bare domain", () => {
    expect(restoreUrlEmailDomainDots("example<<URL_DOT>>com")).toBe(
      "example.com"
    );
  });

  it("restores dots in multi-part domains", () => {
    expect(restoreUrlEmailDomainDots("foo<<URL_DOT>>co<<URL_DOT>>uk")).toBe(
      "foo.co.uk"
    );
  });

  it("restores dots in emails", () => {
    expect(restoreUrlEmailDomainDots("name@example<<URL_DOT>>com")).toBe(
      "name@example.com"
    );
  });

  it("restores dots in full URLs including path dots", () => {
    expect(
      restoreUrlEmailDomainDots(
        "https://example<<URL_DOT>>com/file<<URL_DOT>>html"
      )
    ).toBe("https://example.com/file.html");
  });

  it("preserves surrounding punctuation while restoring", () => {
    expect(restoreUrlEmailDomainDots('"example<<URL_DOT>>com".')).toBe(
      '"example.com".'
    );
  });

  it("round-trips: restore(replace(x)) yields original for typical cases", () => {
    const input =
      "Try https://example.com/a/file.html, or email name@example.co.uk).";
    expect(restoreUrlEmailDomainDots(replaceUrlEmailDomainDots(input))).toBe(
      input
    );
  });

  it("does not alter text without tokens", () => {
    const input = "Nothing to restore.";
    expect(restoreUrlEmailDomainDots(input)).toBe(input);
  });
});
