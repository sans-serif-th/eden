import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { OptionGroup } from "../components/OptionGroup";
import { TimeWheelPicker } from "../components/TimeWheelPicker";
import {
  placeOptions,
  durationOptions,
  startOptions,
  formatThaiDateShort,
  getPlanStartDate,
} from "../data/onboarding";
import { currentBook } from "../data/books";
import { useAppState } from "../AppState";

export function SettingsPage() {
  const navigate = useNavigate();
  const { onboarding, setOnboardingAnswer } = useAppState();
  const [isEditingPlan, setIsEditingPlan] = useState(false);

  const startDate = getPlanStartDate(
    onboarding.startPreference,
    onboarding.customStartDate,
  );
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + currentBook.totalDays - 1);

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="px-6">
          <ScreenHeader title="แก้ไขข้อมูลเฝ้าเดี่ยว" />
        </div>
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-4">
          <div className="flex flex-col gap-3">
            <p className="text-[16px] font-semibold text-ink">
              เวลาที่เหมาะสมที่สุดสำหรับข้าพเจ้าในการเฝ้าเดี่ยวคือ
            </p>
            <TimeWheelPicker
              value={onboarding.preferredTime}
              onChange={(v) => setOnboardingAnswer("preferredTime", v)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[16px] font-semibold text-ink">
              สถานที่ที่เหมาะสมที่สุดสำหรับการเฝ้าเดี่ยวคือ
            </p>
            <OptionGroup
              options={placeOptions}
              value={onboarding.preferredPlace}
              onChange={(v) => setOnboardingAnswer("preferredPlace", v)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[16px] font-semibold text-ink">
              ข้าพเจ้าตั้งใจจะใช้เวลาเข้าเฝ้าพระเจ้าแต่ละวันประมาณ
            </p>
            <OptionGroup
              options={durationOptions}
              value={onboarding.preferredDurationMinutes}
              onChange={(v) =>
                setOnboardingAnswer("preferredDurationMinutes", v)
              }
              formatLabel={(m) => `${m} นาที`}
            />
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[16px] font-semibold text-ink">แผนการเฝ้าเดี่ยว</p>
            <div className="flex items-center gap-2 text-[16px] text-ink-muted">
              <span>
                {formatThaiDateShort(startDate)} – {formatThaiDateShort(endDate)}
              </span>
              <button
                type="button"
                onClick={() => setIsEditingPlan((v) => !v)}
                className="font-semibold text-brand-accent"
              >
                (แก้ไข)
              </button>
            </div>

            {isEditingPlan && (
              <div className="flex flex-col gap-3 pt-1">
                <OptionGroup
                  options={startOptions.map((o) => o.value)}
                  value={onboarding.startPreference}
                  onChange={(v) => setOnboardingAnswer("startPreference", v)}
                  formatLabel={(v) =>
                    startOptions.find((o) => o.value === v)?.label ?? v
                  }
                />
                {onboarding.startPreference === "custom" && (
                  <input
                    type="date"
                    value={onboarding.customStartDate}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) =>
                      setOnboardingAnswer("customStartDate", e.target.value)
                    }
                    className="h-14 w-full rounded-2xl border border-fieldline bg-surface px-4 text-[16px] font-medium text-ink focus:border-brand-accent focus:outline-none"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <PrimaryButton onClick={() => navigate("/profile")}>
            บันทึก
          </PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}
