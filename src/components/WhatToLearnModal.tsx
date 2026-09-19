import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  ArrowRight,
  Clock,
  Brain,
  BookOpen,
  PenSquare,
  RotateCcw,
  Target,
  Zap,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { apiService } from "../services/api";
import { WhatToLearnRecommendation } from "../types";

export const WhatToLearnModal: React.FC = () => {
  const {
    showWhatToLearnModal,
    closeWhatToLearnModal,
    selectedSubject,
    weakTopics,
    conceptNodes,
    startTeachBack,
    selectTopicForTutor,
    setActiveTab,
  } = useApp();

  const [loading, setLoading] = useState<boolean>(true);
  const [recommendation, setRecommendation] = useState<WhatToLearnRecommendation | null>(null);

  useEffect(() => {
    if (showWhatToLearnModal) {
      setLoading(true);
      const subjectName = selectedSubject?.name || "DBMS";
      const subjectNodes = conceptNodes[selectedSubject?.id || "dbms"] || conceptNodes["dbms"] || [];

      apiService
        .getWhatToLearnNext({
          subject: subjectName,
          weakCount: weakTopics.length,
        })
        .then((res) => {
          setRecommendation(res);
        })
        .catch(() => {
          setRecommendation({
            topic: "Second Normal Form (2NF)",
            subject: subjectName,
            actionType: "teach-back",
            reason:
              "You have 3 recurring mistakes on composite key partial dependencies. Explaining this concept in your own words will lock it into your long-term memory.",
            estimatedMinutes: 15,
            urgency: "High",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [showWhatToLearnModal, selectedSubject, weakTopics.length]);

  if (!showWhatToLearnModal) return null;

  const handleStartRecommendedAction = () => {
    if (!recommendation) return;
    closeWhatToLearnModal();

    const act = (recommendation.actionType || "").toLowerCase();
    if (act.includes("teach")) {
      startTeachBack(recommendation.topic, recommendation.subject);
    } else if (act.includes("tutor") || act.includes("learn")) {
      selectTopicForTutor(recommendation.subject, recommendation.topic);
    } else if (act.includes("quiz") || act.includes("pract")) {
      setActiveTab("question-bank");
    } else {
      setActiveTab("revision");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeWhatToLearnModal}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Dynamic Recommendation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            What Should I Learn Now?
          </h2>
          <p className="text-xs text-slate-500">
            Calculated from your knowledge graph, recent quiz mistakes, and active confusion points.
          </p>
        </div>

        {/* Recommendation Content */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-slate-600">
              Scanning knowledge gaps & prerequisite paths...
            </span>
          </div>
        ) : recommendation ? (
          <div className="space-y-4">
            {/* Recommendation Highlight Card */}
            <div className="p-5 rounded-2xl bg-linear-to-br from-indigo-50/90 via-purple-50/50 to-slate-50 border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-100/70 px-2.5 py-0.5 rounded-md">
                  {recommendation.subject}
                </span>
                <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {recommendation.urgency} Priority
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Top Recommended Topic
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {recommendation.topic}
                </h3>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-indigo-100/80 text-xs text-slate-700 leading-relaxed font-medium">
                {recommendation.reason}
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Est. Time: {recommendation.estimatedMinutes} mins</span>
                </div>
                <div className="flex items-center gap-1.5 text-indigo-700">
                  <Target className="w-4 h-4" />
                  <span>Action: {recommendation.actionType}</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleStartRecommendedAction}
              className="w-full py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Start {recommendation.actionType}: {recommendation.topic}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
