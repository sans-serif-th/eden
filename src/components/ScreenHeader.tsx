import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

export function ScreenHeader({
  title,
  right,
}: {
  title: string;
  right?: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex h-[52px] w-full items-center justify-between py-3">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="ย้อนกลับ"
        className="flex size-6 items-center justify-center text-ink"
      >
        <ArrowLeft size={24} />
      </button>
      <p className="text-[17px] font-semibold text-ink">{title}</p>
      <div className="flex size-6 items-center justify-center">{right}</div>
    </div>
  );
}
