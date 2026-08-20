import { useNavigate } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { getBook, levels } from "../data/books";
import { useAppState } from "../AppState";

const YEAR_1_UPCOMING_BOOK_NUMBERS = Array.from(
  { length: 11 },
  (_, i) => i + 2,
);

export function SelectBookPage() {
  const navigate = useNavigate();
  const { selectBook, pendingEnrollment, activeEnrollment } = useAppState();
  const targetLevel = pendingEnrollment?.level ?? activeEnrollment.level;
  const levelLabel = levels.find((l) => l.value === targetLevel)?.label;
  const book = getBook(targetLevel, 1);

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="px-6">
          <ScreenHeader title="แผนการเรียน" />
        </div>
        <div className="flex flex-1 flex-col gap-4 px-6 py-4">
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
            <div className="flex flex-col gap-2 rounded-[18px] border-2 border-brand-accent bg-surface p-[18px]">
              <p className="text-[18px] font-semibold text-ink">
                {book ? `คู่มือเฝ้าเดี่ยว ${book.title}` : "—"}
              </p>
              {book && (
                <p className="text-[16px] font-medium text-brand-accent">
                  0 / {book.totalDays} วัน
                </p>
              )}
            </div>
          </div>

          {targetLevel === "year-1" && (
            <div className="flex flex-col gap-2">
              <p className="text-[16px] font-medium text-ink-muted">
                เล่มถัดไปในปีที่ 1
              </p>
              <div className="grid grid-cols-3 gap-2">
                {YEAR_1_UPCOMING_BOOK_NUMBERS.map((n) => {
                  const upcomingBook = getBook("year-1", n);
                  return (
                    <div
                      key={n}
                      className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl border border-fieldline bg-surface px-2 py-3 text-center ${
                        !upcomingBook ? "opacity-60" : ""
                      }`}
                    >
                      <span
                        className={`text-[16px] font-semibold ${upcomingBook ? "text-ink" : "text-ink-faint"}`}
                      >
                        เล่มที่ {n}
                      </span>
                      <span className="text-[12px] text-ink-faint">
                        {upcomingBook
                          ? `${upcomingBook.totalDays} วัน`
                          : "เร็ว ๆ นี้"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 p-6">
          <PrimaryButton
            disabled={!book}
            onClick={() => {
              selectBook();
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
