export type StepKind = "template" | "authored";

export interface StepDefinition {
  order: number;
  slug: string;
  title: string;
  kind: StepKind;
  buttonLabel: string;
}

export interface DayContent {
  day: number;
  book: number;
  citation: string;
  scriptureReference: string;
  memoryVerse: string;
  reading: { teaser: string };
  understanding: { question: string; explanation: string };
  reflection: string;
  closingPrayer: string;
}
