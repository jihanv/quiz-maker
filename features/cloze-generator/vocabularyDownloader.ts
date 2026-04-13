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
    ...entries.map((entry, i) => new Paragraph(`${i + 1}. ${entry.word}`)),
  ];
  const doc = new Document({ sections: [{ children }] });
}
