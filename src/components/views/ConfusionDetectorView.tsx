import React, { useState } from "react";
import {
  AlertTriangle,
  Brain,
  Sparkles,
  ArrowRight,
  Split,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  PenSquare,
  Search,
  Plus,
  Zap,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { apiService } from "../../services/api";
import { ConfusionItem } from "../../types";

export const ConfusionDetectorView: React.FC = () => {
  const {
    confusionList,
    selectedSubject,
    weakTopics,
    startTeachBack,
    selectTopicForTutor,
    setActiveTab,
  } = useApp();

  const [confusions, setConfusions] = useState<ConfusionItem[]>(() => {
    // Ensure initial items have unique IDs
    const seen = new Set<string>();
    return confusionList.map((item, idx) => {
      let id = item.id;
      if (!id || seen.has(id)) {
        id = `conf-item-${Date.now()}-${idx}`;
      }
      seen.add(id);
      return { ...item, id };
    });
  });
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [conceptAInput, setConceptAInput] = useState<string>("");
  const [conceptBInput, setConceptBInput] = useState<string>("");
  const [selectedConfusion, setSelectedConfusion] = useState<ConfusionItem | null>(confusions[0] || null);

  const handleRunAIDetection = async () => {
    setIsAnalyzing(true);
    try {
      const results = await apiService.detectConfusion({
        subject: selectedSubject?.name || "DBMS",
        topic: weakTopics[0]?.topic || "Database Normalization",
        mistakes: weakTopics,
      });

      if (results && results.length > 0) {
        setConfusions((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const existingPairs = new Set(
            prev.map((p) => `${p.subject || ""}_${p.conceptA || ""}_${p.conceptB || ""}`.toLowerCase())
          );
          const sanitizedNew: ConfusionItem[] = [];

          results.forEach((r, idx) => {
            const pairKey = `${r.subject || ""}_${r.conceptA || ""}_${r.conceptB || ""}`.toLowerCase();
            if (existingPairs.has(pairKey)) return;
            existingPairs.add(pairKey);

            let id = r.id;
            if (!id || existingIds.has(id)) {
              id = `conf-ai-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`;
            }
            existingIds.add(id);
            sanitizedNew.push({ ...r, id });
          });

          return [...sanitizedNew, ...prev];
        });

        if (results[0]) {
          setSelectedConfusion(results[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateCustomPair = () => {
    if (!conceptAInput.trim() || !conceptBInput.trim()) return;

    const newItem: ConfusionItem = {
      id: `conf-custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      subject: selectedSubject?.name || "General",
      title: `${conceptAInput} vs ${conceptBInput}`,
      conceptA: conceptAInput,
      conceptB: conceptBInput,
      mistakesCount: 1,
      whyHappening: `Often confused because both concepts deal with related principles in ${selectedSubject?.name || "the syllabus"}.`,
      keyDistinction: `Remember the decisive rule: ${conceptAInput} focuses on primary criteria, whereas ${conceptBInput} applies when additional constraints or secondary conditions exist.`,
      recommendedAction: `Read 2 worked examples comparing them side-by-side, then explain the difference in Teach-Back Mode.`,
      severity: "Medium",
    };

    setConfusions((prev) => [newItem, ...prev]);
    setSelectedConfusion(newItem);
    setConceptAInput("");
    setConceptBInput("");
    setShowCustomModal(false);
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-amber-900 via-rose-950 to-indigo-950 text-white p-6 sm:p-8 shadow-sm">
        <div className="absolute right-0 bottom-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                <Split className="w-3.5 h-3.5" />
                Root-Cause Diagnostic
              </span>
              <span className="text-xs text-amber-200/80">
                Unpacks recurring "Concept A vs Concept B" errors
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif]">
              🔍 Confusion Detector
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
              Most mistakes aren't from lack of studying — they happen because two very similar concepts are tangled up in your head. LearnLoop untangles them with side-by-side clarity.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowCustomModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Compare Any 2 Concepts</span>
            </button>

            <button
              onClick={handleRunAIDetection}
              disabled={isAnalyzing}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? "Scanning Patterns..." : "Detect Confusions (AI)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: List of detected confusions + Deep Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: List of Confusions */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Identified Confusion Pairs ({confusions.length})
            </span>
          </div>

          <div className="space-y-2.5">
            {confusions.map((item, index) => {
              const isSelected = selectedConfusion?.id === item.id;
              const uniqueKey = item.id ? `${item.id}-${index}` : `conf-item-${index}`;
              return (
                <div
                  key={uniqueKey}
                  onClick={() => setSelectedConfusion(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? "border-amber-500 bg-amber-50/30 ring-2 ring-amber-400/20 shadow-xs"
                      : "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-2xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-black text-slate-900 leading-snug">
                      {item.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        item.severity === "High"
                          ? "bg-rose-100 text-rose-700 border border-rose-200"
                          : "bg-amber-100 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item.severity || "Medium"} Severity
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2 font-medium">
                    <span className="text-indigo-600 font-semibold">{item.subject}</span>
                    <span>•</span>
                    <span>{item.mistakesCount || 2} recurring mistakes detected</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.keyDistinction}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Deep Comparison Matrix & Resolution */}
        <div className="lg:col-span-7">
          {selectedConfusion ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Confusion Untangling Blueprint
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {selectedConfusion.subject}
                </span>
              </div>

              {/* Title & Core Conflict */}
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {selectedConfusion.title}
                </h2>
              </div>

              {/* Side-by-Side Comparison Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                    Concept A
                  </span>
                  <div className="text-sm font-extrabold text-blue-950">
                    {selectedConfusion.conceptA}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-purple-600 tracking-wider">
                    Concept B
                  </span>
                  <div className="text-sm font-extrabold text-purple-950">
                    {selectedConfusion.conceptB}
                  </div>
                </div>
              </div>

              {/* Why are you confusing them? */}
              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Why this confusion is happening in your mind:</span>
                </div>
                <p className="text-xs text-rose-950 leading-relaxed font-medium">
                  {selectedConfusion.whyHappening}
                </p>
              </div>

              {/* The Decisive Key Distinction */}
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>The Decisive Rule (The "Mental Hook"):</span>
                </div>
                <p className="text-xs text-emerald-950 font-bold leading-relaxed">
                  {selectedConfusion.keyDistinction}
                </p>
              </div>

              {/* Action Plan */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Recommended Action Plan:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedConfusion.recommendedAction}
                </p>
              </div>

              {/* Instant Resolution CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  onClick={() => startTeachBack(`${selectedConfusion.conceptA} vs ${selectedConfusion.conceptB}`, selectedConfusion.subject)}
                  className="flex-1 py-3 px-4 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Brain className="w-4 h-4 text-amber-300" />
                  <span>Teach Back This Distinction</span>
                </button>

                <button
                  onClick={() => selectTopicForTutor(selectedConfusion.subject, selectedConfusion.title)}
                  className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Read Simplified Primer</span>
                </button>

                <button
                  onClick={() => setActiveTab("quiz")}
                  className="py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Retest (3 Qs)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-2xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Split className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                No Confusion Selected
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Choose an identified confusion from the left or run the AI Detector to scan recent quiz errors.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Pair Comparison Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Compare Any Two Confusing Concepts
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter two terms or principles you frequently get mixed up (e.g., "Thread vs Process", "Mitosis vs Meiosis", "BFS vs DFS").
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Concept A
                </label>
                <input
                  type="text"
                  value={conceptAInput}
                  onChange={(e) => setConceptAInput(e.target.value)}
                  placeholder="e.g., 2NF or Permutation or Thread"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Concept B
                </label>
                <input
                  type="text"
                  value={conceptBInput}
                  onChange={(e) => setConceptBInput(e.target.value)}
                  placeholder="e.g., 3NF or Combination or Process"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomPair}
                disabled={!conceptAInput.trim() || !conceptBInput.trim()}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs disabled:opacity-50 cursor-pointer"
              >
                Untangle Concepts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
