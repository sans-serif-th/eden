export const ONBOARDING_TOTAL_STEPS = 4;

export const placeOptions = ["บ้าน", "ที่ทำงาน", "คริสตจักร", "อื่นๆ"];

export const durationOptions = [5, 10, 15, 30];

export type StartPreference = "today" | "next-week" | "custom";

export const startOptions: { value: StartPreference; label: string }[] = [
  { value: "today", label: "วันนี้" },
  { value: "next-week", label: "สัปดาห์หน้า" },
  { value: "custom", label: "เลือกวันที่เอง" },
];

const THAI_MONTHS_SHORT = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

export function formatThaiDateShort(date: Date): string {
  return `${date.getDate()} ${THAI_MONTHS_SHORT[date.getMonth()]} ${date.getFullYear() + 543}`;
}

export function getPlanStartDate(startPreference: StartPreference, customStartDate: string): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (startPreference === "next-week") {
    const d = new Date(today);
    d.setDate(d.getDate() + 7);
    return d;
  }
  if (startPreference === "custom" && customStartDate) {
    return new Date(customStartDate + "T00:00:00");
  }
  return today;
}
