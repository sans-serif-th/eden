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

// Loading lesson previews for every visible day would mean touching content
// for the whole Mon-Sun week; capped to a ±2 day window around today to
// keep this to at most 5 lookups regardless of which weekday "today" is.
const SELECTABLE_RADIUS_DAYS = 2;

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

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((b.setHours(0, 0, 0, 0) - a.setHours(0, 0, 0, 0)) / msPerDay);
}

export function WeekStrip({
  todayDone,
  selectedDate,
  onSelectDate,
}: {
  todayDone: boolean;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}) {
  const now = new Date();
  const dates = getWeekDates(now);

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
          const offset = daysBetween(new Date(now), new Date(date));
          const isSelectable = Math.abs(offset) <= SELECTABLE_RADIUS_DAYS;
          const isSelected = key === selectedDate.toDateString();

          return (
            <button
              key={i}
              type="button"
              disabled={!isSelectable}
              onClick={() => onSelectDate(date)}
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
                      : isSelectable
                        ? "border border-fieldline text-ink-muted"
                        : "border border-fieldline text-ink-faint/50"
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
