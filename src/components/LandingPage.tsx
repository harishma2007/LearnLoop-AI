import React from "react";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Bot,
  Brain,
  SearchCheck,
  RotateCcw,
  Languages,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  Mic,
  ShieldAlert,
  Flame,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const LandingPage: React.FC = () => {
  const { login, setActiveTab, setShowAuthModal } = useApp();

  const handleStart = () => {
    login();
    setActiveTab("dashboard");
  };

  const featureCards = [
    {
      title: "All-Subject AI Tutor",
      description: "Adaptive concept breakdowns for STEM, Computer Science, Humanities, and Commerce with real-world examples.",
      icon: Bot,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "Mistake Detective",
      description: "Never settle for 'Wrong'. Diagnoses misunderstood concepts, explains the root misconception, and gives targeted re-practice.",
      icon: SearchCheck,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
      highlight: true,
    },
    {
      title: "Multi-Language Learning",
      description: "Learn concepts, questions, and revision in English, Tamil, Hindi, Malayalam, Telugu, and Kannada seamlessly.",
      icon: Languages,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      title: "Adaptive Academic Quiz",
      description: "Dynamically escalates or de-escalates difficulty based on real-time accuracy and conceptual mastery.",
      icon: Brain,
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      title: "Smart Revision Cycle",
      description: "Spaced repetition and automated retesting targeting your identified weak topics before exams.",
      icon: RotateCcw,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      title: "Voice Learning & Speech AI",
      description: "Speak your academic questions aloud and listen to conversational explanations using voice synthesis.",
      icon: Mic,
      color: "bg-rose-50 text-rose-600 border-rose-200",
    },
  ];

  const steps = [
    { num: "01", step: "Learn", desc: "Understand foundational principles with an AI Tutor tailored to your exact academic level." },
    { num: "02", step: "Practise", desc: "Solve multi-tier questions, university exams (2/5/10/16-marks), and adaptive quizzes." },
    { num: "03", step: "Mistake Analysis", desc: "Mistake Detective breaks down exact misconceptions without penalties or stress." },
    { num: "04", step: "Revise", desc: "Targeted flashcards and smart spaced repetition lock concepts into long-term memory." },
    { num: "05", step: "Retest", desc: "Verify mastery with targeted scenario-based questions and level up your learning XP." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Platform Innovation Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-6 animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Team LearnLoop • Adaptive AI EdTech Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight font-['Outfit',sans-serif] leading-tight">
            Learn. Practise. Improve. <span className="text-indigo-600">Repeat.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            <strong className="text-slate-900 font-semibold">LearnLoop AI</strong> transforms one-size-fits-all education into an adaptive, multi-lingual learning journey. From high school to university exams, master any subject with personalized AI tutoring.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 hover:gap-3 transition-all cursor-pointer"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("features-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm shadow-2xs transition-colors cursor-pointer"
            >
              Explore Features
            </button>
          </div>

          {/* Quick proof pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              18+ Subjects Supported
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              6 Indian & Global Languages
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Zero 'Wrong Answer' Shaming
            </span>
          </div>
        </div>
      </section>

      {/* Real Statistics Section */}
      <section className="py-12 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 font-['Outfit',sans-serif]">98.4%</div>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">Exam Concept Clarity</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 font-['Outfit',sans-serif]">12,400+</div>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">Practice Questions Solved</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 font-['Outfit',sans-serif]">6 Languages</div>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">Tamil, Hindi, Malayalam & More</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 font-['Outfit',sans-serif]">3.8x</div>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">Faster Revision Speed</p>
            </div>
          </div>
        </div>
      </section>

      {/* How LearnLoop Works: The 5-Step Loop */}
      <section className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            The Continuous Cycle
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
            How LearnLoop AI Closes The Learning Gap
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Instead of passive memorization, LearnLoop puts students through an active, forgiving feedback loop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((s, idx) => (
            <div
              key={s.step}
              className="relative p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black text-indigo-500 font-['Outfit',sans-serif]">{s.num}</span>
                <h3 className="mt-2 text-base font-bold text-slate-900">{s.step}</h3>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-[10px] font-bold flex items-center justify-center">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features-section" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Core Capabilities
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
              Engineered For Deep Academic Mastery
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Every tool is crafted to eliminate student anxiety and foster genuine conceptual clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className={`p-6 rounded-2xl bg-white border transition-all hover:translate-y-[-2px] hover:shadow-md ${
                    feat.highlight ? "border-indigo-400 ring-2 ring-indigo-100" : "border-slate-200"
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${feat.color} mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    {feat.title}
                    {feat.highlight && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-indigo-600 text-white uppercase">
                        Flagship
                      </span>
                    )}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mistake Detective Spotlight Banner */}
      <section className="py-14 bg-linear-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/80 border border-indigo-700 text-indigo-300 text-xs font-semibold mb-4">
            <SearchCheck className="w-4 h-4 text-amber-400" />
            <span>The Mistake Detective Difference</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif]">
            "Let's understand where you went wrong."
          </h2>
          <p className="mt-3 text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Other apps just display a red "X" and move on. LearnLoop detects the root misunderstanding, breaks down why your choice seemed right at first, provides a real-world memory hook, and lets you immediately try a matched practice question.
          </p>
          <div className="mt-6">
            <button
              onClick={handleStart}
              className="px-6 py-3 rounded-xl bg-white text-indigo-950 hover:bg-slate-100 font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Experience Mistake Detective Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900 font-['Outfit',sans-serif]">
                LEARNLOOP AI
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              "LearnLoop AI transforms learning from one-size-fits-all education into a personalized learning journey."
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">Team LearnLoop • Educational AI Platform</p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-600 font-medium">
            <button onClick={handleStart} className="hover:text-indigo-600">
              Subjects
            </button>
            <button onClick={handleStart} className="hover:text-indigo-600">
              AI Tutor
            </button>
            <button onClick={handleStart} className="hover:text-indigo-600">
              Question Bank
            </button>
            <button onClick={handleStart} className="hover:text-indigo-600">
              Smart Revision
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
