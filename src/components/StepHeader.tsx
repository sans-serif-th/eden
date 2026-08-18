import { useNavigate } from "react-router-dom";

export function StepHeader({
  step,
  total,
  backTo = "/today",
  backLabel = "วันนี้",
}: {
  step: number;
  total: number;
  backTo?: string;
  backLabel?: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex h-7 w-full items-center justify-between text-[16px] font-medium">
      <button
        type="button"
        onClick={() => navigate(backTo)}
        className="text-brand"
      >
        ‹ {backLabel}
      </button>
      <span className="text-ink-muted">
        ขั้นที่ {step} จาก {total}
      </span>
    </div>
  );
}
