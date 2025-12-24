import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import XPBar from "@/components/XPBar";
import StreakCounter from "@/components/StreakCounter";
import SubjectCard from "@/components/SubjectCard";
import OverallProgress from "@/components/OverallProgress";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API}/dashboard`);
      setDashboard(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" data-testid="dashboard-loading">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" data-testid="dashboard-error">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchDashboard}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="dashboard">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">
          Welcome back, Scholar!
        </h1>
        <p className="text-stone-500 mt-2">
          Continue your learning journey and unlock achievements.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 stagger-children">
        {/* Hero - Overall Progress */}
        <div className="md:col-span-8 md:row-span-2">
          <OverallProgress
            totalCompleted={dashboard.total_completed}
            totalUnits={dashboard.total_units}
            overallProgress={dashboard.overall_progress}
            subjects={dashboard.subjects}
          />
        </div>

        {/* XP Bar */}
        <div className="md:col-span-4">
          <XPBar
            xp={dashboard.xp}
            level={dashboard.level}
            xpToNextLevel={dashboard.xp_to_next_level}
          />
        </div>

        {/* Streak Counter */}
        <div className="md:col-span-4">
          <StreakCounter streakDays={dashboard.streak_days} />
        </div>

        {/* Subject Cards */}
        {dashboard.subjects.map((subject) => (
          <div key={subject.name} className="md:col-span-4">
            <SubjectCard subject={subject} />
          </div>
        ))}
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-500 mono">{dashboard.total_completed}</p>
          <p className="text-sm text-stone-500">Units Done</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
          <p className="text-2xl font-bold text-amber-500 mono">{dashboard.xp}</p>
          <p className="text-sm text-stone-500">Total XP</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
          <p className="text-2xl font-bold text-orange-500 mono">{dashboard.streak_days}</p>
          <p className="text-sm text-stone-500">Day Streak</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
          <p className="text-2xl font-bold text-purple-500 mono">{dashboard.unlocked_achievements?.length || 0}</p>
          <p className="text-sm text-stone-500">Achievements</p>
        </div>
      </div>
    </div>
  );
}
