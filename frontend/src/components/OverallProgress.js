import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Target, BookOpen, CheckCircle2 } from "lucide-react";

export const OverallProgress = ({ totalCompleted, totalUnits, overallProgress, subjects }) => {
  const pieData = subjects.map(s => ({
    name: s.name,
    value: s.completed_units,
    color: s.color
  }));

  // Add remaining as gray
  const remaining = totalUnits - totalCompleted;
  if (remaining > 0) {
    pieData.push({ name: "Remaining", value: remaining, color: "#e7e5e4" });
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 h-full" data-testid="overall-progress">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Your Progress</h2>
          <p className="text-stone-500 mt-1">Keep up the great work!</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Target className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Circular Progress */}
        <div className="relative w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-stone-900 mono" data-testid="overall-percentage">
              {overallProgress}%
            </span>
            <span className="text-xs text-stone-500">Complete</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-stone-500">Total Units</p>
              <p className="text-xl font-bold text-stone-900 mono">{totalUnits}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-stone-500">Completed</p>
              <p className="text-xl font-bold text-stone-900 mono" data-testid="completed-units">{totalCompleted}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject breakdown */}
      <div className="mt-6 grid grid-cols-5 gap-2">
        {subjects.map((subject) => (
          <div key={subject.name} className="text-center">
            <div
              className="w-full h-2 rounded-full mb-1"
              style={{ backgroundColor: subject.color, opacity: subject.progress_percentage / 100 || 0.2 }}
            />
            <span className="text-xs text-stone-500 truncate block">
              {subject.name.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverallProgress;
