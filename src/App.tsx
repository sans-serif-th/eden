import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppStateProvider } from "./AppState";
import { SelectBookPage } from "./pages/SelectBookPage";
import { TodayPage } from "./pages/TodayPage";
import { LessonStepPage } from "./pages/LessonStepPage";
import { SuccessPage } from "./pages/SuccessPage";
import { HistoryPage } from "./pages/HistoryPage";

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SelectBookPage />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/lesson/:step" element={<LessonStepPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}
