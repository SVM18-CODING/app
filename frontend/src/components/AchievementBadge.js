import {
  Grid3X3, Move3D, Rotate3D, Compass, Split,
  Waves, Zap, Filter, BarChart2,
  FlipVertical, Cpu, ToggleRight, HardDrive,
  FunctionSquare, RefreshCw, Scale, Radio,
  ArrowUpRight, Atom, Magnet, Activity,
  Flame, Calendar, Timer, Award, Trophy
} from "lucide-react";

const iconMap = {
  "grid-3x3": Grid3X3,
  "move-3d": Move3D,
  "rotate-3d": Rotate3D,
  "compass": Compass,
  "split": Split,
  "waves": Waves,
  "zap": Zap,
  "filter": Filter,
  "bar-chart-2": BarChart2,
  "flip-vertical": FlipVertical,
  "cpu": Cpu,
  "toggle-right": ToggleRight,
  "hard-drive": HardDrive,
  "function-square": FunctionSquare,
  "refresh-cw": RefreshCw,
  "scale": Scale,
  "radio": Radio,
  "arrow-up-right": ArrowUpRight,
  "atom": Atom,
  "magnet": Magnet,
  "activity": Activity,
  "flame": Flame,
  "calendar": Calendar,
  "timer": Timer,
  "award": Award,
  "trophy": Trophy,
};

const subjectColors = {
  "MATHS": "#2563eb",
  "PDSP": "#9333ea",
  "DVLSI": "#16a34a",
  "CONTROL SYSTEM": "#ea580c",
  "EMFT": "#db2777",
  "SPECIAL": "#eab308",
};

export const AchievementBadge = ({ achievement, size = "default" }) => {
  const Icon = iconMap[achievement.icon] || Award;
  const color = subjectColors[achievement.subject] || "#eab308";
  const isUnlocked = achievement.unlocked;
  
  const sizeClasses = {
    small: "w-16 h-16",
    default: "w-24 h-24",
    large: "w-32 h-32",
  };

  const iconSizes = {
    small: "w-6 h-6",
    default: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} flex flex-col items-center`}
      data-testid={`achievement-badge-${achievement.id}`}
    >
      {/* Hexagon Badge */}
      <div
        className={`relative ${sizeClasses[size]} ${
          isUnlocked ? "badge-unlock" : "achievement-locked"
        }`}
      >
        {/* Glow effect for unlocked */}
        {isUnlocked && (
          <div
            className="absolute inset-0 rounded-2xl blur-md opacity-40"
            style={{ backgroundColor: color }}
          />
        )}
        
        {/* Badge Container */}
        <div
          className={`relative w-full h-full rounded-2xl flex items-center justify-center border-2 transition-all ${
            isUnlocked
              ? "bg-white shadow-lg"
              : "bg-stone-100 border-stone-300"
          }`}
          style={{
            borderColor: isUnlocked ? color : undefined,
          }}
        >
          <Icon
            className={`${iconSizes[size]} transition-colors`}
            style={{ color: isUnlocked ? color : "#a8a29e" }}
          />
        </div>
      </div>

      {/* Badge Name */}
      <p
        className={`mt-2 text-center text-sm font-medium leading-tight ${
          isUnlocked ? "text-stone-900" : "text-stone-400"
        }`}
      >
        {achievement.name}
      </p>
      
      {/* Subject Tag */}
      <span
        className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
          isUnlocked ? "text-white" : "bg-stone-200 text-stone-500"
        }`}
        style={{
          backgroundColor: isUnlocked ? color : undefined,
        }}
      >
        {achievement.subject}
      </span>
    </div>
  );
};

export default AchievementBadge;
