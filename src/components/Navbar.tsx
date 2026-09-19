import React, { useState } from "react";
import {
  Flame,
  Globe,
  Sparkles,
  Mic,
  GraduationCap,
  Play,
  Menu,
  X,
  LogOut,
  ChevronDown,
  User,
  Zap,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Language, LearningLevel } from "../types";
import { PWAInstallButton } from "./pwa/PWAInstallButton";

export const Navbar: React.FC<{ onToggleMobileNav?: () => void; isMobileNavOpen?: boolean }> = ({
  onToggleMobileNav,
  isMobileNavOpen,
}) => {
  const {
    user,
    isAuthenticated,
    language,
    setLanguage,
    level,
    setLevel,
    xp,
    streak,
    openVoiceModal,
    startHackathonDemoFlow,
    logout,
    setShowAuthModal,
    setActiveTab,
  } = useApp();

  const [langDropdown, setLangDropdown] = useState(false);
  const [levelDropdown, setLevelDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const languages: { id: Language; label: string; native: string }[] = [
    { id: "English", label: "English", native: "English" },
    { id: "Tamil", label: "Tamil", native: "தமிழ்" },
    { id: "Hindi", label: "Hindi", native: "हिन्दी" },
    { id: "Malayalam", label: "Malayalam", native: "മലയാളം" },
    { id: "Telugu", label: "Telugu", native: "తెలుగు" },
    { id: "Kannada", label: "Kannada", native: "ಕನ್ನಡ" },
    { id: "Tanglish", label: "Tanglish", native: "Tamil + Eng" },
  ];

  const levels: LearningLevel[] = ["Beginner", "Intermediate", "Advanced"];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Left: Mobile menu toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-hidden"
            aria-label="Toggle navigation"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActiveTab(isAuthenticated ? "dashboard" : "landing")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight font-['Outfit',sans-serif]">
                  LEARNLOOP<span className="text-indigo-600"> AI</span>
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500 font-medium tracking-tight">
                Learn. Practise. Explain. Improve. Repeat.
              </p>
            </div>
          </div>
        </div>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Demo Tour CTA */}
          <button
            onClick={startHackathonDemoFlow}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold shadow-sm hover:shadow-md hover:from-indigo-700 hover:to-violet-700 transition-all cursor-pointer"
            title="Launch step-by-step interactive product tour"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Interactive Demo Tour</span>
          </button>

          {/* Voice Learning Button */}
          <button
            onClick={openVoiceModal}
            className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold transition-colors cursor-pointer"
            title="Open Voice Learning & Speech AI"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voice Learn</span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setLangDropdown(!langDropdown);
                setLevelDropdown(false);
                setUserDropdown(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-medium text-slate-700 bg-white shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline font-semibold">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setLanguage(l.id);
                      setLangDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      language === l.id ? "bg-indigo-50/70 text-indigo-700 font-semibold" : "text-slate-700"
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[11px] text-slate-400">{l.native}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Level Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => {
                setLevelDropdown(!levelDropdown);
                setLangDropdown(false);
                setUserDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-medium text-slate-700 bg-white shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
              <span>{level}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {levelDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Target Level
                </div>
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setLevel(lvl);
                      setLevelDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      level === lvl ? "bg-purple-50 text-purple-700 font-semibold" : "text-slate-700"
                    }`}
                  >
                    <span>{lvl}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Streak & XP Badges */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold"
              title="Daily Learning Streak"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{streak}d</span>
            </div>

            <div
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-bold"
              title="Total Learning XP"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
              <span>{xp} XP</span>
            </div>
          </div>

          {/* User Profile / Auth */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdown(!userDropdown);
                  setLangDropdown(false);
                  setLevelDropdown(false);
                }}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-300 transition-all cursor-pointer"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
              </button>

              {userDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 font-semibold">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("settings");
                      setUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Account Settings
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
