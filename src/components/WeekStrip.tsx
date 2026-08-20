import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

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
      <div
        className="no-scrollbar flex select-none gap-2 overflow-x-auto overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch] [touch-action:pan-x]"
      >
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
              className={`relative flex h-[72px] w-11 flex-none flex-col items-center justify-center gap-1.5 rounded-full transition-colors ${
                isSelected
                  ? "bg-brand"
                  : isToday
                    ? "border-2 border-dashed border-brand-accent"
                    : "border border-fieldline bg-surface"
              }`}
            >
              <span
                className={`text-[11px] font-medium ${
                  isSelected
                    ? "text-white/80"
                    : isToday
                      ? "text-brand"
                      : "text-ink-faint"
                }`}
              >
                {DAY_LABELS[date.getDay()]}
              </span>
              <span
                className={`text-[16px] font-semibold ${
                  isSelected ? "text-white" : "text-ink"
                }`}
              >
                {date.getDate()}
              </span>
              {isDone && (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-brand-accent text-white ring-2 ring-app">
                  <Check size={10} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
