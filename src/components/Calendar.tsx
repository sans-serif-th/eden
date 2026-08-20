import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, CalendarDays, Rows3 } from "lucide-react";

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

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function startOfWeek(d: Date): Date {
  const x = startOfDay(d);
  x.setDate(x.getDate() - x.getDay());
  return x;
}
function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}
function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function Calendar({
  doneDates,
  selectedDate,
  onSelectDate,
  planStartDate,
  planEndDate,
}: {
  doneDates: Set<string>;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  planStartDate: Date;
  planEndDate: Date;
}) {
  const [mode, setMode] = useState<"week" | "month">("week");
  const today = startOfDay(new Date());
  const rangeStart = startOfDay(planStartDate);
  const rangeEnd = startOfDay(planEndDate);
  const inPlanRange = (d: Date) => d >= rangeStart && d <= rangeEnd;

  const [weekAnchor, setWeekAnchor] = useState(() => startOfWeek(today));
  const [monthAnchor, setMonthAnchor] = useState(() => startOfMonth(today));

  const goToToday = () => {
    onSelectDate(today);
    setWeekAnchor(startOfWeek(today));
    setMonthAnchor(startOfMonth(today));
  };

  const dayCellClass = (date: Date, disabled: boolean) => {
    const isSelected = isSameDay(date, selectedDate);
    const isToday = isSameDay(date, today);
    if (disabled) return "opacity-30 pointer-events-none";
    if (isSelected) return "bg-brand";
    if (isToday) return "border-2 border-dashed border-brand-accent";
    return "border border-fieldline bg-surface";
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {mode === "month" && (
            <button
              type="button"
              onClick={() => setMonthAnchor(addMonths(monthAnchor, -1))}
              disabled={isSameMonth(monthAnchor, rangeStart)}
              aria-label="เดือนก่อนหน้า"
              className="flex size-6 items-center justify-center text-ink-muted disabled:opacity-20"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          <p className="text-[16px] font-semibold text-ink-muted">
            {mode === "week"
              ? Array.from(
                  new Set(
                    Array.from({ length: 7 }, (_, i) =>
                      MONTH_LABELS[addDays(weekAnchor, i).getMonth()],
                    ),
                  ),
                ).join(" – ") + ` ${weekAnchor.getFullYear() + 543}`
              : `${MONTH_LABELS[monthAnchor.getMonth()]} ${monthAnchor.getFullYear() + 543}`}
          </p>
          {mode === "month" && (
            <button
              type="button"
              onClick={() => setMonthAnchor(addMonths(monthAnchor, 1))}
              disabled={isSameMonth(monthAnchor, rangeEnd)}
              aria-label="เดือนถัดไป"
              className="flex size-6 items-center justify-center text-ink-muted disabled:opacity-20"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goToToday}
            className="text-[16px] font-medium text-brand-accent"
          >
            วันนี้
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "week" ? "month" : "week")}
            aria-label={mode === "week" ? "ดูแบบเดือน" : "ดูแบบสัปดาห์"}
            className="flex size-7 items-center justify-center rounded-full border border-fieldline text-ink-muted"
          >
            {mode === "week" ? (
              <CalendarDays size={16} />
            ) : (
              <Rows3 size={16} />
            )}
          </button>
        </div>
      </div>

      {mode === "week" ? (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setWeekAnchor(addDays(weekAnchor, -7))}
            disabled={weekAnchor <= startOfWeek(rangeStart)}
            aria-label="สัปดาห์ก่อนหน้า"
            className="flex size-7 flex-none items-center justify-center text-ink-muted disabled:opacity-20"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="grid flex-1 grid-cols-7 gap-1">
            {Array.from({ length: 7 }, (_, i) => addDays(weekAnchor, i)).map(
              (date, i) => {
                const key = date.toDateString();
                const disabled = !inPlanRange(date);
                const isDone = doneDates.has(key);
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelectDate(date)}
                    className={`relative flex h-[72px] flex-col items-center justify-center gap-1.5 rounded-full transition-colors ${dayCellClass(date, disabled)}`}
                  >
                    <span
                      className={`text-[11px] font-medium ${
                        disabled
                          ? "text-ink-faint"
                          : isSameDay(date, selectedDate)
                            ? "text-white/80"
                            : isSameDay(date, today)
                              ? "text-brand"
                              : "text-ink-faint"
                      }`}
                    >
                      {DAY_LABELS[date.getDay()]}
                    </span>
                    <span
                      className={`text-[16px] font-semibold ${
                        !disabled && isSameDay(date, selectedDate)
                          ? "text-white"
                          : "text-ink"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    {isDone && !disabled && (
                      <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-brand-accent text-white ring-2 ring-app">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              },
            )}
          </div>
          <button
            type="button"
            onClick={() => setWeekAnchor(addDays(weekAnchor, 7))}
            disabled={weekAnchor >= startOfWeek(rangeEnd)}
            aria-label="สัปดาห์ถัดไป"
            className="flex size-7 flex-none items-center justify-center text-ink-muted disabled:opacity-20"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-7 text-center">
            {DAY_LABELS.map((label) => (
              <span
                key={label}
                className="text-[11px] font-medium text-ink-faint"
              >
                {label}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1.5">
            {(() => {
              const gridStart = startOfWeek(monthAnchor);
              return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i)).map(
                (date, i) => {
                  const key = date.toDateString();
                  const outOfMonth = !isSameMonth(date, monthAnchor);
                  const disabled = outOfMonth || !inPlanRange(date);
                  const isDone = doneDates.has(key);
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={disabled}
                      onClick={() => onSelectDate(date)}
                      className="flex items-center justify-center py-0.5"
                    >
                      <span
                        className={`relative flex size-9 items-center justify-center rounded-full text-[16px] font-semibold transition-colors ${
                          outOfMonth
                            ? "text-ink-faint"
                            : `${dayCellClass(date, disabled)} ${
                                !disabled && isSameDay(date, selectedDate)
                                  ? "text-white"
                                  : "text-ink"
                              }`
                        }`}
                      >
                        {isDone && !disabled ? (
                          <Check size={16} strokeWidth={2.5} />
                        ) : (
                          date.getDate()
                        )}
                      </span>
                    </button>
                  );
                },
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
