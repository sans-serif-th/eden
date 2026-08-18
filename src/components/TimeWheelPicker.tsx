import { useEffect, useRef } from "react";

const ROW_HEIGHT = 44;
const VISIBLE_ROWS = 7;
const PICKER_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS;

function parseTime(value: string) {
  const [h, m] = value.split(":").map(Number);
  return { hour: h, minute: m };
}

function formatTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

function WheelColumn<T extends string | number>({
  items,
  selected,
  onSelect,
  format,
}: {
  items: T[];
  selected: T;
  onSelect: (item: T) => void;
  format: (item: T) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const suppressScroll = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const selectedIndex = items.indexOf(selected);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targetTop = selectedIndex * ROW_HEIGHT;
    if (Math.abs(el.scrollTop - targetTop) > 1) {
      suppressScroll.current = true;
      el.scrollTo({ top: targetTop, behavior: "auto" });
      requestAnimationFrame(() => {
        suppressScroll.current = false;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  const handleScroll = () => {
    if (suppressScroll.current) return;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const index = Math.round(el.scrollTop / ROW_HEIGHT);
      const clamped = Math.max(0, Math.min(items.length - 1, index));
      const item = items[clamped];
      if (item !== selected) onSelect(item);
    }, 120);
  };

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      className="no-scrollbar flex-1 overflow-y-scroll"
      style={{
        height: PICKER_HEIGHT,
        scrollSnapType: "y mandatory",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 28%, black 72%, transparent)",
        maskImage:
          "linear-gradient(to bottom, transparent, black 28%, black 72%, transparent)",
      }}
    >
      <div style={{ height: ROW_HEIGHT * 3 }} />
      {items.map((item, i) => (
        <div
          key={String(item)}
          onClick={() =>
            ref.current?.scrollTo({ top: i * ROW_HEIGHT, behavior: "smooth" })
          }
          className={`flex cursor-pointer items-center justify-center text-[22px] transition-colors ${
            i === selectedIndex ? "font-semibold text-ink" : "text-ink-faint"
          }`}
          style={{ height: ROW_HEIGHT, scrollSnapAlign: "center" }}
        >
          {format(item)}
        </div>
      ))}
      <div style={{ height: ROW_HEIGHT * 3 }} />
    </div>
  );
}

export function TimeWheelPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { hour, minute } = parseTime(value);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-fieldline bg-surface"
      style={{ height: PICKER_HEIGHT }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-3 top-1/2 -translate-y-1/2 rounded-xl bg-app"
        style={{ height: ROW_HEIGHT }}
      />
      <div className="relative flex h-full">
        <WheelColumn
          items={HOURS}
          selected={hour}
          onSelect={(h) => onChange(formatTime(h, minute))}
          format={(h) => String(h).padStart(2, "0")}
        />
        <div
          className="flex items-center justify-center text-[22px] font-semibold text-ink"
          style={{ width: 12 }}
        >
          :
        </div>
        <WheelColumn
          items={MINUTES}
          selected={minute}
          onSelect={(m) => onChange(formatTime(hour, m))}
          format={(m) => String(m).padStart(2, "0")}
        />
        <div
          className="flex items-center justify-center text-[16px] font-medium text-ink-muted"
          style={{ width: 32 }}
        >
          น.
        </div>
      </div>
    </div>
  );
}
