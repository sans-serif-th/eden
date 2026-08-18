import { useState } from "react";
import { Zap } from "lucide-react";

const DAY_LABELS = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"]; // Mon..Sun
const MONTH_LABELS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

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
  const [selected, setSelected] = useState(now.toDateString());

  // Month label: if the week spans two months, show both.
  const months = Array.from(
    new Set(dates.map((d) => MONTH_LABELS[d.getMonth()])),
  );

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[13px] font-semibold text-ink-muted">
        {months.join(" – ")} {now.getFullYear() + 543}
      </p>
      <div className="flex items-center justify-between">
        {dates.map((date, i) => {
          const key = date.toDateString();
          const isToday = key === now.toDateString();
          const isFuture = date > now && !isToday;
          const isSelected = key === selected;

          return (
            <button
              key={i}
              type="button"
              disabled={isFuture}
              onClick={() => setSelected(key)}
              className="flex flex-col items-center gap-1 disabled:cursor-not-allowed"
            >
              <span
                className={`text-[11px] font-medium ${isToday ? "text-brand" : "text-ink-faint"}`}
              >
                {DAY_LABELS[i]}
              </span>
              <div
                className={`flex size-9 items-center justify-center rounded-full text-[13px] font-semibold transition-colors ${
                  isToday && todayDone
                    ? "bg-brand text-white"
                    : isSelected
                      ? "border-2 border-brand bg-surface-tint text-brand"
                      : isFuture
                        ? "border border-fieldline text-ink-faint/50"
                        : "border border-fieldline text-ink-muted"
                }`}
              >
                {isToday && todayDone ? (
                  <Zap size={16} strokeWidth={2.5} />
                ) : (
                  date.getDate()
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
