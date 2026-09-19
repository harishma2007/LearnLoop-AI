import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Globe,
  GraduationCap,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Save,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Language, LearningLevel } from "../../types";

export const SettingsView: React.FC = () => {
  const { user, login, language, setLanguage, level, setLevel, triggerConfetti } = useApp();

  const [name, setName] = useState(user?.name || "Harish Kalyan");
  const [email, setEmail] = useState(user?.email || "student@learnloop.ai");
  const [role, setRole] = useState<"School Student" | "College Student" | "Exam Aspirant" | "Lifelong Learner">(
    user?.role || "College Student"
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const languages: Language[] = ["English", "Tamil", "Hindi", "Malayalam", "Telugu", "Kannada"];
  const levels: LearningLevel[] = ["Beginner", "Intermediate", "Advanced"];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      name,
      email,
      role,
    });
    setSavedSuccess(true);
    triggerConfetti();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset application progress to initial state?")) {
      localStorage.removeItem("learnloop_user");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
          Student Preferences & Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure default learning dialect, academic depth level, and profile credentials.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        {/* Profile Details */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Profile Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Learner Type</label>
            <select
              value={role}
              onChange={(e: any) => setRole(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-indigo-600"
            >
              <option value="College Student">College Student (Engineering / Arts & Science)</option>
              <option value="School Student">School Student (10th / 11th / 12th)</option>
              <option value="Exam Aspirant">Competitive Exam Aspirant (GATE / GRE / UPSC)</option>
              <option value="Lifelong Learner">Lifelong Learner</option>
            </select>
          </div>
        </div>

        {/* Language & Depth Preferences */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Language & Conceptual Depth</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Explanation Language</label>
              <select
                value={language}
                onChange={(e: any) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-indigo-600"
              >
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Academic Depth</label>
              <select
                value={level}
                onChange={(e: any) => setLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-indigo-600"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* About Section */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            About LearnLoop AI
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>Team Name:</strong> LearnLoop • <strong>Tagline:</strong> "Learn. Practise. Improve. Repeat."
        </p>
        <p className="text-[11px] text-slate-400">
          Powered by React, Express, Vite, and Google Gemini API.
        </p>
      </div>
    </div>
  );
};
