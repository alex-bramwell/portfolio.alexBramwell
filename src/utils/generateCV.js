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
  ShadingType,
} from "docx";

const ACCENT = "4A7C00";
const DARK = "222222";
const MID = "555555";
const LIGHT = "888888";
const RULE = "CCCCCC";

function sectionHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 160 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: RULE },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: "Calibri",
        size: 22,
        bold: true,
        color: ACCENT,
        characterSpacing: 80,
      }),
    ],
  });
}

function bulletItem(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [
      new TextRun({ text, font: "Calibri", size: 20, color: MID }),
    ],
  });
}

function spacer(height = 120) {
  return new Paragraph({ spacing: { after: height }, children: [] });
}

export async function generateCV(resume) {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22, color: DARK },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: "bullet-list",
          levels: [
            {
              level: 0,
              format: "bullet",
              text: "\u2022",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 360, hanging: 180 },
                },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 680, bottom: 680, left: 760, right: 760 },
          },
        },
        children: [
          // ─── HEADER ───
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: resume.basics.name,
                font: "Calibri",
                size: 44,
                bold: true,
                color: DARK,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: resume.basics.label,
                font: "Calibri",
                size: 26,
                color: ACCENT,
              }),
            ],
          }),

          // Contact details
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({ text: resume.basics.email, font: "Calibri", size: 18, color: MID }),
              new TextRun({ text: "   \u00B7   ", font: "Calibri", size: 18, color: RULE }),
              new TextRun({ text: resume.basics.phone, font: "Calibri", size: 18, color: MID }),
              new TextRun({ text: "   \u00B7   ", font: "Calibri", size: 18, color: RULE }),
              new TextRun({ text: resume.basics.location.region + ", " + resume.basics.location.countryCode, font: "Calibri", size: 18, color: MID }),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: resume.basics.profiles.flatMap((p, i) => {
              const parts = [];
              if (i > 0) parts.push(new TextRun({ text: "   \u00B7   ", font: "Calibri", size: 18, color: RULE }));
              parts.push(new TextRun({ text: p.network + ": ", font: "Calibri", size: 18, bold: true, color: MID }));
              parts.push(new TextRun({ text: p.url, font: "Calibri", size: 18, color: ACCENT }));
              return parts;
            }),
          }),

          // Divider
          new Paragraph({
            spacing: { after: 80 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: ACCENT } },
            children: [],
          }),

          // ─── ABOUT ───
          sectionHeading("About"),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: resume.basics.about || resume.basics.summary,
                font: "Calibri",
                size: 21,
                color: MID,
              }),
            ],
          }),

          // Key strengths
          new Paragraph({
            spacing: { before: 120, after: 80 },
            children: [
              new TextRun({ text: "Key strengths:", font: "Calibri", size: 19, bold: true, color: DARK }),
            ],
          }),
          ...(resume.basics.strengths || []).map((s) => {
            const colonIdx = s.indexOf(":");
            if (colonIdx === -1) return bulletItem(s);
            return new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 80 },
              children: [
                new TextRun({ text: s.substring(0, colonIdx + 1), font: "Calibri", size: 20, bold: true, color: DARK }),
                new TextRun({ text: s.substring(colonIdx + 1), font: "Calibri", size: 20, color: MID }),
              ],
            });
          }),

          spacer(80),

          // ─── EXPERIENCE ───
          sectionHeading("Experience"),
          ...resume.work.flatMap((job) => [
            // Company + date row
            new Paragraph({
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
              spacing: { before: 280, after: 40 },
              children: [
                new TextRun({ text: job.company, font: "Calibri", size: 24, bold: true, color: DARK }),
                new TextRun({ text: "\t", font: "Calibri" }),
                new TextRun({ text: job.startDate + " \u2013 " + job.endDate, font: "Calibri", size: 20, color: LIGHT }),
              ],
            }),
            // Job title
            new Paragraph({
              spacing: { after: 80 },
              children: [
                new TextRun({ text: job.position, font: "Calibri", size: 21, italics: true, color: ACCENT }),
              ],
            }),
            // Role summary
            new Paragraph({
              spacing: { after: 120 },
              children: [
                new TextRun({ text: job.summary, font: "Calibri", size: 20, color: MID }),
              ],
            }),
            // Key achievements label
            new Paragraph({
              spacing: { after: 60 },
              children: [
                new TextRun({ text: "Key contributions:", font: "Calibri", size: 19, bold: true, color: DARK }),
              ],
            }),
            // Bullet points
            ...job.highlights.map((h) => bulletItem(h)),
          ]),

          spacer(200),

          // ─── SKILLS ───
          sectionHeading("Skills"),
          ...resume.skills.flatMap((cat) => [
            new Paragraph({
              spacing: { before: 160, after: 80 },
              children: [
                new TextRun({ text: cat.name, font: "Calibri", size: 21, bold: true, color: DARK }),
              ],
            }),
            new Paragraph({
              spacing: { after: 120 },
              children: [
                new TextRun({ text: cat.keywords.join("  \u00B7  "), font: "Calibri", size: 20, color: MID }),
              ],
            }),
          ]),

          spacer(200),

          // ─── PROJECTS ───
          sectionHeading("Selected Projects"),
          ...resume.projects.flatMap((proj) => [
            new Paragraph({
              spacing: { before: 200, after: 40 },
              children: [
                new TextRun({ text: proj.name, font: "Calibri", size: 22, bold: true, color: DARK }),
                ...(proj.url
                  ? [
                      new TextRun({ text: "  \u2014  ", font: "Calibri", size: 18, color: RULE }),
                      new TextRun({ text: proj.url, font: "Calibri", size: 18, color: ACCENT }),
                    ]
                  : []),
              ],
            }),
            new Paragraph({
              spacing: { after: 60 },
              children: [
                new TextRun({ text: proj.description, font: "Calibri", size: 20, color: MID }),
              ],
            }),
            new Paragraph({
              spacing: { after: 160 },
              children: [
                new TextRun({ text: "Tech: ", font: "Calibri", size: 18, bold: true, color: DARK }),
                new TextRun({ text: proj.keywords.join(", "), font: "Calibri", size: 18, color: LIGHT }),
              ],
            }),
          ]),

          spacer(200),

          // ─── EDUCATION ───
          sectionHeading("Education"),
          new Paragraph({
            spacing: { before: 160, after: 40 },
            children: [
              new TextRun({ text: resume.education[0].institution, font: "Calibri", size: 22, bold: true, color: DARK }),
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
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
