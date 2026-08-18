import { useNavigate } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { OptionGroup } from "../components/OptionGroup";
import { TimeWheelPicker } from "../components/TimeWheelPicker";
import { placeOptions, durationOptions } from "../data/onboarding";
import { useAppState } from "../AppState";

export function SettingsPage() {
  const navigate = useNavigate();
  const { onboarding, setOnboardingAnswer } = useAppState();

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="px-6">
          <ScreenHeader title="แก้ไขข้อมูลเฝ้าเดี่ยว" />
        </div>
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-4">
          <div className="flex flex-col gap-3">
            <p className="text-[15px] font-semibold text-ink">
              เวลาที่เหมาะสมที่สุดสำหรับข้าพเจ้าในการเฝ้าเดี่ยวคือ
            </p>
            <TimeWheelPicker
              value={onboarding.preferredTime}
              onChange={(v) => setOnboardingAnswer("preferredTime", v)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[15px] font-semibold text-ink">
              สถานที่ที่เหมาะสมที่สุดสำหรับการเฝ้าเดี่ยวคือ
            </p>
            <OptionGroup
              options={placeOptions}
              value={onboarding.preferredPlace}
              onChange={(v) => setOnboardingAnswer("preferredPlace", v)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[15px] font-semibold text-ink">
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
