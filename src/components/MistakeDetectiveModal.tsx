import React, { useState } from "react";
import {
  SearchCheck,
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const MistakeDetectiveModal: React.FC = () => {
  const { showMistakeModal, closeMistakeDetective, activeMistakeAnalysis, addXP, triggerConfetti } = useApp();
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<number | null>(null);
  const [hasPracticed, setHasPracticed] = useState<boolean>(false);

  if (!showMistakeModal || !activeMistakeAnalysis) return null;

  const practice = activeMistakeAnalysis.similarPracticeQuestion;

  const handlePracticeSelect = (optIndex: number) => {
    setSelectedPracticeOption(optIndex);
    setHasPracticed(true);
    if (practice && optIndex === practice.correctIndex) {
      triggerConfetti();
      addXP(25);
    }
  };

  const isPracticeCorrect = practice && selectedPracticeOption === practice.correctIndex;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 text-white relative">
          <button
            onClick={closeMistakeDetective}
            className="absolute top-4 right-4 p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black shadow-sm">
              <SearchCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Flagship Diagnostic Engine
              </span>
              <h2 className="text-xl font-black font-['Outfit',sans-serif]">
                Mistake Detective
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-indigo-100 italic">
            "{activeMistakeAnalysis.friendlyIntro || activeMistakeAnalysis.encouragement || "Let's understand where you went wrong."}"
          </p>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Side by side Comparison */}
          {(activeMistakeAnalysis.studentAnswer || activeMistakeAnalysis.correctAnswer) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] font-bold uppercase text-rose-700 tracking-wider">
                  What you selected
                </span>
                <p className="text-xs sm:text-sm font-semibold text-rose-950 mt-1">
                  {activeMistakeAnalysis.studentAnswer || "Selected Option"}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">
                  Accurate Academic Principle
                </span>
                <p className="text-xs sm:text-sm font-semibold text-emerald-950 mt-1">
                  {activeMistakeAnalysis.correctAnswer || "Model Correct Option"}
                </p>
              </div>
            </div>
          )}

          {/* Root Misconception Breakdown */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Core Misconception Identified
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              <strong className="text-indigo-900 font-bold">{activeMistakeAnalysis.misunderstoodConcept}: </strong>
              {activeMistakeAnalysis.whyIncorrect}
            </p>
          </div>

          {/* Simple Explanation & Relatable Analogy */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Simple Explanation
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeMistakeAnalysis.simpleExplanation}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-linear-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-indigo-950 mb-0.5">
                  Relatable Real-World Memory Hook
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeMistakeAnalysis.relatableExample}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Similar Practice Question */}
          {practice && (
            <div className="p-5 rounded-2xl bg-white border border-indigo-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                    Try Similar Question (Verify Breakthrough)
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                  +25 XP
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                {practice.question}
              </p>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {practice.options.map((opt: string, i: number) => {
                  const isSelected = selectedPracticeOption === i;
                  const isCorrect = i === practice.correctIndex;
                  let btnStyle = "border-slate-200 hover:border-slate-300 bg-white text-slate-700";

                  if (hasPracticed) {
                    if (isCorrect) {
                      btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold";
                    } else if (isSelected) {
                      btnStyle = "border-rose-400 bg-rose-50 text-rose-950";
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handlePracticeSelect(i)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {hasPracticed && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {hasPracticed && (
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed animate-in fade-in ${
                    isPracticeCorrect
                      ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                      : "bg-amber-50 text-amber-900 border border-amber-200"
                  }`}
                >
                  <strong>{isPracticeCorrect ? "Spot on! Concept mastered!" : "Almost there! "}</strong>
                  {practice.hint || "Keep this distinction in mind for your upcoming quizzes."}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            LearnLoop AI • No penalties for mistakes
          </span>
          <button
            onClick={() => {
              addXP(15);
              closeMistakeDetective();
            }}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            I Understand Now! Close
          </button>
        </div>
      </div>
    </div>
  );
};
