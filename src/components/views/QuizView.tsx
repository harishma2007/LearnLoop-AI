import React, { useState } from "react";
import {
  PenSquare,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  SearchCheck,
  AlertTriangle,
  Award,
  BookOpen,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { apiService } from "../../services/api";
import { Difficulty, Language, QuizQuestion } from "../../types";

export const QuizView: React.FC = () => {
  const {
    subjects,
    selectedSubject,
    language,
    openMistakeDetective,
    addXP,
    triggerConfetti,
    selectTopicForTutor,
    setActiveTab,
  } = useApp();

  // Generator parameters
  const [subject, setSubject] = useState(selectedSubject?.name || "DBMS");
  const [topic, setTopic] = useState("Normalization (1NF, 2NF, 3NF, BCNF)");
  const [count, setCount] = useState<number>(4);
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [quizLang, setQuizLang] = useState<Language>(language || "English");

  // State
  const [status, setStatus] = useState<"configure" | "loading" | "active" | "result">("configure");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [loadingMistakeFor, setLoadingMistakeFor] = useState<number | null>(null);

  const startQuizGeneration = async () => {
    setStatus("loading");
    try {
      const qs = await apiService.generateQuiz({
        subject,
        topic,
        count,
        difficulty,
        language: quizLang,
      });
      setQuestions(qs);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setStatus("active");
    } catch (e) {
      console.error(e);
      setStatus("configure");
    }
  };

  const selectOption = (optIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optIndex }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setStatus("result");
    let score = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswerIndex) score += 1;
    });
    const percent = Math.round((score / questions.length) * 100);
    if (percent >= 70) {
      triggerConfetti();
      addXP(50);
    } else {
      addXP(20);
    }
  };

  const handleInspectMistake = async (qIndex: number) => {
    const q = questions[qIndex];
    const chosenOpt = q.options[selectedAnswers[qIndex] ?? 0];
    const correctOpt = q.options[q.correctAnswerIndex];

    setLoadingMistakeFor(qIndex);
    try {
      const analysis = await apiService.analyzeMistake({
        question: q.question,
        studentAnswer: chosenOpt,
        correctAnswer: correctOpt,
        subject,
        topic,
        language: quizLang,
      });
      openMistakeDetective(analysis);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMistakeFor(null);
    }
  };

  const calculateResults = () => {
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswerIndex) correctCount += 1;
    });
    const accuracy = Math.round((correctCount / questions.length) * 100);
    return { correctCount, total: questions.length, accuracy };
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Configure State */}
      {status === "configure" && (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
              <PenSquare className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
              AI Adaptive Quiz Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Test your recall, identify subtle traps, and diagnose mistakes with our built-in Mistake Detective.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-indigo-600"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Academic Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Normalization (1NF, 2NF, 3NF), Eigenvalues, Organic Chemistry..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Number of Questions</label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value={3}>3 Questions (Express)</option>
                  <option value={4}>4 Questions (Standard)</option>
                  <option value={5}>5 Questions (Comprehensive)</option>
                  <option value={8}>8 Questions (Exam Mock)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e: any) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Easy">Easy (Foundations)</option>
                  <option value="Medium">Medium (Application)</option>
                  <option value="Hard">Hard (Scenarios & Edge Cases)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Language</label>
                <select
                  value={quizLang}
                  onChange={(e: any) => setQuizLang(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value="English">English</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="Malayalam">Malayalam (മലയാളം)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                </select>
              </div>
            </div>

            <button
              onClick={startQuizGeneration}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Personalized Quiz</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Loading State */}
      {status === "loading" && (
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center animate-spin">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
            Synthesizing Academic Quiz...
          </h3>
          <p className="text-xs text-slate-500">
            Generating adaptive multiple-choice questions for <strong className="text-slate-800">{topic}</strong> in <strong className="text-indigo-600">{quizLang}</strong>.
          </p>
        </div>
      )}

      {/* 3. Active Quiz Runner */}
      {status === "active" && currentQ && (
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Top Progress & Details */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{subject}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-600 truncate max-w-xs">{topic}</span>
              </div>
              <p className="text-xs font-bold text-slate-900">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>

            {/* Visual Step Indicator */}
            <div className="flex items-center gap-1.5">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-2 rounded-full transition-all ${
                    i === currentIndex
                      ? "bg-indigo-600 w-8"
                      : selectedAnswers[i] !== undefined
                      ? "bg-indigo-200"
                      : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((opt, optIndex) => {
                const isSelected = selectedAnswers[currentIndex] === optIndex;
                const letter = String.fromCharCode(65 + optIndex);
                return (
                  <button
                    key={optIndex}
                    onClick={() => selectOption(optIndex)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold ring-2 ring-indigo-200"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="mt-0.5 leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Next / Submit Button */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={() => setStatus("configure")}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Quit Quiz
              </button>

              <button
                onClick={handleNext}
                disabled={selectedAnswers[currentIndex] === undefined}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>{currentIndex === questions.length - 1 ? "Submit & View Breakdown" : "Next Question"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Quiz Results & Mistake Detective Launchpad */}
      {status === "result" && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Result Banner */}
          {(() => {
            const { correctCount, total, accuracy } = calculateResults();
            const isHigh = accuracy >= 75;
            return (
              <div
                className={`p-6 sm:p-8 rounded-2xl border text-white ${
                  isHigh
                    ? "bg-linear-to-r from-indigo-900 to-emerald-900 border-emerald-700"
                    : "bg-linear-to-r from-slate-900 to-indigo-950 border-indigo-800"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Quiz Diagnostic Complete
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black font-['Outfit',sans-serif]">
                      Accuracy: {accuracy}% ({correctCount}/{total} Correct)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                      {isHigh
                        ? "Outstanding mastery! You demonstrated strong conceptual clarity across standard and composite constraints."
                        : "Great effort! Several subtle traps were identified. Use Mistake Detective below to understand where you went wrong."}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={startQuizGeneration}
                      className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-xs hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retest Again</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("revision")}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
                    >
                      Add to Smart Revision
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Question-by-Question Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Detailed Question Analysis & Mistake Detective
            </h3>

            {questions.map((q, idx) => {
              const studentChoice = selectedAnswers[idx];
              const isCorrect = studentChoice === q.correctAnswerIndex;
              const chosenText = q.options[studentChoice ?? 0];
              const correctText = q.options[q.correctAnswerIndex];

              return (
                <div
                  key={q.id || idx}
                  className={`p-5 rounded-2xl bg-white border transition-all ${
                    isCorrect ? "border-emerald-200" : "border-rose-200 bg-rose-50/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                          <XCircle className="w-4 h-4" />
                        </div>
                      )}
                      <span className="text-xs font-bold text-slate-800">Question {idx + 1}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600">
                        {q.concept || topic}
                      </span>
                    </div>

                    {!isCorrect && (
                      <button
                        onClick={() => handleInspectMistake(idx)}
                        disabled={loadingMistakeFor === idx}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer animate-pulse"
                      >
                        <SearchCheck className="w-3.5 h-3.5" />
                        <span>
                          {loadingMistakeFor === idx
                            ? "Analyzing Misconception..."
                            : "Inspect with Mistake Detective"}
                        </span>
                      </button>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-slate-900 mt-1 mb-3">{q.question}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        isCorrect
                          ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                          : "bg-rose-50 text-rose-900 border-rose-200"
                      }`}
                    >
                      <span className="font-bold block text-[10px] uppercase">Your Answer:</span>
                      <span>{chosenText || "No answer selected"}</span>
                    </div>

                    {!isCorrect && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
                        <span className="font-bold block text-[10px] uppercase">Correct Answer:</span>
                        <span>{correctText}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <strong className="font-bold text-slate-900">Explanation: </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
