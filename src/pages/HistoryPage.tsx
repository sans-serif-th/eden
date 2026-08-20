import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Sprout } from "lucide-react";
import { ScreenShell } from "../components/ScreenShell";
import { BottomNav } from "../components/BottomNav";
import { getBook } from "../data/books";
import { getDayContent } from "../data/dayContent";
import { getPlanStartDate } from "../data/onboarding";
import { useAppState } from "../AppState";

type StatusFilter = "all" | "done" | "not-done";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "done", label: "บันทึกแล้ว" },
  { value: "not-done", label: "ยังไม่ได้บันทึก" },
];

export function HistoryPage() {
  const navigate = useNavigate();
  const { activeEnrollment, currentDay } = useAppState();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const book = getBook(activeEnrollment.level, activeEnrollment.book);
  const totalDays = book?.totalDays ?? 0;

  const startDate = getPlanStartDate(
    activeEnrollment.startPreference,
    activeEnrollment.customStartDate,
  );

  const lastDay = Math.min(currentDay, totalDays);

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
        content: getDayContent(activeEnrollment.level, activeEnrollment.book, day),
      });
    }
    return list;
  }, [lastDay, startDate, activeEnrollment.level, activeEnrollment.book, activeEnrollment.dayRecords]);

  const filteredRows =
    statusFilter === "all"
      ? rows
      : rows.filter((row) => (statusFilter === "done" ? row.done : !row.done));

  const handleRowClick = (row: (typeof rows)[number]) => {
    if (row.done) navigate(`/history/${row.day}`);
    else navigate(`/lesson/${row.day}/${row.resumeStep > 0 ? row.resumeStep : 1}`);
  };

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-3 px-6 pt-4 pb-[140px]">
          <h1 className="text-[26px] font-semibold text-ink">ประวัติของฉัน</h1>
          <p className="text-[16px] font-medium text-brand-accent">
            {book?.title ?? "—"}
          </p>

          <div className="flex items-center justify-between">
            <p className="text-[16px] font-semibold text-ink">
              {book?.title ?? "เล่มที่ 1"}
            </p>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="h-9 rounded-full border border-fieldline bg-surface px-3 text-[16px] font-medium text-ink focus:border-brand-accent focus:outline-none"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            {filteredRows.length === 0 && (
              <p className="text-[16px] text-ink-muted">ไม่มีรายการ</p>
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

        <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 bg-app p-6">
          <BottomNav active="history" />
        </div>
      </div>
    </ScreenShell>
  );
}
