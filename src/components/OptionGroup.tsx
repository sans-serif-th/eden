export function OptionGroup<T extends string | number>({
  options,
  value,
  onChange,
  formatLabel = (o) => String(o),
}: {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  formatLabel?: (option: T) => string;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`flex h-12 w-full items-center rounded-2xl border px-4 text-[16px] font-medium transition-colors ${
              selected
                ? "border-brand-accent bg-surface-tint text-brand"
                : "border-fieldline bg-surface text-ink"
            }`}
          >
            {formatLabel(option)}
          </button>
        );
      })}
    </div>
  );
}
