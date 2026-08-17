import { useNavigate } from "react-router-dom";

export function StepHeader({ step, total }: { step: number; total: number }) {
  const navigate = useNavigate();
  return (
    <div className="flex h-7 w-full items-center justify-between text-sm font-medium">
      <button
        type="button"
        onClick={() => navigate("/today")}
        className="text-brand"
      >
        ‹ วันนี้
      </button>
      <span className="text-ink-muted">
        ขั้นที่ {step} จาก {total}
      </span>
    </div>
  );
}
