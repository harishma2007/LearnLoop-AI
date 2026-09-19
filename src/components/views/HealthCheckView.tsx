import React from "react";
import {
  Activity,
  HeartPulse,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Zap,
  Target,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const HealthCheckView: React.FC = () => {
  const {
    user,
    weakTopics,
    conceptNodes,
    confusionList,
    teachBackHistory,
    startTeachBack,
    setActiveTab,
    openMasteryMap,
    openWhatToLearnModal,
  } = useApp();

  // Compute live health metrics
  const dbmsNodes = conceptNodes["dbms"] || [];
  const masteredCount = dbmsNodes.filter((n) => n.mastery === "Mastered").length;
  const needsPracticeCount = dbmsNodes.filter((n) => n.mastery === "Needs Practice").length;
  const recentTeachBackScore = teachBackHistory[0]?.evaluation?.understandingScore || 82;

  // Holistic score formula
  const healthScore = Math.min(
    96,
    Math.max(45, Math.round(50 + masteredCount * 8 - needsPracticeCount * 5 + (recentTeachBackScore - 70) * 0.5))
  );

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-teal-900 via-emerald-950 to-indigo-950 text-white p-6 sm:p-8 shadow-sm">
        <div className="absolute right-0 top-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 text-xs font-bold border border-teal-400/30">
                <HeartPulse className="w-3.5 h-3.5" />
                Cognitive Diagnostic
              </span>
              <span className="text-xs text-teal-200/80">
                Real-time assessment of syllabus preparedness
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif]">
              🩺 Learning Health Check
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
              A bird's-eye diagnosis of your learning curve: retention strength, cognitive blind spots, and syllabus exam readiness.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center min-w-32">
              <div className="text-3xl font-black text-emerald-400 leading-none mb-1">
                {healthScore}/100
              </div>
              <div className="text-[11px] font-bold text-teal-200 uppercase tracking-wider">
                Health Score
              </div>
            </div>

            <button
              onClick={openWhatToLearnModal}
              className="px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Next Priority</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Strengths */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Validated Strengths
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">Proven in Teach-Back & Quizzes</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950">ER Modeling & Schema Design</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">94%</span>
              </div>
              <p className="text-[11px] text-emerald-800/80">Strong conceptual intuition on entities and cardinalities.</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950">First Normal Form (1NF)</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">92%</span>
              </div>
              <p className="text-[11px] text-emerald-800/80">Atomicity and column redundancy rules mastered.</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950">Linear Data Structures</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">95%</span>
              </div>
              <p className="text-[11px] text-emerald-800/80">Arrays, Stacks, and asymptotic Big-O runtime mastery.</p>
            </div>
          </div>
        </div>

        {/* Identified Weaknesses */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-rose-700">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Vulnerable Topics
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">Needs revision before test day</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-950">Second Normal Form (2NF)</span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">62%</span>
              </div>
              <p className="text-[11px] text-rose-800/80">Frequent confusion over composite candidate keys.</p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-950">Third Normal Form (3NF)</span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">58%</span>
              </div>
              <p className="text-[11px] text-rose-800/80">Transitive dependency identification errors.</p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-950">Eigenvalues & Multiplicities</span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">55%</span>
              </div>
              <p className="text-[11px] text-rose-800/80">Calculation slip-ups on characteristic equations.</p>
            </div>
          </div>
        </div>

        {/* Prescription & Recommended Action */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-700">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  AI Prescription
                </h2>
                <span className="text-[11px] text-slate-400 font-medium">To reach 90%+ Exam Readiness</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-linear-to-br from-indigo-50/80 via-purple-50/50 to-slate-50 border border-indigo-100 space-y-2">
              <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Today's Highest ROI Action:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Untangle <span className="font-bold text-slate-900">2NF vs 3NF</span> by explaining the rule of composite keys out loud in Teach-Back Mode, then verify with a 3-question adaptive retest.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <button
              onClick={() => startTeachBack("Second Normal Form (2NF)", "DBMS")}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Brain className="w-4 h-4 text-amber-300" />
              <span>Start Prescribed Teach-Back</span>
            </button>

            <button
              onClick={() => setActiveTab("revision")}
              className="w-full py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Open Smart Revision Deck</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
