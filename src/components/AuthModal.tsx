import React, { useState } from "react";
import { X, Sparkles, User, Mail, Lock, GraduationCap, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, login } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("Harish Kalyan");
  const [email, setEmail] = useState("student@learnloop.ai");
  const [password, setPassword] = useState("learnloop2026");
  const [role, setRole] = useState<"School Student" | "College Student" | "Exam Aspirant" | "Lifelong Learner">("College Student");

  if (!showAuthModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      name: name || "Student",
      email: email || "student@learnloop.ai",
      role,
    });
  };

  const handleQuickDemo = () => {
    login({
      name: "Harish Kalyan",
      email: "student@learnloop.ai",
      role: "College Student",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-blue-600 p-6 text-white text-center relative">
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute top-4 right-4 p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 mx-auto rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold font-['Outfit',sans-serif]">
            {isSignUp ? "Create Your LearnLoop Account" : "Welcome Back to LearnLoop AI"}
          </h2>
          <p className="text-xs text-white/80 mt-1">
            "Learn. Practise. Improve. Repeat."
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Quick Demo Login */}
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full mb-5 py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>⚡ 1-Click Quick Demo Login (Instant Access)</span>
          </button>

          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-medium absolute">or continue with email</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Harish Kalyan"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Learner Type</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="College Student">College Student (Engineering / Arts & Science)</option>
                  <option value="School Student">School Student (10th / 11th / 12th)</option>
                  <option value="Exam Aspirant">Competitive Exam Aspirant (GATE / GRE / Exams)</option>
                  <option value="Lifelong Learner">Lifelong Learner & Professional</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{isSignUp ? "Create Account & Start Learning" : "Sign In & Continue"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {isSignUp ? "Already have an account? Sign In" : "New to LearnLoop? Create an account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
