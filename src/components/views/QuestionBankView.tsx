import React, { useState } from "react";
import {
  Library,
  Search,
  Filter,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Award,
  ChevronDown,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Difficulty, QuestionBankItem, QuestionType } from "../../types";

export const QuestionBankView: React.FC = () => {
  const { questionBank, subjects, setActiveTab } = useApp();
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const questionTypes: (QuestionType | "All")[] = [
    "All",
    "MCQ",
    "2-mark",
    "Short answer",
    "5-mark",
    "Long answer",
    "10/13/16-mark",
    "Scenario-based",
  ];

  const difficulties: (Difficulty | "All")[] = ["All", "Easy", "Medium", "Hard"];

  const filtered = questionBank.filter((item) => {
    const matchSubject = selectedSubject === "All" || item.subject === selectedSubject;
    const matchType = selectedType === "All" || item.type === selectedType;
    const matchDiff = selectedDifficulty === "All" || item.difficulty === selectedDifficulty;
    const matchSearch =
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.topic.toLowerCase().includes(search.toLowerCase()) ||
      item.unit.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchType && matchDiff && matchSearch;
  });

  const toggleAnswer = (id: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
            Academic Question Bank
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Curated repository supporting 2-mark definitions, 5-mark short notes, 16-mark derivations, and scenario cases.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("quiz")}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Practice Quiz</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions by keyword, unit, or topic..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        {/* Filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Subject Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-600"
            >
              <option value="All">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Question Type Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Question Format
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-600"
            >
              {questionTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-600"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>Showing {filtered.length} matching questions</span>
        <button
          onClick={() => {
            const all: Record<string, boolean> = {};
            filtered.forEach((q) => (all[q.id] = true));
            setRevealedAnswers(all);
          }}
          className="text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          Expand All Solutions
        </button>
      </div>

      {/* Question Items List */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isRevealed = Boolean(revealedAnswers[item.id]);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-200 transition-all p-5"
            >
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase">
                    {item.subject}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                    {item.unit}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-semibold">
                    {item.type}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.difficulty === "Easy"
                      ? "bg-emerald-50 text-emerald-700"
                      : item.difficulty === "Medium"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {item.difficulty}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed mb-3">
                {item.question}
              </h3>

              {/* Answer Toggle Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => toggleAnswer(item.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                  {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isRevealed ? "Hide Model Solution" : "Reveal Model Solution"}</span>
                </button>

                {item.markingScheme && (
                  <span className="text-[11px] text-slate-400 font-medium">
                    Scheme: {item.markingScheme}
                  </span>
                )}
              </div>

              {/* Revealed Solution Box */}
              {isRevealed && (
                <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 p-4 rounded-xl space-y-3 animate-in fade-in">
                  <div>
                    <h5 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                      Model Solution & Explanation
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                      {item.answer}
                    </p>
                  </div>

                  {item.keyPoints && item.keyPoints.length > 0 && (
                    <div>
                      <h6 className="text-[10px] font-bold uppercase text-indigo-700 tracking-wider mb-1">
                        Mandatory Exam Points
                      </h6>
                      <ul className="space-y-1">
                        {item.keyPoints.map((pt, idx) => (
                          <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
