import type { ButtonHTMLAttributes } from "react";

export function PrimaryButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`flex h-12 w-full items-center justify-center rounded-2xl bg-brand text-[16px] font-semibold text-white transition-opacity active:opacity-90 disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export function OutlineButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`flex h-12 w-full items-center justify-center rounded-2xl border border-brand bg-surface text-[16px] font-semibold text-brand transition-opacity active:opacity-90 ${className}`}
      {...props}
    />
  );
}
