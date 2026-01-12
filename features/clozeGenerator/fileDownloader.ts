import { toCircledNumber } from "@/lib/utils";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  TableBorders,
  convertInchesToTwip,
  LineRuleType,
  PageBreak,
} from "docx";
const LINE_1_5 = 480;

export type MultipleChoiceData = {
  passage: string;
  questions: { choices: string[]; answer: number }[];
};

const margins = 0.5;

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function downloadDocxFromItem(
  item: MultipleChoiceData,
  filename = "item.docx"
) {
  const children: Array<Paragraph | Table> = [];

  children.push(new Paragraph(""));

  // Passage label
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Read the following passage and choose the most appropriate word or phrase for each item (1 - ${item.questions.length}). `,
          bold: true,
          size: 24,
        }),
      ],
    })
  );

  children.push(new Paragraph(""));

  // Passage paragraphs (split on blank lines)
  const passageParagraphs = item.passage
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/g);
  for (const p of passageParagraphs) {
    children.push(
      new Paragraph({
        spacing: {
          line: 360, // 1.5 lines (see note below)
          lineRule: "auto",
        },
        children: [new TextRun({ text: p.trim(), size: 24 })],
      })
    );
    children.push(new Paragraph(""));
  }

  children.push(new Paragraph(""));

  // Questions heading
  children.push(new Paragraph(""));

  // 5-column table
  const rows = item.questions.map((q, i) => {
    // 1) First column: question number only (small)
    const numberCell = new TableCell({
      width: { size: 4, type: WidthType.PERCENTAGE }, // small column
      children: [
        new Paragraph({
          spacing: {
            line: LINE_1_5,
            lineRule: LineRuleType.AUTO,
          },
          children: [new TextRun({ text: `${i + 1}.`, size: 22 })],
        }),
      ],
    });

    // 2) Next 4 columns: choices (equal larger columns)
    const choiceCells = q.choices.map((choice, j) => {
      const letter = String.fromCharCode(97 + j); // a, b, c, d
      const prefix = `(${letter}) `;

      return new TableCell({
        width: { size: 24, type: WidthType.PERCENTAGE }, // 90% / 4
        children: [
          new Paragraph({
            spacing: {
              line: LINE_1_5,
              lineRule: LineRuleType.AUTO,
            },
            children: [new TextRun({ text: `${prefix}${choice}`, size: 22 })],
          }),
        ],
      });
    });

    // 3) Combine into 5 cells total
    return new TableRow({
      children: [numberCell, ...choiceCells],
    });
  });

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows,
      borders: TableBorders.NONE,
    })
  );

  children.push(new Paragraph({ children: [new PageBreak()] }));

  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Answer Key", bold: true, size: 24 })],
    })
  );
  children.push(new Paragraph(""));

  const keys = item.questions.map((q, i) => {
    // 1) First column: question number only (small)
    const numberCell = new TableCell({
      width: { size: 4, type: WidthType.PERCENTAGE }, // small column
      children: [
        new Paragraph({
          spacing: {
            line: LINE_1_5,
            lineRule: LineRuleType.AUTO,
          },
          children: [new TextRun({ text: toCircledNumber(i + 1), size: 22 })],
        }),
      ],
    });

    // Second Column Correct Answer
    const correct = `(${String.fromCharCode(97 + q.answer)})  ${
      q.choices[q.answer]
    }`;

    const ans = new TableCell({
      width: { size: 30, type: WidthType.PERCENTAGE }, // 90% / 4
      children: [
        new Paragraph({
          spacing: {
            line: LINE_1_5,
            lineRule: LineRuleType.AUTO,
          },
          children: [new TextRun({ text: correct, size: 22 })],
        }),
      ],
    });
    // 3) Combine into 5 cells total
    return new TableRow({
      children: [numberCell, ans],
    });
  });

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: keys,
      borders: TableBorders.NONE,
    })
  );
  // A4 + margins (same as you learned)
  const mmToInches = (mm: number) => mm / 25.4;

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: convertInchesToTwip(mmToInches(210)),
              height: convertInchesToTwip(mmToInches(297)),
            },
            margin: {
              top: convertInchesToTwip(margins),
              bottom: convertInchesToTwip(margins),
              left: convertInchesToTwip(margins),
              right: convertInchesToTwip(margins),
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, filename);
}
