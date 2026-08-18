import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { PrimaryButton, OutlineButton } from "../components/PrimaryButton";
import { ProgressBar } from "../components/ProgressBar";
import { BottomNav } from "../components/BottomNav";
import { LevelBookSwitcher } from "../components/LevelBookSwitcher";
import { WeekStrip } from "../components/WeekStrip";
import { STEP_DEFINITIONS, TOTAL_STEPS } from "../data/stepDefinitions";
import { getDayContent } from "../data/dayContent";
import { currentBook } from "../data/books";
import { getBookDayForDate } from "../data/onboarding";
import { useAppState } from "../AppState";

export function TodayPage() {
  const navigate = useNavigate();
  const { currentStep, selectedLevel, onboarding } = useAppState();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const notStarted = currentStep === 0;
  const doneToday = currentStep > TOTAL_STEPS;
  const activeStep = STEP_DEFINITIONS[Math.min(currentStep, TOTAL_STEPS) - 1];

  const ctaLabel = notStarted ? "เริ่มเฝ้าเดี่ยว" : doneToday ? "ดูสรุปวันนี้" : "ทำต่อ";

  const handleCta = () => {
    if (doneToday) navigate("/success");
    else navigate(`/lesson/${notStarted ? 1 : currentStep}`);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const selectedDayNumber = getBookDayForDate(
    selectedDate,
    onboarding.startPreference,
    onboarding.customStartDate,
  );
  const selectedDayContent = !isToday
    ? getDayContent(selectedDayNumber)
    : undefined;

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between px-6 pt-4">
          <LevelBookSwitcher selectedLevel={selectedLevel} />
          <div className="size-8 shrink-0 rounded-full bg-brand-soft" />
        </div>
        <div className="px-6 pt-4">
          <WeekStrip
            todayDone={doneToday}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>
        <div className="flex flex-1 flex-col gap-4 px-6 py-4">
          <h1 className="text-[25px] font-semibold text-ink">
            สวัสดี, วันนี้พร้อมไหม
          </h1>

          {isToday ? (
            <div className="flex flex-col gap-3 rounded-[22px] bg-surface p-5 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
              <p className="text-[13px] font-semibold text-brand-accent">
                บทเรียนของวันนี้
              </p>
              {notStarted ? (
                <>
                  <p className="text-[21px] font-semibold text-ink">
                    {STEP_DEFINITIONS[0].title}
                  </p>
                  <p className="text-sm text-ink-muted">
                    ยังไม่เริ่มบทเรียนวันนี้
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[21px] font-semibold text-ink">
                    {doneToday ? "เสร็จสิ้นแล้ว" : activeStep.title}
                  </p>
                  <p className="text-sm text-ink-muted">
                    {doneToday
                      ? "ทำเฝ้าเดี่ยววันนี้ครบแล้ว"
                      : `ทำต่อจากขั้น: ${activeStep.title}`}
                  </p>
                </>
              )}
              <div className="flex flex-col gap-1.5">
                <ProgressBar
                  percent={
                    doneToday
                      ? 100
                      : (Math.min(currentStep, TOTAL_STEPS) / TOTAL_STEPS) * 100
                  }
                />
                <p className="text-[13px] font-medium text-brand-accent">
                  {Math.min(currentStep, TOTAL_STEPS)} จาก {TOTAL_STEPS} ขั้นตอน
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 rounded-[22px] bg-surface p-5 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
              <p className="text-[13px] font-semibold text-brand-accent">
                {selectedDayNumber < 1
                  ? "ยังไม่ถึงวันเริ่มต้น"
                  : `บทเรียนวันที่ ${selectedDayNumber}`}
              </p>
              {selectedDayNumber < 1 ? (
                <p className="text-sm text-ink-muted">
                  แผนการเฝ้าเดี่ยวของคุณยังไม่เริ่มในวันนี้
                </p>
              ) : selectedDayNumber > currentBook.totalDays ? (
                <p className="text-sm text-ink-muted">
                  ยังไม่มีเนื้อหาสำหรับวันนี้
                </p>
              ) : selectedDayContent ? (
                <>
                  <p className="text-[19px] font-semibold text-ink">
                    {selectedDayContent.scriptureReference}
                  </p>
                  <p className="text-sm text-ink-muted">
                    {selectedDayContent.memoryVerse}
                  </p>
                </>
              ) : (
                <p className="text-sm text-ink-muted">ยังไม่มีเนื้อหาสำหรับวันนี้</p>
              )}
              <OutlineButton onClick={() => setSelectedDate(new Date())}>
                กลับไปวันนี้
              </OutlineButton>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-6">
          {isToday && <PrimaryButton onClick={handleCta}>{ctaLabel}</PrimaryButton>}
          <BottomNav active="today" />
        </div>
      </div>
    </ScreenShell>
  );
}
