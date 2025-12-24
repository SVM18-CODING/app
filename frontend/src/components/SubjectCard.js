import { Link } from "react-router-dom";
import { ChevronRight, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const colorMap = {
  "#2563eb": { bg: "bg-blue-500", accent: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  "#9333ea": { bg: "bg-purple-500", accent: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  "#16a34a": { bg: "bg-green-500", accent: "bg-green-50", text: "text-green-600", border: "border-green-200" },
  "#ea580c": { bg: "bg-orange-500", accent: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  "#db2777": { bg: "bg-pink-500", accent: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
};

export const SubjectCard = ({ subject }) => {
  const colors = colorMap[subject.color] || colorMap["#2563eb"];
  const isComplete = subject.progress_percentage === 100;
  
  return (
    <Link
      to={`/subject/${encodeURIComponent(subject.name)}`}
      className="block"
      data-testid={`subject-card-${subject.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={`bg-white rounded-2xl border border-stone-200 overflow-hidden card-hover ${isComplete ? 'ring-2 ring-green-500' : ''}`}>
        {/* Subject Image Header */}
        <div className="relative h-32 overflow-hidden">
          <img
            src={subject.image}
            alt={subject.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white">{subject.name}</h3>
          </div>
          {isComplete && (
            <div className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4">
          {/* Progress Info */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-stone-500">
              {subject.completed_units} of {subject.total_units} units
            </span>
            <span className={`text-sm font-bold mono ${colors.text}`}>
              {subject.progress_percentage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full ${colors.bg} rounded-full transition-all duration-500`}
              style={{ width: `${subject.progress_percentage}%` }}
            />
          </div>

          {/* CTA */}
          <div className={`flex items-center justify-between ${colors.accent} rounded-xl px-4 py-3`}>
            <span className={`text-sm font-medium ${colors.text}`}>
              {isComplete ? "Review Units" : "Continue Learning"}
            </span>
            <ChevronRight className={`w-5 h-5 ${colors.text}`} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SubjectCard;
