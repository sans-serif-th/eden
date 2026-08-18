import { Zap } from "lucide-react";

const DAY_LABELS = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"]; // Mon..Sun

function getWeekDates(today: Date): Date[] {
  const day = today.getDay(); // 0 = Sun
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export function WeekStrip({ todayDone }: { todayDone: boolean }) {
  const now = new Date();
  const dates = getWeekDates(now);

  return (
    <div className="flex items-center justify-between">
      {dates.map((date, i) => {
        const isToday = date.toDateString() === now.toDateString();
        return (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div
              className={`flex size-9 items-center justify-center rounded-full text-[13px] font-semibold ${
                isToday
                  ? todayDone
                    ? "bg-brand text-white"
                    : "border-2 border-brand bg-app text-brand"
                  : "border border-fieldline text-ink-faint"
              }`}
            >
              {isToday && todayDone ? (
                <Zap size={16} strokeWidth={2.5} />
              ) : (
                DAY_LABELS[i]
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
