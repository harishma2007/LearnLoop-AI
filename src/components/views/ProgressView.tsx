import React from "react";
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Zap,
  Flame,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const ProgressView: React.FC = () => {
  const { subjects, weakTopics, xp, streak } = useApp();

  const studyTimeWeekly = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 3.0 },
    { day: "Wed", hours: 1.8 },
    { day: "Thu", hours: 4.2 },
    { day: "Fri", hours: 3.5 },
    { day: "Sat", hours: 5.0 },
    { day: "Sun", hours: 3.8 },
  ];

  const maxHours = Math.max(...studyTimeWeekly.map((s) => s.hours));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
          Learning Analytics & Mastery
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Real-time metrics tracking conceptual retention, daily hours, and subject accuracy.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall Accuracy</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-['Outfit',sans-serif]">
            84.5%
          </div>
          <span className="text-[11px] font-semibold text-emerald-600">Top 15% in cohort</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Weekly Study Time</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-['Outfit',sans-serif]">
            23.8 <span className="text-xs font-normal text-slate-400">hrs</span>
          </div>
          <span className="text-[11px] font-semibold text-indigo-600">+4.2 hrs vs last week</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mistakes Diagnosed</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-['Outfit',sans-serif]">
            18
          </div>
          <span className="text-[11px] font-semibold text-amber-600">14 successfully cured</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total XP Earned</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-['Outfit',sans-serif]">
            {xp}
          </div>
          <span className="text-[11px] font-semibold text-purple-600">Streak: {streak} Days</span>
        </div>
      </div>

      {/* Grid: Study Hours Bar Graph & Subject Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Study Time Graph (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Daily Study Hours (Last 7 Days)</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Avg: 3.4 hrs/day</span>
          </div>

          <div className="pt-6 pb-2 flex items-end justify-between gap-3 h-48 border-b border-slate-100 px-2">
            {studyTimeWeekly.map((item) => {
              const heightPercent = Math.round((item.hours / maxHours) * 100);
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500">{item.hours}h</span>
                  <div className="w-full max-w-[36px] bg-slate-100 rounded-t-lg h-36 relative flex items-end">
                    <div
                      className="w-full bg-linear-to-t from-indigo-600 to-purple-600 rounded-t-lg transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Accuracy & Mastery by Subject (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Mastery by Subject</h2>
            <span className="text-xs text-slate-400">Target: 80%+</span>
          </div>

          <div className="space-y-3.5">
            {subjects.slice(0, 5).map((s) => (
              <div key={s.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{s.name}</span>
                  <span className="font-bold text-indigo-600">{s.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-linear-to-r ${s.color}`}
                    style={{ width: `${s.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
