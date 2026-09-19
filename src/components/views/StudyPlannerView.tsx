import React, { useState } from "react";
import {
  Calendar,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { apiService } from "../../services/api";
import { StudyPlanDay } from "../../types";

export const StudyPlannerView: React.FC = () => {
  const { addXP, triggerConfetti, language } = useApp();
  const [examName, setExamName] = useState("University DBMS & Computer Systems Finals");
  const [days, setDays] = useState(7);
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [topicsInput, setTopicsInput] = useState("Normalization, SQL queries, Concurrency Control, Deadlock, B-Trees");
  const [isGenerating, setIsGenerating] = useState(false);

  const [schedule, setSchedule] = useState<StudyPlanDay[]>([
    {
      dayNumber: 1,
      topics: ["Relational Model & Relational Algebra", "1NF & 2NF Normalization"],
      hours: 3,
      quizScheduled: true,
      revisionFocus: "Functional dependencies",
      completed: true,
    },
    {
      dayNumber: 2,
      topics: ["3NF vs BCNF Transitive Dependencies", "Multivalued Dependencies (4NF)"],
      hours: 3,
      quizScheduled: false,
      revisionFocus: "Lossless Join Decomposition proofs",
      completed: false,
    },
    {
      dayNumber: 3,
      topics: ["ACID Properties & Transaction States", "Serializability & Conflict Graphs"],
      hours: 3,
      quizScheduled: true,
      revisionFocus: "Schedule equivalence algorithms",
      completed: false,
    },
    {
      dayNumber: 4,
      topics: ["Concurrency Control Protocols", "Two-Phase Locking (2PL) & Timestamp Ordering"],
      hours: 3,
      quizScheduled: false,
      revisionFocus: "Deadlock prevention vs detection",
      completed: false,
    },
    {
      dayNumber: 5,
      topics: ["B-Trees, B+ Trees, and Indexing Storage", "Hashing Techniques"],
      hours: 3,
      quizScheduled: true,
      revisionFocus: "Tree balance and pointer traversal",
      completed: false,
    },
    {
      dayNumber: 6,
      topics: ["Comprehensive Weak Topics Drill", "Solving 16-mark previous university papers"],
      hours: 3.5,
      quizScheduled: true,
      revisionFocus: "Addressing flagged Mistake Detective items",
      completed: false,
    },
    {
      dayNumber: 7,
      topics: ["Final Formula & Constraints Revision", "Light Flashcard Recall & Mind Warmup"],
      hours: 2,
      quizScheduled: false,
      revisionFocus: "Confidence building & Exam readiness",
      completed: false,
    },
  ]);

  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({ 1: true });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await apiService.generateStudyPlan({
        examDate: `${days} days remaining`,
        subjects: [examName],
        hoursPerDay,
        language,
        topics: topicsInput,
      });

      if (res.schedule && res.schedule.length > 0) {
        setSchedule(res.schedule);
      } else if (res.today && res.today.length > 0) {
        // Map from day plan to timeline
        const mapped: StudyPlanDay[] = [
          ...res.today.map((t, idx) => ({
            dayNumber: idx + 1,
            topics: [t.topic || "Core Syllabus Review", t.activity || "Interactive AI Tutor"],
            hours: hoursPerDay,
            quizScheduled: idx % 2 === 0,
            revisionFocus: t.subject || "Exam Target",
            completed: false,
          })),
        ];
        setSchedule(mapped);
      }
      addXP(30);
      triggerConfetti();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleDayComplete = (dayNum: number) => {
    setCompletedDays((prev) => {
      const updated = !prev[dayNum];
      if (updated) addXP(20);
      return { ...prev, [dayNum]: updated };
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
            AI Adaptive Study Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Generates intelligent schedules with spaced revision intervals, practice checkpoints, and buffer days.
          </p>
        </div>
      </div>

      {/* Input Parameters Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Exam</label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="e.g. DBMS Semester Exam"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Days Remaining</label>
              <input
                type="number"
                min={1}
                max={60}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Study Hours / Day</label>
              <input
                type="number"
                min={1}
                max={12}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Syllabus Topics to Cover (comma-separated)
            </label>
            <input
              type="text"
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              placeholder="e.g. Normalization, B-Trees, 2PL, Deadlock"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? "Synthesizing Schedule..." : "Recalculate AI Study Plan"}</span>
          </button>
        </form>
      </div>

      {/* Daily Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Day-By-Day Personalized Trajectory
          </h3>
          <span className="text-xs text-slate-400">
            {Object.values(completedDays).filter(Boolean).length} of {schedule.length} Days Finished
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedule.map((day, dayIdx) => {
            const dayNum = day.dayNumber || dayIdx + 1;
            const isDone = Boolean(completedDays[dayNum]);
            const topicList = day.topics || [day.topic || "Core Subject Material"];

            return (
              <div
                key={dayNum}
                className={`p-5 rounded-2xl border transition-all ${
                  isDone
                    ? "bg-slate-50 border-slate-200 opacity-80"
                    : "bg-white border-slate-200 shadow-2xs hover:border-indigo-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                        isDone ? "bg-slate-200 text-slate-600" : "bg-indigo-600 text-white"
                      }`}
                    >
                      Day {dayNum}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {day.hours || hoursPerDay} Hours
                    </span>
                  </div>

                  <button
                    onClick={() => toggleDayComplete(dayNum)}
                    className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      isDone
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isDone ? "Completed (+20 XP)" : "Mark Done"}</span>
                  </button>
                </div>

                {/* Topics to Study */}
                <div className="space-y-1 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Syllabus Topics
                  </span>
                  <ul className="space-y-1">
                    {topicList.map((top: string, idx: number) => (
                      <li key={idx} className="text-xs text-slate-800 font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span>{top}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Revision & Checkpoint */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    <strong className="text-slate-700">Focus:</strong> {day.revisionFocus || day.activity || "Conceptual mastery"}
                  </span>
                  {day.quizScheduled && (
                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm">
                      Quiz Scheduled
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
