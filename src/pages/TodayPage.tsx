import { useNavigate } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { ProgressBar } from "../components/ProgressBar";
import { BottomNav } from "../components/BottomNav";
import { currentBook } from "../data/books";
import { STEP_DEFINITIONS, TOTAL_STEPS } from "../data/stepDefinitions";
import { useAppState } from "../AppState";

export function TodayPage() {
  const navigate = useNavigate();
  const { currentDay, totalDays, currentStep } = useAppState();

  const notStarted = currentStep === 0;
  const doneToday = currentStep > TOTAL_STEPS;
  const activeStep = STEP_DEFINITIONS[Math.min(currentStep, TOTAL_STEPS) - 1];

  const ctaLabel = notStarted ? "เริ่มเฝ้าเดี่ยว" : doneToday ? "ดูสรุปวันนี้" : "ทำต่อ";

  const handleCta = () => {
    if (doneToday) navigate("/success");
    else navigate(`/lesson/${notStarted ? 1 : currentStep}`);
  };

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="px-6">
          <ScreenHeader
            title="เฝ้าเดี่ยว"
            right={
              <div className="size-8 rounded-full bg-brand-soft" />
            }
          />
        </div>
        <div className="flex flex-1 flex-col gap-4 px-6 py-4">
          <h1 className="text-[25px] font-semibold text-ink">
            สวัสดี, วันนี้พร้อมไหม
          </h1>
          <p className="text-sm font-medium text-brand-accent">
            {currentBook.title} &nbsp;•&nbsp; วันที่ {currentDay} จาก {totalDays}
          </p>

          <div className="flex flex-col gap-3 rounded-[22px] bg-surface p-5 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
            <p className="text-[13px] font-semibold text-brand-accent">
              บทเรียนของวันนี้
            </p>
            {notStarted ? (
              <>
                <p className="text-[21px] font-semibold text-ink">
                  {STEP_DEFINITIONS[0].title}
                </p>
                <p className="text-sm text-ink-muted">ยังไม่เริ่มบทเรียนวันนี้</p>
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
        </div>

        <div className="flex flex-col gap-2 p-6">
          <PrimaryButton onClick={handleCta}>{ctaLabel}</PrimaryButton>
          <BottomNav active="today" />
        </div>
      </div>
    </ScreenShell>
  );
}
