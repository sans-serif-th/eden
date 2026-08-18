import type { DayContent } from "../types";
import book01Raw from "./content/book-01.json";

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

export const book1Days: DayContent[] = (book01Raw as RawDay[]).map((d) =>
  toDayContent(d, 1),
);

export function getDayContent(day: number): DayContent | undefined {
  return book1Days.find((d) => d.day === day);
}

// A Day has real ทำความเข้าใจพระคัมภีร์ content only when the source book
// actually included that section — 8 of Book 1's 31 Days go straight from
// the reading into ข้อคิดและการตอบสนอง instead. The UI should skip step 4
// entirely for those Days rather than show a blank section.
export function hasUnderstandingStep(day: DayContent): boolean {
  return day.understanding.question.trim().length > 0;
}
