import type { MultipleChoiceData } from "./fileDownloader";
import type { VocabularyDictionaryEntry } from "@/lib/types";
import {
  AlignmentType,
  Document,
  LevelFormat,
  LevelSuffix,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

export function getCorrectAnswerWords(item: MultipleChoiceData) {
  return item.questions.map((q) => q.choices[q.answer]);
}

export function getAllChoiceWords(item: MultipleChoiceData) {
  return item.questions.flatMap((q) => q.choices);
}

export function getAlphabetizedChoiceWords(item: MultipleChoiceData) {
  return [...getAllChoiceWords(item)].sort((a, b) => a.localeCompare(b));
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  });
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function downloadVocabularyDictionaryDocx(
  entries: VocabularyDictionaryEntry[],
  filename = "vocabulary-dictionary.docx",
) {
  const children = [
    new Paragraph({
      children: [new TextRun({ text: "Vocabulary Dictionary", bold: true })],
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...entries.flatMap((entry, i) => {
      const fallbackDefinitions = entry.fallbackEntries[0]?.definitions ?? [];
      const apiDefinitions =
        entry.definition
          ?.split("/")
          .map((d) => d.trim())
          .filter(Boolean) ?? [];
      if (apiDefinitions.length > 1)
        return [
          new Paragraph({
            numbering: { reference: "vocab-numbering", level: 0 },
            children: [new TextRun(`${entry.word}:`)],
          }),
          ...apiDefinitions.map(
            (d, j) =>
              new Paragraph({
                indent: { left: 720, hanging: 360 },
                children: [new TextRun(`(${j + 1}) ${d}`)],
              }),
          ),
        ];
      if (fallbackDefinitions.length > 1)
        return [
          new Paragraph({
            numbering: { reference: "vocab-numbering", level: 0 },
            children: [new TextRun(`${entry.word}:`)],
          }),
          ...fallbackDefinitions.map(
            (d, j) =>
              new Paragraph({
                indent: { left: 720, hanging: 360 },
                children: [new TextRun(`(${j + 1}) ${d}`)],
              }),
          ),
        ];
      if (entry.definition)
        return [
          new Paragraph({
            numbering: { reference: "vocab-numbering", level: 0 },
            children: [new TextRun(`${entry.word}: ${entry.definition}`)],
          }),
        ];
      return [
        new Paragraph({
          numbering: { reference: "vocab-numbering", level: 0 },
          children: [
            new TextRun(
              `${entry.word}:${entry.fallbackEntries[0]?.summary ?? "No definition available"}`,
            ),
          ],
        }),
      ];
    }),
  ];
  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "vocab-numbering",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              suffix: LevelSuffix.SPACE,
              alignment: AlignmentType.LEFT,
            },
          ],
        },
      ],
    },
    sections: [{ children }],
  });
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, filename);
}
