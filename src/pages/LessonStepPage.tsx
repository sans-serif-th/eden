import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { StepHeader } from "../components/StepHeader";
import { ProgressBar } from "../components/ProgressBar";
import { PrimaryButton } from "../components/PrimaryButton";
import {
  STEP_DEFINITIONS,
  TEMPLATE_COPY,
  TOTAL_STEPS,
} from "../data/stepDefinitions";
import { getDayContent } from "../data/dayContent";
import { useAppState } from "../AppState";

export function LessonStepPage() {
  const { step: stepParam } = useParams();
  const navigate = useNavigate();
  const { currentDay, answers, setAnswer, completeStep } = useAppState();

  const stepNumber = Number(stepParam);
  const step = STEP_DEFINITIONS[stepNumber - 1];
  const day = getDayContent(currentDay);

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

  const handleContinue = () => {
    if (step.slug === "reading") setAnswer(`${stepNumber}-reading`, readingAnswer);
    if (step.slug === "closing-prayer")
      setAnswer(`${stepNumber}-closing`, closingAnswer);
    if (step.slug === "journal") {
      setAnswer(`${stepNumber}-journal-0`, journalAnswers[0]);
      setAnswer(`${stepNumber}-journal-1`, journalAnswers[1]);
    }
    completeStep(stepNumber);
    if (stepNumber >= TOTAL_STEPS) navigate("/success");
    else navigate(`/lesson/${stepNumber + 1}`);
  };

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col gap-4 px-6 pt-11 pb-6">
        <StepHeader step={stepNumber} total={TOTAL_STEPS} />

        <h1 className="text-[25px] font-semibold text-ink">{step.title}</h1>
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
              <p className="text-sm text-ink-muted">{day.reading.teaser}</p>
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
          <div className="flex flex-col gap-2.5 rounded-[18px] bg-surface p-[18px]">
            <p className="text-[13px] font-semibold text-brand-accent">
              ทำความเข้าใจพระคัมภีร์ตอนนี้
            </p>
            <p className="text-[15px] font-medium text-ink">
              {day.understanding.question}
            </p>
            <p className="text-sm text-ink-muted">
              {day.understanding.explanation}
            </p>
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
              <p className="text-sm font-semibold text-ink">{prompt.label}</p>
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
              <p className="text-sm text-ink-muted">{day.closingPrayer}</p>
            </div>
            <textarea
              value={closingAnswer}
              onChange={(e) => setClosingAnswer(e.target.value)}
              placeholder="พิมพ์คำอธิษฐานของคุณ…"
              className="h-[120px] w-full flex-none resize-none rounded-2xl border border-fieldline-strong bg-surface p-4 text-[15px] text-ink placeholder:text-ink-faint focus:border-brand-accent focus:outline-none"
            />
          </>
        )}

        <div className="flex-1" />

        <PrimaryButton onClick={handleContinue}>
          {step.buttonLabel}
        </PrimaryButton>
      </div>
    </ScreenShell>
  );
}
