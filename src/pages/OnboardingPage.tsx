import { useNavigate, useParams } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { ProgressBar } from "../components/ProgressBar";
import { OutlineButton, PrimaryButton } from "../components/PrimaryButton";
import { OptionGroup } from "../components/OptionGroup";
import { TimeWheelPicker } from "../components/TimeWheelPicker";
import {
  ONBOARDING_TOTAL_STEPS,
  durationOptions,
  placeOptions,
  startOptions,
} from "../data/onboarding";
import { useAppState } from "../AppState";

export function OnboardingPage() {
  const { step: stepParam } = useParams();
  const navigate = useNavigate();
  const { onboarding, setOnboardingAnswer, completeOnboarding } =
    useAppState();

  const stepNumber = Number(stepParam);
  if (!stepNumber || stepNumber < 1 || stepNumber > ONBOARDING_TOTAL_STEPS)
    return null;

  const handleContinue = () => {
    if (stepNumber >= ONBOARDING_TOTAL_STEPS) {
      completeOnboarding();
      navigate("/");
    } else {
      navigate(`/onboarding/${stepNumber + 1}`);
    }
  };

  const handleBack = () => navigate(`/onboarding/${stepNumber - 1}`);

  return (
    <ScreenShell>
      <div className="flex h-dvh flex-col">
        <div className="flex-1 overflow-y-auto px-6 pt-14 pb-32">
          <div className="flex flex-col gap-4">
            <p className="text-[16px] font-semibold text-brand">
              เวลานัดหมายกับพระเจ้า
            </p>
            <p className="text-[16px] font-medium text-ink-muted">
              ขั้นที่ {stepNumber} จาก {ONBOARDING_TOTAL_STEPS}
            </p>
            <ProgressBar
              percent={(stepNumber / ONBOARDING_TOTAL_STEPS) * 100}
            />

            {stepNumber === 1 && (
              <>
                <h1 className="text-2xl font-semibold text-ink">
                  เวลาที่เหมาะสมที่สุดสำหรับข้าพเจ้าในการเฝ้าเดี่ยวคือ
                </h1>
                <TimeWheelPicker
                  value={onboarding.preferredTime}
                  onChange={(v) => setOnboardingAnswer("preferredTime", v)}
                />
              </>
            )}

            {stepNumber === 2 && (
              <>
                <h1 className="text-2xl font-semibold text-ink">
                  สถานที่ที่เหมาะสมที่สุดสำหรับการเฝ้าเดี่ยวคือ
                </h1>
                <OptionGroup
                  options={placeOptions}
                  value={onboarding.preferredPlace}
                  onChange={(v) => setOnboardingAnswer("preferredPlace", v)}
                />
              </>
            )}

            {stepNumber === 3 && (
              <>
                <h1 className="text-2xl font-semibold text-ink">
                  ข้าพเจ้าตั้งใจจะใช้เวลาเข้าเฝ้าพระเจ้าแต่ละวันประมาณ
                </h1>
                <OptionGroup
                  options={durationOptions}
                  value={onboarding.preferredDurationMinutes}
                  onChange={(v) =>
                    setOnboardingAnswer("preferredDurationMinutes", v)
                  }
                  formatLabel={(m) => `${m} นาที`}
                />
              </>
            )}

            {stepNumber === 4 && (
              <>
                <h1 className="text-2xl font-semibold text-ink">
                  ข้าพเจ้าต้องการเริ่มเฝ้าเดี่ยว
                </h1>
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
                {stepNumber >= ONBOARDING_TOTAL_STEPS ? "เริ่มต้นใช้งาน" : "ถัดไป"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
