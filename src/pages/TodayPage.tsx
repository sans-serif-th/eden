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
import { getBook } from "../data/books";
import {
  getBookDayForDate,
  getPlanStartDate,
  formatThaiDateShort,
} from "../data/onboarding";
import { mockUserName } from "../data/user";
import { useAppState } from "../AppState";

export function TodayPage() {
  const navigate = useNavigate();
  const { currentDay, activeEnrollment, requestNextBook, lineProfile } =
    useAppState();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currentBookDef = getBook(activeEnrollment.level, activeEnrollment.book);
  const totalDaysInBook = currentBookDef?.totalDays ?? Infinity;
  const nextBookExists = !!getBook(
    activeEnrollment.level,
    activeEnrollment.book + 1,
  );

  const currentStep = activeEnrollment.dayRecords[currentDay]?.currentStep ?? 0;
  const notStarted = currentStep === 0;
  const doneToday = currentStep > TOTAL_STEPS;
  const bookFinished = currentDay > totalDaysInBook;
  const activeStep = STEP_DEFINITIONS[Math.min(currentStep, TOTAL_STEPS) - 1];

  const ctaLabel = notStarted ? "เริ่มเฝ้าเดี่ยว" : doneToday ? "ดูสรุปวันนี้" : "ทำต่อ";

  const handleCta = () => {
    if (doneToday) navigate("/success", { state: { day: currentDay } });
    else navigate(`/lesson/${currentDay}/${notStarted ? 1 : currentStep}`);
  };

  const handleStartNextBook = () => {
    requestNextBook(false);
    navigate("/new-plan");
  };

  const planStartDate = getPlanStartDate(
    activeEnrollment.startPreference,
    activeEnrollment.customStartDate,
  );
  const doneDates = new Set(
    Object.entries(activeEnrollment.dayRecords)
      .filter(([, record]) => record.status === "done")
      .map(([day]) => {
        const date = new Date(planStartDate);
        date.setDate(date.getDate() + Number(day) - 1);
        return date.toDateString();
      }),
  );

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const selectedDayNumber = getBookDayForDate(
    selectedDate,
    activeEnrollment.startPreference,
    activeEnrollment.customStartDate,
  );
  const selectedDayContent = !isToday
    ? getDayContent(activeEnrollment.level, activeEnrollment.book, selectedDayNumber)
    : undefined;
  const selectedDayRecord = activeEnrollment.dayRecords[selectedDayNumber];
  const selectedDayDone = selectedDayRecord?.status === "done";
  const selectedDayStep = selectedDayRecord?.currentStep ?? 0;
  const selectedDayCtaLabel = selectedDayDone
    ? "ดูสรุป"
    : selectedDayStep > 0
      ? "ทำต่อ"
      : "เริ่มบทเรียนนี้";

  // currentDay from AppState clamps to a minimum of 1 for safe content lookup,
  // so check the raw (unclamped) value here to know if the plan has actually started.
  const planNotStartedYet = isToday && selectedDayNumber < 1;
  const currentDayContent = getDayContent(
    activeEnrollment.level,
    activeEnrollment.book,
    currentDay,
  );
  // A Day within the book's day count can still lack authored content (see
  // Day readiness in CONTEXT.md) — never navigate into /lesson for one, since
  // LessonStepPage has nothing to render and would just show a blank screen.
  const currentDayNotReady =
    !planNotStartedYet && !bookFinished && !currentDayContent;

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between px-6 pt-4">
          <LevelBookSwitcher
            selectedLevel={activeEnrollment.level}
            book={activeEnrollment.book}
          />
          {lineProfile?.pictureUrl ? (
            <img
              src={lineProfile.pictureUrl}
              alt=""
              className="size-8 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="size-8 shrink-0 rounded-full bg-brand-soft" />
          )}
        </div>
        <div className="px-6 pt-4">
          <WeekStrip
            doneDates={doneDates}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>
        <div className="flex flex-1 flex-col gap-4 px-6 py-4">
          <h1 className="text-[25px] font-semibold text-ink">
            สวัสดี, {lineProfile?.displayName ?? mockUserName}
          </h1>

          {isToday ? (
            planNotStartedYet ? (
              <div className="flex flex-col gap-3 rounded-[22px] bg-surface p-5 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
                <p className="text-[16px] font-semibold text-brand-accent">
                  ยังไม่มีแผนการเรียน
                </p>
                <p className="text-[21px] font-semibold text-ink">
                  แผนการเฝ้าเดี่ยวของคุณยังไม่เริ่ม
                </p>
                <p className="text-[16px] text-ink-muted">
                  แผนจะเริ่มวันที่ {formatThaiDateShort(planStartDate)}
                </p>
              </div>
            ) : bookFinished ? (
              <div className="flex flex-col gap-3 rounded-[22px] bg-surface p-5 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
                <p className="text-[16px] font-semibold text-brand-accent">
                  จบเล่มนี้แล้ว!
                </p>
                <p className="text-[21px] font-semibold text-ink">
                  {nextBookExists
                    ? "พร้อมเริ่มเล่มถัดไปหรือยัง"
                    : "ยังไม่มีเล่มถัดไปในตอนนี้"}
                </p>
                <p className="text-[16px] text-ink-muted">
                  {nextBookExists
                    ? "แผนเดิมจะถูกเก็บไว้ และเริ่มนับวันใหม่ในเล่มถัดไป"
                    : "กรุณารอการอัปเดตเนื้อหาเล่มถัดไป"}
                </p>
                {nextBookExists && (
                  <PrimaryButton onClick={handleStartNextBook}>
                    เริ่มเล่มถัดไป
                  </PrimaryButton>
                )}
              </div>
            ) : currentDayNotReady ? (
              <div className="flex flex-col gap-3 rounded-[22px] bg-surface p-5 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
                <p className="text-[16px] font-semibold text-brand-accent">
                  บทเรียนของวันนี้
                </p>
                <p className="text-[21px] font-semibold text-ink">
                  บทเรียนนี้ยังไม่พร้อมใช้งาน
                </p>
                <p className="text-[16px] text-ink-muted">
                  กรุณารอการอัปเดตเนื้อหา แล้วกลับมาใหม่อีกครั้ง
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 rounded-[22px] bg-surface p-5 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
                <p className="text-[16px] font-semibold text-brand-accent">
                  บทเรียนของวันนี้
                </p>
                {notStarted ? (
                  <>
                    <p className="text-[21px] font-semibold text-ink">
                      {STEP_DEFINITIONS[0].title}
                    </p>
                    <p className="text-[16px] text-ink-muted">
                      พร้อมเริ่มบทเรียนวันนี้
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[21px] font-semibold text-ink">
                      {doneToday ? "เสร็จสิ้นแล้ว" : activeStep.title}
                    </p>
                    <p className="text-[16px] text-ink-muted">
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
                  <p className="text-[16px] font-medium text-brand-accent">
                    {Math.min(currentStep, TOTAL_STEPS)} จาก {TOTAL_STEPS} ขั้นตอน
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col gap-3 rounded-[22px] bg-surface p-5 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
              <p className="text-[16px] font-semibold text-brand-accent">
                {selectedDayNumber < 1
                  ? "ยังไม่มีแผนการเรียน"
                  : `บทเรียนวันที่ ${selectedDayNumber}`}
              </p>
              {selectedDayNumber < 1 ? (
                <p className="text-[16px] text-ink-muted">
                  แผนการเฝ้าเดี่ยวของคุณยังไม่เริ่มในวันนี้
                </p>
              ) : selectedDayNumber > totalDaysInBook ? (
                <p className="text-[16px] text-ink-muted">
                  ยังไม่มีเนื้อหาสำหรับวันนี้
                </p>
              ) : selectedDayContent ? (
                <>
                  <p className="text-[19px] font-semibold text-ink">
                    {selectedDayContent.scriptureReference}
                  </p>
                  <p className="text-[16px] text-ink-muted">
                    {selectedDayContent.memoryVerse}
                  </p>
                </>
              ) : (
                <p className="text-[16px] text-ink-muted">ยังไม่มีเนื้อหาสำหรับวันนี้</p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-6">
          {isToday ? (
            !planNotStartedYet &&
            !bookFinished &&
            !currentDayNotReady && (
              <PrimaryButton onClick={handleCta}>{ctaLabel}</PrimaryButton>
            )
          ) : (
            <>
              {selectedDayContent && (
                <PrimaryButton
                  onClick={() =>
                    selectedDayDone
                      ? navigate(`/history/${selectedDayNumber}`)
                      : navigate(
                          `/lesson/${selectedDayNumber}/${selectedDayStep > 0 ? selectedDayStep : 1}`,
                        )
                  }
                >
                  {selectedDayCtaLabel}
                </PrimaryButton>
              )}
              <OutlineButton onClick={() => setSelectedDate(new Date())}>
                ไปที่วันนี้
              </OutlineButton>
            </>
          )}
          <BottomNav active="today" />
        </div>
      </div>
    </ScreenShell>
  );
}
