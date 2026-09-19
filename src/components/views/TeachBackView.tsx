import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  BookOpen,
  PenSquare,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  HelpCircle,
  Copy,
  Check,
  Volume2,
  MapPin,
  Flame,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { apiService } from "../../services/api";
import { Language, TeachBackEvaluation } from "../../types";

export const TeachBackView: React.FC = () => {
  const {
    selectedSubject,
    subjects,
    setSelectedSubject,
    language,
    activeTeachBackTopic,
    teachBackHistory,
    addTeachBackEvaluation,
    selectTopicForTutor,
    setActiveTab,
    openMasteryMap,
  } = useApp();

  const [topic, setTopic] = useState<string>(activeTeachBackTopic || "Second Normal Form (2NF)");
  const [explanation, setExplanation] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<TeachBackEvaluation | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [evaluationStep, setEvaluationStep] = useState<string>("");

  const recognitionRef = useRef<any>(null);

  // Sync topic when activeTeachBackTopic changes
  useEffect(() => {
    if (activeTeachBackTopic) {
      setTopic(activeTeachBackTopic);
    }
  }, [activeTeachBackTopic]);

  // Setup Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang =
        language === "Tamil"
          ? "ta-IN"
          : language === "Hindi"
          ? "hi-IN"
          : language === "Telugu"
          ? "te-IN"
          : language === "Malayalam"
          ? "ml-IN"
          : language === "Kannada"
          ? "kn-IN"
          : "en-US";

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setExplanation((prev) => (prev ? prev + " " + transcript : transcript));
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleRecording = () => {
    if (!speechSupported) {
      alert("Speech recognition is not supported in this browser environment. You can type your explanation directly!");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        setIsRecording(false);
      }
    }
  };

  const handleEvaluate = async () => {
    if (!explanation.trim()) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    setIsEvaluating(true);
    setEvaluationStep("Analyzing conceptual mental model...");

    const timer1 = setTimeout(() => setEvaluationStep("Checking core concepts and principles..."), 600);
    const timer2 = setTimeout(() => setEvaluationStep("Detecting subtle misconceptions and gaps..."), 1200);

    try {
      const result = await apiService.evaluateTeachBack({
        topic,
        subject: selectedSubject?.name || "DBMS",
        explanation,
        language,
      });

      setEvaluation(result);
      addTeachBackEvaluation(topic, selectedSubject?.name || "DBMS", explanation, result);
    } catch (e) {
      console.error(e);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsEvaluating(false);
      setEvaluationStep("");
    }
  };

  const handlePasteDemoExplanation = () => {
    if (topic.toLowerCase().includes("2nf") || topic.toLowerCase().includes("normal")) {
      setExplanation(
        "Normalization is about eliminating duplicate redundant data in database tables so update anomalies don't happen. 1NF means each cell only has a single atomic value. In 2NF, we are solving partial dependency: if a table has a composite key made of StudentID and CourseID, a column like CourseFee shouldn't depend on just CourseID — it must depend on the whole composite key. If it depends on just part of the key, we split it into a separate course table."
      );
    } else if (topic.toLowerCase().includes("photo") || selectedSubject?.name === "Biology") {
      setExplanation(
        "Photosynthesis is how green plants make their own food using light energy. Inside the plant cells, chloroplasts contain chlorophyll, which absorbs sunlight. Plants take in carbon dioxide from air and water from soil, and using the sun's energy, they convert them into glucose sugar for growth and release oxygen gas as a byproduct."
      );
    } else {
      setExplanation(
        `${topic} is a key concept in ${selectedSubject?.name || "our syllabus"}. Its main goal is to enforce consistency and eliminate errors by breaking the problem into modular rules. For example, instead of repeating redundant data or calculating values repeatedly, we establish clean boundaries and verify preconditions before computing results.`
      );
    }
  };

  const wordCount = explanation.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-900 via-purple-900 to-indigo-950 text-white p-6 sm:p-8 shadow-sm">
        <div className="absolute -right-8 -top-8 w-60 h-60 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                <Brain className="w-3.5 h-3.5 text-amber-300" />
                LearnLoop Signature Innovation
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
                Feynman Technique Engine
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif]">
              🧠 Teach-Back Mode
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
              "LearnLoop does not only teach students. It checks whether you truly understand by asking you to explain the concept back in your own words."
            </p>

            {/* Learning loop stepper */}
            <div className="pt-2 flex flex-wrap items-center gap-1 text-[11px] font-semibold text-indigo-200">
              <span className="text-slate-300">LEARN</span>
              <span>→</span>
              <span className="text-slate-300">PRACTISE</span>
              <span>→</span>
              <span className="text-slate-300">MAKE MISTAKES</span>
              <span>→</span>
              <span className="text-amber-300 font-bold bg-amber-400/20 px-2 py-0.5 rounded-md">EXPLAIN</span>
              <span>→</span>
              <span className="text-indigo-300">AI ANALYSIS</span>
              <span>→</span>
              <span className="text-slate-300">REVISE</span>
              <span>→</span>
              <span className="text-emerald-300">MASTER</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={() => openMasteryMap(selectedSubject?.id)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-purple-300" />
              <span>Concept Mastery Map</span>
            </button>
            <button
              onClick={handlePasteDemoExplanation}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load Demo Explanation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Input & Prompt Area vs AI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Topic Setup & Explanation Input */}
        <div className="lg:col-span-7 space-y-5">
          {/* Topic & Subject Selector Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Subject & Syllabus
                </label>
                <select
                  value={selectedSubject?.id || "dbms"}
                  onChange={(e) => {
                    const found = subjects.find((s) => s.id === e.target.value);
                    if (found) {
                      setSelectedSubject(found);
                      if (found.topics[0]) setTopic(found.topics[0]);
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Concept / Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Second Normal Form (2NF), Photosynthesis"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Quick suggested topics pills */}
            {selectedSubject?.topics && (
              <div>
                <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Quick select syllabus topic:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSubject.topics.slice(0, 4).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        topic === t
                          ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Teacher Persona Prompt Box */}
          <div className="bg-linear-to-br from-indigo-50/80 via-purple-50/50 to-slate-50 rounded-2xl p-5 border border-indigo-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Brain className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-slate-900">
                  Imagine you are the teacher. Explain <span className="text-indigo-600 font-extrabold">{topic}</span> in your own words.
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Do not worry about formal textbook grammar. Speak or write naturally in <span className="font-semibold text-indigo-700">{language}</span>. Cover what problem it solves, the main rule, and a simple analogy.
                </p>
              </div>
            </div>
          </div>

          {/* Explanation Textarea & Voice Input */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Your Explanation
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${wordCount < 20 ? "text-amber-600" : "text-emerald-600"}`}>
                  {wordCount} words
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">Language: {language}</span>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder={`Start explaining ${topic} here... \nExample: "${topic} is used when we have a situation where..."\n\n(Click the microphone below to dictate with your voice!)`}
                rows={7}
                className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed font-normal resize-none"
              />

              {isRecording && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>Listening...</span>
                </div>
              )}
            </div>

            {/* Input Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isRecording
                      ? "bg-red-600 text-white shadow-md shadow-red-200 animate-pulse"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-indigo-600" />}
                  <span>{isRecording ? "Stop Dictation" : "Voice Input (Mic)"}</span>
                </button>

                {explanation && (
                  <button
                    onClick={() => setExplanation("")}
                    className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 font-medium cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                onClick={handleEvaluate}
                disabled={isEvaluating || !explanation.trim()}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-100 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isEvaluating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Evaluating Mental Model...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Evaluate My Understanding</span>
                  </>
                )}
              </button>
            </div>

            {isEvaluating && evaluationStep && (
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-2.5 text-xs text-indigo-800 font-medium animate-pulse">
                <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                <span>{evaluationStep}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Analysis Result Display */}
        <div className="lg:col-span-5 space-y-5">
          {evaluation ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 transition-all">
              {/* Header with Score */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    LearnLoop Analysis
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Understanding Diagnosis
                  </h3>
                </div>

                {/* Circular Score Gauge */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900 leading-none">
                      {evaluation.understandingScore}%
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Score
                    </span>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${
                      evaluation.understandingScore >= 80
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : evaluation.understandingScore >= 60
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-rose-100 text-rose-800 border border-rose-300"
                    }`}
                  >
                    {evaluation.understandingScore >= 80 ? "A" : evaluation.understandingScore >= 60 ? "B" : "C"}
                  </div>
                </div>
              </div>

              {/* Clarity & Cognitive Status */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Explanation Clarity:</span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {evaluation.clarity}
                </span>
              </div>

              {/* Concepts Understood */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Concepts Correctly Understood</span>
                </div>
                <div className="space-y-1.5">
                  {evaluation.conceptsUnderstood.map((c, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900 font-medium flex items-start gap-2"
                    >
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Concepts */}
              {evaluation.missingConcepts.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Missing Concepts / Gaps to Mention</span>
                  </div>
                  <div className="space-y-1.5">
                    {evaluation.missingConcepts.map((m, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-xs text-amber-900 font-medium flex items-start gap-2"
                      >
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Misconceptions */}
              {evaluation.misconceptions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Misconceptions / Confusion Points</span>
                  </div>
                  <div className="space-y-1.5">
                    {evaluation.misconceptions.map((mis, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-rose-900 font-medium flex items-start gap-2"
                      >
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{mis}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Recommendation */}
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 space-y-1">
                <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wide">
                  🎯 Next Revision Step
                </span>
                <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                  {evaluation.recommendation}
                </p>
              </div>

              {/* Encouragement Note */}
              <p className="text-xs text-slate-500 italic">
                "{evaluation.encouragement}"
              </p>

              {/* Actions Matrix */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setExplanation("");
                    setEvaluation(null);
                  }}
                  className="py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>

                <button
                  onClick={() => {
                    selectTopicForTutor(selectedSubject?.name || "DBMS", topic);
                  }}
                  className="py-2 px-3 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Explain Simpler</span>
                </button>

                <button
                  onClick={() => setActiveTab("quiz")}
                  className="py-2 px-3 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PenSquare className="w-3.5 h-3.5" />
                  <span>Take Retest</span>
                </button>

                <button
                  onClick={() => openMasteryMap(selectedSubject?.id)}
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Update Mastery</span>
                </button>
              </div>
            </div>
          ) : (
            /* Empty State Guide Card */
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Brain className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  How Teach-Back Evaluation Works
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Unlike traditional multiple-choice questions where guessing is possible, Teach-Back tests your real cognitive mastery.
                </p>
              </div>

              <div className="space-y-2 text-left pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                  <div className="text-xs text-slate-700">
                    <span className="font-bold text-slate-900">No English penalty:</span> We evaluate your mental model, not your vocabulary.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                  <div className="text-xs text-slate-700">
                    <span className="font-bold text-slate-900">Find hidden gaps:</span> Discover which sub-rules you missed before exams do.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                  <div className="text-xs text-slate-700">
                    <span className="font-bold text-slate-900">Instant Mastery update:</span> High-score explanations automatically update your Concept Mastery Map!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Past Teach-Back History Widget */}
          {teachBackHistory.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Past Teach-Back Logs
                </span>
                <span className="text-xs text-indigo-600 font-semibold">
                  {teachBackHistory.length} completed
                </span>
              </div>

              <div className="space-y-2">
                {teachBackHistory.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setTopic(item.topic);
                      setExplanation(item.studentExplanation);
                      setEvaluation(item.evaluation);
                    }}
                    className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between text-left group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                        {item.topic}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.subject} • {item.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.evaluation.understandingScore}%
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
