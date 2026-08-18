import { ChevronRight, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { BottomNav } from "../components/BottomNav";
import { mockUserName } from "../data/user";

export function ProfilePage() {
  const navigate = useNavigate();

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-6 px-6 py-6">
          <div className="flex flex-col items-center gap-3 pt-4">
            <div className="size-16 rounded-full bg-brand-soft" />
            <p className="text-[17px] font-semibold text-ink">{mockUserName}</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[16px] font-medium text-ink-muted">ตั้งค่า</p>
            <button
              type="button"
              onClick={() => navigate("/settings")}
              className="flex items-center gap-3 rounded-2xl border border-fieldline bg-surface px-4 py-3.5 text-left"
            >
              <Settings size={20} className="text-brand-accent" />
              <span className="flex-1 text-[16px] font-medium text-ink">
                แก้ไขข้อมูลเฝ้าเดี่ยว
              </span>
              <ChevronRight size={18} className="text-ink-faint" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <BottomNav active="profile" />
        </div>
      </div>
    </ScreenShell>
  );
}
