import { useNavigate } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { BottomNav } from "../components/BottomNav";
import { currentBook } from "../data/books";
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
          <p className="text-[16px] font-semibold text-brand">EDEN</p>
          <h1 className="text-2xl font-semibold text-ink">
            เลือกเล่มที่กำลังเรียน
          </h1>
          <p className="text-[16px] text-ink-muted">
            เริ่มต้นด้วยการเลือกคู่มือที่ต้องการเรียน
          </p>

          <div className="flex flex-col gap-2">
            <span className="text-[16px] font-medium text-ink">
              คู่มือเฝ้าเดี่ยว
            </span>
            <div className="flex flex-col gap-2 rounded-[18px] border-2 border-brand-accent bg-surface p-[18px]">
              <p className="text-[18px] font-semibold text-ink">
                {currentBook.title}
              </p>
              <p className="text-[16px] text-ink-muted">
                {currentBook.description}
              </p>
              <p className="text-[16px] font-medium text-brand-accent">
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
