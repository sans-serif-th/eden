import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { PrimaryButton, OutlineButton } from "../components/PrimaryButton";
import { OptionGroup } from "../components/OptionGroup";
import { startOptions, type StartPreference } from "../data/onboarding";
import { getBook, levels } from "../data/books";
import { useAppState } from "../AppState";

export function NewPlanPage() {
  const navigate = useNavigate();
  const {
    activeEnrollment,
    pendingEnrollment,
    confirmPendingEnrollment,
    cancelPendingEnrollment,
    skipPendingBook,
  } = useAppState();
  const [startPreference, setStartPreference] =
    useState<StartPreference>("today");
  const [customStartDate, setCustomStartDate] = useState("");

  useEffect(() => {
    // Only guard against landing here directly with nothing pending (e.g. a
    // refresh) — this must not re-run after a deliberate confirm/cancel
    // clears pendingEnrollment, or it would race with and override the
    // explicit navigate() those handlers already do.
    if (!pendingEnrollment) navigate("/", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!pendingEnrollment) return null;

  const isLevelSwitch = pendingEnrollment.level !== activeEnrollment.level;
  const levelLabel = levels.find((l) => l.value === pendingEnrollment.level)?.label;
  const targetBook = getBook(pendingEnrollment.level, pendingEnrollment.book);
  const nextBookExists = !!getBook(
    pendingEnrollment.level,
    pendingEnrollment.book + 1,
  );

  const handleCancel = () => {
    cancelPendingEnrollment();
    navigate("/");
  };

  const handleConfirm = () => {
    confirmPendingEnrollment(startPreference, customStartDate);
    navigate("/today");
  };

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="px-6">
          <ScreenHeader title="ตั้งแผนการเฝ้าเดี่ยวใหม่" />
        </div>
        <div className="flex flex-1 flex-col gap-4 px-6 py-4">
          <p className="rounded-2xl bg-surface-tint px-4 py-3 text-[16px] text-brand-accent">
            {isLevelSwitch ? (
              <>คุณกำลังเปลี่ยนไปเรียน {levelLabel}</>
            ) : (
              <>
                คุณกำลังจะเริ่ม {targetBook?.title ?? `เล่มที่ ${pendingEnrollment.book}`}{" "}
                ต่อจาก {levelLabel}
              </>
            )}{" "}
            — แผนเดิมจะถูกเก็บไว้ (ไม่ลบข้อมูลที่เคยบันทึก) และเริ่มนับวันใหม่ตามแผนนี้
          </p>

          {!targetBook ? (
            <p className="text-[16px] text-ink-muted">
              ยังไม่มีเนื้อหาสำหรับเล่มนี้ในตอนนี้ กรุณารอการอัปเดต
            </p>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-ink">
                ต้องการเริ่มเฝ้าเดี่ยวเล่มนี้เมื่อไหร่
              </h1>
              <OptionGroup
                options={startOptions.map((o) => o.value)}
                value={startPreference}
                onChange={setStartPreference}
                formatLabel={(v) =>
                  startOptions.find((o) => o.value === v)?.label ?? v
                }
              />
              {startPreference === "custom" && (
                <input
                  type="date"
                  value={customStartDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-fieldline bg-surface px-4 text-[16px] font-medium text-ink focus:border-brand-accent focus:outline-none"
                />
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-3 p-6">
          <PrimaryButton onClick={handleConfirm} disabled={!targetBook}>
            เริ่มแผนใหม่
          </PrimaryButton>
          {!isLevelSwitch && nextBookExists && (
            <OutlineButton onClick={skipPendingBook}>
              ข้ามเล่มนี้ (เคยเรียนแล้ว)
            </OutlineButton>
          )}
          <OutlineButton onClick={handleCancel}>ยกเลิก</OutlineButton>
        </div>
      </div>
    </ScreenShell>
  );
}
