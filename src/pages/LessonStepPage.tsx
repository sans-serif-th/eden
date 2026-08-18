import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
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
  const { step: stepParam } = useParams();
  const navigate = useNavigate();
  const { currentDay, answers, setAnswer, completeStep } = useAppState();

  const stepNumber = Number(stepParam);
  const step = STEP_DEFINITIONS[stepNumber - 1];
  const day = getDayContent(currentDay);

  // Some Days skip ทำความเข้าใจพระคัมภีร์ entirely in the source — never
  // show a blank step 4, whichever direction the user arrived from.
  useEffect(() => {
    if (
      day &&
      stepNumber === UNDERSTANDING_STEP &&
      !hasUnderstandingStep(day)
    ) {
      navigate(`/lesson/${UNDERSTANDING_STEP + 1}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepNumber, day]);

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

  if (!step || !day) return null;

  const persistDraft = () => {
    if (step.slug === "reading") setAnswer(`${stepNumber}-reading`, readingAnswer);
    if (step.slug === "closing-prayer")
      setAnswer(`${stepNumber}-closing`, closingAnswer);
    if (step.slug === "journal") {
      setAnswer(`${stepNumber}-journal-0`, journalAnswers[0]);
      setAnswer(`${stepNumber}-journal-1`, journalAnswers[1]);
    }
  };

  const handleContinue = () => {
    persistDraft();
    completeStep(stepNumber);
    if (stepNumber >= TOTAL_STEPS) {
      navigate("/success");
      return;
    }
    let next = stepNumber + 1;
    if (next === UNDERSTANDING_STEP && day && !hasUnderstandingStep(day)) {
      next += 1;
    }
    navigate(`/lesson/${next}`);
  };

  const handleBack = () => {
    persistDraft();
    let prev = stepNumber - 1;
    if (prev === UNDERSTANDING_STEP && day && !hasUnderstandingStep(day)) {
      prev -= 1;
    }
    navigate(`/lesson/${prev}`);
  };

  return (
    <ScreenShell>
      <div className="flex h-dvh flex-col">
        <div className="flex-1 overflow-y-auto px-6 pt-11 pb-32">
          <div className="flex flex-col gap-4">
            <StepHeader step={stepNumber} total={TOTAL_STEPS} />

            <h1 className="text-[25px] font-semibold text-ink">
              {step.title}
            </h1>
            <p className="text-sm font-medium text-brand-accent">
              {day.citation}
            </p>

            <ProgressBar percent={(stepNumber / TOTAL_STEPS) * 100} />

            {step.slug === "prayer" && (
              <div className="flex flex-col gap-2.5 rounded-[18px] bg-surface p-[18px]">
                <p className="text-[13px] font-semibold text-brand-accent">
                  อธิษฐาน
                </p>
                <p className="text-sm text-ink-muted">
                  {TEMPLATE_COPY.openingPrayerInstruction}
                </p>
              </div>
            )}

            {step.slug === "memory-verse" && (
              <div className="flex flex-col gap-2.5 rounded-[18px] bg-surface p-[18px]">
                <p className="text-[13px] font-semibold text-brand-accent">
                  ภาวนาพระวจนะ
                </p>
                <p className="text-sm text-ink-muted">{day.memoryVerse}</p>
              </div>
            )}

            {step.slug === "reading" && (
              <>
                <div className="flex flex-col gap-2.5 rounded-[18px] bg-surface-tint p-[18px]">
                  <p className="text-[13px] font-semibold text-brand-accent">
                    อ่านพระธรรม {day.scriptureReference}
                  </p>
                  <p className="text-sm text-ink-muted">
                    {day.reading.teaser}
                  </p>
                </div>
                <p className="text-sm font-semibold text-ink">
                  บันทึกคำตอบของคุณ
                </p>
                <textarea
                  value={readingAnswer}
                  onChange={(e) => setReadingAnswer(e.target.value)}
                  placeholder="พิมพ์สิ่งที่คุณได้รับจากบทเรียนวันนี้…"
                  className="h-[150px] w-full flex-none resize-none rounded-2xl border border-fieldline-strong bg-surface p-4 text-[15px] text-ink placeholder:text-ink-faint focus:border-brand-accent focus:outline-none"
                />
              </>
            )}

            {step.slug === "understanding" && (
              <div className="flex flex-col gap-3 rounded-[18px] bg-surface p-[18px]">
                <p className="text-[13px] font-semibold text-brand-accent">
                  ทำความเข้าใจพระคัมภีร์ตอนนี้
                </p>
                <p className="text-[15px] font-medium text-ink">
                  {day.understanding.question}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {day.understanding.explanation.map((point, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-ink-muted">
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
                <p className="text-[13px] font-semibold text-brand-accent">
                  ข้อคิดและการตอบสนอง
                </p>
                <p className="text-sm text-ink-muted">{day.reflection}</p>
              </div>
            )}

            {step.slug === "journal" &&
              TEMPLATE_COPY.journalPrompts.map((prompt, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-ink">
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
                    className="h-[110px] w-full flex-none resize-none rounded-2xl border border-fieldline-strong bg-surface p-4 text-[15px] text-ink placeholder:text-ink-faint focus:border-brand-accent focus:outline-none"
                  />
                </div>
              ))}

            {step.slug === "closing-prayer" && (
              <>
                <div className="flex flex-col gap-2.5 rounded-[18px] bg-surface p-[18px]">
                  <p className="text-[13px] font-semibold text-brand-accent">
                    อธิษฐาน
                  </p>
                  <p className="text-sm text-ink-muted">
                    {day.closingPrayer}
                  </p>
                </div>
                <textarea
                  value={closingAnswer}
                  onChange={(e) => setClosingAnswer(e.target.value)}
                  placeholder="พิมพ์คำอธิษฐานของคุณ…"
                  className="h-[120px] w-full flex-none resize-none rounded-2xl border border-fieldline-strong bg-surface p-4 text-[15px] text-ink placeholder:text-ink-faint focus:border-brand-accent focus:outline-none"
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
              <PrimaryButton onClick={handleContinue}>
                {step.buttonLabel}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
