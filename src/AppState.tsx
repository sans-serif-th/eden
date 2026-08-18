import { createContext, useContext, useState, type ReactNode } from "react";
import { TOTAL_STEPS } from "./data/stepDefinitions";
import { getBookDayForDate, type StartPreference } from "./data/onboarding";

export interface OnboardingAnswers {
  preferredTime: string; // "HH:mm"
  preferredPlace: string;
  preferredDurationMinutes: number;
}

// One Day's logged progress. `currentStep` lets a catch-up session resume
// exactly where it left off, the same way today's Day already could before
// this was tracked per-Day. `status` is only ever set once the Day's full
// step flow is completed — its absence means the Day is untouched or has an
// in-progress draft.
export interface DayRecord {
  answers: Record<string, string>;
  currentStep?: number;
  status?: "done";
}

export interface Enrollment {
  level: string;
  startPreference: StartPreference;
  customStartDate: string;
  startedAt: string; // ISO date this Enrollment was created, for the archive list
  // Keyed by Personal-Calendar day number. Lives on the Enrollment (not a
  // separate top-level map) so archiving a switched-away-from Enrollment
  // carries its logged Days with it, and a new Enrollment's day numbers
  // never collide with an old one's.
  dayRecords: Record<number, DayRecord>;
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
  setDayAnswer: (day: number, key: string, value: string) => void;
  completeStep: (day: number, step: number) => void;
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
  dayRecords: {},
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

  const value: DevotionState = {
    onboardingComplete,
    onboarding,
    activeEnrollment,
    pastEnrollments,
    pendingLevel,
    bookSelected,
    currentDay,
    totalDays: 366, // Year 1's Personal Calendar length (12 Books, leap-year edition)
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
        dayRecords: {},
      });
      setPendingLevel(null);
      // A new Enrollment starts its own journey — the old plan's dayRecords
      // stay behind on the archived Enrollment, untouched.
    },
    cancelLevelSwitch: () => setPendingLevel(null),
    selectBook: () => setBookSelected(true),
    setDayAnswer: (day, key, val) =>
      setActiveEnrollment((prev) => ({
        ...prev,
        dayRecords: {
          ...prev.dayRecords,
          [day]: {
            ...prev.dayRecords[day],
            answers: { ...(prev.dayRecords[day]?.answers ?? {}), [key]: val },
          },
        },
      })),
    completeStep: (day, step) => {
      const next = step >= TOTAL_STEPS ? TOTAL_STEPS + 1 : step + 1;
      setActiveEnrollment((prev) => ({
        ...prev,
        dayRecords: {
          ...prev.dayRecords,
          [day]: {
            answers: prev.dayRecords[day]?.answers ?? {},
            currentStep: next,
            ...(next > TOTAL_STEPS ? { status: "done" as const } : {}),
          },
        },
      }));
    },
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
