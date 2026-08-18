import type { DayContent } from "../types";
import book01Raw from "./content/book-01.json";
import book02Raw from "./content/book-02.json";

interface RawDay {
  day: number;
  citation: string;
  scriptureReference: string;
  steps: {
    memoryVerse: string;
    reading: { teaser: string };
    understanding: { question: string; explanation: string[] };
    reflection: string;
    closingPrayer: string;
    needsReview?: boolean;
    reviewNote?: string;
  };
}

function toDayContent(raw: RawDay, book: number): DayContent {
  return {
    day: raw.day,
    book,
    citation: raw.citation,
    scriptureReference: raw.scriptureReference,
    memoryVerse: raw.steps.memoryVerse,
    reading: raw.steps.reading,
    understanding: raw.steps.understanding,
    reflection: raw.steps.reflection,
    closingPrayer: raw.steps.closingPrayer,
  };
}

const book1Days: DayContent[] = (book01Raw as RawDay[]).map((d) =>
  toDayContent(d, 1),
);
const book2Days: DayContent[] = (book02Raw as RawDay[]).map((d) =>
  toDayContent(d, 2),
);

const CONTENT_BY_LEVEL_BOOK: Record<string, Record<number, DayContent[]>> = {
  "year-1": {
    1: book1Days,
    2: book2Days,
  },
};

export function getDayContent(
  level: string,
  book: number,
  day: number,
): DayContent | undefined {
  return CONTENT_BY_LEVEL_BOOK[level]?.[book]?.find((d) => d.day === day);
}

// A Day has real ทำความเข้าใจพระคัมภีร์ content only when the source book
// actually included that section — some Days go straight from the reading
// into ข้อคิดและการตอบสนอง instead. The UI should skip step 4 entirely for
// those Days rather than show a blank section.
export function hasUnderstandingStep(day: DayContent): boolean {
  return day.understanding.question.trim().length > 0;
}
