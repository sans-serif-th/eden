import { useNavigate } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { BottomNav } from "../components/BottomNav";
import { currentBook } from "../data/lessonSteps";
import { useAppState } from "../AppState";

export function SelectBookPage() {
  const navigate = useNavigate();
  const { selectBook } = useAppState();

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="px-6">
          <ScreenHeader title="เลือกเล่มที่เรียน" />
        </div>
        <div className="flex flex-1 flex-col gap-4 px-6 py-4">
          <p className="text-xs font-semibold text-brand">DAILY DEVOTION</p>
          <h1 className="text-2xl font-semibold text-ink">
            เลือกเล่มที่กำลังเรียน
          </h1>
          <p className="text-[15px] text-ink-muted">
            เริ่มต้นด้วยการเลือกระดับและคู่มือที่ต้องการเรียน
          </p>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-ink">ระดับ</label>
            <div className="flex h-9 w-full items-center justify-between rounded-2xl border border-fieldline bg-surface px-3 py-2.5">
              <span className="text-[16px] font-medium text-ink">
                ระดับเริ่มต้น
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-ink-muted"
              >
                <path
                  d="M4 6l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-medium text-ink">
              คู่มือเฝ้าเดี่ยว
            </span>
            <div className="flex flex-col gap-2 rounded-[18px] border-2 border-brand-accent bg-surface p-[18px]">
              <p className="text-[18px] font-semibold text-ink">
                {currentBook.title}
              </p>
              <p className="text-sm text-ink-muted">
                {currentBook.description}
              </p>
              <p className="text-[13px] font-medium text-brand-accent">
                0 / {currentBook.totalDays} วัน
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-6">
          <PrimaryButton
            onClick={() => {
              selectBook();
              navigate("/today");
            }}
          >
            เลือกเล่มนี้
          </PrimaryButton>
          <BottomNav active="today" />
        </div>
      </div>
    </ScreenShell>
  );
}
