import React from "react";
import {
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Bot,
  Layers,
  PenSquare,
  CheckCircle2,
  Trash2,
  Calendar,
  Clock,
  ArrowRight,
  WifiOff,
  Database,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

export const RevisionView: React.FC = () => {
  const isOnline = useOnlineStatus();
  const {
    weakTopics,
    removeWeakTopic,
    selectTopicForTutor,
    setActiveTab,
    addXP,
    triggerConfetti,
  } = useApp();

  const spacedSchedule = [
    { topic: "2NF vs 3NF Transitive Dependency", interval: "Due Today", urgency: "high", subject: "DBMS" },
    { topic: "Eigenvalues & Diagonalization", interval: "Due in 2 days", urgency: "medium", subject: "Mathematics" },
    { topic: "Carnot Engine & Entropy", interval: "Due in 5 days", urgency: "low", subject: "Physics" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                Smart Revision Cycle
              </h1>
              <p className="text-xs text-slate-500">
                Spaced repetition and automated retesting targeting concepts you found challenging.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("quiz")}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Retest All Weak Topics</span>
            </button>
            <button
              onClick={() => setActiveTab("flashcards")}
              className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs border border-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Revision Flashcards</span>
            </button>
          </div>
        </div>

        {!isOnline && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-amber-800 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Offline Revision Active:</strong> All weak concepts, mastery records, and spaced repetition intervals are stored locally and work fully without internet.
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-md shrink-0">
              <Database className="w-3 h-3" />
              <span>Offline Ready</span>
            </div>
          </div>
        )}
      </div>

      {/* Weak Topics Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Identified Knowledge Gaps ({weakTopics.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Resolved topics earn +30 XP upon retesting
          </span>
        </div>

        {weakTopics.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">All Weak Topics Resolved!</h3>
            <p className="text-xs text-slate-500">
              You have currently cleared all flagged mistakes. Take a new quiz to continue challenging yourself!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {weakTopics.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-300 transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 uppercase">
                      {item.subject}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{item.topic}</span>
                    <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      Accuracy: {item.accuracy}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-800 font-semibold">Recommended Fix: </strong>
                    {item.recommendedAction}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => selectTopicForTutor(item.subject, item.topic)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Explain Simpler Again</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("quiz")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <PenSquare className="w-3.5 h-3.5" />
                    <span>Retest Topic</span>
                  </button>

                  <button
                    onClick={() => removeWeakTopic(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Mark as Mastered"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spaced Repetition Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Spaced Repetition Schedule
            </h2>
          </div>
          <span className="text-xs text-slate-400">Based on Ebbinghaus Forgetting Curve</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {spacedSchedule.map((s, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${
                s.urgency === "high"
                  ? "bg-rose-50/50 border-rose-200"
                  : s.urgency === "medium"
                  ? "bg-amber-50/50 border-amber-200"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                <span className="text-slate-500 uppercase">{s.subject}</span>
                <span
                  className={
                    s.urgency === "high"
                      ? "text-rose-600"
                      : s.urgency === "medium"
                      ? "text-amber-600"
                      : "text-slate-600"
                  }
                >
                  {s.interval}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">{s.topic}</h4>
              <button
                onClick={() => selectTopicForTutor(s.subject, s.topic)}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Revise Now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
