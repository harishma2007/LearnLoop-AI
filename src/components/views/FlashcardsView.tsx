import React, { useState } from "react";
import {
  Layers,
  Sparkles,
  RotateCw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Zap,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const FlashcardsView: React.FC = () => {
  const { flashcards, toggleFlashcardMastered, addFlashcards, addXP } = useApp();
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredCards = flashcards.filter(
    (card) => selectedSubject === "All" || card.subject === selectedSubject
  );

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % (filteredCards.length || 1));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % (filteredCards.length || 1));
  };

  const handleGenerateCards = () => {
    if (!newTopic.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      addFlashcards([
        {
          front: `What is the core definition of ${newTopic}?`,
          back: `${newTopic} is a foundational principle ensuring data integrity and structured modular performance.`,
          subject: "Custom",
          topic: newTopic,
        },
        {
          front: `What is a common pitfall when implementing ${newTopic}?`,
          back: `Failing to handle boundary conditions and transitive dependencies between composite keys.`,
          subject: "Custom",
          topic: newTopic,
        },
      ]);
      setNewTopic("");
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
            Active Recall Flashcards
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Reinforce key formulas, ACID constraints, and definitions with spaced flashcards.
          </p>
        </div>

        {/* Generate AI Flashcards */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="Generate flashcards on topic..."
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600 w-48 sm:w-60"
          />
          <button
            onClick={handleGenerateCards}
            disabled={!newTopic.trim() || isGenerating}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? "Generating..." : "Generate AI Cards"}</span>
          </button>
        </div>
      </div>

      {/* Main Flashcard Carousel */}
      {currentCard ? (
        <div className="max-w-xl mx-auto space-y-4">
          {/* Card Status Banner */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
            <span>
              Card {currentIndex + 1} of {filteredCards.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] uppercase font-bold">
                {currentCard.subject}
              </span>
              <span className="text-slate-400">•</span>
              <span>{currentCard.topic}</span>
            </div>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`min-h-[280px] sm:min-h-[320px] p-8 rounded-3xl cursor-pointer transition-all duration-300 shadow-md border flex flex-col justify-between select-none relative ${
              isFlipped
                ? "bg-linear-to-br from-indigo-900 to-purple-950 text-white border-indigo-700"
                : "bg-white text-slate-900 border-slate-200 hover:border-indigo-300"
            }`}
          >
            {/* Top row inside card */}
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isFlipped ? "bg-white/10 text-indigo-200" : "bg-slate-100 text-slate-500"
                }`}
              >
                {isFlipped ? "Answer / Conceptual Breakdown" : "Question / Concept"}
              </span>

              <div className="flex items-center gap-1 text-[11px] opacity-70">
                <RotateCw className="w-3 h-3" />
                <span>Click anywhere to flip</span>
              </div>
            </div>

            {/* Center Content */}
            <div className="py-6 text-center my-auto">
              <p className="text-base sm:text-xl font-bold leading-relaxed">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>

            {/* Bottom Row inside card */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100/10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFlashcardMastered(currentCard.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  currentCard.mastered
                    ? "bg-emerald-500 text-white"
                    : isFlipped
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{currentCard.mastered ? "Mastered (+15 XP)" : "Mark Mastered"}</span>
              </button>

              <span className="text-[11px] opacity-60">
                {currentCard.mastered ? "Locked in memory" : "Needs repetition"}
              </span>
            </div>
          </div>

          {/* Controls below card */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors cursor-pointer"
              title="Previous card"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-6 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span>Flip Card (Spacebar)</span>
            </button>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors cursor-pointer"
              title="Next card"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
