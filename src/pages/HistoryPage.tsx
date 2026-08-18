import { ChevronRight } from "lucide-react";
import { ScreenShell } from "../components/ScreenShell";
import { ProgressBar } from "../components/ProgressBar";
import { BottomNav } from "../components/BottomNav";
import { currentBook, history } from "../data/lessonSteps";

export function HistoryPage() {
  const completed = history.length;

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-3 px-6 py-4">
          <h1 className="text-[26px] font-semibold text-ink">ประวัติของฉัน</h1>
          <p className="text-sm font-medium text-brand-accent">
            {currentBook.shortTitle}
          </p>

          <div className="flex flex-col gap-3 rounded-[18px] bg-surface-tint px-[18px] py-4">
            <p className="text-[17px] font-semibold text-ink">
              ทำแล้ว {completed} จาก {currentBook.totalDays} บทเรียน
            </p>
            <ProgressBar
              percent={(completed / currentBook.totalDays) * 100}
              thick
            />
          </div>

          <p className="text-sm font-semibold text-ink">ล่าสุด</p>

          <div className="flex flex-col gap-2">
            {history.map((row) => (
              <div
                key={row.day}
                className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3"
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-[15px] font-semibold text-ink">
                    วันที่ {row.day}
                  </p>
                  <p className="text-xs text-brand-accent">{row.status}</p>
                </div>
                <span className="flex items-center gap-0.5 text-[13px] text-nav-inactive">
                  {row.label} <ChevronRight size={14} />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          <BottomNav active="history" />
        </div>
      </div>
    </ScreenShell>
  );
}
