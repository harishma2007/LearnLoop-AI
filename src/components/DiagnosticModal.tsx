import React, { useState, useEffect } from "react";
import {
  X,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { apiService } from "../services/api";
import { DiagnosticQuestion, DiagnosticResult, LearningLevel } from "../types";

export const DiagnosticModal: React.FC = () => {
  const {
    showDiagnosticModal,
    closeDiagnosticModal,
    diagnosticSubject,
    language,
    setLevel,
    selectTopicForTutor,
    triggerConfetti,
  } = useApp();

  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(true);
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  useEffect(() => {
    if (showDiagnosticModal) {
      setLoadingQuestions(true);
      setCurrentStep(0);
      setSelectedAnswers({});
      setResult(null);

      apiService
        .generateDiagnosticTest(diagnosticSubject)
        .then((qs) => {
          setQuestions(qs);
        })
        .catch(() => {
          // Fallback questions for DBMS
          setQuestions([
            {
              id: "diag-1",
              question: "What is the primary objective of Database Normalization?",
              options: [
                "To speed up disk read times by duplicating indexes",
                "To eliminate redundant data and avoid update anomalies",
                "To automatically encrypt all relational columns",
                "To convert relational tables into unstructured JSON objects",
              ],
              correctIndex: 1,
              difficulty: "Easy",
              topic: "Normalization Fundamentals",
            },
            {
              id: "diag-2",
              question: "Which normal form specifically addresses partial dependencies on a composite candidate key?",
              options: [
                "First Normal Form (1NF)",
                "Second Normal Form (2NF)",
                "Third Normal Form (3NF)",
                "Boyce-Codd Normal Form (BCNF)",
              ],
              correctIndex: 1,
              difficulty: "Medium",
              topic: "Second Normal Form (2NF)",
            },
            {
              id: "diag-3",
              question: "A relation is in 3NF if it is in 2NF and has no transitive dependencies. What is a transitive dependency?",
              options: [
                "A non-key attribute depending on another non-key attribute",
                "A prime attribute depending directly on the primary key",
                "A foreign key referencing a composite candidate key",
                "A null value permitted in a unique index column",
              ],
              correctIndex: 0,
              difficulty: "Medium",
              topic: "Third Normal Form (3NF)",
            },
            {
              id: "diag-4",
              question: "Under the Strict 2PL (Two-Phase Locking) concurrency protocol, when are exclusive locks released?",
              options: [
                "Immediately after the specific record write operation completes",
                "Only after the transaction commits or aborts",
                "When the shrinking phase begins",
                "Whenever a deadlock detection cycle is triggered",
              ],
              correctIndex: 1,
              difficulty: "Hard",
              topic: "Concurrency Control & 2PL",
            },
          ]);
        })
        .finally(() => {
          setLoadingQuestions(false);
        });
    }
  }, [showDiagnosticModal, diagnosticSubject]);

  if (!showDiagnosticModal) return null;

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentStep]: optionIndex,
    }));
  };

  const handleSubmitTest = async () => {
    setIsEvaluating(true);
    try {
      let correct = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) correct++;
      });

      const res = await apiService.evaluateDiagnosticTest({
        subject: diagnosticSubject,
        score: correct,
        total: questions.length || 4,
      });

      const pct = Math.round((correct / (questions.length || 1)) * 100);
      const computedLevel: LearningLevel = res.suggestedLevel || (pct >= 75 ? "Advanced" : pct >= 50 ? "Intermediate" : "Beginner");

      setResult({
        ...res,
        assessedLevel: computedLevel,
        scorePercentage: pct,
        strengths: res.topicClassifications.filter((t) => t.status === "Strong").map((t) => t.topic),
        recommendedStartingTopic:
          res.topicClassifications.find((t) => t.status === "Needs Practice")?.topic || "Second Normal Form (2NF)",
        learningPathSummary: `Your assessed level is ${computedLevel} (${pct}% score). ${res.personalizedPath?.[0] || "Targeted revision recommended."}`,
      });
      triggerConfetti();
    } catch (e) {
      console.error(e);
      let correct = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) correct++;
      });
      const pct = Math.round((correct / (questions.length || 1)) * 100);
      const computedLevel: LearningLevel = pct >= 75 ? "Advanced" : pct >= 50 ? "Intermediate" : "Beginner";
      setResult({
        subject: diagnosticSubject,
        overallScore: pct,
        suggestedLevel: computedLevel,
        assessedLevel: computedLevel,
        scorePercentage: pct,
        strengths: ["Core definitions", "Relational modeling"],
        recommendedStartingTopic: "Second Normal Form (2NF)",
        learningPathSummary: `Based on your diagnostic accuracy of ${pct}%, we recommend starting at the ${computedLevel} stage focusing on composite key dependencies.`,
        topicClassifications: [
          { topic: "Foundations", status: "Strong", note: "Solid grasp" },
          { topic: "2NF & 3NF", status: "Needs Practice", note: "Focus on partial dependency" },
        ],
        personalizedPath: ["Revise 2NF with Teach-Back", "Practice composite key questions"],
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleApplyResult = () => {
    if (!result) return;
    const targetLevel = result.assessedLevel || result.suggestedLevel;
    setLevel(targetLevel);
    closeDiagnosticModal();
    selectTopicForTutor(diagnosticSubject, result.recommendedStartingTopic || "Second Normal Form (2NF)");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeDiagnosticModal}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold">
            <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
            <span>Smart Level Diagnostic</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Find My Learning Level: {diagnosticSubject}
          </h2>
          <p className="text-xs text-slate-500">
            A quick 4-question adaptive gauge (Easy → Medium → Hard) to place you into Beginner, Intermediate, or Advanced.
          </p>
        </div>

        {/* Loading state */}
        {loadingQuestions ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-slate-600">
              Generating tailored diagnostic test questions...
            </span>
          </div>
        ) : result ? (
          /* Result Summary */
          <div className="space-y-5">
            <div className="p-6 rounded-2xl bg-linear-to-br from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  Assessed Learning Level
                </span>
                <div className="text-2xl font-black text-slate-900">
                  {result.assessedLevel} ({result.scorePercentage}%)
                </div>
              </div>

              <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed">
                {result.learningPathSummary}
              </p>
            </div>

            {/* Strengths & Recommendation */}
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Recommended Starting Topic:
                </span>
                <div className="text-sm font-bold text-indigo-700">
                  {result.recommendedStartingTopic}
                </div>
              </div>

              {result.strengths && result.strengths.length > 0 && (
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Validated Foundation:
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {result.strengths.map((s: string, i: number) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-900 font-semibold">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleApplyResult}
              className="w-full py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Set Profile to {result.assessedLevel || result.suggestedLevel} & Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : currentQuestion ? (
          /* Question View */
          <div className="space-y-5">
            {/* Stepper progress */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>
                Question {currentStep + 1} of {questions.length}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-700">
                Difficulty: {currentQuestion.difficulty || "Medium"}
              </span>
            </div>

            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {currentQuestion.options.map((opt, optIndex) => {
                  const isSelected = selectedAnswers[currentStep] === optIndex;
                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelectOption(optIndex)}
                      className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50 border-indigo-600 text-indigo-950 font-bold ring-2 ring-indigo-500/20 shadow-2xs"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nav controls */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
              >
                Back
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmitTest}
                  disabled={isEvaluating || selectedAnswers[currentStep] === undefined}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isEvaluating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Grading Diagnostic...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Finish & Calculate My Level</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(questions.length - 1, prev + 1))}
                  disabled={selectedAnswers[currentStep] === undefined}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs disabled:opacity-40 transition-all cursor-pointer"
                >
                  Next Question
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
