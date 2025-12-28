type MultipleChoiceSection = {
  order: number;
  sectionText: string;
  difficultWord: string | null;
  difficultWordTokenIndex: number | null;
  difficultWordSpan: { start: number; end: number } | null;
};

export function pickDifficultWord(
  passageSections: string[]
): MultipleChoiceSection[] {
  const object = passageSections.map((sectionText, i) => ({
    order: i + 1,
    sectionText,
    difficultWord: null,
    difficultWordTokenIndex: null,
    difficultWordSpan: null,
  }));
  console.log(object);
  return object;
}
