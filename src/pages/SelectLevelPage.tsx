import { useNavigate } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { BottomNav } from "../components/BottomNav";
import { levels } from "../data/books";
import { useAppState } from "../AppState";

export function SelectLevelPage() {
  const navigate = useNavigate();
  const { selectedLevel, selectLevel } = useAppState();

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

          <div className="flex flex-col gap-2.5">
            {levels.map((level) => {
              const selected = level.value === selectedLevel;
              return (
                <button
                  key={level.value}
                  type="button"
                  disabled={!level.enabled}
                  onClick={() => selectLevel(level.value)}
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
          <PrimaryButton onClick={() => navigate("/select-book")}>
            ถัดไป
          </PrimaryButton>
          <BottomNav active="today" />
        </div>
      </div>
    </ScreenShell>
  );
}
