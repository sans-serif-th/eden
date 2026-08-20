import { ScreenShell } from "../components/ScreenShell";
import { ScreenHeader } from "../components/ScreenHeader";

export function AboutPage() {
  return (
    <ScreenShell>
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <img
          src="/about-illustration.png"
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-app via-app/70 to-transparent px-6 pt-4 pb-10">
          <ScreenHeader title="เกี่ยวกับเรา" />
        </div>
        <div className="relative flex flex-col items-center gap-4 px-6 pt-14 text-center">
          <img
            src="/eden-logo.svg"
            alt="Eden"
            className="h-[62px] w-[190px]"
          />
          <div className="flex flex-col gap-2">
            <p className="text-[20px] font-bold text-ink">
              ทุกการเติบโต เริ่มต้นจากเมล็ดเล็ก ๆ
            </p>
            <p className="text-[16px] font-medium text-ink">
              เช่นเดียวกับต้นไม้ที่เติบโตจากเมล็ดพันธุ์เล็ก ๆ
              ความเชื่อของเราก็เติบโตผ่านช่วงเวลาที่ได้ใช้กับพระเจ้า
            </p>
            <p className="text-[16px] font-medium text-ink">
              Eden ตั้งใจสร้างพื้นที่เรียบง่ายสำหรับการเฝ้าเดี่ยว อธิษฐาน
              และบันทึกการเดินทางฝ่ายจิตวิญญาณในแต่ละวัน
            </p>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
