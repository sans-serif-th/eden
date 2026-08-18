import type { LessonStep } from "../types";

export const TOTAL_STEPS = 8;

export const lessonSteps: LessonStep[] = [
  {
    order: 1,
    slug: "prayer",
    title: "อธิษฐาน",
    contentLabel: "อธิษฐาน",
    contentTitle: "เนื้อหาจากคู่มือ",
    contentBody: "แสดงข้อความสำหรับขั้นนี้จากคู่มือที่เผยแพร่แล้ว",
    helperText: "เมื่อพร้อมแล้ว เลื่อนไปยังขั้นถัดไป",
    buttonLabel: "พร้อมแล้ว",
  },
  {
    order: 2,
    slug: "meditation",
    title: "ภาวนาพระวจนะ",
    contentLabel: "ภาวนาพระวจนะ",
    contentBody: "ใช้เวลาอ่านและใคร่ครวญข้อความจากคู่มือ",
    buttonLabel: "ไปยังพระธรรม",
  },
  {
    order: 3,
    slug: "scripture",
    title: "อ่านพระธรรม",
    contentLabel: "พระธรรมที่อ่าน",
    contentBody: "แสดง reference และลิงก์พระธรรมที่ได้รับสิทธิ์",
    buttonLabel: "อ่านเสร็จแล้ว",
  },
  {
    order: 4,
    slug: "question",
    title: "คำถามจากพระธรรม",
    contentLabel: "คำถามจากคู่มือ",
    contentTitle: "ท่านได้บทเรียนอะไรบ้าง?",
    contentBody: "",
    tinted: true,
    privateField: {
      label: "บันทึกคำตอบของคุณ",
      placeholder: "พิมพ์สิ่งที่คุณได้รับจากบทเรียนวันนี้…",
      footerNote: "บันทึกนี้เป็นข้อมูลส่วนตัว",
    },
    buttonLabel: "บันทึก",
  },
  {
    order: 5,
    slug: "understanding",
    title: "ทำความเข้าใจพระคัมภีร์",
    contentLabel: "ทำความเข้าใจพระคัมภีร์",
    contentBody: "แสดงเนื้อหาอธิบายจากคู่มือที่เผยแพร่แล้ว",
    buttonLabel: "ไปยังข้อคิด",
  },
  {
    order: 6,
    slug: "reflection",
    title: "ข้อคิดและการตอบสนอง",
    contentLabel: "ข้อคิดและการตอบสนอง",
    contentBody: "แสดงคำถามตอบสนองตามคู่มือ",
    tinted: true,
    privateField: {
      label: "พื้นที่บันทึกส่วนตัว",
      placeholder: "พิมพ์บันทึกของคุณ…",
    },
    buttonLabel: "บันทึกสิ่งที่ได้รับ",
  },
  {
    order: 7,
    slug: "journal",
    title: "บันทึกส่วนตัว",
    contentLabel: "บันทึกส่วนตัว",
    contentBody: "บันทึกของคุณเป็นข้อมูลส่วนตัว",
    tinted: true,
    privateField: {
      label: "พื้นที่บันทึกส่วนตัว",
      placeholder: "พิมพ์บันทึกของคุณ…",
    },
    buttonLabel: "ไปยังอธิษฐานปิด",
  },
  {
    order: 8,
    slug: "closing-prayer",
    title: "อธิษฐานปิด",
    contentLabel: "อธิษฐาน",
    contentBody: "แสดงข้อความจากคู่มือ และบันทึกคำอธิษฐานส่วนตัวได้",
    tinted: true,
    privateField: {
      label: "พื้นที่บันทึกส่วนตัว",
      placeholder: "พิมพ์บันทึกของคุณ…",
    },
    buttonLabel: "เสร็จสิ้นวันนี้",
  },
];

export const currentBook = {
  title: "คู่มือเฝ้าเดี่ยว QT เล่มที่ 1",
  shortTitle: "QT เล่มที่ 1",
  description: "เรียนรู้ตามลำดับ วันละหนึ่งบทเรียน",
  totalDays: 30,
};

export const history = [
  { day: 4, status: "เสร็จสิ้นแล้ว", label: "วันนี้" },
  { day: 3, status: "เสร็จสิ้นแล้ว", label: "9 ส.ค." },
  { day: 2, status: "เสร็จสิ้นแล้ว", label: "8 ส.ค." },
  { day: 1, status: "เสร็จสิ้นแล้ว", label: "7 ส.ค." },
];
