import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Sprout } from "lucide-react";
import { ScreenShell } from "../components/ScreenShell";
import { ProgressBar } from "../components/ProgressBar";
import { BottomNav } from "../components/BottomNav";
import { currentBook } from "../data/books";
import { getDayContent } from "../data/dayContent";
import { getPlanStartDate } from "../data/onboarding";
import { useAppState } from "../AppState";

const THAI_MONTHS_FULL = [
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

function monthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function monthLabel(date: Date) {
  return `${THAI_MONTHS_FULL[date.getMonth()]} ${date.getFullYear() + 543}`;
}

export function HistoryPage() {
  const navigate = useNavigate();
  const { activeEnrollment, currentDay } = useAppState();
  const [monthFilter, setMonthFilter] = useState("all");

  const startDate = getPlanStartDate(
    activeEnrollment.startPreference,
    activeEnrollment.customStartDate,
  );

  const lastDay = Math.min(currentDay, currentBook.totalDays);

  const rows = useMemo(() => {
    const list = [];
    for (let day = lastDay; day >= 1; day--) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day - 1);
      const record = activeEnrollment.dayRecords[day];
      list.push({
        day,
        date,
        done: record?.status === "done",
        resumeStep: record?.currentStep ?? 0,
        content: getDayContent(day),
      });
    }
    return list;
  }, [lastDay, startDate, activeEnrollment.dayRecords]);

  const months = useMemo(() => {
    const seen = new Map<string, Date>();
    for (const row of rows) {
      const key = monthKey(row.date);
      if (!seen.has(key)) seen.set(key, row.date);
    }
    return [...seen.entries()];
  }, [rows]);

  const filteredRows =
    monthFilter === "all"
      ? rows
      : rows.filter((row) => monthKey(row.date) === monthFilter);

  const daysStudied = Object.values(activeEnrollment.dayRecords).filter(
    (r) => r.status === "done",
  ).length;
  const percent = (daysStudied / currentBook.totalDays) * 100;

  const handleRowClick = (row: (typeof rows)[number]) => {
    if (row.done) navigate(`/history/${row.day}`);
    else navigate(`/lesson/${row.day}/${row.resumeStep > 0 ? row.resumeStep : 1}`);
  };

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-3 px-6 py-4">
          <h1 className="text-[26px] font-semibold text-ink">ประวัติของฉัน</h1>
          <p className="text-[16px] font-medium text-brand-accent">
            {currentBook.title}
          </p>

          <div className="flex flex-col gap-3 rounded-[18px] bg-surface-tint px-[18px] py-4">
            <p className="text-[17px] font-semibold text-ink">
              ทำแล้ว {daysStudied} จาก {currentBook.totalDays} บทเรียน
            </p>
            <ProgressBar percent={percent} thick />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[16px] font-semibold text-ink">รายวัน</p>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="h-9 rounded-full border border-fieldline bg-surface px-3 text-[16px] font-medium text-ink focus:border-brand-accent focus:outline-none"
            >
              <option value="all">ทุกเดือน</option>
              {months.map(([key, date]) => (
                <option key={key} value={key}>
                  {monthLabel(date)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            {filteredRows.length === 0 && (
              <p className="text-[16px] text-ink-muted">ไม่มีรายการในเดือนนี้</p>
            )}
            {filteredRows.map((row) => (
              <button
                key={row.day}
                type="button"
                onClick={() => handleRowClick(row)}
                className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3 text-left"
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-[16px] font-semibold text-ink">
                    วันที่ {row.day}
                  </p>
                  <p className="text-[16px] text-ink-muted">
                    {row.content?.scriptureReference ?? "ยังไม่มีเนื้อหา"}
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-[16px] text-nav-inactive">
                  {row.done ? (
                    <span className="flex items-center gap-1 font-medium text-brand-accent">
                      <Sprout size={16} strokeWidth={2.5} />
                      เสร็จสิ้นแล้ว
                    </span>
                  ) : (
                    "ยังไม่ได้ทำ"
                  )}
                  <ChevronRight size={14} />
                </span>
              </button>
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
