import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Trophy, Lock, Sparkles } from "lucide-react";
import AchievementBadge from "@/components/AchievementBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SUBJECTS = ["ALL", "MATHS", "PDSP", "DVLSI", "CONTROL SYSTEM", "EMFT", "SPECIAL"];

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");

  const fetchAchievements = async () => {
    try {
      const response = await axios.get(`${API}/achievements`);
      setAchievements(response.data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" data-testid="achievements-loading">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const filteredAchievements = activeTab === "ALL"
    ? achievements
    : achievements.filter((a) => a.subject === activeTab);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="achievements-page">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 flex items-center gap-3">
              <Trophy className="w-10 h-10 text-yellow-500" />
              Achievements
            </h1>
            <p className="text-stone-500 mt-2">
              Complete units and maintain streaks to unlock achievements
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-stone-900 mono" data-testid="achievements-count">
              {unlockedCount}/{totalCount}
            </p>
            <p className="text-sm text-stone-500">Unlocked</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-4 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full flex flex-wrap gap-2 bg-transparent h-auto p-0 mb-8">
          {SUBJECTS.map((subject) => {
            const count = subject === "ALL"
              ? achievements.filter((a) => a.unlocked).length
              : achievements.filter((a) => a.subject === subject && a.unlocked).length;
            const total = subject === "ALL"
              ? achievements.length
              : achievements.filter((a) => a.subject === subject).length;

            return (
              <TabsTrigger
                key={subject}
                value={subject}
                className={`px-4 py-2 rounded-full font-medium transition-colors data-[state=active]:bg-stone-900 data-[state=active]:text-white ${
                  activeTab === subject ? "" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
                data-testid={`tab-${subject.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {subject === "CONTROL SYSTEM" ? "CONTROL" : subject}
                <span className="ml-2 text-xs opacity-70">
                  {count}/{total}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Achievement Grid */}
        <TabsContent value={activeTab} className="mt-0">
          {filteredAchievements.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
              <Lock className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">No achievements in this category yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    achievement.unlocked
                      ? "bg-white border-yellow-200 shadow-sm hover:shadow-md"
                      : "bg-stone-50 border-stone-200"
                  }`}
                >
                  <AchievementBadge achievement={achievement} />
                  <p className="text-xs text-stone-500 text-center mt-2">
                    {achievement.description}
                  </p>
                  {achievement.unlocked && (
                    <div className="flex items-center justify-center gap-1 mt-2 text-yellow-600">
                      <Sparkles className="w-3 h-3" />
                      <span className="text-xs font-medium">Unlocked</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Legend */}
      <div className="mt-12 bg-white rounded-2xl border border-stone-200 p-6">
        <h3 className="font-semibold text-stone-900 mb-4">How to Unlock</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <div>
              <p className="font-medium text-stone-900">Unit Achievements</p>
              <p className="text-stone-500">Complete specific units to unlock subject-related badges</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
              <span className="text-orange-600 font-bold">2</span>
            </div>
            <div>
              <p className="font-medium text-stone-900">Streak Achievements</p>
              <p className="text-stone-500">Study consistently to earn streak badges (3, 7 days)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 font-bold">3</span>
            </div>
            <div>
              <p className="font-medium text-stone-900">Pomodoro Achievement</p>
              <p className="text-stone-500">Complete 10 pomodoro focus sessions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
