import type { MultipleChoiceData } from "./fileDownloader";
import type { VocabularyDictionaryEntry } from "@/lib/types";
import { Document, Packer, Paragraph, TextRun } from "docx";

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
    ...entries.flatMap((entry, i) => {
      const fallbackDefinitions = entry.fallbackEntries[0]?.definitions ?? [];
      if (entry.definition)
        return [new Paragraph(`${i + 1}. ${entry.word}: ${entry.definition}`)];
      if (fallbackDefinitions.length === 1) {
        return [
          new Paragraph({
            children: [
              new TextRun(`${i + 1}. `),
              new TextRun(`${entry.word}: `),
              new TextRun(fallbackDefinitions[0]),
            ],
          }),
        ];
      }
      if (fallbackDefinitions.length > 1)
        return [
          new Paragraph(`${i + 1}. ${entry.word}:`),
          ...fallbackDefinitions.map(
            (d, j) => new Paragraph(`   ${j + 1}. ${d}`),
          ),
        ];
      return [
        new Paragraph(
          `${i + 1}. ${entry.word}: ${entry.fallbackEntries[0]?.summary ?? "No definition available"}`,
        ),
      ];
    }),
  ];
  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, filename);
}
