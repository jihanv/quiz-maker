import { switchQuotedEndings } from "@/lib/utils";

describe("removeAbbreviations", () => {
  it('replaces ." inside quotes with <<SWITCH PERIOD>> and removes the quote', () => {
    const input = 'She said "Hello."';
    const result = switchQuotedEndings(input);

    expect(result).toBe('She said "Hello<<SWITCH PERIOD>>.');
  });

  it('replaces ?" inside quotes with <<SWITCH PERIOD>> and removes the quote', () => {
    const input = 'She said "Why?"';
    const result = switchQuotedEndings(input);

    expect(result).toBe('She said "Why<<SWITCH QU>>?');
  });

  it('replaces !" inside quotes with <<SWITCH PERIOD>> and removes the quote', () => {
    const input = 'She said "Why!"';
    const result = switchQuotedEndings(input);

    expect(result).toBe('She said "Why<<SWITCH EX>>!');
  });

  it("handles multiple quoted sentences in one string", () => {
    const input = 'She said "Hello." Then he replied "Goodbye."';
    const result = switchQuotedEndings(input);

    expect(result).toBe(
      'She said "Hello<<SWITCH PERIOD>>. Then he replied "Goodbye<<SWITCH PERIOD>>.'
    );
  });

  it('handles mixed punctuation (." and !") in the same string', () => {
    const input = 'She said "Hello." He shouted "Stop!"';
    const result = switchQuotedEndings(input);

    expect(result).toBe(
      'She said "Hello<<SWITCH PERIOD>>. He shouted "Stop<<SWITCH EX>>!'
    );
  });
  it("does not replace punctuation in quotes when it is not a quoted sentence ending", () => {
    const input = 'She said "Hello", then left.';
    const result = switchQuotedEndings(input);

    expect(result).toBe('She said "Hello", then left.');
  });

  it("handles quoted text when another quote appears later in the sentence", () => {
    const input = 'She said "Hello." Then she added "Really?" and left.';
    const result = switchQuotedEndings(input);

    expect(result).toBe(
      'She said "Hello<<SWITCH PERIOD>>. Then she added "Really<<SWITCH QU>>? and left.'
    );
  });
});
