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
import { getBook, levels } from "../data/books";
import { useAppState } from "../AppState";

export function OnboardingPage() {
  const { step: stepParam } = useParams();
  const navigate = useNavigate();
  const {
    onboarding,
    setOnboardingAnswer,
    completeOnboarding,
    activeEnrollment,
    setActiveLevel,
    setEnrollmentStart,
    acceptedTerms,
    acceptedPrivacy,
    setAcceptedTerms,
    setAcceptedPrivacy,
  } = useAppState();

  const stepNumber = Number(stepParam);
  if (!stepNumber || stepNumber < 1 || stepNumber > ONBOARDING_TOTAL_STEPS)
    return null;

  const onboardingBook = getBook(activeEnrollment.level, 1);
  const consentGiven = acceptedTerms && acceptedPrivacy;

  const handleContinue = () => {
    if (stepNumber >= ONBOARDING_TOTAL_STEPS) {
      if (!consentGiven) return;
      completeOnboarding();
      navigate("/today");
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
                  เลือกระดับที่ต้องการเรียน
                </h1>
                <p className="text-[16px] text-ink-muted">
                  แต่ละระดับมีคู่มือเฝ้าเดี่ยวของตัวเอง เลือกระดับที่เหมาะกับคุณ
                </p>
                <div className="flex flex-col gap-2.5">
                  {levels.map((level) => {
                    const selected = level.value === activeEnrollment.level;
                    return (
                      <button
                        key={level.value}
                        type="button"
                        disabled={!level.enabled}
                        onClick={() => setActiveLevel(level.value)}
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
                          <span className="text-[16px] text-ink-faint">
                            เร็ว ๆ นี้
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {stepNumber === 5 && (
              <>
                <h1 className="text-2xl font-semibold text-ink">
                  เลือกเล่มที่กำลังเรียน
                </h1>
                <p className="text-[16px] text-ink-muted">
                  เริ่มต้นด้วยการเลือกคู่มือที่ต้องการเรียน
                </p>
                <div className="flex flex-col gap-2 rounded-[18px] border-2 border-brand-accent bg-surface p-[18px]">
                  <p className="text-[18px] font-semibold text-ink">
                    {onboardingBook?.title ?? "—"}
                  </p>
                  <p className="text-[16px] text-ink-muted">
                    {onboardingBook?.description ?? "ยังไม่มีเนื้อหาสำหรับระดับนี้"}
                  </p>
                  {onboardingBook && (
                    <p className="text-[16px] font-medium text-brand-accent">
                      0 / {onboardingBook.totalDays} วัน
                    </p>
                  )}
                </div>
              </>
            )}

            {stepNumber === 6 && (
              <>
                <h1 className="text-2xl font-semibold text-ink">
                  ข้าพเจ้าต้องการเริ่มเฝ้าเดี่ยว
                </h1>
                <OptionGroup
                  options={startOptions.map((o) => o.value)}
                  value={activeEnrollment.startPreference}
                  onChange={(v) =>
                    setEnrollmentStart(v, activeEnrollment.customStartDate)
                  }
                  formatLabel={(v) =>
                    startOptions.find((o) => o.value === v)?.label ?? v
                  }
                />
                {activeEnrollment.startPreference === "custom" && (
                  <input
                    type="date"
                    value={activeEnrollment.customStartDate}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) =>
                      setEnrollmentStart(
                        activeEnrollment.startPreference,
                        e.target.value,
                      )
                    }
                    className="box-border h-14 w-full max-w-full rounded-2xl border border-fieldline bg-surface px-4 text-[16px] font-medium text-ink focus:border-brand-accent focus:outline-none"
                  />
                )}
              </>
            )}

            {stepNumber === 7 && (
              <>
                <h1 className="text-2xl font-semibold text-ink">
                  ก่อนเริ่มใช้งาน EDEN
                </h1>
                <p className="text-[16px] text-ink-muted">
                  กรุณายอมรับเงื่อนไขและนโยบายด้านล่างก่อนเริ่มต้นใช้งาน
                </p>
                <div className="flex flex-col gap-3">
                  <label className="flex items-start gap-3 rounded-2xl border border-fieldline bg-surface p-4">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 size-5 shrink-0 accent-brand"
                    />
                    <span className="text-[16px] text-ink">
                      ฉันยอมรับ
                      <button
                        type="button"
                        onClick={() => navigate("/terms")}
                        className="mx-1 font-medium text-brand-accent underline"
                      >
                        เงื่อนไขการใช้บริการ
                      </button>
                    </span>
                  </label>
                  <label className="flex items-start gap-3 rounded-2xl border border-fieldline bg-surface p-4">
                    <input
                      type="checkbox"
                      checked={acceptedPrivacy}
                      onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                      className="mt-0.5 size-5 shrink-0 accent-brand"
                    />
                    <span className="text-[16px] text-ink">
                      ฉันรับทราบ
                      <button
                        type="button"
                        onClick={() => navigate("/privacy")}
                        className="mx-1 font-medium text-brand-accent underline"
                      >
                        นโยบายความเป็นส่วนตัวและ PDPA
                      </button>
                      และยินยอมให้ EDEN ประมวลผลข้อมูลส่วนบุคคลตามนโยบายดังกล่าว
                    </span>
                  </label>
                </div>
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
              <PrimaryButton
                onClick={handleContinue}
                disabled={stepNumber >= ONBOARDING_TOTAL_STEPS && !consentGiven}
              >
                {stepNumber >= ONBOARDING_TOTAL_STEPS ? "เริ่มต้นใช้งาน" : "ถัดไป"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
