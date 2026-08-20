import { useState } from "react";
import { Check, ChevronRight, Copy, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { BottomNav } from "../components/BottomNav";
import { mockUserName } from "../data/user";
import { useAppState } from "../AppState";

export function ProfilePage() {
  const navigate = useNavigate();
  const { userId, lineProfile, onboarding, logout } = useAppState();
  const [copied, setCopied] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCopyUserId = () => {
    if (!userId) return;
    void navigator.clipboard.writeText(userId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const settingsRows: { label: string; value: string }[] = [
    {
      label: "เวลาที่เหมาะสมที่สุด",
      value: `${onboarding.preferredTime} น.`,
    },
    { label: "สถานที่ที่เหมาะสมที่สุด", value: onboarding.preferredPlace },
    {
      label: "ระยะเวลาที่ตั้งใจ",
      value: `${onboarding.preferredDurationMinutes} นาที`,
    },
  ];

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-6 px-6 pt-6 pb-[140px]">
          <div className="flex flex-col items-center gap-3 pt-4">
            {lineProfile?.pictureUrl ? (
              <img
                src={lineProfile.pictureUrl}
                alt=""
                className="size-16 rounded-full object-cover"
              />
            ) : (
              <div className="size-16 rounded-full bg-brand-soft" />
            )}
            <p className="text-[17px] font-semibold text-ink">
              {lineProfile?.displayName ?? mockUserName}
            </p>
            {userId && (
              <button
                type="button"
                onClick={handleCopyUserId}
                className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5"
              >
                <span className="font-mono text-[12px] text-ink-faint">
                  {userId}
                </span>
                {copied ? (
                  <Check size={13} className="shrink-0 text-brand-accent" />
                ) : (
                  <Copy size={13} className="shrink-0 text-ink-faint" />
                )}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[16px] font-medium text-ink-muted">ตั้งค่า</p>
            <button
              type="button"
              onClick={() => navigate("/settings")}
              className="flex flex-col rounded-[18px] bg-surface text-left shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]"
            >
              {settingsRows.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between gap-3 px-4 py-3.5 ${
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
                </div>
              ))}
            </button>
          </div>

          <div className="flex flex-col rounded-[18px] bg-surface shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
            <button
              type="button"
              onClick={() => navigate("/about")}
              className="px-4 py-3.5 text-left text-[16px] text-ink-muted"
            >
              เกี่ยวกับเรา
            </button>
            <button
              type="button"
              disabled
              className="border-t border-hairline px-4 py-3.5 text-left text-[16px] text-ink-faint"
            >
              แจ้งปัญหา/สนับสนุน
            </button>
            <button
              type="button"
              onClick={() => navigate("/terms")}
              className="border-t border-hairline px-4 py-3.5 text-left text-[16px] text-ink-muted"
            >
              เงื่อนไขการใช้บริการ
            </button>
            <button
              type="button"
              onClick={() => navigate("/privacy")}
              className="border-t border-hairline px-4 py-3.5 text-left text-[16px] text-ink-muted"
            >
              การคุ้มครองข้อมูลส่วนบุคคล (PDPA)
            </button>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-2xl border border-fieldline bg-surface px-4 py-3.5 text-left"
          >
            <LogOut size={20} className="text-red-600" />
            <span className="flex-1 text-[16px] font-medium text-red-600">
              ออกจากระบบ
            </span>
          </button>
          <p className="text-center text-[13px] text-ink-faint">
            เวอร์ชัน {__APP_VERSION__}
          </p>
        </div>

        <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 bg-app p-6">
          <BottomNav active="profile" />
        </div>
      </div>
    </ScreenShell>
  );
}
