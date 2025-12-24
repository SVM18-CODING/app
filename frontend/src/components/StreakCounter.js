import { Flame, Calendar } from "lucide-react";

export const StreakCounter = ({ streakDays }) => {
  const getStreakMessage = () => {
    if (streakDays === 0) return "Start your streak today!";
    if (streakDays === 1) return "Great start! Keep going!";
    if (streakDays < 7) return "Building momentum!";
    if (streakDays < 14) return "One week strong!";
    if (streakDays < 30) return "Unstoppable!";
    return "Legendary dedication!";
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 card-hover" data-testid="streak-counter">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
          streakDays > 0 
            ? "bg-gradient-to-br from-orange-400 to-red-500" 
            : "bg-stone-200"
        }`}>
          <Flame 
            className={`w-7 h-7 ${streakDays > 0 ? "text-white flame-animate" : "text-stone-400"}`}
          />
        </div>
        <div className="flex-1">
          <p className="text-sm text-stone-500 font-medium">Daily Streak</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-stone-900 mono" data-testid="streak-count">
              {streakDays}
            </span>
            <span className="text-stone-500">
              {streakDays === 1 ? "day" : "days"}
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-stone-500 mt-3">{getStreakMessage()}</p>
      
      {/* Streak calendar preview */}
      <div className="flex gap-1 mt-4">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
              i < streakDays % 7 || (streakDays >= 7 && i < 7)
                ? "bg-gradient-to-br from-orange-400 to-red-500 text-white"
                : "bg-stone-100 text-stone-400"
            }`}
          >
            {["M", "T", "W", "T", "F", "S", "S"][i]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreakCounter;
