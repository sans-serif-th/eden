import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { TOTAL_STEPS } from "./data/stepDefinitions";
import { getBookDayForDate, type StartPreference } from "./data/onboarding";
import { supabase } from "./lib/supabase";
import { bootstrapAuth } from "./lib/auth";
import { getLineProfile, logoutFromLine, type LineProfile } from "./lib/liff";

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
  id: string;
  level: string;
  book: number; // which Book within the Level this Enrollment is studying
  startPreference: StartPreference;
  customStartDate: string;
  startedAt: string; // ISO date this Enrollment was created, for the archive list
  // Keyed by Personal-Calendar day number. Lives on the Enrollment (not a
  // separate top-level map) so archiving a switched-away-from Enrollment
  // carries its logged Days with it, and a new Enrollment's day numbers
  // never collide with an old one's.
  dayRecords: Record<number, DayRecord>;
}

// A Level/Book combination awaiting a new start date, via either a Level
// switch (book always resets to 1) or finishing a Book and moving to the
// next one (or skipping past it) within the same Level.
export interface PendingEnrollment {
  level: string;
  book: number;
}

type DevotionState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  lineProfile: LineProfile | null;
  onboardingComplete: boolean;
  onboarding: OnboardingAnswers;
  activeEnrollment: Enrollment;
  pastEnrollments: Enrollment[];
  pendingEnrollment: PendingEnrollment | null;
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
  requestNextBook: (skip: boolean) => void;
  skipPendingBook: () => void;
  confirmPendingEnrollment: (
    startPreference: StartPreference,
    customStartDate: string,
  ) => void;
  cancelPendingEnrollment: () => void;
  selectBook: () => void;
  setDayAnswer: (day: number, key: string, value: string) => void;
  completeStep: (day: number, step: number) => void;
  logout: () => void;
};

const AppStateContext = createContext<DevotionState | null>(null);

const defaultOnboarding: OnboardingAnswers = {
  preferredTime: "05:00",
  preferredPlace: "บ้าน",
  preferredDurationMinutes: 15,
};

function newEnrollment(level: string, book: number): Enrollment {
  return {
    id: crypto.randomUUID(),
    level,
    book,
    startPreference: "today",
    customStartDate: "",
    startedAt: new Date().toISOString(),
    dayRecords: {},
  };
}

interface EnrollmentRow {
  id: string;
  level: string;
  book: number;
  start_preference: StartPreference;
  custom_start_date: string | null;
  started_at: string;
}

function enrollmentFromRow(row: EnrollmentRow): Enrollment {
  return {
    id: row.id,
    level: row.level,
    book: row.book,
    startPreference: row.start_preference,
    customStartDate: row.custom_start_date ?? "",
    startedAt: row.started_at,
    dayRecords: {},
  };
}

function upsertEnrollment(userId: string, e: Enrollment, isActive: boolean) {
  return supabase
    .from("enrollments")
    .upsert({
      id: e.id,
      user_id: userId,
      level: e.level,
      book: e.book,
      start_preference: e.startPreference,
      custom_start_date: e.customStartDate || null,
      started_at: e.startedAt,
      is_active: isActive,
    })
    .then(({ error }) => {
      if (error) console.error("Failed to save enrollment", error);
    });
}

function upsertOnboarding(
  userId: string,
  complete: boolean,
  answers: OnboardingAnswers,
) {
  return supabase
    .from("onboarding_answers")
    .upsert({
      user_id: userId,
      onboarding_complete: complete,
      preferred_time: answers.preferredTime,
      preferred_place: answers.preferredPlace,
      preferred_duration_minutes: answers.preferredDurationMinutes,
    })
    .then(({ error }) => {
      if (error) console.error("Failed to save onboarding answers", error);
    });
}

