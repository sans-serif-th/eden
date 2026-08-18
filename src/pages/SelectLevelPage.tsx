import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { levels } from "../data/books";
import { useAppState } from "../AppState";

export function SelectLevelPage() {
  const navigate = useNavigate();
  const { activeEnrollment, requestLevelSwitch } = useAppState();
  const [chosenLevel, setChosenLevel] = useState(activeEnrollment.level);

  const handleContinue = () => {
    requestLevelSwitch(chosenLevel);
    navigate("/select-book");
  };

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="px-6">
          <ScreenHeader title="เลือกระดับ" />
        </div>
        <div className="flex flex-1 flex-col gap-4 px-6 py-4">
          <p className="text-[16px] font-semibold text-brand">EDEN</p>
          <h1 className="text-2xl font-semibold text-ink">
            เลือกระดับที่ต้องการเรียน
          </h1>
          <p className="text-[16px] text-ink-muted">
            แต่ละระดับมีคู่มือเฝ้าเดี่ยวของตัวเอง เลือกระดับที่เหมาะกับคุณ
          </p>
          {chosenLevel !== activeEnrollment.level && (
            <p className="rounded-2xl bg-surface-tint px-4 py-3 text-[16px] text-brand-accent">
              การเปลี่ยนระดับต้องตั้งแผนการเฝ้าเดี่ยวใหม่ แผนเดิมจะถูกเก็บไว้
              ไม่ลบข้อมูลที่เคยบันทึก
            </p>
          )}

          <div className="flex flex-col gap-2.5">
            {levels.map((level) => {
              const selected = level.value === chosenLevel;
              return (
                <button
                  key={level.value}
                  type="button"
                  disabled={!level.enabled}
                  onClick={() => setChosenLevel(level.value)}
                  className={`flex h-14 w-full items-center justify-between rounded-2xl border px-4 text-[16px] font-medium transition-colors disabled:cursor-not-allowed ${
                    selected
                      ? "border-brand-accent bg-surface-tint text-brand"
                      : level.enabled
                        ? "border-fieldline bg-surface text-ink"
                        : "border-fieldline bg-surface text-ink-faint"
                  }`}
                >
                  <span>{level.label}</span>
                  {!level.enabled && (
                    <span className="text-[16px] text-ink-faint">เร็ว ๆ นี้</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 p-6">
          <PrimaryButton onClick={handleContinue}>ถัดไป</PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}
