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
} from "docx";

export type MultipleChoiceData = {
  passage: string;
  questions: { choices: string[]; answer: number }[];
};

// const item: MultipleChoiceData = {
//   passage: `President Donald Trump says the US needs to "own" Greenland to prevent Russia and China from doing so.

// "Countries have to have ownership and you defend ownership, you don't defend [1]. And we'll have to defend Greenland," Trump told [2] on Friday, in response to a question from the BBC.

// We will do it "the easy way" or "the hard way", he added. The White House said recently the administration is considering buying the semi-autonomous territory of fellow Nato member Denmark, but it would not rule out the option of [3] it by force.

// Denmark and Greenland say the territory is not for sale. Denmark has said military action would [4] the end of the trans-Atlantic defence alliance.`,
//   questions: [
//     {
//       choices: ["heartbeats", "volatilities", "Chinese", "leases"],
//       answer: 3,
//     },
//     {
//       choices: ["professors", "reporters", "proprietorships", "reassessments"],
//       answer: 1,
//     },
//     {
//       choices: ["annexing", "stifling", "broiling", "dressing"],
//       answer: 0,
//     },
//     {
//       choices: ["spell", "bereaved", "unsung", "effeminate"],
//       answer: 0,
//     },
//   ],
// };

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

  // Title
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Export", bold: true, size: 24 })],
    })
  );
  children.push(new Paragraph(""));

  // Passage label
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Passage", bold: true, size: 24 })],
    })
  );

  // Passage paragraphs (split on blank lines)
  const passageParagraphs = item.passage
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/g);
  for (const p of passageParagraphs) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: p.trim(), size: 24 })],
      })
    );
    children.push(new Paragraph(""));
  }

  children.push(new Paragraph(""));

  // Questions heading
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Questions", bold: true, size: 24 })],
    })
  );

  // 4-column table
  const rows = item.questions.map((q, i) => {
    const cells = q.choices.map((choice, j) => {
      const letter = String.fromCharCode(97 + j); // a, b, c, d
      const prefix = j === 0 ? `${i + 1}. (${letter}) ` : `(${letter}) `;

      return new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            children: [new TextRun({ text: `${prefix}${choice}`, size: 24 })],
          }),
        ],
      });
    });

    return new TableRow({ children: cells });
  });

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows,
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
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
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
