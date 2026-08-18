import { useParams } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { STEP_DEFINITIONS, TEMPLATE_COPY } from "../data/stepDefinitions";
import { getDayContent, hasUnderstandingStep } from "../data/dayContent";
import { useAppState } from "../AppState";

function orderOf(slug: string) {
  return STEP_DEFINITIONS.find((s) => s.slug === slug)!.order;
}

function Block({
  label,
  content,
  answer,
  answerLabel,
}: {
  label: string;
  content: string;
  answer?: string;
  answerLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-[18px] bg-surface p-[18px]">
      <p className="text-[16px] font-semibold text-brand-accent">{label}</p>
      <p className="text-[16px] text-ink-muted">{content}</p>
      {answer !== undefined && (
        <div className="mt-1 flex flex-col gap-1 border-t border-hairline pt-3">
          <p className="text-[16px] font-medium text-ink">
            {answerLabel ?? "คำตอบของคุณ"}
          </p>
          <p className="text-[16px] whitespace-pre-wrap text-ink-muted">
            {answer.trim().length > 0 ? answer : "(ไม่ได้บันทึกคำตอบ)"}
          </p>
        </div>
      )}
    </div>
  );
}

export function DaySummaryPage() {
  const { day: dayParam } = useParams();
  const { activeEnrollment } = useAppState();

  const day = Number(dayParam);
  const dayContent = getDayContent(
    activeEnrollment.level,
    activeEnrollment.book,
    day,
  );
  const record = activeEnrollment.dayRecords[day];
  const answers = record?.answers ?? {};

  if (!dayContent) return null;

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="px-6">
          <ScreenHeader title={`วันที่ ${day}`} />
        </div>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
          <p className="text-[16px] font-medium text-brand-accent">
            {dayContent.citation}
          </p>

          <Block label="อธิษฐาน" content={TEMPLATE_COPY.openingPrayerInstruction} />

          <Block label="ภาวนาพระวจนะ" content={dayContent.memoryVerse} />

          <Block
            label={`อ่านพระธรรม ${dayContent.scriptureReference}`}
            content={dayContent.reading.teaser}
            answer={answers[`${orderOf("reading")}-reading`] ?? ""}
          />

          {hasUnderstandingStep(dayContent) && (
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

          <Block label="ข้อคิดและการตอบสนอง" content={dayContent.reflection} />

          <div className="flex flex-col gap-2.5 rounded-[18px] bg-surface p-[18px]">
            <p className="text-[16px] font-semibold text-brand-accent">บันทึก</p>
            {TEMPLATE_COPY.journalPrompts.map((prompt, i) => (
              <div key={i} className="flex flex-col gap-1 border-t border-hairline pt-3 first:border-0 first:pt-0">
                <p className="text-[16px] font-medium text-ink">{prompt.label}</p>
                <p className="text-[16px] whitespace-pre-wrap text-ink-muted">
                  {answers[`${orderOf("journal")}-journal-${i}`]?.trim() || "(ไม่ได้บันทึกคำตอบ)"}
                </p>
              </div>
            ))}
          </div>

          <Block
            label="อธิษฐาน"
            content={dayContent.closingPrayer}
            answer={answers[`${orderOf("closing-prayer")}-closing`] ?? ""}
            answerLabel="คำอธิษฐานของคุณ"
          />
        </div>
      </div>
    </ScreenShell>
  );
}
