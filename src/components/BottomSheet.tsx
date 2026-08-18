import type { ReactNode } from "react";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-[430px] rounded-t-[24px] bg-app p-6 pb-8">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-fieldline" />
        <p className="mb-4 text-[19px] font-semibold text-ink">{title}</p>
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
