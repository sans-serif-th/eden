import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppStateProvider, useAppState } from "./AppState";
import { LoginPage } from "./pages/LoginPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { SelectLevelPage } from "./pages/SelectLevelPage";
import { SelectBookPage } from "./pages/SelectBookPage";
import { NewPlanPage } from "./pages/NewPlanPage";
import { TodayPage } from "./pages/TodayPage";
import { LessonStepPage } from "./pages/LessonStepPage";
import { SuccessPage } from "./pages/SuccessPage";
import { HistoryPage } from "./pages/HistoryPage";
import { DaySummaryPage } from "./pages/DaySummaryPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { AboutPage } from "./pages/AboutPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { StatsPage } from "./pages/StatsPage";

function RootRoute() {
  const { isAuthenticated, onboardingComplete, bookSelected } = useAppState();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!onboardingComplete) return <Navigate to="/onboarding/1" replace />;
  // A returning user who already has an active enrollment has already been
  // through the level/book picker — go straight to their plan instead of
  // making them re-pick it on every login.
  return bookSelected ? (
    <Navigate to="/today" replace />
  ) : (
    <SelectLevelPage />
  );
}

function LoadingScreen() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-app">
      <p className="text-[16px] text-ink-muted">กำลังโหลด...</p>
    </div>
  );
}

function AppRoutes() {
  const { isLoading } = useAppState();
  if (isLoading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding/:step" element={<OnboardingPage />} />
      <Route path="/select-level" element={<SelectLevelPage />} />
      <Route path="/select-book" element={<SelectBookPage />} />
      <Route path="/new-plan" element={<NewPlanPage />} />
      <Route path="/today" element={<TodayPage />} />
      <Route path="/lesson/:day/:step" element={<LessonStepPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/history/:day" element={<DaySummaryPage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppStateProvider>
  );
}
