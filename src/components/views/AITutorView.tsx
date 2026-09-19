import React, { useState, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  ArrowRight,
  PenSquare,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ListOrdered,
  BookMarked,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { apiService } from "../../services/api";
import { ChatMessage, TopicExplanation } from "../../types";

export const AITutorView: React.FC = () => {
  const {
    selectedSubject,
    selectedTopic,
    setSelectedTopic,
    language,
    level,
    setLevel,
    setActiveTab,
    addXP,
  } = useApp();

  const [topicInput, setTopicInput] = useState(
    selectedTopic || selectedSubject?.topics[0]?.name || "Linear Algebra & Vector Spaces"
  );
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<TopicExplanation | null>(null);
  const [activeTab, setActiveSubTab] = useState<"explanation" | "chat">("explanation");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Sync when selectedSubject or selectedTopic changes
  useEffect(() => {
    const topicToUse = selectedTopic || selectedSubject?.topics[0]?.name || "Linear Algebra & Vector Spaces";
    setTopicInput(topicToUse);
    fetchExplanation(topicToUse, false, false);
  }, [selectedSubject?.id, selectedTopic, language, level]);

  const fetchExplanation = async (
    topicName: string,
    simpler = false,
    anotherExample = false
  ) => {
    setLoading(true);
    try {
      const res = await apiService.explainTopic({
        topic: topicName,
        subject: selectedSubject?.name || "Mathematics",
        level,
        language,
        simpler,
        anotherExample,
      });
      setExplanation(res);
      addXP(10);

      // Add system intro to chat
      setChatMessages([
        {
          id: `msg-${Date.now()}`,
          sender: "ai",
          text: `Hello! I am your LearnLoop AI Tutor for **${topicName}** in **${selectedSubject?.name || "Academic Learning"}** (${language}, ${level} level). You can ask me any question, request simpler analogies, or test your understanding!`,
          timestamp: "Just now",
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    setSelectedTopic(topicInput.trim());
    fetchExplanation(topicInput.trim());
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Just now",
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput("");

    try {
      const reply = await apiService.sendChatMessage({
        message: text,
        topic: topicInput,
        subject: selectedSubject?.name || "Mathematics",
        level,
        language,
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: reply,
        timestamp: "Just now",
      };
      setChatMessages((prev) => [...prev, aiMsg]);
      addXP(5);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text to speech is not supported in this browser environment.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (explanation) {
      const textToRead = `${explanation.title}. ${explanation.simpleExplanation}. Real world example: ${explanation.realWorldExample}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const quickPrompts = [
    "What does this mean?",
    "Explain it simpler",
    "Give an example",
    "Give me a question to test me",
    "Why is this important for exams?",
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Search / Topic Input Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                AI Academic Tutor
              </h1>
              <p className="text-xs text-slate-500">
                Subject: <span className="font-semibold text-indigo-600">{selectedSubject?.name || "DBMS"}</span> • Language: <span className="font-semibold text-slate-800">{language}</span> • Level: <span className="font-semibold text-slate-800">{level}</span>
              </p>
            </div>
          </div>

          {/* Sub-tab toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab("explanation")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "explanation" ? "bg-white text-indigo-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Structured Lesson
            </button>
            <button
              onClick={() => setActiveSubTab("chat")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "chat" ? "bg-white text-indigo-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Interactive Q&A</span>
            </button>
          </div>
        </div>

        {/* Topic Input Form */}
        <form onSubmit={handleTopicSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder={`Enter any topic in ${selectedSubject?.name || "this subject"} (or custom topic)...`}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            {loading ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Explain Topic</span>
          </button>
        </form>

        {/* Selected Subject Topic Chips */}
        {selectedSubject?.topics && selectedSubject.topics.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              {selectedSubject.name} Topics:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {selectedSubject.topics.map((t) => {
                const isSelected = topicInput === t.name;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setTopicInput(t.name);
                      setSelectedTopic(t.name);
                      fetchExplanation(t.name);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === "explanation" ? (
        <div className="space-y-5">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => fetchExplanation(topicInput, true, false)}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Explain Simpler</span>
              </button>

              <button
                onClick={() => fetchExplanation(topicInput, false, true)}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                <span>Give Another Example</span>
              </button>

              <button
                onClick={toggleSpeech}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isSpeaking
                    ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-600" /> : <Volume2 className="w-3.5 h-3.5 text-slate-600" />}
                <span>{isSpeaking ? "Stop Voice" : "Read Aloud"}</span>
              </button>
            </div>

            <button
              onClick={() => setActiveTab("quiz")}
              className="px-3.5 py-1.5 rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Generate Quiz on this Topic</span>
            </button>
          </div>

          {/* Loading skeleton or Explanation Cards */}
          {loading ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center animate-pulse">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <h3 className="text-base font-bold text-slate-800 font-['Outfit',sans-serif]">
                Personalizing Explanation in {language}...
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Adapting academic depth for {level} level with key terms, practical examples, and examination highlights.
              </p>
            </div>
          ) : explanation ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Explanations & Examples (8 cols) */}
              <div className="lg:col-span-8 space-y-5">
                {/* Simple Language Card */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                      Intuitive Breakdown
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
                    {explanation.simpleExplanation}
                  </p>
                </div>

                {/* Real-World Practical Example */}
                <div className="p-6 rounded-2xl bg-linear-to-br from-indigo-50/70 via-purple-50/40 to-white border border-indigo-100 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-indigo-950">
                      Real-World Concrete Example
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {explanation.realWorldExample}
                  </p>
                </div>

                {/* Detailed Technical Explanation */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 mb-3">
                    <BookMarked className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Detailed Theoretical Mechanics
                    </h3>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {explanation.detailedExplanation}
                  </div>
                </div>
              </div>

              {/* Right Column: Key Points & Terminology (4 cols) */}
              <div className="lg:col-span-4 space-y-5">
                {/* Important Exam Points */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Important Takeaways
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {explanation.keyPoints?.map((pt, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Terminology glossary */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 mb-3">
                    <ListOrdered className="w-4 h-4 text-purple-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Key Terms & Definitions
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {explanation.keyTerms?.map((term, i) => (
                      <div key={i} className="py-2.5 first:pt-0 last:pb-0">
                        <h5 className="text-xs font-bold text-slate-900">{term.term}</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                          {term.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        /* Interactive Chat Sub-Tab */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[520px]">
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-xl p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-xs"
                      : "bg-white text-slate-800 border border-slate-200 rounded-tl-xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="p-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 shrink-0">
              Suggestions:
            </span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-[11px] text-slate-600 font-medium whitespace-nowrap transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Ask a follow-up question in ${language}...`}
              className="flex-1 px-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
