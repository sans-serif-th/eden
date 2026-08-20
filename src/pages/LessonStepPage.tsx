import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { StepHeader } from "../components/StepHeader";
import { ProgressBar } from "../components/ProgressBar";
import { OutlineButton, PrimaryButton } from "../components/PrimaryButton";
import {
  STEP_DEFINITIONS,
  TEMPLATE_COPY,
  TOTAL_STEPS,
} from "../data/stepDefinitions";
import { getDayContent, hasUnderstandingStep } from "../data/dayContent";
import { useAppState } from "../AppState";

const UNDERSTANDING_STEP = 4;

export function LessonStepPage() {
  const { day: dayParam, step: stepParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { activeEnrollment, setDayAnswer, completeStep } = useAppState();

  // Which page linked into this lesson — set by TodayPage/HistoryPage when
  // they navigate here — so the back button returns to where the user
  // actually came from instead of guessing from the day number (a day
  // opened via "เรียนล่วงหน้า" on Today isn't the current day, but the user
  // still came from Today, not History).
  const cameFrom: "today" | "history" =
    location.state?.from === "history" ? "history" : "today";

  const dayNumber = Number(dayParam);
  const answers = activeEnrollment.dayRecords[dayNumber]?.answers ?? {};

  const stepNumber = Number(stepParam);
  const step = STEP_DEFINITIONS[stepNumber - 1];
  const dayContent = getDayContent(
    activeEnrollment.level,
    activeEnrollment.book,
    dayNumber,
  );

  // Some Days skip ทำความเข้าใจพระคัมภีร์ entirely in the source — never
  // show a blank step 4, whichever direction the user arrived from.
  useEffect(() => {
    if (
      dayContent &&
      stepNumber === UNDERSTANDING_STEP &&
      !hasUnderstandingStep(dayContent)
    ) {
      navigate(`/lesson/${dayNumber}/${UNDERSTANDING_STEP + 1}`, {
        replace: true,
        state: location.state,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayNumber, stepNumber, dayContent]);

  const [readingAnswer, setReadingAnswer] = useState(
    answers[`${stepNumber}-reading`] ?? "",
  );
  const [closingAnswer, setClosingAnswer] = useState(
    answers[`${stepNumber}-closing`] ?? "",
  );
  const [journalAnswers, setJournalAnswers] = useState<[string, string]>([
    answers[`${stepNumber}-journal-0`] ?? "",
    answers[`${stepNumber}-journal-1`] ?? "",
  ]);

  // Reachable if content isn't authored yet for this Day (see Day readiness
  // in CONTEXT.md) even though callers should already be checking first —
  // never render a blank screen here as the last line of defense.
  if (!step || !dayContent) {
    return (
      <ScreenShell>
        <div className="flex flex-1 flex-col">
          <div className="sticky top-0 z-10 bg-app px-6">
            <ScreenHeader title="บทเรียนนี้ยังไม่พร้อมใช้งาน" />
          </div>
          <div className="flex flex-1 flex-col gap-3 px-6 py-4">
            <p className="text-[16px] text-ink-muted">
              กรุณารอการอัปเดตเนื้อหา แล้วกลับมาใหม่อีกครั้ง
            </p>
          </div>
        </div>
      </ScreenShell>
    );
  }

  // These three steps ask the user to write something — block continuing
  // past them with a blank answer instead of silently saving nothing.
  const canContinue =
    step.slug === "reading"
      ? readingAnswer.trim().length > 0
      : step.slug === "closing-prayer"
        ? closingAnswer.trim().length > 0
        : step.slug === "journal"
          ? journalAnswers[0].trim().length > 0 &&
            journalAnswers[1].trim().length > 0
          : true;

  const persistDraft = () => {
    if (step.slug === "reading")
      setDayAnswer(dayNumber, `${stepNumber}-reading`, readingAnswer);
    if (step.slug === "closing-prayer")
      setDayAnswer(dayNumber, `${stepNumber}-closing`, closingAnswer);
    if (step.slug === "journal") {
      setDayAnswer(dayNumber, `${stepNumber}-journal-0`, journalAnswers[0]);
      setDayAnswer(dayNumber, `${stepNumber}-journal-1`, journalAnswers[1]);
    }
  };

  const handleContinue = () => {
    persistDraft();
    completeStep(dayNumber, stepNumber);
    if (stepNumber >= TOTAL_STEPS) {
      navigate("/success", { state: { day: dayNumber } });
      return;
    }
    let next = stepNumber + 1;
    if (next === UNDERSTANDING_STEP && !hasUnderstandingStep(dayContent)) {
      next += 1;
    }
    navigate(`/lesson/${dayNumber}/${next}`, { state: location.state });
  };

  const handleBack = () => {
    persistDraft();
    let prev = stepNumber - 1;
    if (prev === UNDERSTANDING_STEP && !hasUnderstandingStep(dayContent)) {
      prev -= 1;
    }
    navigate(`/lesson/${dayNumber}/${prev}`, { state: location.state });
  };

  return (
    <ScreenShell>
      <div className="flex h-dvh flex-col">
        <div className="flex-1 overflow-y-auto px-6 pt-11 pb-32">
          <div className="flex flex-col gap-4">
            <StepHeader
              step={stepNumber}
              total={TOTAL_STEPS}
              backTo={cameFrom === "history" ? "/history" : "/today"}
              backLabel={cameFrom === "history" ? "ประวัติ" : "วันนี้"}
              showStepCount={step.slug !== "journal"}
            />

            <h1 className="text-[25px] font-semibold text-ink">
              {step.title}
            </h1>
            <p className="text-[16px] font-medium text-brand-accent">
              {dayContent.citation}
            </p>

            <ProgressBar percent={(stepNumber / TOTAL_STEPS) * 100} />

            {step.slug === "prayer" && (
              <div className="flex flex-col gap-2.5 rounded-[18px] bg-surface p-[18px]">
                <p className="text-[16px] font-semibold text-brand-accent">
                  อธิษฐาน
                </p>
                <p className="text-[16px] text-ink-muted">
                  {TEMPLATE_COPY.openingPrayerInstruction}
                </p>
              </div>
            )}

            {step.slug === "memory-verse" && (
              <div className="flex flex-col gap-2.5 rounded-[18px] bg-surface p-[18px]">
                <p className="text-[16px] font-semibold text-brand-accent">
                  ภาวนาพระวจนะ
                </p>
                <p className="text-[16px] text-ink-muted">
                  {dayContent.memoryVerse}
                </p>
              </div>
            )}

            {step.slug === "reading" && (
              <>
                <div className="flex flex-col gap-2.5 rounded-[18px] bg-surface-tint p-[18px]">
                  <p className="text-[16px] font-semibold text-brand-accent">
                    อ่านพระธรรม {dayContent.scriptureReference}
                  </p>
                  <p className="text-[16px] text-ink-muted">
                    {dayContent.reading.teaser}
                  </p>
                </div>
                <p className="text-[16px] font-semibold text-ink">
                  บันทึกคำตอบของคุณ
                </p>
                <textarea
                  value={readingAnswer}
                  onChange={(e) => setReadingAnswer(e.target.value)}
                  placeholder="พิมพ์สิ่งที่คุณได้รับจากบทเรียนวันนี้…"
                  className="h-[150px] w-full flex-none resize-none rounded-2xl border border-fieldline-strong bg-surface p-4 text-[16px] text-ink placeholder:text-ink-faint focus:border-brand-accent focus:outline-none"
                />
              </>
            )}

            {step.slug === "understanding" && (
              <div className="flex flex-col gap-3 rounded-[18px] bg-surface p-[18px]">
                <p className="text-[16px] font-semibold text-brand-accent">
                  ทำความเข้าใจพระคัมภีร์ตอนนี้
                </p>
                <p className="text-[16px] font-medium text-ink">
                  {dayContent.understanding.question}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {dayContent.understanding.explanation.map((point, i) => (
                    <li key={i} className="flex gap-2.5 text-[16px] text-ink-muted">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand-accent"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step.slug === "reflection" && (
              <div className="flex flex-col gap-2.5 rounded-[18px] bg-surface-tint p-[18px]">
                <p className="text-[16px] font-semibold text-brand-accent">
                  ข้อคิดและการตอบสนอง
                </p>
                <p className="text-[16px] text-ink-muted">
                  {dayContent.reflection}
                </p>
              </div>
            )}

            {step.slug === "journal" &&
              TEMPLATE_COPY.journalPrompts.map((prompt, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <p className="text-[16px] font-semibold text-ink">
                    {prompt.label}
                  </p>
                  <textarea
                    value={journalAnswers[i]}
                    onChange={(e) =>
                      setJournalAnswers((prev) => {
                        const next = [...prev] as [string, string];
                        next[i] = e.target.value;
                        return next;
                      })
                    }
                    placeholder={prompt.placeholder}
                    className="h-[110px] w-full flex-none resize-none rounded-2xl border border-fieldline-strong bg-surface p-4 text-[16px] text-ink placeholder:text-ink-faint focus:border-brand-accent focus:outline-none"
                  />
                </div>
              ))}

            {step.slug === "closing-prayer" && (
              <>
                <div className="flex flex-col gap-2.5 rounded-[18px] bg-surface p-[18px]">
                  <p className="text-[16px] font-semibold text-brand-accent">
                    อธิษฐาน
                  </p>
                  <p className="text-[16px] text-ink-muted">
                    {dayContent.closingPrayer}
                  </p>
                </div>
                <textarea
                  value={closingAnswer}
                  onChange={(e) => setClosingAnswer(e.target.value)}
                  placeholder="พิมพ์คำอธิษฐานของคุณ…"
                  className="h-[120px] w-full flex-none resize-none rounded-2xl border border-fieldline-strong bg-surface p-4 text-[16px] text-ink placeholder:text-ink-faint focus:border-brand-accent focus:outline-none"
                />
              </>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-hairline bg-app px-6 pt-3 pb-6">
          <div className="flex gap-3">
            {stepNumber > 1 && (
              <div className="shrink-0 basis-[112px]">
                <OutlineButton onClick={handleBack} className="!w-auto px-6">
                  ก่อนหน้า
                </OutlineButton>
              </div>
            )}
            <div className="flex-1">
              <PrimaryButton onClick={handleContinue} disabled={!canContinue}>
                {step.buttonLabel}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
