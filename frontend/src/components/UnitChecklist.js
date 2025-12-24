import { useState } from "react";
import { Check, BookOpen, Sparkles } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const UnitChecklist = ({ units, completedUnits, subjectColor, onUnitToggle }) => {
  const [loading, setLoading] = useState(null);

  const handleToggle = async (unitId) => {
    setLoading(unitId);
    try {
      const response = await axios.post(`${API}/units/toggle`, { unit_id: unitId });
      const { completed, xp, new_achievements } = response.data;

      if (completed) {
        toast.success("Unit Completed!", {
          description: `+100 XP earned! Total: ${xp} XP`,
        });
      } else {
        toast.info("Unit marked incomplete", {
          description: `XP adjusted. Total: ${xp} XP`,
        });
      }

      if (new_achievements?.length > 0) {
        new_achievements.forEach((ach) => {
          setTimeout(() => {
            toast.success(`Achievement Unlocked!`, {
              description: ach.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
              icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
            });
          }, 500);
        });
      }

      onUnitToggle(response.data);
    } catch (error) {
      console.error("Error toggling unit:", error);
      toast.error("Failed to update unit");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3" data-testid="unit-checklist">
      {units.map((unit, index) => {
        const isCompleted = completedUnits.includes(unit.id);
        const isLoading = loading === unit.id;

        return (
          <div
            key={unit.id}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              isCompleted
                ? "bg-green-50 border-green-200"
                : "bg-white border-stone-200 hover:border-stone-300"
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
            data-testid={`unit-item-${unit.id}`}
          >
            <div
              className="relative"
              onClick={() => !isLoading && handleToggle(unit.id)}
            >
              <Checkbox
                checked={isCompleted}
                disabled={isLoading}
                className={`w-6 h-6 rounded-lg border-2 cursor-pointer transition-colors ${
                  isCompleted ? "" : ""
                }`}
                style={{
                  borderColor: isCompleted ? "#16a34a" : subjectColor,
                  backgroundColor: isCompleted ? "#16a34a" : "transparent",
                }}
                data-testid={`unit-checkbox-${unit.id}`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p
                className={`font-medium ${
                  isCompleted ? "text-green-700 line-through" : "text-stone-900"
                }`}
              >
                {unit.name}
              </p>
              <p className="text-sm text-stone-500">Unit {index + 1}</p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium mono ${
                  isCompleted ? "text-green-600" : "text-stone-400"
                }`}
              >
                +{unit.xp} XP
              </span>
              {isCompleted && (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UnitChecklist;
