import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { OptionGroup } from "../components/OptionGroup";
import { TimeWheelPicker } from "../components/TimeWheelPicker";
import { BottomSheet } from "../components/BottomSheet";
import { placeOptions, durationOptions } from "../data/onboarding";
import { useAppState } from "../AppState";

type EditableField = "time" | "place" | "duration" | null;

export function SettingsPage() {
  const navigate = useNavigate();
  const { onboarding, setOnboardingAnswer } = useAppState();
  const [openField, setOpenField] = useState<EditableField>(null);

  const rows: { field: EditableField; label: string; value: string }[] = [
    {
      field: "time",
      label: "เวลาที่เหมาะสมที่สุด",
      value: `${onboarding.preferredTime} น.`,
    },
    {
      field: "place",
      label: "สถานที่ที่เหมาะสมที่สุด",
      value: onboarding.preferredPlace,
    },
    {
      field: "duration",
      label: "ระยะเวลาที่ตั้งใจ",
      value: `${onboarding.preferredDurationMinutes} นาที`,
    },
  ];

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="px-6">
          <ScreenHeader title="แก้ไขข้อมูลเฝ้าเดี่ยว" />
        </div>
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-6 py-4">
          <div className="flex flex-col rounded-[18px] bg-surface shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
            {rows.map((row, i) => (
              <button
                key={row.field}
                type="button"
                onClick={() => setOpenField(row.field)}
                className={`flex items-center justify-between gap-3 px-4 py-3.5 text-left ${
                  i > 0 ? "border-t border-hairline" : ""
                }`}
              >
                <span className="text-[16px] text-ink-muted">
                  {row.label}
                </span>
                <span className="flex items-center gap-1 text-[16px] font-medium text-ink">
                  {row.value}
                  <ChevronRight size={18} className="text-ink-faint" />
                </span>
              </button>
            ))}
          </div>
        </div>

        <BottomSheet
          open={openField === "time"}
          onClose={() => setOpenField(null)}
          title="เวลาที่เหมาะสมที่สุดสำหรับข้าพเจ้าในการเฝ้าเดี่ยวคือ"
        >
          <TimeWheelPicker
            value={onboarding.preferredTime}
            onChange={(v) => setOnboardingAnswer("preferredTime", v)}
          />
          <PrimaryButton onClick={() => setOpenField(null)}>
            บันทึก
          </PrimaryButton>
        </BottomSheet>

        <BottomSheet
          open={openField === "place"}
          onClose={() => setOpenField(null)}
          title="สถานที่ที่เหมาะสมที่สุดสำหรับการเฝ้าเดี่ยวคือ"
        >
          <OptionGroup
            options={placeOptions}
            value={onboarding.preferredPlace}
            onChange={(v) => setOnboardingAnswer("preferredPlace", v)}
          />
          <PrimaryButton onClick={() => setOpenField(null)}>
            บันทึก
          </PrimaryButton>
        </BottomSheet>

        <BottomSheet
          open={openField === "duration"}
          onClose={() => setOpenField(null)}
          title="ข้าพเจ้าตั้งใจจะใช้เวลาเข้าเฝ้าพระเจ้าแต่ละวันประมาณ"
        >
          <OptionGroup
            options={durationOptions}
            value={onboarding.preferredDurationMinutes}
            onChange={(v) =>
              setOnboardingAnswer("preferredDurationMinutes", v)
            }
            formatLabel={(m) => `${m} นาที`}
          />
          <PrimaryButton onClick={() => setOpenField(null)}>
            บันทึก
          </PrimaryButton>
        </BottomSheet>

        <div className="p-6">
          <PrimaryButton onClick={() => navigate("/profile")}>
            เสร็จสิ้น
          </PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}
