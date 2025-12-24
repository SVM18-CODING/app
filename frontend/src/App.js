import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Dashboard from "@/pages/Dashboard";
import SubjectPage from "@/pages/SubjectPage";
import AchievementsPage from "@/pages/AchievementsPage";
import Header from "@/components/Header";
import PomodoroWidget from "@/components/PomodoroWidget";

function App() {
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <BrowserRouter>
        <Header />
        <main className="pb-24 md:pb-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/subject/:subjectName" element={<SubjectPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
          </Routes>
        </main>
        <PomodoroWidget />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
