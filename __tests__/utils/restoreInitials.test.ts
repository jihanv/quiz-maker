import { restoreInitials } from "@/lib/utils";

describe("restoreInitials", () => {
  it("restores spaced initials (J. K.) from token form", () => {
    const input = "<<INITIALS:J-K|s>> Rowling wrote books.";
    const output = restoreInitials(input);

    expect(output).toBe("J. K. Rowling wrote books.");
  });

  it("restores tight initials (T.S.) from token form", () => {
    const input = "<<INITIALS:T-S|>> Eliot was a poet.";
    const output = restoreInitials(input);

    expect(output).toBe("T.S. Eliot was a poet.");
  });

  it("restores three initials with mixed gaps", () => {
    const input = "<<INITIALS:A-B-C|ss,t>> Person arrived.";
    const output = restoreInitials(input);

    expect(output).toBe("A.  B.\tC. Person arrived.");
  });

  it("restores multiple initials sequences in the same string", () => {
    const input = "<<INITIALS:J-K|s>> Rowling met <<INITIALS:T-S|>> Eliot.";
    const output = restoreInitials(input);

    expect(output).toBe("J. K. Rowling met T.S. Eliot.");
  });

  it("leaves single-initial text untouched", () => {
    const input = "J. Rowling wrote books.";
    const output = restoreInitials(input);

    expect(output).toBe(input);
  });

  it("restores initials at the start of the string", () => {
    const input = "<<INITIALS:J-K|s>> is an example.";
    const output = restoreInitials(input);

    expect(output).toBe("J. K. is an example.");
  });

  it("restores initials at the end of the string", () => {
    const input = "This was written by <<INITIALS:J-K|s>>";
    const output = restoreInitials(input);

    expect(output).toBe("This was written by J. K.");
  });

  it("does not modify unrelated tokens", () => {
    const input = "Use <<INITIALS_TOKEN>> or example.com.";
    const output = restoreInitials(input);

    expect(output).toBe(input);
  });

  it("restores initials with newline gaps", () => {
    const input = "<<INITIALS:J-K|n>> Rowling";
    const output = restoreInitials(input);

    expect(output).toBe("J.\nK. Rowling");
  });

  it("is idempotent when called twice", () => {
    const input = "<<INITIALS:J-K|s>> Rowling";
    const once = restoreInitials(input);
    const twice = restoreInitials(once);

    expect(once).toBe("J. K. Rowling");
    expect(twice).toBe("J. K. Rowling");
  });
});
