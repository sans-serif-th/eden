import { useState } from "react";
import { useParams } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { STEP_DEFINITIONS, TEMPLATE_COPY } from "../data/stepDefinitions";
import { getDayContent, hasUnderstandingStep } from "../data/dayContent";
import { useAppState } from "../AppState";

function orderOf(slug: string) {
  return STEP_DEFINITIONS.find((s) => s.slug === slug)!.order;
}

const answerFieldClass =
  "h-[110px] w-full flex-none resize-none rounded-2xl border border-fieldline-strong bg-app p-3 text-[16px] text-ink focus:border-brand-accent focus:outline-none";

function EditActions({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="mt-1 flex gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 rounded-full border border-fieldline-strong py-2 text-[14px] font-medium text-ink-muted"
      >
        ยกเลิก
      </button>
      <button
        type="button"
        onClick={onSave}
        className="flex-1 rounded-full bg-brand py-2 text-[14px] font-medium text-white"
      >
        บันทึก
      </button>
    </div>
  );
}

function Block({
  label,
  content,
  answer,
  answerLabel,
  onSaveAnswer,
}: {
  label: string;
  content: string;
  answer?: string;
  answerLabel?: string;
  onSaveAnswer?: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(answer ?? "");

  return (
    <div className="flex flex-col gap-2.5 rounded-[18px] bg-surface p-[18px]">
      <p className="text-[16px] font-semibold text-brand-accent">{label}</p>
      <p className="text-[16px] text-ink-muted">{content}</p>
      {answer !== undefined && (
        <div className="mt-1 flex flex-col gap-1.5 border-t border-hairline pt-3">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-medium text-ink">
              {answerLabel ?? "คำตอบของคุณ"}
            </p>
            {onSaveAnswer && !editing && (
              <button
                type="button"
                onClick={() => {
                  setDraft(answer);
                  setEditing(true);
                }}
                className="text-[14px] font-medium text-brand-accent"
              >
                แก้ไข
              </button>
            )}
          </div>
          {editing ? (
            <>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className={answerFieldClass}
              />
              <EditActions
                onCancel={() => setEditing(false)}
                onSave={() => {
                  onSaveAnswer?.(draft);
                  setEditing(false);
                }}
              />
            </>
          ) : (
            <p className="text-[16px] whitespace-pre-wrap text-ink-muted">
              {answer.trim().length > 0 ? answer : "(ไม่ได้บันทึกคำตอบ)"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function JournalBlock({
  keys,
  answers,
  onSaveAnswers,
}: {
  keys: [string, string];
  answers: Record<string, string>;
  onSaveAnswers: (values: [string, string]) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<[string, string]>([
    answers[keys[0]] ?? "",
    answers[keys[1]] ?? "",
  ]);

  return (
    <div className="flex flex-col gap-2.5 rounded-[18px] bg-surface p-[18px]">
      <div className="flex items-center justify-between">
        <p className="text-[16px] font-semibold text-brand-accent">บันทึก</p>
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setDraft([answers[keys[0]] ?? "", answers[keys[1]] ?? ""]);
              setEditing(true);
            }}
            className="text-[14px] font-medium text-brand-accent"
          >
            แก้ไข
          </button>
        )}
      </div>
      {TEMPLATE_COPY.journalPrompts.map((prompt, i) => (
        <div
          key={i}
          className="flex flex-col gap-1.5 border-t border-hairline pt-3 first:border-0 first:pt-0"
        >
          <p className="text-[16px] font-medium text-ink">{prompt.label}</p>
          {editing ? (
            <textarea
              value={draft[i]}
              onChange={(e) =>
                setDraft((prev) => {
                  const next = [...prev] as [string, string];
                  next[i] = e.target.value;
                  return next;
                })
              }
              className={answerFieldClass}
            />
          ) : (
            <p className="text-[16px] whitespace-pre-wrap text-ink-muted">
              {answers[keys[i]]?.trim() || "(ไม่ได้บันทึกคำตอบ)"}
            </p>
          )}
        </div>
      ))}
      {editing && (
        <EditActions
          onCancel={() => setEditing(false)}
          onSave={() => {
            onSaveAnswers(draft);
            setEditing(false);
          }}
        />
      )}
    </div>
  );
}

export function DaySummaryPage() {
  const { day: dayParam } = useParams();
  const { activeEnrollment, setDayAnswer } = useAppState();

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
        <div className="sticky top-0 z-10 bg-app px-6">
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
            onSaveAnswer={(v) =>
              setDayAnswer(day, `${orderOf("reading")}-reading`, v)
            }
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

          <JournalBlock
            keys={[
              `${orderOf("journal")}-journal-0`,
              `${orderOf("journal")}-journal-1`,
            ]}
            answers={answers}
            onSaveAnswers={([a, b]) => {
              setDayAnswer(day, `${orderOf("journal")}-journal-0`, a);
              setDayAnswer(day, `${orderOf("journal")}-journal-1`, b);
            }}
          />

          <Block
            label="อธิษฐาน"
            content={dayContent.closingPrayer}
            answer={answers[`${orderOf("closing-prayer")}-closing`] ?? ""}
            answerLabel="คำอธิษฐานของคุณ"
            onSaveAnswer={(v) =>
              setDayAnswer(day, `${orderOf("closing-prayer")}-closing`, v)
            }
          />
        </div>
      </div>
    </ScreenShell>
  );
}
