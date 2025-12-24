import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Loader2, BookOpen, CheckCircle2, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import UnitChecklist from "@/components/UnitChecklist";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const colorMap = {
  "#2563eb": { gradient: "from-blue-600 to-indigo-600", bg: "bg-blue-500", light: "bg-blue-50", text: "text-blue-600" },
  "#9333ea": { gradient: "from-purple-600 to-fuchsia-600", bg: "bg-purple-500", light: "bg-purple-50", text: "text-purple-600" },
  "#16a34a": { gradient: "from-green-600 to-emerald-600", bg: "bg-green-500", light: "bg-green-50", text: "text-green-600" },
  "#ea580c": { gradient: "from-orange-600 to-amber-600", bg: "bg-orange-500", light: "bg-orange-50", text: "text-orange-600" },
  "#db2777": { gradient: "from-pink-600 to-rose-600", bg: "bg-pink-500", light: "bg-pink-50", text: "text-pink-600" },
};

export default function SubjectPage() {
  const { subjectName } = useParams();
  const [subject, setSubject] = useState(null);
  const [completedUnits, setCompletedUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubject = async () => {
    try {
      const [subjectsRes, progressRes] = await Promise.all([
        axios.get(`${API}/subjects`),
        axios.get(`${API}/progress`),
      ]);

      const decodedName = decodeURIComponent(subjectName);
      const found = subjectsRes.data.find(
        (s) => s.name.toLowerCase() === decodedName.toLowerCase()
      );

      if (found) {
        setSubject(found);
        setCompletedUnits(progressRes.data.completed_units || []);
      }
    } catch (error) {
      console.error("Error fetching subject:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubject();
  }, [subjectName]);

  const handleUnitToggle = (data) => {
    if (data.completed) {
      setCompletedUnits((prev) => [...prev, data.unit_id]);
    } else {
      setCompletedUnits((prev) => prev.filter((id) => id !== data.unit_id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" data-testid="subject-loading">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" data-testid="subject-not-found">
        <div className="text-center">
          <p className="text-stone-500 mb-4">Subject not found</p>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const colors = colorMap[subject.color] || colorMap["#2563eb"];
  const subjectCompletedUnits = subject.units.filter((u) =>
    completedUnits.includes(u.id)
  ).length;
  const progressPercentage = Math.round(
    (subjectCompletedUnits / subject.units.length) * 100
  );

  return (
    <div className="min-h-screen" data-testid={`subject-page-${subject.name.toLowerCase().replace(/\s+/g, '-')}`}>
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={subject.image}
          alt={subject.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back Button */}
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-stone-900 font-medium hover:bg-white transition-colors"
          data-testid="back-to-dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>

        {/* Subject Title */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {subject.name}
            </h1>
            <p className="text-white/80">
              Master {subject.units.length} units to complete this subject
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-stone-200 p-4 text-center shadow-sm">
            <div className={`w-12 h-12 ${colors.light} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <BookOpen className={`w-6 h-6 ${colors.text}`} />
            </div>
            <p className="text-2xl font-bold text-stone-900 mono">{subject.units.length}</p>
            <p className="text-sm text-stone-500">Total Units</p>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-4 text-center shadow-sm">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-stone-900 mono" data-testid="subject-completed-count">
              {subjectCompletedUnits}
            </p>
            <p className="text-sm text-stone-500">Completed</p>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-4 text-center shadow-sm">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Target className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-stone-900 mono" data-testid="subject-progress-percentage">
              {progressPercentage}%
            </p>
            <p className="text-sm text-stone-500">Progress</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-stone-900">Subject Progress</h3>
            <span className={`text-sm font-bold mono ${colors.text}`}>
              {progressPercentage}%
            </span>
          </div>
          <div className="h-4 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.bg} rounded-full transition-all duration-500 xp-stripes`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {progressPercentage === 100 && (
            <p className="text-green-600 font-medium mt-3 text-center">
              Congratulations! You've completed all units in {subject.name}!
            </p>
          )}
        </div>

        {/* Units Checklist */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <h3 className="font-semibold text-stone-900 mb-4">Units</h3>
          <UnitChecklist
            units={subject.units}
            completedUnits={completedUnits}
            subjectColor={subject.color}
            onUnitToggle={handleUnitToggle}
          />
        </div>
      </div>
    </div>
  );
}
