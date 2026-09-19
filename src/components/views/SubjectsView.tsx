import React, { useState } from "react";
import {
  Search,
  Plus,
  BookOpen,
  ArrowRight,
  Bot,
  PenSquare,
  Sparkles,
  Layers,
  GraduationCap,
  X,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SubjectItem } from "../../types";

export const SubjectsView: React.FC = () => {
  const { subjects, addCustomSubject, selectTopicForTutor, setActiveTab, setSelectedSubject } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectCategory, setNewSubjectCategory] = useState<SubjectItem["category"]>("Custom");

  const categories = ["All", "Engineering & Tech", "Sciences", "Humanities & Commerce", "Custom"];

  const filteredSubjects = subjects.filter((s) => {
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    addCustomSubject(newSubjectName.trim(), newSubjectCategory);
    setNewSubjectName("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
            All-Subject Academic Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            LearnLoop AI supports all disciplines — from Computer Science and Mathematics to Humanities and Law.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Subject</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects or topics..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSubjects.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between group"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl bg-linear-to-br ${sub.color} text-white flex items-center justify-center font-bold text-sm shadow-xs`}
                  >
                    {sub.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {sub.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                      {sub.category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700">{sub.progress}%</span>
                  <div className="w-16 h-1.5 rounded-full bg-slate-100 mt-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-linear-to-r ${sub.color}`}
                      style={{ width: `${sub.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Topics preview */}
              <div className="mt-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Key Topics</span>
                  <span>{sub.topicsCount} Total</span>
                </div>
                <div className="space-y-1">
                  {sub.topics.slice(0, 3).map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => selectTopicForTutor(sub.name, topic)}
                      className="w-full text-left p-1.5 rounded-lg text-xs text-slate-600 hover:bg-indigo-50/70 hover:text-indigo-700 flex items-center justify-between group/item transition-colors"
                    >
                      <span className="truncate pr-2">• {topic}</span>
                      <Bot className="w-3 h-3 text-slate-400 group-hover/item:text-indigo-600 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => selectTopicForTutor(sub.name, sub.topics[0] || sub.name)}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI Tutor</span>
              </button>

              <button
                onClick={() => {
                  setSelectedSubject(sub);
                  setActiveTab("quiz");
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PenSquare className="w-3.5 h-3.5" />
                <span>Test Quiz</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Add New Subject</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="e.g. Constitutional Law, Astrophysics, French"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Category</label>
                <select
                  value={newSubjectCategory}
                  onChange={(e: any) => setNewSubjectCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="Engineering & Tech">Engineering & Tech</option>
                  <option value="Sciences">Sciences</option>
                  <option value="Humanities & Commerce">Humanities & Commerce</option>
                  <option value="Custom">Custom Specialty</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Add Subject & Start Learning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
