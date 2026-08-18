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

const TRAILING_DAYS = 7;

// The last 7 days ending today — showing lessons that haven't happened yet
// added no value, so this never looks forward, only back.
function getTrailingDates(today: Date): Date[] {
  const base = new Date(today);
  base.setHours(0, 0, 0, 0);
  return Array.from({ length: TRAILING_DAYS }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() - (TRAILING_DAYS - 1 - i));
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
  const dates = getTrailingDates(now);

  const months = Array.from(
    new Set(dates.map((d) => MONTH_LABELS[d.getMonth()])),
  );

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[16px] font-semibold text-ink-muted">
        {months.join(" – ")} {now.getFullYear() + 543}
      </p>
      <div className="flex items-center justify-between">
        {dates.map((date, i) => {
          const key = date.toDateString();
          const isToday = key === now.toDateString();
          const isSelected = key === selectedDate.toDateString();
          const isDone = doneDates.has(key);

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectDate(date)}
              className="flex flex-col items-center gap-1"
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
