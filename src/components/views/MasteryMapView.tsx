import React, { useState } from "react";
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  PenSquare,
  Brain,
  RotateCcw,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  HelpCircle,
  Filter,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ConceptNode, TopicMasteryState } from "../../types";

export const MasteryMapView: React.FC = () => {
  const {
    selectedSubject,
    subjects,
    setSelectedSubject,
    conceptNodes,
    updateTopicMastery,
    selectTopicForTutor,
    startTeachBack,
    setActiveTab,
    openWhatToLearnModal,
  } = useApp();

  const [activeSubjectKey, setActiveSubjectKey] = useState<string>("dbms");
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null);
  const [filterState, setFilterState] = useState<string>("All");

  const nodes = conceptNodes[activeSubjectKey] || conceptNodes["dbms"] || [];

  // Statistics calculation
  const totalNodes = nodes.length;
  const masteredCount = nodes.filter((n) => n.mastery === "Mastered").length;
  const understoodCount = nodes.filter((n) => n.mastery === "Understood").length;
  const needsPracticeCount = nodes.filter((n) => n.mastery === "Needs Practice").length;
  const learningCount = nodes.filter((n) => n.mastery === "Learning").length;
  const notStartedCount = nodes.filter((n) => n.mastery === "Not Started").length;

  const masteryPercent = totalNodes > 0 ? Math.round(((masteredCount + understoodCount * 0.7) / totalNodes) * 100) : 0;

  const filteredNodes = filterState === "All" ? nodes : nodes.filter((n) => n.mastery === filterState);

  const getMasteryBadge = (state: TopicMasteryState) => {
    switch (state) {
      case "Mastered":
        return {
          label: "Mastered",
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
          nodeBorder: "border-emerald-400 bg-emerald-50/40",
        };
      case "Understood":
        return {
          label: "Understood",
          bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
          dot: "bg-indigo-500",
          nodeBorder: "border-indigo-400 bg-indigo-50/30",
        };
      case "Needs Practice":
        return {
          label: "Needs Practice",
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          dot: "bg-amber-500",
          nodeBorder: "border-amber-400 bg-amber-50/40",
        };
      case "Learning":
        return {
          label: "Learning",
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          dot: "bg-blue-500",
          nodeBorder: "border-blue-400 bg-blue-50/30",
        };
      case "Not Started":
      default:
        return {
          label: "Not Started",
          bg: "bg-slate-100 text-slate-600 border-slate-200",
          dot: "bg-slate-400",
          nodeBorder: "border-slate-200 bg-white",
        };
    }
  };

  const handleSubjectChange = (key: string) => {
    setActiveSubjectKey(key);
    setSelectedNode(null);
    const found = subjects.find((s) => s.id === key);
    if (found) setSelectedSubject(found);
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 shadow-sm">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-400/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
                <MapPin className="w-3.5 h-3.5" />
                Adaptive Knowledge Graph
              </span>
              <span className="text-xs text-slate-400">
                Updated in real-time from Teach-Back & Quiz results
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif]">
              🗺️ Concept Mastery Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Visualize prerequisite chains, track exact mastery depth across topics, and launch targeted actions from any node.
            </p>
          </div>

          {/* Quick stats counter */}
          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center min-w-28">
              <div className="text-2xl font-black text-emerald-400 leading-none mb-1">
                {masteryPercent}%
              </div>
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Overall Mastery
              </div>
            </div>

            <button
              onClick={openWhatToLearnModal}
              className="px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>What Should I Learn Now?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: "dbms", name: "DBMS", icon: "Database" },
          { key: "math", name: "Mathematics", icon: "Sigma" },
          { key: "cs", name: "Computer Science", icon: "Laptop" },
        ].map((sub) => (
          <button
            key={sub.key}
            onClick={() => handleSubjectChange(sub.key)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSubjectKey === sub.key
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
            }`}
          >
            <span>{sub.name}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                activeSubjectKey === sub.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {(conceptNodes[sub.key] || []).length} Nodes
            </span>
          </button>
        ))}
      </div>

      {/* Mastery Status Filter & Legend Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-400 uppercase text-[11px] mr-1">Filter State:</span>
          {["All", "Mastered", "Understood", "Needs Practice", "Learning", "Not Started"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterState(st)}
              className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                filterState === st
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Mastered ({masteredCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>Understood ({understoodCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Needs Practice ({needsPracticeCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Learning ({learningCount})</span>
          </div>
        </div>
      </div>

      {/* Interactive Node Graph & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Node Tree / Graph */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Curriculum Flow & Prerequisite Chain
          </div>

          <div className="space-y-3">
            {filteredNodes.map((node, index) => {
              const badge = getMasteryBadge(node.mastery);
              const isSelected = selectedNode?.id === node.id;
              const hasParent = Boolean(node.parentId);

              return (
                <div key={node.id} className="relative">
                  {/* Visual connector line */}
                  {hasParent && (
                    <div className="absolute -top-3 left-6 w-0.5 h-3 bg-indigo-200" />
                  )}

                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? "border-indigo-600 ring-2 ring-indigo-500/20 shadow-md bg-indigo-50/20"
                        : `${badge.nodeBorder} hover:shadow-sm hover:border-slate-300`
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                        <span className={`w-3 h-3 rounded-full ${badge.dot}`} />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-extrabold text-slate-900">
                            {node.title}
                          </h2>
                          {hasParent && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              (Step {index + 1})
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {node.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                      {typeof node.accuracy === "number" && node.accuracy > 0 && (
                        <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                          {node.accuracy}%
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Node Inspector Drawer Card */}
        <div className="lg:col-span-5 sticky top-20">
          {selectedNode ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Topic Inspector
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    getMasteryBadge(selectedNode.mastery).bg
                  }`}
                >
                  {selectedNode.mastery}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {selectedNode.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Estimated Time</span>
                  <span className="font-bold text-slate-800">{selectedNode.estimatedMinutes || 30} mins</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Accuracy Score</span>
                  <span className="font-bold text-indigo-700">
                    {selectedNode.accuracy ? `${selectedNode.accuracy}%` : "Not evaluated yet"}
                  </span>
                </div>
              </div>

              {/* Quick Mastery State Override */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Update Knowledge State:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["Needs Practice", "Understood", "Mastered"] as TopicMasteryState[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateTopicMastery(activeSubjectKey, selectedNode.id, st);
                        setSelectedNode({ ...selectedNode, mastery: st });
                      }}
                      className={`text-xs py-1.5 px-2 rounded-lg font-bold border transition-all cursor-pointer ${
                        selectedNode.mastery === st
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons Matrix */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  LearnLoop 5-Step Actions
                </div>

                {/* 1. Teach Back Action (Highlighted Signature) */}
                <button
                  onClick={() => startTeachBack(selectedNode.title, selectedNode.subject)}
                  className="w-full py-2.5 px-4 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-sm flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-amber-300" />
                    <span>Explain in Teach-Back Mode</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 2. Learn (AI Tutor) */}
                <button
                  onClick={() => selectTopicForTutor(selectedNode.subject, selectedNode.title)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Learn with AI Tutor</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* 3. Practice Questions */}
                <button
                  onClick={() => setActiveTab("question-bank")}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <PenSquare className="w-4 h-4 text-blue-600" />
                    <span>Practice Questions</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* 4. Retest / Quiz */}
                <button
                  onClick={() => setActiveTab("quiz")}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Take Retest (Adaptive Quiz)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Select a Topic Node
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Click any node on the left to inspect its prerequisites, update its mastery status, or launch a direct Teach-Back session.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
