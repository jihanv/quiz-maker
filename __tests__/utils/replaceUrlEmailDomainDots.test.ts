import { replaceUrlEmailDomainDots } from "@/lib/utils";

describe("replaceUrlEmailDomainDots", () => {
  it("replaces dots in a bare domain", () => {
    expect(replaceUrlEmailDomainDots("Visit example.com today")).toBe(
      "Visit example<<URL_DOT>>com today"
    );
  });

  it("replaces dots in multi-part domains", () => {
    expect(replaceUrlEmailDomainDots("See foo.co.uk for details")).toBe(
      "See foo<<URL_DOT>>co<<URL_DOT>>uk for details"
    );
  });

  it("replaces dots in emails (including domain dots)", () => {
    expect(replaceUrlEmailDomainDots("Email me at name@example.com")).toBe(
      "Email me at name@example<<URL_DOT>>com"
    );
  });

  it("handles www.* domains", () => {
    expect(replaceUrlEmailDomainDots("Go to www.example.com now")).toBe(
      "Go to www<<URL_DOT>>example<<URL_DOT>>com now"
    );
  });

  it("handles full URLs and dots in path extensions", () => {
    expect(
      replaceUrlEmailDomainDots("Link: https://example.com/a/b/file.html")
    ).toBe("Link: https://example<<URL_DOT>>com/a/b/file<<URL_DOT>>html");
  });

  it("preserves trailing punctuation: period", () => {
    expect(replaceUrlEmailDomainDots("Visit example.com.")).toBe(
      "Visit example<<URL_DOT>>com."
    );
  });

  it("preserves trailing punctuation: close paren + comma", () => {
    expect(replaceUrlEmailDomainDots("See (example.com), ok")).toBe(
      "See (example<<URL_DOT>>com), ok"
    );
  });

  it("preserves trailing punctuation: quote", () => {
    expect(replaceUrlEmailDomainDots('He said "example.com".')).toBe(
      'He said "example<<URL_DOT>>com".'
    );
  });

  it("handles emails followed by punctuation", () => {
    expect(replaceUrlEmailDomainDots("Send to name@example.com, thanks")).toBe(
      "Send to name@example<<URL_DOT>>com, thanks"
    );
  });

  it("does not change text with no urls/emails/domains", () => {
    const input = "No links here. Just text.";
    expect(replaceUrlEmailDomainDots(input)).toBe(input);
  });
});
