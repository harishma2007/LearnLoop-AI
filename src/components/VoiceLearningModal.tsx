import React, { useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  RotateCcw,
  Bot,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { apiService } from "../services/api";

export const VoiceLearningModal: React.FC = () => {
  const { showVoiceModal, closeVoiceModal, language, level, addXP } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  useEffect(() => {
    // Check SpeechRecognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === "Tamil" ? "ta-IN" : language === "Hindi" ? "hi-IN" : "en-US";

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setSpokenTranscript(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setRecognitionInstance(recognition);
    }
  }, [language]);

  if (!showVoiceModal) return null;

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionInstance) recognitionInstance.stop();
      setIsRecording(false);
    } else {
      setSpokenTranscript("");
      setAiAnswer("");
      if (recognitionInstance) {
        try {
          recognitionInstance.start();
          setIsRecording(true);
        } catch (e) {
          console.error(e);
          simulateSpeechInput();
        }
      } else {
        simulateSpeechInput();
      }
    }
  };

  const simulateSpeechInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setSpokenTranscript("Can you explain why 3NF eliminates transitive functional dependency in DBMS?");
      setIsRecording(false);
    }, 1800);
  };

  const handleAskSpokenQuestion = async () => {
    if (!spokenTranscript.trim()) return;
    setIsAnswering(true);
    try {
      const reply = await apiService.sendChatMessage({
        message: spokenTranscript,
        topic: "Voice Learning Inquiry",
        subject: "Academic Inquiry",
        level,
        language,
      });
      setAiAnswer(reply);
      addXP(20);
      speakText(reply);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnswering(false);
    }
  };

  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopVoiceOutput = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-900 via-indigo-800 to-emerald-900 p-6 text-white relative">
          <button
            onClick={() => {
              stopVoiceOutput();
              closeVoiceModal();
            }}
            className="absolute top-4 right-4 p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Voice Learning & Speech AI
            </span>
          </div>

          <h2 className="text-xl font-bold font-['Outfit',sans-serif]">
            Conversational Oral Tutor
          </h2>
          <p className="text-xs text-indigo-100 mt-0.5">
            Speak academic questions aloud in <strong className="text-white">{language}</strong>. Listen to clear auditory explanations.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-center">
          {/* Pulse Microphone Button */}
          <div className="flex flex-col items-center justify-center py-4">
            <button
              onClick={toggleRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-lg cursor-pointer ${
                isRecording
                  ? "bg-rose-500 scale-110 ring-8 ring-rose-200 animate-pulse"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:scale-105"
              }`}
            >
              {isRecording ? <Mic className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>

            <span className="mt-3 text-xs font-bold text-slate-700">
              {isRecording ? "Listening... Speak your question now" : "Tap microphone to speak question"}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              Powered by Browser Speech Synthesis & Gemini 2.5
            </span>
          </div>

          {/* Transcript Box */}
          <div className="text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 min-h-[70px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Spoken Transcript
            </span>
            <p className="text-xs sm:text-sm text-slate-800">
              {spokenTranscript || (
                <span className="text-slate-400 italic">
                  Tap microphone or click suggestion below...
                </span>
              )}
            </p>
          </div>

          {/* Quick Voice Suggestions */}
          {!spokenTranscript && (
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {[
                "Explain 3NF vs BCNF",
                "What is Eigenvector?",
                "Define photosynthesis",
              ].map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setSpokenTranscript(s)}
                  className="px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-medium transition-colors"
                >
                  "{s}"
                </button>
              ))}
            </div>
          )}

          {/* Ask Button */}
          {spokenTranscript && !aiAnswer && (
            <button
              onClick={handleAskSpokenQuestion}
              disabled={isAnswering}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnswering ? "Synthesizing Vocal Answer..." : "Submit Question to AI Tutor"}</span>
            </button>
          )}

          {/* AI Vocal Answer Box */}
          {aiAnswer && (
            <div className="text-left bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <span>AI Tutor Explanation</span>
                </div>

                <button
                  onClick={() => (isSpeaking ? stopVoiceOutput() : speakText(aiAnswer))}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-600" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? "Pause Audio" : "Replay Audio"}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed max-h-48 overflow-y-auto">
                {aiAnswer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
