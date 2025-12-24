import { restoreQuotedEndings } from "@/lib/utils";

describe("removeAbbreviations", () => {
  it('restores <<SWITCH PERIOD>>. to ." inside quotes', () => {
    const input = 'She said "Hello<<SWITCH PERIOD>>.';
    const result = restoreQuotedEndings(input);

    expect(result).toBe('She said "Hello."');
  });

  it('restores <<SWITCH QU>>? to ?" inside quotes', () => {
    const input = 'She said "Why<<SWITCH QU>>?';
    const result = restoreQuotedEndings(input);

    expect(result).toBe('She said "Why?"');
  });

  it('restores <<SWITCH EX>>! to !" inside quotes', () => {
    const input = 'She said "Why<<SWITCH EX>>!';
    const result = restoreQuotedEndings(input);

    expect(result).toBe('She said "Why!"');
  });

  it("handles multiple restored quoted sentences in one string", () => {
    const input =
      'She said "Hello<<SWITCH PERIOD>>. Then he replied "Goodbye<<SWITCH PERIOD>>.';
    const result = restoreQuotedEndings(input);

    expect(result).toBe('She said "Hello." Then he replied "Goodbye."');
  });

  it("handles mixed restored punctuation in the same string", () => {
    const input =
      'She said "Hello<<SWITCH PERIOD>>. He shouted "Stop<<SWITCH EX>>!';
    const result = restoreQuotedEndings(input);

    expect(result).toBe('She said "Hello." He shouted "Stop!"');
  });

  it("does not modify text without switch markers", () => {
    const input = 'She said "Hello", then left.';
    const result = restoreQuotedEndings(input);

    expect(result).toBe('She said "Hello", then left.');
  });

  it("handles restored quoted text when another quote appears later in the sentence", () => {
    const input =
      'She said "Hello<<SWITCH PERIOD>>. Then she added "Really<<SWITCH QU>>? and left.';
    const result = restoreQuotedEndings(input);

    expect(result).toBe('She said "Hello." Then she added "Really?" and left.');
  });
});
