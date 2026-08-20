import { Sprout } from "lucide-react";
import { ScreenShell } from "../components/ScreenShell";
import { ScreenHeader } from "../components/ScreenHeader";

export function AboutPage() {
  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="px-6">
          <ScreenHeader title="เกี่ยวกับเรา" />
        </div>
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-4">
          <div className="flex flex-col items-center gap-4 rounded-[22px] bg-surface p-6 text-center shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
            <div className="flex size-14 items-center justify-center rounded-full bg-surface-tint">
              <Sprout size={28} className="text-brand" strokeWidth={2} />
            </div>
            <p className="text-[19px] font-semibold text-ink">
              ทุกการเติบโต เริ่มต้นจากเมล็ดเล็ก ๆ
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-[16px] leading-relaxed text-ink-muted">
              เช่นเดียวกับต้นไม้ที่เติบโตจากเมล็ดพันธุ์เล็ก ๆ
              ความเชื่อของเราก็เติบโตผ่านช่วงเวลาที่ได้ใช้กับพระเจ้า
            </p>
            <p className="text-[16px] leading-relaxed text-ink-muted">
              Eden ตั้งใจสร้างพื้นที่เรียบง่ายสำหรับการเฝ้าเดี่ยว อธิษฐาน
              และบันทึกการเดินทางฝ่ายจิตวิญญาณในแต่ละวัน
            </p>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
