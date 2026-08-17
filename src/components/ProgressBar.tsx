export function ProgressBar({
  percent,
  thick = false,
}: {
  percent: number;
  thick?: boolean;
}) {
  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-track ${thick ? "h-2" : "h-1.5"}`}
    >
      <div
        className={`rounded-full bg-brand-accent ${thick ? "h-2" : "h-1.5"}`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}
