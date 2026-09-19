import React from "react";
import {
  Award,
  Sparkles,
  Flame,
  Zap,
  CheckCircle2,
  Lock,
  Trophy,
  Target,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AchievementsView: React.FC = () => {
  const { xp, streak, badges, triggerConfetti, addXP } = useApp();

  const handleClaimReward = () => {
    triggerConfetti();
    addXP(50);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-amber-500 via-orange-500 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
              <Trophy className="w-3.5 h-3.5 text-amber-200" />
              <span>Scholar Level 4: Academic Explorer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif]">
              Achievements & Milestones
            </h1>
            <p className="text-xs sm:text-sm text-white/90 max-w-lg">
              Earn XP by completing structured lessons, resolving mistakes through Mistake Detective, and keeping daily learning streaks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClaimReward}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Claim Daily Streak Bonus (+50 XP)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Current Streak</span>
            <h4 className="text-xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {streak} Days Active
            </h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 fill-indigo-600 text-indigo-600" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Experience Points</span>
            <h4 className="text-xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {xp} Total XP
            </h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Badges Unlocked</span>
            <h4 className="text-xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {badges.filter((b) => b.unlocked).length} of {badges.length}
            </h4>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Academic Honor Badges
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all ${
                badge.unlocked
                  ? "bg-white border-slate-200 shadow-2xs hover:border-amber-300"
                  : "bg-slate-50/70 border-slate-200 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    badge.unlocked ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {badge.unlocked ? "🏆" : <Lock className="w-4 h-4" />}
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    badge.unlocked
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {badge.unlocked ? "Unlocked" : "In Progress"}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-2">{badge.name}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
