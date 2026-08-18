import { ScreenShell } from "../components/ScreenShell";
import { ProgressBar } from "../components/ProgressBar";
import { BottomNav } from "../components/BottomNav";
import { currentBook, history, levels } from "../data/books";
import { useAppState } from "../AppState";

export function StatsPage() {
  const { selectedLevel, answers } = useAppState();

  const level = levels.find((l) => l.value === selectedLevel);
  const daysStudied = history.filter(
    (h) => h.status === "เสร็จสิ้นแล้ว",
  ).length;
  const percent = (daysStudied / currentBook.totalDays) * 100;

  const totalLogs = Object.values(answers).filter(
    (v) => v.trim().length > 0,
  ).length;

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-4 px-6 py-6">
          <h1 className="text-2xl font-semibold text-ink">เล่มของฉัน</h1>

          <div className="flex flex-col gap-2 rounded-[18px] bg-surface p-5 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
            <p className="text-[16px] font-semibold text-brand-accent">
              กำลังเรียนอยู่
            </p>
            <p className="text-[19px] font-semibold text-ink">
              {level?.label ?? "—"} &middot; {currentBook.title}
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-[18px] bg-surface p-5 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
            <p className="text-[16px] font-semibold text-brand-accent">
              ความคืบหน้า
            </p>
            <p className="text-[19px] font-semibold text-ink">
              เรียนมาแล้ว {daysStudied} จาก {currentBook.totalDays} วัน
            </p>
            <ProgressBar percent={percent} thick />
            <p className="text-[16px] font-medium text-brand-accent">
              {percent.toFixed(0)}%
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-[18px] bg-surface p-5 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
            <p className="text-[16px] font-semibold text-brand-accent">
              บันทึกทั้งหมด
            </p>
            <p className="text-[19px] font-semibold text-ink">
              {totalLogs} รายการ
            </p>
            <p className="text-[16px] text-ink-muted">
              คำตอบ ข้อคิด และคำอธิษฐานที่คุณบันทึกไว้
            </p>
          </div>
        </div>

        <div className="p-6">
          <BottomNav active="books" />
        </div>
      </div>
    </ScreenShell>
  );
}
