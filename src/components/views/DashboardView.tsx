import React, { useState } from "react";
import {
  Flame,
  Zap,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  BookOpen,
  PenSquare,
  RotateCcw,
  Bot,
  Layers,
  ChevronRight,
  Clock,
  Award,
  WifiOff,
  Brain,
  MapPin,
  Split,
  HeartPulse,
  Stethoscope,
  Plus,
  Search,
  Check,
  GraduationCap,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { SubjectItem } from "../../types";

export const DashboardView: React.FC = () => {
  const isOnline = useOnlineStatus();
  const {
    user,
    streak,
    xp,
    weakTopics,
    subjects,
    selectedSubject,
    setSelectedSubject,
    conceptNodes,
    confusionList,
    setActiveTab,
    startTeachBack,
    openMasteryMap,
    openConfusionDetector,
    openWhatToLearnModal,
    openDiagnosticModal,
    selectTopicForTutor,
    addCustomSubject,
  } = useApp();

  const [subjectCategory, setSubjectCategory] = useState<string>("All");
  const [subjectSearch, setSubjectSearch] = useState<string>("");
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);
  const [customSubjectInput, setCustomSubjectInput] = useState<string>("");

  const currentSubject: SubjectItem = selectedSubject || subjects[0];
  const activeSubjectId = currentSubject?.id || "math";
  const activeSubjectName = currentSubject?.name || "Mathematics";
  const activeSubjectKeyTopic = currentSubject?.topics?.[0] || "Foundations";

  // Nodes for current subject
  const currentNodes = conceptNodes[activeSubjectId] || conceptNodes["math"] || [];
  const masteredCount = currentNodes.filter((n) => n.mastery === "Mastered").length;
  const needsPracticeCount = currentNodes.filter((n) => n.mastery === "Needs Practice").length;

  // Confusions for current subject
  const subjectConfusions = confusionList.filter(
    (c) => c.subject?.toLowerCase() === activeSubjectName.toLowerCase()
  );
  const topConfusion = subjectConfusions[0] || confusionList[0];

  // Weak topics for current subject
  const subjectWeakTopics = weakTopics.filter(
    (wt) => wt.subject?.toLowerCase() === activeSubjectName.toLowerCase()
  );
  const displayedWeakTopics = subjectWeakTopics.length > 0 ? subjectWeakTopics : weakTopics;

  // Filtered subjects for selection
  const filteredSubjects = subjects.filter((s) => {
    const matchesCategory = subjectCategory === "All" || s.category === subjectCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      s.topics.some((t) => t.toLowerCase().includes(subjectSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = ["All", "Sciences", "Engineering & Tech", "Humanities & Commerce", "Custom"];

  const handleCustomSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSubjectInput.trim()) return;
    addCustomSubject(customSubjectInput.trim());
    setCustomSubjectInput("");
    setShowAddCustomModal(false);
  };

  // Dynamic recommendations based on current subject
  const dynamicRecommendations = [
    {
      title: `Explain ${activeSubjectKeyTopic} in Teach-Back Mode`,
      subject: activeSubjectName,
      action: "Feynman Technique: Prove deep conceptual grasp to AI",
      type: "teach-back",
      topic: activeSubjectKeyTopic,
    },
    {
      title: `Resolve ${topConfusion ? topConfusion.title : `${activeSubjectName} Concept Confusions`}`,
      subject: activeSubjectName,
      action: "Review side-by-side mental distinction & avoid common traps",
      type: "confusion",
      topic: topConfusion?.title || activeSubjectKeyTopic,
    },
    {
      title: `Practice 5 Adaptive ${activeSubjectName} Questions`,
      subject: activeSubjectName,
      action: "Adaptive quiz drill targeted to your skill level",
      type: "quiz",
      topic: currentSubject?.topics?.[1] || activeSubjectKeyTopic,
    },
    {
      title: `Inspect ${activeSubjectName} Concept Mastery Map`,
      subject: activeSubjectName,
      action: "Track prerequisite chains, unlock nodes & verify coverage",
      type: "mastery-map",
      topic: `${activeSubjectName} Mastery Graph`,
    },
  ];

  const recentActivities = [
    {
      title: `Solved 5 Adaptive Questions in ${activeSubjectName}`,
      time: "25 minutes ago",
      score: "+40 XP Earned",
      subject: activeSubjectName,
      icon: PenSquare,
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: `Explained ${activeSubjectKeyTopic} in Teach-Back Mode`,
      time: "2 hours ago",
      score: "Score: 88% (Concepts Mastered)",
      subject: activeSubjectName,
      icon: Brain,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "Mistake Detective analyzed key conceptual boundary",
      time: "Yesterday",
      score: "Misconception Resolved",
      subject: activeSubjectName,
      icon: Sparkles,
      color: "text-amber-600 bg-amber-50",
    },
    {
      title: "Mastered Flashcards on Core Principles",
      time: "2 days ago",
      score: "100% Spaced Recall",
      subject: activeSubjectName,
      icon: Layers,
      color: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Personal AI Learning Companion • All Subjects</span>
              </div>
              {!isOnline && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/30 text-amber-200 text-xs font-semibold backdrop-blur-xs border border-amber-400/40">
                  <WifiOff className="w-3 h-3 text-amber-300" />
                  <span>Offline Ready • Local Cache Active</span>
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif]">
              Welcome back, {user?.name || "Student"}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl leading-relaxed">
              Currently studying <span className="font-bold text-amber-300 underline underline-offset-4">{activeSubjectName}</span>. Your AI companion dynamically adapts all lessons, quizzes, flashcards, and teach-backs to your chosen subject.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openWhatToLearnModal}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>What Should I Learn Now?</span>
            </button>
            <button
              onClick={() => openDiagnosticModal(activeSubjectName)}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-teal-300" />
              <span>Find My Level in {activeSubjectName}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CORE FEATURE: "Choose Your Subject" Command Station */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                Choose Your Subject
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select any subject to instantly switch AI Tutor, Question Bank, Quiz, Flashcards, and Mastery Maps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddCustomModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Custom Subject</span>
            </button>
          </div>
        </div>

        {/* Search and Category Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              placeholder="Search 19+ subjects or topics..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSubjectCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  subjectCategory === cat
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects Horizontal Carousel / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {filteredSubjects.map((sub) => {
            const isSelected = sub.id === activeSubjectId;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub)}
                className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? "bg-indigo-50/90 border-indigo-500 shadow-xs ring-2 ring-indigo-500/20"
                    : "bg-slate-50/60 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-2xs"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                    <Check className="w-3 h-3" />
                  </span>
                )}

                <div>
                  <div
                    className={`w-8 h-8 rounded-lg bg-linear-to-br ${sub.color} text-white flex items-center justify-center font-bold text-xs shadow-2xs mb-2`}
                  >
                    {sub.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h3
                    className={`text-xs font-bold truncate ${
                      isSelected ? "text-indigo-950" : "text-slate-900 group-hover:text-indigo-600"
                    }`}
                  >
                    {sub.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                    {sub.topicsCount} topics • {sub.progress}%
                  </span>
                </div>

                <div className="w-full bg-slate-200/80 rounded-full h-1 mt-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-linear-to-r ${sub.color}`}
                    style={{ width: `${sub.progress}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Subject Focus Bar */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border border-indigo-500/20 shadow-xs">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${currentSubject.color} text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0`}>
            {activeSubjectName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Active Subject
              </span>
              <span className="text-xs text-slate-300">{currentSubject.category}</span>
            </div>
            <h2 className="text-lg font-bold font-['Outfit',sans-serif] mt-0.5">
              {activeSubjectName} Learning Track
            </h2>
            <p className="text-xs text-slate-300">
              Next focus: <span className="font-semibold text-white">{activeSubjectKeyTopic}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => selectTopicForTutor(activeSubjectName, activeSubjectKeyTopic)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Tutor</span>
          </button>
          <button
            onClick={() => startTeachBack(activeSubjectKeyTopic, activeSubjectName)}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Teach-Back</span>
          </button>
          <button
            onClick={() => openMasteryMap(activeSubjectId)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-purple-300" />
            <span>Mastery Map</span>
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <PenSquare className="w-3.5 h-3.5 text-emerald-300" />
            <span>Practice Quiz</span>
          </button>
        </div>
      </div>

      {/* Signature Innovation Highlight: Teach-Back Feature Card */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-purple-900 via-indigo-900 to-slate-900 text-white p-6 border border-purple-500/30 shadow-sm">
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-md">
              <Brain className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                  Signature Innovation
                </span>
                <span className="text-xs text-purple-200">The Feynman Technique Engine</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold font-['Outfit',sans-serif]">
                Teach-Back Mode: Prove you truly understand
              </h2>
              <p className="text-xs text-slate-200 max-w-xl leading-relaxed">
                LearnLoop doesn't just feed you answers. Explain <span className="font-semibold text-white">{activeSubjectKeyTopic}</span> in your own words. The AI detects gaps and reinforces your understanding.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={() => startTeachBack(activeSubjectKeyTopic, activeSubjectName)}
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Brain className="w-4 h-4" />
              <span>Explain {activeSubjectKeyTopic.split(" ")[0]} Now</span>
            </button>
            <button
              onClick={() => openMasteryMap(activeSubjectId)}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-purple-300" />
              <span>View {activeSubjectName} Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Learning Streak</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
            {streak} <span className="text-xs font-semibold text-amber-600">Days Active</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-medium">Keep learning today to reach 8 days!</p>
        </div>

        {/* Concept Mastery for Active Subject */}
        <div
          onClick={() => openMasteryMap(activeSubjectId)}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-indigo-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{activeSubjectName} Mastery</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
            {masteredCount} <span className="text-xs font-semibold text-emerald-600">Mastered</span>
          </div>
          <p className="mt-1 text-[11px] text-indigo-600 font-medium">
            {needsPracticeCount} pending practice in {activeSubjectName} →
          </p>
        </div>

        {/* Confusion Detector Alert */}
        <div
          onClick={() => openConfusionDetector(activeSubjectName)}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-200 shadow-2xs hover:border-rose-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Confusion Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Split className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
            {subjectConfusions.length > 0 ? subjectConfusions.length : confusionList.length}{" "}
            <span className="text-xs font-semibold text-rose-600">Tangled Pairs</span>
          </div>
          <p className="mt-1 text-[11px] text-rose-700 font-medium truncate">
            {topConfusion ? `${topConfusion.title} needs untangling →` : "All concepts clear →"}
          </p>
        </div>

        {/* Learning XP */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total XP</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-600 fill-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
            {xp} <span className="text-xs font-semibold text-purple-600">XP</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-medium">Level 4: Curious Scholar</p>
        </div>
      </div>

      {/* Two Column Layout: Weak Topics & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Weak Topics & Mistakes (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Weak Topics Alert Card */}
          <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Weak Topics Flagged for Revision</h2>
                  <p className="text-[11px] text-slate-500">
                    Flagged automatically based on quiz performance and conceptual misunderstandings.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("revision")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                View Revision Loop →
              </button>
            </div>

            <div className="space-y-2.5 mt-4">
              {displayedWeakTopics.map((wt) => (
                <div
                  key={wt.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-indigo-100 text-indigo-700">
                        {wt.subject}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{wt.topic}</h4>
                    </div>
                    <p className="text-[11px] text-amber-700 font-medium mt-1">
                      {wt.recommendedAction}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => startTeachBack(wt.topic, wt.subject)}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Brain className="w-3 h-3" />
                      <span>Teach Back</span>
                    </button>
                    <button
                      onClick={() => selectTopicForTutor(wt.subject, wt.topic)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      AI Tutor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Progress by Subject */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">Curriculum Progress by Subject</h2>
              <button
                onClick={() => setActiveTab("subjects")}
                className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                All {subjects.length} Subjects →
              </button>
            </div>

            <div className="space-y-3">
              {subjects.slice(0, 6).map((subj) => (
                <div
                  key={subj.id}
                  onClick={() => setSelectedSubject(subj)}
                  className="space-y-1 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="flex justify-between text-xs font-medium">
                    <span className={`font-semibold ${subj.id === activeSubjectId ? "text-indigo-600 font-bold" : "text-slate-800"}`}>
                      {subj.name} {subj.id === activeSubjectId && "(Active)"}
                    </span>
                    <span className="text-slate-500">{subj.progress}% Completed</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-linear-to-r ${subj.color}`}
                      style={{ width: `${subj.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations & Recent Activity (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recommendations Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Recommended for {activeSubjectName}
                </h2>
              </div>
              <button
                onClick={openWhatToLearnModal}
                className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                AI Reasoning →
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Tailored algorithm based on your recent performance in {activeSubjectName}.
            </p>

            <div className="space-y-2">
              {dynamicRecommendations.map((rec, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (rec.type === "teach-back") startTeachBack(rec.topic, rec.subject);
                    else if (rec.type === "confusion") openConfusionDetector(rec.subject);
                    else if (rec.type === "mastery-map") openMasteryMap(activeSubjectId);
                    else setActiveTab("quiz");
                  }}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/70 hover:border-indigo-200 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">
                        {rec.subject}
                      </span>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {rec.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{rec.action}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-bold text-slate-900">Recent Activity</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {recentActivities.map((act, i) => {
                const Icon = act.icon;
                return (
                  <div key={i} className="py-2.5 flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-lg ${act.color} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{act.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{act.time}</span>
                        <span>•</span>
                        <span className="font-semibold text-indigo-600">{act.score}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Subject Modal */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Add Any Custom Subject</h3>
              </div>
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Enter any subject or academic field (e.g., <em>Psychology, Environmental Science, French, Astronomy, Constitutional Law</em>). LearnLoop AI will generate starter topics and personalize all study modes.
            </p>

            <form onSubmit={handleCustomSubjectSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={customSubjectInput}
                  onChange={(e) => setCustomSubjectInput(e.target.value)}
                  placeholder="e.g. Behavioral Economics, Organic Chemistry, Philosophy..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customSubjectInput.trim()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Add & Start Learning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
