import type { ReactNode } from "react";

export function ScreenShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full justify-center bg-neutral-100">
      <div className="flex min-h-dvh w-full max-w-[430px] flex-col bg-app">
        {children}
      </div>
    </div>
  );
}
