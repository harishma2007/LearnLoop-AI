import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  Library,
  PenSquare,
  RotateCcw,
  Layers,
  FileText,
  Calendar,
  BarChart3,
  Award,
  Settings,
  Sparkles,
  Brain,
  MapPin,
  Split,
  HeartPulse,
} from "lucide-react";
import { useApp, TabId } from "../context/AppContext";

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, weakTopics, confusionList } = useApp();

  const primaryLoopItems: { id: TabId; label: string; icon: React.FC<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "subjects", label: "Learn", icon: BookOpen },
    { id: "tutor", label: "AI Tutor", icon: Bot, badge: "AI", badgeColor: "bg-indigo-100 text-indigo-700" },
    {
      id: "teach-back",
      label: "Teach-Back Mode",
      icon: Brain,
      badge: "CORE",
      badgeColor: "bg-amber-100 text-amber-800 font-extrabold border border-amber-300/50",
    },
    { id: "mastery-map", label: "Concept Map", icon: MapPin, badge: "Graph", badgeColor: "bg-purple-100 text-purple-700" },
    {
      id: "confusion",
      label: "Confusion Detector",
      icon: Split,
      badge: confusionList.length > 0 ? confusionList.length : undefined,
      badgeColor: "bg-rose-100 text-rose-700 font-bold",
    },
    { id: "health-check", label: "Health Check", icon: HeartPulse },
  ];

  const practiceItems: { id: TabId; label: string; icon: React.FC<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    { id: "question-bank", label: "Question Bank", icon: Library },
    { id: "quiz", label: "Quiz", icon: PenSquare },
    {
      id: "revision",
      label: "Revision",
      icon: RotateCcw,
      badge: weakTopics.length > 0 ? weakTopics.length : undefined,
      badgeColor: "bg-amber-100 text-amber-700",
    },
    { id: "flashcards", label: "Flashcards", icon: Layers },
    { id: "notes", label: "My Notes", icon: FileText },
  ];

  const toolsItems: { id: TabId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: "planner", label: "Study Planner", icon: Calendar },
    { id: "progress", label: "Progress", icon: BarChart3 },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleSelect = (tab: TabId) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar navigation */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-40 md:z-10 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 transition-transform duration-200 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-3 overflow-y-auto space-y-4">
          {/* Section 1: LearnLoop Cycle */}
          <div>
            <div className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              LearnLoop Cycle
            </div>
            <div className="space-y-1">
              {primaryLoopItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all group cursor-pointer ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-bold shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.badgeColor || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Practice & Revision */}
          <div>
            <div className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Practice & Revise
            </div>
            <div className="space-y-1">
              {practiceItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all group cursor-pointer ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-bold shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.badgeColor || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Tools & Growth */}
          <div>
            <div className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Analytics & Tools
            </div>
            <div className="space-y-1">
              {toolsItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all group cursor-pointer ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-bold shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Banner inside Sidebar */}
        <div className="p-3 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-linear-to-br from-indigo-50 via-purple-50 to-blue-50 border border-indigo-100 text-left">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-950">Teach-Back Mode</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
              Explain a concept back in your own words to prove true mastery.
            </p>
            <button
              onClick={() => handleSelect("teach-back")}
              className="w-full text-center py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              Try Teach-Back
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
