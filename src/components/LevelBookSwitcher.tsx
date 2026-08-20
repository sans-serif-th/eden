import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getBook, levels } from "../data/books";

export function LevelBookSwitcher({
  selectedLevel,
  book,
}: {
  selectedLevel: string;
  book: number;
}) {
  const navigate = useNavigate();
  const level = levels.find((l) => l.value === selectedLevel);
  const bookDef = getBook(selectedLevel, book);

  return (
    <button
      type="button"
      onClick={() => navigate("/select-level")}
      className="flex items-center gap-1.5 rounded-full border border-fieldline bg-surface py-1.5 pr-2.5 pl-3 text-[16px] font-semibold text-ink"
    >
      <span>{level?.label ?? "เลือกระดับ"}</span>
      <span className="text-ink-faint">·</span>
      <span>{bookDef?.title ?? "—"}</span>
      <ChevronDown size={14} className="text-ink-faint" />
    </button>
  );
}
