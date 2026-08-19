import { useEffect, useRef } from "react";
import { Sprout } from "lucide-react";

// Indexed by Date#getDay() (0 = Sun .. 6 = Sat).
const DAY_LABELS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
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

// Two weeks, today roughly centered — a week back for catch-up, a week
// ahead for a look at what's coming. Scrolls horizontally since 14 days
// doesn't fit one screen width.
const DAYS_BEFORE = 7;
const DAYS_AFTER = 6;

function getTwoWeekDates(today: Date): Date[] {
  const base = new Date(today);
  base.setHours(0, 0, 0, 0);
  return Array.from({ length: DAYS_BEFORE + DAYS_AFTER + 1 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() - DAYS_BEFORE + i);
    return d;
  });
}

export function WeekStrip({
  doneDates,
  selectedDate,
  onSelectDate,
}: {
  doneDates: Set<string>;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}) {
  const now = new Date();
  const dates = getTwoWeekDates(now);
  const todayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    todayRef.current?.scrollIntoView({ inline: "center", block: "nearest" });
  }, []);

  const months = Array.from(
    new Set(dates.map((d) => MONTH_LABELS[d.getMonth()])),
  );

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[16px] font-semibold text-ink-muted">
        {months.join(" – ")} {now.getFullYear() + 543}
      </p>
      <div className="no-scrollbar flex gap-1 overflow-x-auto">
        {dates.map((date, i) => {
          const key = date.toDateString();
          const isToday = key === now.toDateString();
          const isSelected = key === selectedDate.toDateString();
          const isDone = doneDates.has(key);

          return (
            <button
              key={i}
              ref={isToday ? todayRef : undefined}
              type="button"
              onClick={() => onSelectDate(date)}
              className="flex w-10 flex-none flex-col items-center gap-1"
            >
              <span
                className={`text-[11px] font-medium ${isToday ? "text-brand" : "text-ink-faint"}`}
              >
                {DAY_LABELS[date.getDay()]}
              </span>
              <div
                className={`flex size-9 items-center justify-center rounded-full text-[16px] font-semibold transition-colors ${
                  isDone
                    ? "bg-brand text-white"
                    : isToday
                      ? "border-2 border-brand bg-surface-tint text-brand"
                      : isSelected
                        ? "border-2 border-ink-muted text-ink"
                        : "border border-fieldline text-ink-muted"
                }`}
              >
                {isDone ? (
                  <Sprout size={16} strokeWidth={2.5} />
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
