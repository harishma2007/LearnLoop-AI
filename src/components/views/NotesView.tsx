import React, { useState } from "react";
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  PenSquare,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { apiService } from "../../services/api";

export const NotesView: React.FC = () => {
  const { notes, addXP, setActiveTab, language } = useApp();
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || "note-1");
  const [activeOutputTab, setActiveOutputTab] = useState<"summary" | "questions" | "flashcards">("summary");
  const [pastedText, setPastedText] = useState("");
  const [fileName, setFileName] = useState("University_DBMS_Lecture_Notes.pdf");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setPastedText(`[Content extracted from ${file.name}]: Relational Database Normalization guidelines, Boyce-Codd normal form requirements, functional dependency decompositions without loss.`);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await apiService.analyzeNotes({
        title: fileName,
        content: pastedText || currentNote?.summary || "Database principles",
        language,
      });
      addXP(40);
      alert("Notes successfully processed! Summaries, 2-mark questions, and flashcards synthesized.");
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const importantPointsList = currentNote?.keyPoints || currentNote?.importantPoints || [
    "First Normal Form (1NF) eliminates duplicate columns and requires atomicity",
    "Second Normal Form (2NF) eliminates partial dependency on composite candidate keys",
    "Third Normal Form (3NF) eliminates transitive dependency between non-prime attributes",
    "Boyce-Codd Normal Form (BCNF) strictly requires every determinant to be a super key",
  ];

  const questionsList = currentNote?.generatedQuestions || [
    { marks: 2, question: "State the primary condition for a relational schema to be in 2NF." },
    { marks: 5, question: "Differentiate between 3NF and BCNF with a suitable example." },
    { marks: 16, question: "Explain the complete decomposition algorithm for 3NF and prove its lossless-join property." },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
            Notes & PDF AI Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Turn dense college lecture PDFs and rough handwritten notes into exam summaries and practice questions.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("quiz")}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <PenSquare className="w-3.5 h-3.5" />
          <span>Quiz from Notes</span>
        </button>
      </div>

      {/* Upload / Paste Container */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File Drag / Drop & Picker */}
          <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 text-center flex flex-col items-center justify-center transition-colors bg-slate-50/50">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800">
              Drag & drop lecture PDF, PPTX or DOCX
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Supported files up to 25MB</p>

            <label className="mt-3 px-4 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer">
              Browse Document
              <input
                type="file"
                accept=".pdf,.txt,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {fileName && (
              <span className="mt-2 text-[11px] text-indigo-600 font-semibold truncate max-w-xs">
                Selected: {fileName}
              </span>
            )}
          </div>

          {/* Paste Raw Text Option */}
          <div className="flex flex-col justify-between">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Or Paste Lecture / Textbook Content
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste class notes, syllabus units, or article paragraphs here..."
                rows={4}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="mt-2 w-full py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? "Processing Notes with Gemini..." : "Extract Summaries & Exam Questions"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Processed Notes Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveOutputTab("summary")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeOutputTab === "summary"
                ? "bg-white text-indigo-700 shadow-2xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Structured Summary
          </button>
          <button
            onClick={() => setActiveOutputTab("questions")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeOutputTab === "questions"
                ? "bg-white text-indigo-700 shadow-2xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Exam Questions (2/5/16 Marks)
          </button>
          <button
            onClick={() => setActiveOutputTab("flashcards")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeOutputTab === "flashcards"
                ? "bg-white text-indigo-700 shadow-2xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Extracted Flashcards
          </button>
        </div>

        {/* Tab 1: Structured Summary */}
        {activeOutputTab === "summary" && currentNote && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">{currentNote.title}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 uppercase">
                {currentNote.subject}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {currentNote.summary}
            </p>

            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Synthesized Key Principles
              </h4>
              <ul className="space-y-1.5">
                {importantPointsList.map((pt, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: University Exam Questions */}
        {activeOutputTab === "questions" && (
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              {questionsList.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-indigo-100 text-indigo-700">
                      {q.marks} Marks
                    </span>
                    <span className="text-[11px] text-slate-400">Exam Model Question</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-1">
                    {q.question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Extracted Flashcards */}
        {activeOutputTab === "flashcards" && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <span className="text-[10px] font-bold uppercase text-indigo-700">Card 1</span>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  What defines a lossless-join decomposition?
                </p>
                <p className="text-xs text-slate-600 mt-2 pt-2 border-t border-indigo-100">
                  A decomposition where natural joining the sub-relations produces the exact original relation without extraneous tuples.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                <span className="text-[10px] font-bold uppercase text-purple-700">Card 2</span>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  How does BCNF differ from 3NF?
                </p>
                <p className="text-xs text-slate-600 mt-2 pt-2 border-t border-purple-100">
                  BCNF strictly requires the determinant to be a super key, prohibiting prime attributes on the right-hand side.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("flashcards")}
              className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Practice in Flashcards Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
