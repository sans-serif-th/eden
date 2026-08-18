export const levels = [
  { value: "beginner", label: "สำหรับผู้เชื่อใหม่", enabled: false },
  { value: "year-1", label: "ปีที่ 1", enabled: true },
  { value: "year-2", label: "ปีที่ 2", enabled: false },
  { value: "year-3", label: "ปีที่ 3", enabled: false },
  { value: "year-4", label: "ปีที่ 4", enabled: false },
  { value: "year-5", label: "ปีที่ 5", enabled: false },
] as const;

export const currentBook = {
  title: "เล่มที่ 1",
  description: "เรียนรู้ตามลำดับ วันละหนึ่งบทเรียน",
  totalDays: 31, // Book 1's own length (มกราคม is the source citation month, not shown as primary label)
};

export const history = [
  { day: 1, status: "เสร็จสิ้นแล้ว", label: "วันนี้" },
];
