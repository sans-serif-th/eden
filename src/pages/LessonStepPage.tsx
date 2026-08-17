import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { StepHeader } from "../components/StepHeader";
import { ProgressBar } from "../components/ProgressBar";
import { PrimaryButton } from "../components/PrimaryButton";
import { currentBook, lessonSteps, TOTAL_STEPS } from "../data/lessonSteps";
import { useAppState } from "../AppState";

export function LessonStepPage() {
  const { step: stepParam } = useParams();
  const navigate = useNavigate();
  const { currentDay, answers, setAnswer, completeStep } = useAppState();

  const stepNumber = Number(stepParam);
  const step = lessonSteps[stepNumber - 1];
  const [draft, setDraft] = useState(answers[stepNumber] ?? "");

  if (!step) return null;

  const handleContinue = () => {
    if (step.privateField) setAnswer(stepNumber, draft);
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
          {currentBook.shortTitle} &nbsp;•&nbsp; วันที่ {currentDay}
        </p>

        <ProgressBar percent={(stepNumber / TOTAL_STEPS) * 100} thick={false} />

        <div
          className={`flex flex-col gap-2.5 rounded-[18px] p-[18px] ${
            step.tinted ? "bg-surface-tint" : "bg-surface"
          }`}
        >
          <p
            className={`text-[13px] font-semibold ${
              step.tinted ? "text-brand-accent" : "text-brand-accent"
            }`}
          >
            {step.contentLabel}
          </p>
          {step.contentTitle && (
            <p className="text-[17px] font-medium text-ink">
              {step.contentTitle}
            </p>
          )}
          {step.contentBody && (
            <p className="text-sm text-ink-muted">{step.contentBody}</p>
          )}
        </div>

        {step.privateField ? (
          <>
            <p className="text-sm font-semibold text-ink">
              {step.privateField.label}
            </p>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={step.privateField.placeholder}
              className="h-[150px] w-full flex-none resize-none rounded-2xl border border-fieldline-strong bg-surface p-4 text-[15px] text-ink placeholder:text-ink-faint focus:border-brand-accent focus:outline-none"
            />
            {step.privateField.footerNote && (
              <p className="text-xs text-ink-muted">
                {step.privateField.footerNote}
              </p>
            )}
          </>
        ) : (
          step.helperText && (
            <p className="text-[13px] text-ink-muted">{step.helperText}</p>
          )
        )}

        <div className="flex-1" />

        <PrimaryButton onClick={handleContinue}>
          {step.buttonLabel}
        </PrimaryButton>
      </div>
    </ScreenShell>
  );
}