function upsertDayRecord(
  userId: string,
  enrollmentId: string,
  day: number,
  record: DayRecord,
) {
  return supabase
    .from("day_records")
    .upsert(
      {
        user_id: userId,
        enrollment_id: enrollmentId,
        day_number: day,
        answers: record.answers,
        current_step: record.currentStep ?? 0,
        status: record.status ?? null,
      },
      { onConflict: "enrollment_id,day_number" },
    )
    .then(({ error }) => {
      if (error) console.error("Failed to save day record", error);
    });
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [lineProfile, setLineProfile] = useState<LineProfile | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboarding, setOnboarding] =
    useState<OnboardingAnswers>(defaultOnboarding);
  const [activeEnrollment, setActiveEnrollment] = useState<Enrollment>(() =>
    newEnrollment("year-1", 1),
  );
  const [pastEnrollments, setPastEnrollments] = useState<Enrollment[]>([]);
  const [pendingEnrollment, setPendingEnrollment] =
    useState<PendingEnrollment | null>(null);
  const [bookSelected, setBookSelected] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const uid = await bootstrapAuth();
        if (cancelled) return;
        if (!uid) {
          setIsAuthenticated(false);
          return;
        }
        setIsAuthenticated(true);
        setUserId(uid);

        const { data: onboardingRow, error: onboardingError } = await supabase
          .from("onboarding_answers")
          .select("*")
          .eq("user_id", uid)
          .maybeSingle();
        console.log("[bootstrap] onboarding fetch", {
          uid,
          onboardingRow,
          onboardingError,
        });
        if (onboardingRow) {
          setOnboardingComplete(onboardingRow.onboarding_complete);
          setOnboarding({
            preferredTime: onboardingRow.preferred_time,
            preferredPlace: onboardingRow.preferred_place,
            preferredDurationMinutes:
              onboardingRow.preferred_duration_minutes,
          });
        }

        const { data: activeRow } = await supabase
          .from("enrollments")
          .select("*")
          .eq("user_id", uid)
          .eq("is_active", true)
          .maybeSingle();

        if (activeRow) {
          const { data: dayRows } = await supabase
            .from("day_records")
            .select("*")
            .eq("enrollment_id", activeRow.id);
          const dayRecords: Record<number, DayRecord> = {};
          for (const row of dayRows ?? []) {
            dayRecords[row.day_number] = {
              answers: row.answers ?? {},
              currentStep: row.current_step ?? 0,
              status: row.status ?? undefined,
            };
          }
          if (!cancelled) {
            setActiveEnrollment({ ...enrollmentFromRow(activeRow), dayRecords });
          }
        }

        const { data: pastRows } = await supabase
          .from("enrollments")
          .select("*")
          .eq("user_id", uid)
          .eq("is_active", false)
          .order("created_at", { ascending: true });
        if (!cancelled) {
          setPastEnrollments((pastRows ?? []).map(enrollmentFromRow));
        }
      } catch (err) {
        console.error("Failed to load user state from Supabase", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    // Independent of the Supabase bootstrap above and never blocks isLoading —
    // outside the LINE client (e.g. local dev, or before the user taps
    // "เข้าสู่ระบบด้วย LINE") there's no LINE session yet, and that's fine;
    // the UI just falls back to the placeholder name until one exists.
    getLineProfile()
      .then((profile) => {
        if (!cancelled) setLineProfile(profile);
      })
      .catch((err) => console.error("Failed to load LINE profile", err));
    return () => {
      cancelled = true;
    };
  }, []);

  const value: DevotionState = {
    isLoading,
    isAuthenticated,
    lineProfile,
    onboardingComplete,
    onboarding,
    activeEnrollment,
    pastEnrollments,
    pendingEnrollment,
    bookSelected,
    currentDay: Math.max(
      1,
      getBookDayForDate(
        new Date(),
        activeEnrollment.startPreference,
        activeEnrollment.customStartDate,
      ),
    ),
    totalDays: 366, // Year 1's Personal Calendar length (12 Books, leap-year edition)
    setOnboardingAnswer: (key, val) => {
      setOnboarding((prev) => {
        const next = { ...prev, [key]: val };
        if (userId) void upsertOnboarding(userId, onboardingComplete, next);
        return next;
      });
    },
    completeOnboarding: () => {
      setOnboardingComplete(true);
      if (userId) {
        void upsertOnboarding(userId, true, onboarding);
        // setActiveLevel/setEnrollmentStart already upsert on every change,
        // but a user who never touches a step (accepting every default) can
        // reach here without the Enrollment ever having been written — do it
        // here too so day_records' FK to enrollments always has a row to
        // point at once the user starts logging progress.
        void upsertEnrollment(userId, activeEnrollment, true);
      }
    },
    setActiveLevel: (level) => {
      setActiveEnrollment((prev) => {
        const next = { ...prev, level };
        if (userId) void upsertEnrollment(userId, next, true);
        return next;
      });
    },
    setEnrollmentStart: (startPreference, customStartDate) => {
      setActiveEnrollment((prev) => {
        const next = { ...prev, startPreference, customStartDate };
        if (userId) void upsertEnrollment(userId, next, true);
        return next;
      });
    },
    requestLevelSwitch: (level) => {
      if (level === activeEnrollment.level) return;
      setPendingEnrollment({ level, book: 1 });
    },
    requestNextBook: (skip) => {
      setPendingEnrollment({
        level: activeEnrollment.level,
        book: activeEnrollment.book + (skip ? 2 : 1),
      });
    },
    skipPendingBook: () => {
      setPendingEnrollment((prev) =>
        prev ? { ...prev, book: prev.book + 1 } : prev,
      );
    },
    confirmPendingEnrollment: (startPreference, customStartDate) => {
      if (!pendingEnrollment) return;
      const oldEnrollment = activeEnrollment;
      const nextEnrollment: Enrollment = {
        ...newEnrollment(pendingEnrollment.level, pendingEnrollment.book),
        startPreference,
        customStartDate,
      };
      setPastEnrollments((prev) => [...prev, oldEnrollment]);
      setActiveEnrollment(nextEnrollment);
      setPendingEnrollment(null);
      // A new Enrollment starts its own journey — the old plan's dayRecords
      // stay behind on the archived Enrollment, untouched.
      if (userId) {
        void upsertEnrollment(userId, oldEnrollment, false);
        void upsertEnrollment(userId, nextEnrollment, true);
      }
    },
    cancelPendingEnrollment: () => setPendingEnrollment(null),
    selectBook: () => setBookSelected(true),
    setDayAnswer: (day, key, val) => {
      setActiveEnrollment((prev) => {
        const nextAnswers = {
          ...(prev.dayRecords[day]?.answers ?? {}),
          [key]: val,
        };
        const nextRecord: DayRecord = {
          ...prev.dayRecords[day],
          answers: nextAnswers,
        };
        if (userId) void upsertDayRecord(userId, prev.id, day, nextRecord);
        return {
          ...prev,
          dayRecords: { ...prev.dayRecords, [day]: nextRecord },
        };
      });
    },
    completeStep: (day, step) => {
      const next = step >= TOTAL_STEPS ? TOTAL_STEPS + 1 : step + 1;
      setActiveEnrollment((prev) => {
        const nextRecord: DayRecord = {
          answers: prev.dayRecords[day]?.answers ?? {},
          currentStep: next,
          ...(next > TOTAL_STEPS ? { status: "done" as const } : {}),
        };
        if (userId) void upsertDayRecord(userId, prev.id, day, nextRecord);
        return {
          ...prev,
          dayRecords: { ...prev.dayRecords, [day]: nextRecord },
        };
      });
    },
    logout: () => {
      setLineProfile(null);
      setIsAuthenticated(false);
      setUserId(null);
      void logoutFromLine();
      void supabase.auth.signOut();
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
