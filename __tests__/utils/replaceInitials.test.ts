import { replaceInitials } from "@/lib/utils";

describe("replaceInitials", () => {
  it("replaces spaced initials (J. K.) and preserves the single space gap", () => {
    const input = "J. K. Rowling wrote books.";
    const output = replaceInitials(input);

    expect(output).toBe("<<INITIALS:J-K|s>> Rowling wrote books.");
  });

  it("replaces tight initials (T.S.) with no gap", () => {
    const input = "T.S. Eliot was a poet.";
    const output = replaceInitials(input);

    expect(output).toBe("<<INITIALS:T-S|>> Eliot was a poet.");
  });

  it("replaces three initials and preserves mixed gaps", () => {
    const input = "A.  B.\tC. Person arrived.";
    const output = replaceInitials(input);

    // A.␠␠B.␉C.  -> gaps: "ss" and "t"
    expect(output).toBe("<<INITIALS:A-B-C|ss,t>> Person arrived.");
  });

  it("replaces multiple initials sequences in the same string", () => {
    const input = "J. K. Rowling met T.S. Eliot.";
    const output = replaceInitials(input);

    expect(output).toBe(
      "<<INITIALS:J-K|s>> Rowling met <<INITIALS:T-S|>> Eliot."
    );
  });

  it("does not replace a single initial (not a sequence)", () => {
    const input = "J. Rowling wrote books.";
    const output = replaceInitials(input);

    expect(output).toBe(input);
  });

  it("handles initials at the start of the string", () => {
    const input = "J. K. is an example.";
    const output = replaceInitials(input);

    expect(output).toBe("<<INITIALS:J-K|s>> is an example.");
  });

  it("handles initials at the end of the string", () => {
    const input = "This was written by J. K.";
    const output = replaceInitials(input);

    expect(output).toBe("This was written by <<INITIALS:J-K|s>>");
  });

  it("does not replace non-initial dot patterns", () => {
    const input = "Use example.com or config.json.";
    const output = replaceInitials(input);

    expect(output).toBe(input);
  });

  it("handles newlines between initials (lossless gap encoding)", () => {
    const input = "J.\nK. Rowling";
    const output = replaceInitials(input);

    // newline encoded as "n"
    expect(output).toBe("<<INITIALS:J-K|n>> Rowling");
  });

  it("is idempotent when called twice", () => {
    const input = "J. K. Rowling";
    const once = replaceInitials(input);
    const twice = replaceInitials(once);

    expect(once).toBe("<<INITIALS:J-K|s>> Rowling");
    expect(twice).toBe(once);
  });
});
