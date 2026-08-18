import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppStateProvider, useAppState } from "./AppState";
import { OnboardingPage } from "./pages/OnboardingPage";
import { SelectLevelPage } from "./pages/SelectLevelPage";
import { SelectBookPage } from "./pages/SelectBookPage";
import { TodayPage } from "./pages/TodayPage";
import { LessonStepPage } from "./pages/LessonStepPage";
import { SuccessPage } from "./pages/SuccessPage";
import { HistoryPage } from "./pages/HistoryPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { StatsPage } from "./pages/StatsPage";

function RootRoute() {
  const { onboardingComplete } = useAppState();
  return onboardingComplete ? (
    <SelectLevelPage />
  ) : (
    <Navigate to="/onboarding/1" replace />
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/onboarding/:step" element={<OnboardingPage />} />
          <Route path="/select-book" element={<SelectBookPage />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/lesson/:step" element={<LessonStepPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}
