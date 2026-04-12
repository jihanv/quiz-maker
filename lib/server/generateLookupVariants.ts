export function generateLookupVariants(word: string): string[] {
  const lowerWord = word.toLowerCase().trim();
  const variants = new Set<string>();

  if (!lowerWord) return [];

  variants.add(lowerWord);

  if (lowerWord.endsWith("ies") && lowerWord.length > 3) {
    variants.add(lowerWord.slice(0, -3) + "y");
  }

  if (lowerWord.endsWith("ves") && lowerWord.length > 3) {
    variants.add(lowerWord.slice(0, -3) + "f");
    variants.add(lowerWord.slice(0, -3) + "fe");
  }

  if (lowerWord.endsWith("ied") && lowerWord.length > 3) {
    variants.add(lowerWord.slice(0, -3) + "y");
  }

  if (lowerWord.endsWith("ed") && lowerWord.length > 2) {
    variants.add(lowerWord.slice(0, -2));
    variants.add(lowerWord.slice(0, -1));
  }

  if (lowerWord.endsWith("es") && lowerWord.length > 2) {
    variants.add(lowerWord.slice(0, -2));
  }

  if (lowerWord.endsWith("s") && lowerWord.length > 1) {
    variants.add(lowerWord.slice(0, -1));
  }

  return Array.from(variants);
}
