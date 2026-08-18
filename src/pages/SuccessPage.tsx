import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { OutlineButton, PrimaryButton } from "../components/PrimaryButton";
import { currentBook } from "../data/books";
import { useAppState } from "../AppState";

export function SuccessPage() {
  const navigate = useNavigate();
  const { currentDay, totalDays } = useAppState();

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col items-center justify-between pt-12">
        <div className="flex w-full flex-col items-center gap-6 px-6">
          <div className="flex size-[92px] items-center justify-center rounded-full bg-brand-soft">
            <Check size={44} strokeWidth={3} className="text-brand" />
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-[27px] font-semibold text-ink">
              เสร็จสิ้นวันนี้แล้ว
            </h1>
            <p className="text-[15px] text-ink-muted">
              บันทึกและความคืบหน้าของคุณถูกเก็บเรียบร้อย
            </p>
          </div>
          <div className="flex w-full flex-col gap-2.5 rounded-[18px] bg-surface p-[18px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
            <p className="text-sm font-medium text-brand-accent">
              {currentBook.title}
            </p>
            <p className="text-[19px] font-semibold text-ink">
              วันที่ {currentDay} จาก {totalDays}
            </p>
            <p className="text-sm text-ink-muted">
              บทเรียนถัดไปจะพร้อมในวันถัดไป
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 p-6">
          <OutlineButton onClick={() => navigate("/history")}>
            ดูบันทึกของวันนี้
          </OutlineButton>
          <PrimaryButton onClick={() => navigate("/today")}>
            กลับหน้าวันนี้
          </PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}
