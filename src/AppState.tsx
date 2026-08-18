import { createContext, useContext, useState, type ReactNode } from "react";
import { TOTAL_STEPS } from "./data/stepDefinitions";
import { getBookDayForDate, type StartPreference } from "./data/onboarding";

export interface OnboardingAnswers {
  preferredTime: string; // "HH:mm"
  preferredPlace: string;
  preferredDurationMinutes: number;
}

export interface Enrollment {
  level: string;
  startPreference: StartPreference;
  customStartDate: string;
  startedAt: string; // ISO date this Enrollment was created, for the archive list
}

type DevotionState = {
  onboardingComplete: boolean;
  onboarding: OnboardingAnswers;
  activeEnrollment: Enrollment;
  pastEnrollments: Enrollment[];
  pendingLevel: string | null; // set while switching Level/Book, awaiting a new start date
  bookSelected: boolean;
  currentDay: number;
  totalDays: number;
  currentStep: number; // 0 = not started, 1..TOTAL_STEPS = in progress, TOTAL_STEPS+1 = done today
  answers: Record<string, string>;
  setOnboardingAnswer: <K extends keyof OnboardingAnswers>(
    key: K,
    value: OnboardingAnswers[K],
  ) => void;
  completeOnboarding: () => void;
  setActiveLevel: (level: string) => void;
  setEnrollmentStart: (
    startPreference: StartPreference,
    customStartDate: string,
  ) => void;
  requestLevelSwitch: (level: string) => void;
  confirmLevelSwitch: (
    startPreference: StartPreference,
    customStartDate: string,
  ) => void;
  cancelLevelSwitch: () => void;
  selectBook: () => void;
  setAnswer: (key: string, value: string) => void;
  completeStep: (step: number) => void;
};

const AppStateContext = createContext<DevotionState | null>(null);

const defaultOnboarding: OnboardingAnswers = {
  preferredTime: "05:00",
  preferredPlace: "บ้าน",
  preferredDurationMinutes: 15,
};

const defaultEnrollment: Enrollment = {
  level: "year-1",
  startPreference: "today",
  customStartDate: "",
  startedAt: new Date().toISOString(),
};

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboarding, setOnboarding] =
    useState<OnboardingAnswers>(defaultOnboarding);
  const [activeEnrollment, setActiveEnrollment] =
    useState<Enrollment>(defaultEnrollment);
  const [pastEnrollments, setPastEnrollments] = useState<Enrollment[]>([]);
  const [pendingLevel, setPendingLevel] = useState<string | null>(null);
  const [bookSelected, setBookSelected] = useState(false);
  const currentDay = Math.max(
    1,
    getBookDayForDate(
      new Date(),
      activeEnrollment.startPreference,
      activeEnrollment.customStartDate,
    ),
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const value: DevotionState = {
    onboardingComplete,
    onboarding,
    activeEnrollment,
    pastEnrollments,
    pendingLevel,
    bookSelected,
    currentDay,
    totalDays: 366, // Year 1's Personal Calendar length (12 Books, leap-year edition)
    currentStep,
    answers,
    setOnboardingAnswer: (key, val) =>
      setOnboarding((prev) => ({ ...prev, [key]: val })),
    completeOnboarding: () => setOnboardingComplete(true),
    setActiveLevel: (level) =>
      setActiveEnrollment((prev) => ({ ...prev, level })),
    setEnrollmentStart: (startPreference, customStartDate) =>
      setActiveEnrollment((prev) => ({
        ...prev,
        startPreference,
        customStartDate,
      })),
    requestLevelSwitch: (level) => {
      if (level === activeEnrollment.level) return;
      setPendingLevel(level);
    },
    confirmLevelSwitch: (startPreference, customStartDate) => {
      if (!pendingLevel) return;
      setPastEnrollments((prev) => [...prev, activeEnrollment]);
      setActiveEnrollment({
        level: pendingLevel,
        startPreference,
        customStartDate,
        startedAt: new Date().toISOString(),
      });
      setPendingLevel(null);
      // A new Enrollment starts its own journey — today's in-progress step
      // and logged answers belong to the old plan and aren't touched.
      setCurrentStep(0);
    },
    cancelLevelSwitch: () => setPendingLevel(null),
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
