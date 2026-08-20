import { BookOpen, Gauge, History, User } from "lucide-react";
import { Link } from "react-router-dom";

type NavKey = "today" | "books" | "history" | "profile";

const items: {
  key: NavKey;
  label: string;
  icon: typeof BookOpen;
  to?: string;
}[] = [
  { key: "today", label: "วันนี้", icon: BookOpen, to: "/today" },
  { key: "books", label: "ภาพรวม", icon: Gauge, to: "/stats" },
  { key: "history", label: "ประวัติ", icon: History, to: "/history" },
  { key: "profile", label: "โปรไฟล์", icon: User, to: "/profile" },
];

export function BottomNav({ active }: { active: NavKey }) {
  return (
    <nav className="flex h-[72px] w-full items-center justify-between rounded-3xl border-t border-hairline bg-white p-2">
      {items.map(({ key, label, icon: Icon, to }) => {
        const isActive = key === active;
        const content = (
          <div className="relative flex h-full flex-1 flex-col items-center justify-center gap-1 py-1.5">
            {isActive && (
              <div className="absolute top-1/2 left-1/2 h-1 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10" />
            )}
            <Icon
              size={24}
              strokeWidth={2}
              className={isActive ? "text-brand" : "text-nav-inactive"}
            />
            <span
              className={`text-[11px] ${isActive ? "font-semibold text-brand" : "font-normal text-nav-inactive"}`}
            >
              {label}
            </span>
          </div>
        );
        return to ? (
          <Link key={key} to={to} className="flex h-full flex-1">
            {content}
          </Link>
        ) : (
          <div key={key} className="flex h-full flex-1 opacity-60">
            {content}
          </div>
        );
      })}
    </nav>
  );
}
