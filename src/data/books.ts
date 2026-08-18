export const levels = [
  { value: "beginner", label: "สำหรับผู้เชื่อใหม่", enabled: false },
  { value: "year-1", label: "ปีที่ 1", enabled: true },
  { value: "year-2", label: "ปีที่ 2", enabled: false },
  { value: "year-3", label: "ปีที่ 3", enabled: false },
  { value: "year-4", label: "ปีที่ 4", enabled: false },
  { value: "year-5", label: "ปีที่ 5", enabled: false },
] as const;

export interface Book {
  book: number;
  title: string;
  description: string;
  totalDays: number;
}

export const booksByLevel: Record<string, Book[]> = {
  "year-1": [
    {
      book: 1,
      title: "เล่มที่ 1",
      description: "เรียนรู้ตามลำดับ วันละหนึ่งบทเรียน",
      totalDays: 31, // มกราคม
    },
    {
      book: 2,
      title: "เล่มที่ 2",
      description: "เรียนรู้ตามลำดับ วันละหนึ่งบทเรียน",
      totalDays: 29, // กุมภาพันธ์
    },
  ],
};

export function getBook(level: string, book: number): Book | undefined {
  return booksByLevel[level]?.find((b) => b.book === book);
}
