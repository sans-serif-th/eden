import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { getBook, levels } from "../data/books";
import { useAppState } from "../AppState";

const YEAR_1_BOOK_NUMBERS = Array.from({ length: 12 }, (_, i) => i + 1);

export function SelectBookPage() {
  const navigate = useNavigate();
  const { selectBook, pendingEnrollment, activeEnrollment } = useAppState();
  const targetLevel = pendingEnrollment?.level ?? activeEnrollment.level;
  const levelLabel = levels.find((l) => l.value === targetLevel)?.label;
  const bookNumbers = targetLevel === "year-1" ? YEAR_1_BOOK_NUMBERS : [1];
  const [selectedBookNumber, setSelectedBookNumber] = useState(1);
  const selectedBook = getBook(targetLevel, selectedBookNumber);

  // Only the active Enrollment's dayRecords are loaded client-side (archived
  // Enrollments load lazily on resume) — days-studied can only be shown
  // accurately for whichever book is currently active.
  const activeDaysStudied = Object.values(activeEnrollment.dayRecords).filter(
    (r) => r.status === "done",
  ).length;
  const isActiveBook = (n: number) =>
    targetLevel === activeEnrollment.level && n === activeEnrollment.book;

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="sticky top-0 z-10 bg-app px-6">
          <ScreenHeader title="แผนการเรียน" />
        </div>
        <div className="flex flex-1 flex-col gap-4 px-6 pt-4 pb-[120px]">
          <img src="/eden-logo.svg" alt="Eden" className="h-8 w-[99px]" />
          <h1 className="text-2xl font-semibold text-ink">
            เลือกเล่มที่กำลังเรียน
          </h1>
          {levelLabel && (
            <p className="text-[16px] text-ink-muted">
              ระดับที่เลือก: <span className="font-medium text-ink">{levelLabel}</span>
            </p>
          )}
          <div className="flex flex-col gap-2">
            {bookNumbers.map((n) => {
              const book = getBook(targetLevel, n);
              const selected = n === selectedBookNumber;
              return (
                <button
                  key={n}
                  type="button"
                  disabled={!book}
                  onClick={() => setSelectedBookNumber(n)}
                  className={`flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-colors disabled:cursor-not-allowed ${
                    selected
                      ? "border-brand-accent bg-surface"
                      : "border-fieldline bg-surface"
                  } ${!book ? "opacity-60" : ""}`}
                >
                  <p
                    className={`text-[16px] font-semibold ${book ? "text-ink" : "text-ink-faint"}`}
                  >
                    คู่มือเฝ้าเดี่ยว เล่มที่ {n}
                  </p>
                  {book ? (
                    <p className="text-[16px] font-medium text-brand-accent">
                      {isActiveBook(n) ? activeDaysStudied : 0} /{" "}
                      {book.totalDays} วัน
                    </p>
                  ) : (
                    <p className="text-[16px] font-medium text-ink-faint">
                      เร็ว ๆ นี้
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 bg-app p-6">
          <PrimaryButton
            disabled={!selectedBook}
            onClick={() => {
              selectBook(selectedBookNumber);
              navigate(pendingEnrollment ? "/new-plan" : "/today");
            }}
          >
            เลือกเล่มนี้
          </PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}
