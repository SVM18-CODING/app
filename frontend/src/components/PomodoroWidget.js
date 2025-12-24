import { useState, useEffect, useCallback } from "react";
import { Timer, Play, Pause, RotateCcw, X, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TIMER_MODES = [
  { name: "Focus 25", focus: 25, break: 5 },
  { name: "Focus 50", focus: 50, break: 10 },
  { name: "Focus 90", focus: 90, break: 15 },
];

export const PomodoroWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedMode, setSelectedMode] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES[0].focus * 60);
  const [totalTime, setTotalTime] = useState(TIMER_MODES[0].focus * 60);

  const currentMode = TIMER_MODES[selectedMode];

  const resetTimer = useCallback((mode = selectedMode, startBreak = false) => {
    const newMode = TIMER_MODES[mode];
    const newTime = startBreak ? newMode.break * 60 : newMode.focus * 60;
    setTimeLeft(newTime);
    setTotalTime(newTime);
    setIsBreak(startBreak);
    setIsRunning(false);
  }, [selectedMode]);

  const handleModeChange = (index) => {
    setSelectedMode(index);
    resetTimer(index, false);
  };

  const completeSession = async () => {
    try {
      const response = await axios.post(`${API}/pomodoro/complete`, {
        duration_minutes: currentMode.focus,
        completed: true
      });
      
      if (response.data.new_achievements?.length > 0) {
        response.data.new_achievements.forEach(ach => {
          toast.success(`Achievement Unlocked: ${ach}!`, {
            description: "Great job staying focused!",
          });
        });
      }
      
      toast.success("Pomodoro Complete!", {
        description: `You've completed a ${currentMode.focus} minute focus session. Time for a break!`,
      });
    } catch (error) {
      console.error("Error completing pomodoro:", error);
    }
  };

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (!isBreak) {
        completeSession();
        // Auto-start break
        resetTimer(selectedMode, true);
        toast.info("Break time!", {
          description: `Take a ${currentMode.break} minute break.`,
        });
      } else {
        toast.success("Break over!", {
          description: "Ready for another focus session?",
        });
        resetTimer(selectedMode, false);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, selectedMode, currentMode, resetTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow z-50 btn-neo"
        data-testid="pomodoro-open-btn"
      >
        <Timer className="w-6 h-6" />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 z-50 flex items-center gap-4"
        data-testid="pomodoro-minimized"
      >
        <div className={`text-2xl font-bold mono ${isBreak ? "text-green-500" : "text-red-500"}`}>
          {formatTime(timeLeft)}
        </div>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsRunning(!isRunning)}
            data-testid="pomodoro-play-pause-mini"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsMinimized(false)}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-50"
      data-testid="pomodoro-widget"
    >
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between ${isBreak ? "bg-green-500" : "bg-red-500"}`}>
        <div className="flex items-center gap-2 text-white">
          <Timer className="w-5 h-5" />
          <span className="font-medium">{isBreak ? "Break Time" : "Focus Time"}</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Minimize2 className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Timer Display */}
      <div className="p-6">
        {/* Circular Timer */}
        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg className="w-full h-full circular-progress" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e7e5e4"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isBreak ? "#22c55e" : "#ef4444"}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="timer-ring"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold mono ${isBreak ? "text-green-500" : "text-red-500"}`} data-testid="timer-display">
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm text-stone-500">{isBreak ? "Break" : "Focus"}</span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-4">
          {TIMER_MODES.map((mode, index) => (
            <button
              key={mode.name}
              onClick={() => handleModeChange(index)}
              disabled={isRunning}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                selectedMode === index
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
              data-testid={`pomodoro-mode-${index}`}
            >
              {mode.focus}m
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 ${isBreak ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
            data-testid="pomodoro-play-pause"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" /> Start
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => resetTimer(selectedMode, false)}
            data-testid="pomodoro-reset"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroWidget;
