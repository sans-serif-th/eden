import { createContext, useContext, useState, type ReactNode } from "react";
import { TOTAL_STEPS } from "./data/lessonSteps";

type DevotionState = {
  bookSelected: boolean;
  currentDay: number;
  totalDays: number;
  currentStep: number; // 0 = not started, 1..TOTAL_STEPS = in progress, TOTAL_STEPS+1 = done today
  answers: Record<number, string>;
  selectBook: () => void;
  setAnswer: (step: number, value: string) => void;
  completeStep: (step: number) => void;
};

const AppStateContext = createContext<DevotionState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [bookSelected, setBookSelected] = useState(false);
  const [currentDay] = useState(4);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const value: DevotionState = {
    bookSelected,
    currentDay,
    totalDays: 30,
    currentStep,
    answers,
    selectBook: () => setBookSelected(true),
    setAnswer: (step, val) =>
      setAnswers((prev) => ({ ...prev, [step]: val })),
    completeStep: (step) =>
      setCurrentStep(step >= TOTAL_STEPS ? TOTAL_STEPS + 1 : step + 1),
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
