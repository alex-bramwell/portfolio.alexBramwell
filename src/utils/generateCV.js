import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  TabStopPosition,
  TabStopType,
} from "docx";

const ACCENT = "4A7C00";

function sectionHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: "Calibri",
        size: 22,
        bold: true,
        color: ACCENT,
      }),
    ],
  });
}

function bulletItem(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [
      new TextRun({ text, font: "Calibri", size: 20 }),
    ],
  });
}

export async function generateCV(resume) {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children: [
          // Name
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: resume.basics.name,
                font: "Calibri",
                size: 40,
                bold: true,
                color: "222222",
              }),
            ],
          }),
          // Title
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: resume.basics.label,
                font: "Calibri",
                size: 24,
                color: ACCENT,
              }),
            ],
          }),
          // Contact row
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({ text: resume.basics.email, font: "Calibri", size: 18, color: "555555" }),
              new TextRun({ text: "  |  ", font: "Calibri", size: 18, color: "AAAAAA" }),
              new TextRun({ text: resume.basics.phone, font: "Calibri", size: 18, color: "555555" }),
              new TextRun({ text: "  |  ", font: "Calibri", size: 18, color: "AAAAAA" }),
              new TextRun({ text: resume.basics.location.region + ", " + resume.basics.location.countryCode, font: "Calibri", size: 18, color: "555555" }),
            ],
          }),
          // Links row
          new Paragraph({
            spacing: { after: 200 },
            children: resume.basics.profiles.flatMap((p, i) => {
              const parts = [];
              if (i > 0) parts.push(new TextRun({ text: "  |  ", font: "Calibri", size: 18, color: "AAAAAA" }));
              parts.push(new TextRun({ text: p.url, font: "Calibri", size: 18, color: ACCENT }));
              return parts;
            }),
          }),

          // Summary
          sectionHeading("Summary"),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: resume.basics.summary, font: "Calibri", size: 20 }),
            ],
          }),

          // Experience
          sectionHeading("Experience"),
          ...resume.work.flatMap((job) => [
            new Paragraph({
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
              spacing: { before: 200, after: 40 },
              children: [
                new TextRun({ text: job.company, font: "Calibri", size: 22, bold: true }),
                new TextRun({ text: "\t", font: "Calibri" }),
                new TextRun({ text: job.startDate + " - " + job.endDate, font: "Calibri", size: 20, color: "777777" }),
              ],
            }),
            new Paragraph({
              spacing: { after: 80 },
              children: [
                new TextRun({ text: job.position, font: "Calibri", size: 20, italics: true, color: ACCENT }),
              ],
            }),
            ...job.highlights.map((h) => bulletItem(h)),
          ]),

          // Education
          sectionHeading("Education"),
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({ text: resume.education[0].institution, font: "Calibri", size: 22, bold: true }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: resume.education[0].studyType + " " + resume.education[0].area,
                font: "Calibri",
                size: 20,
                italics: true,
                color: ACCENT,
              }),
            ],
          }),

          // Skills
          sectionHeading("Skills"),
          ...resume.skills.map(
            (cat) =>
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({ text: cat.name + ": ", font: "Calibri", size: 20, bold: true }),
                  new TextRun({ text: cat.keywords.join(", "), font: "Calibri", size: 20 }),
                ],
              })
          ),

          // Projects
          sectionHeading("Projects"),
          ...resume.projects.flatMap((proj) => [
            new Paragraph({
              spacing: { before: 160, after: 40 },
              children: [
                new TextRun({ text: proj.name, font: "Calibri", size: 22, bold: true }),
                ...(proj.url
                  ? [
                      new TextRun({ text: "  ", font: "Calibri" }),
                      new TextRun({ text: proj.url, font: "Calibri", size: 18, color: ACCENT }),
                    ]
                  : []),
              ],
            }),
            new Paragraph({
              spacing: { after: 60 },
              children: [
                new TextRun({ text: proj.description, font: "Calibri", size: 20 }),
              ],
            }),
            new Paragraph({
              spacing: { after: 120 },
              children: [
                new TextRun({ text: proj.keywords.join(", "), font: "Calibri", size: 18, italics: true, color: "777777" }),
              ],
            }),
          ]),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
