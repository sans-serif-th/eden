import type { StepDefinition } from "../types";

export const TOTAL_STEPS = 7;

export const STEP_DEFINITIONS: StepDefinition[] = [
  {
    order: 1,
    slug: "prayer",
    title: "อธิษฐาน",
    kind: "template",
    buttonLabel: "พร้อมแล้ว",
  },
  {
    order: 2,
    slug: "memory-verse",
    title: "ภาวนาพระวจนะ",
    kind: "authored",
    buttonLabel: "ไปยังพระธรรม",
  },
  {
    order: 3,
    slug: "reading",
    title: "อ่านพระธรรม",
    kind: "authored",
    buttonLabel: "บันทึกคำตอบ",
  },
  {
    order: 4,
    slug: "understanding",
    title: "ทำความเข้าใจพระคัมภีร์",
    kind: "authored",
    buttonLabel: "ไปยังข้อคิด",
  },
  {
    order: 5,
    slug: "reflection",
    title: "ข้อคิดและการตอบสนอง",
    kind: "authored",
    buttonLabel: "ไปยังบันทึก",
  },
  {
    order: 6,
    slug: "journal",
    title: "บันทึก",
    kind: "template",
    buttonLabel: "บันทึกสิ่งที่ได้รับ",
  },
  {
    order: 7,
    slug: "closing-prayer",
    title: "อธิษฐานปิด",
    kind: "authored",
    buttonLabel: "เสร็จสิ้นวันนี้",
  },
];

export const TEMPLATE_COPY = {
  openingPrayerInstruction:
    "อธิษฐานสั้น ๆ ขอการทรงนำและความเข้าใจการเฝ้าเดี่ยววันนี้",
  journalPrompts: [
    {
      label: "ท่านได้บทเรียนอะไรบ้างในการเฝ้าเดี่ยววันนี้?",
      placeholder: "พิมพ์คำตอบของคุณ…",
    },
    {
      label: "พระเจ้าตรัสอะไรกับท่านบ้างในการเฝ้าเดี่ยววันนี้?",
      placeholder: "พิมพ์คำตอบของคุณ…",
    },
  ],
} as const;
