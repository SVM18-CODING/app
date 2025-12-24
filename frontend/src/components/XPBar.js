import { Zap } from "lucide-react";

export const XPBar = ({ xp, level, xpToNextLevel }) => {
  const currentLevelXP = (level - 1) * 500;
  const progressInLevel = xp - currentLevelXP;
  const levelProgress = (progressInLevel / 500) * 100;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 card-hover" data-testid="xp-bar">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">Current Level</p>
            <p className="text-2xl font-bold text-stone-900">Level {level}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-stone-500 font-medium">Total XP</p>
          <p className="text-2xl font-bold text-amber-500 mono">{xp.toLocaleString()}</p>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="relative">
        <div className="h-6 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 xp-stripes rounded-full transition-all duration-500"
            style={{ width: `${Math.min(levelProgress, 100)}%` }}
            data-testid="xp-progress-fill"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-stone-700 mono">
            {progressInLevel} / 500 XP
          </span>
        </div>
      </div>
      
      <p className="text-sm text-stone-500 mt-2 text-center">
        {xpToNextLevel} XP to Level {level + 1}
      </p>
    </div>
  );
};

export default XPBar;
