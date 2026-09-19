import React, { createContext, useContext, useEffect, useState } from "react";
import confetti from "canvas-confetti";
import {
  INITIAL_BADGES,
  INITIAL_CONCEPT_NODES,
  INITIAL_CONFUSIONS,
  INITIAL_FLASHCARDS,
  INITIAL_NOTES,
  INITIAL_QUESTION_BANK,
  INITIAL_SUBJECTS,
  INITIAL_TEACHBACK_HISTORY,
  INITIAL_USER,
  INITIAL_WEAK_TOPICS,
} from "../data/demoData";
import {
  Badge,
  ConceptNode,
  ConfusionItem,
  Flashcard,
  Language,
  LearningLevel,
  MistakeAnalysis,
  NoteDocument,
  QuestionBankItem,
  SubjectItem,
  TeachBackEvaluation,
  TeachBackHistoryItem,
  TopicMasteryState,
  UserProfile,
  WeakTopic,
  WhatToLearnRecommendation,
} from "../types";

export type TabId =
  | "dashboard"
  | "subjects"
  | "tutor"
  | "teach-back"
  | "mastery-map"
  | "confusion"
  | "health-check"
  | "question-bank"
  | "quiz"
  | "revision"
  | "flashcards"
  | "notes"
  | "planner"
  | "progress"
  | "achievements"
  | "settings"
  | "landing";

interface AppContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  selectedSubject: SubjectItem | null;
  setSelectedSubject: (subject: SubjectItem | null) => void;
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  level: LearningLevel;
  setLevel: (level: LearningLevel) => void;
  xp: number;
  streak: number;
  subjects: SubjectItem[];
  weakTopics: WeakTopic[];
  questionBank: QuestionBankItem[];
  flashcards: Flashcard[];
  notes: NoteDocument[];
  badges: Badge[];
  conceptNodes: Record<string, ConceptNode[]>;
  confusionList: ConfusionItem[];
  teachBackHistory: TeachBackHistoryItem[];
  activeTeachBackTopic: string;
  showWhatToLearnModal: boolean;
  showDiagnosticModal: boolean;
  diagnosticSubject: string;
  showMistakeModal: boolean;
  activeMistakeAnalysis: MistakeAnalysis | null;
  showVoiceModal: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  login: (data?: Partial<UserProfile>) => void;
  logout: () => void;
  addXP: (amount: number) => void;
  triggerConfetti: () => void;
  selectTopicForTutor: (subjectName: string, topicName: string) => void;
  startTeachBack: (topic: string, subjectName?: string) => void;
  openMasteryMap: (subjectId?: string) => void;
  openConfusionDetector: (subjectName?: string) => void;
  updateTopicMastery: (subjectKey: string, nodeId: string, mastery: TopicMasteryState) => void;
  addTeachBackEvaluation: (topic: string, subject: string, explanation: string, evalResult: TeachBackEvaluation) => void;
  openWhatToLearnModal: () => void;
  closeWhatToLearnModal: () => void;
  openDiagnosticModal: (subjectName?: string) => void;
  closeDiagnosticModal: () => void;
  openMistakeDetective: (analysis: MistakeAnalysis) => void;
  closeMistakeDetective: () => void;
  openVoiceModal: () => void;
  closeVoiceModal: () => void;
  toggleFlashcardMastered: (id: string) => void;
  addFlashcards: (newCards: { front: string; back: string; subject: string; topic: string }[]) => void;
  addCustomSubject: (name: string, category?: string) => void;
  removeWeakTopic: (id: string) => void;
  startHackathonDemoFlow: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("learnloop_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email === "harishkalyan06s@gmail.com") {
          parsed.email = "student@learnloop.ai";
          localStorage.setItem("learnloop_user", JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_USER;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [selectedSubject, setSelectedSubjectState] = useState<SubjectItem | null>(() => {
    const savedId = localStorage.getItem("learnloop_active_subject_id");
    if (savedId) {
      const found = INITIAL_SUBJECTS.find((s) => s.id === savedId);
      if (found) return found;
    }
    return INITIAL_SUBJECTS[0]; // Default to Mathematics
  });
  const [selectedTopic, setSelectedTopic] = useState<string>(
    INITIAL_SUBJECTS[0]?.topics[0] || "Linear Algebra & Matrix Transformations"
  );

  const setSelectedSubject = (subject: SubjectItem | null) => {
    setSelectedSubjectState(subject);
    if (subject) {
      localStorage.setItem("learnloop_active_subject_id", subject.id);
      if (subject.topics && subject.topics.length > 0) {
        if (!subject.topics.includes(selectedTopic)) {
          setSelectedTopic(subject.topics[0]);
        }
      } else {
        setSelectedTopic(`Fundamentals of ${subject.name}`);
      }
    }
  };
  const [language, setLanguageState] = useState<Language>(() => user?.preferredLanguage || "English");
  const [level, setLevelState] = useState<LearningLevel>(() => user?.learningLevel || "Intermediate");
  const [xp, setXp] = useState<number>(() => user?.xp || 1420);
  const [streak, setStreak] = useState<number>(() => user?.streakDays || 7);
  const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
    const saved = localStorage.getItem("learnloop_subjects");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_SUBJECTS;
  });

  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>(() => {
    const saved = localStorage.getItem("learnloop_weak_topics");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return INITIAL_WEAK_TOPICS;
  });

  const [questionBank, setQuestionBank] = useState<QuestionBankItem[]>(() => {
    const saved = localStorage.getItem("learnloop_question_bank");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_QUESTION_BANK;
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem("learnloop_flashcards");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_FLASHCARDS;
  });

  const [notes, setNotes] = useState<NoteDocument[]>(INITIAL_NOTES);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);

  // Teach-Back, Concept Mastery, and Confusion States
  const [conceptNodes, setConceptNodes] = useState<Record<string, ConceptNode[]>>(() => {
    const saved = localStorage.getItem("learnloop_concept_nodes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") return parsed;
      } catch (e) {}
    }
    return INITIAL_CONCEPT_NODES;
  });

  const [confusionList, setConfusionList] = useState<ConfusionItem[]>(() => {
    const sanitizeList = (items: ConfusionItem[]): ConfusionItem[] => {
      const seenIds = new Set<string>();
      const seenPairs = new Set<string>();
      const sanitized: ConfusionItem[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item) continue;
        const pairKey = `${item.subject || ""}_${item.conceptA || ""}_${item.conceptB || ""}`.toLowerCase();
        if (seenPairs.has(pairKey)) continue;
        seenPairs.add(pairKey);

        let id = item.id;
        if (!id || seenIds.has(id)) {
          id = `conf-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`;
        }
        seenIds.add(id);
        sanitized.push({ ...item, id });
      }
      return sanitized.length > 0 ? sanitized : INITIAL_CONFUSIONS;
    };

    const saved = localStorage.getItem("learnloop_confusions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeList(parsed);
        }
      } catch (e) {}
    }
    return sanitizeList(INITIAL_CONFUSIONS);
  });

  const [teachBackHistory, setTeachBackHistory] = useState<TeachBackHistoryItem[]>(() => {
    const saved = localStorage.getItem("learnloop_teachback_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return INITIAL_TEACHBACK_HISTORY;
  });

  const [activeTeachBackTopic, setActiveTeachBackTopic] = useState<string>("Second Normal Form (2NF)");
  const [showWhatToLearnModal, setShowWhatToLearnModal] = useState<boolean>(false);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState<boolean>(false);
  const [diagnosticSubject, setDiagnosticSubject] = useState<string>("DBMS");

  const [showMistakeModal, setShowMistakeModal] = useState<boolean>(false);
  const [activeMistakeAnalysis, setActiveMistakeAnalysis] = useState<MistakeAnalysis | null>(null);
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("learnloop_user", JSON.stringify({ ...user, xp, streak, preferredLanguage: language, learningLevel: level }));
    }
  }, [user, xp, streak, language, level]);

  useEffect(() => {
    localStorage.setItem("learnloop_weak_topics", JSON.stringify(weakTopics));
  }, [weakTopics]);

  useEffect(() => {
    localStorage.setItem("learnloop_flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem("learnloop_subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("learnloop_concept_nodes", JSON.stringify(conceptNodes));
  }, [conceptNodes]);

  useEffect(() => {
    localStorage.setItem("learnloop_confusions", JSON.stringify(confusionList));
  }, [confusionList]);

  useEffect(() => {
    localStorage.setItem("learnloop_teachback_history", JSON.stringify(teachBackHistory));
  }, [teachBackHistory]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (user) setUser({ ...user, preferredLanguage: lang });
  };

  const setLevel = (newLevel: LearningLevel) => {
    setLevelState(newLevel);
    if (user) setUser({ ...user, learningLevel: newLevel });
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"],
      });
    } catch (e) {
      // Ignore in headless/fallback
    }
  };

  const addXP = (amount: number) => {
    setXp((prev) => prev + amount);
    triggerConfetti();
  };

  const login = (data?: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      ...INITIAL_USER,
      ...data,
    };
    setUser(newUser);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setActiveTab("dashboard");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab("landing");
  };

  const selectTopicForTutor = (subjectName: string, topicName: string) => {
    const foundSub = subjects.find((s) => s.name.toLowerCase() === subjectName.toLowerCase()) || subjects[0];
    setSelectedSubject(foundSub);
    setSelectedTopic(topicName);
    setActiveTab("tutor");
  };

  const startTeachBack = (topic: string, subjectName?: string) => {
    if (subjectName) {
      const foundSub = subjects.find((s) => s.name.toLowerCase() === subjectName.toLowerCase()) || subjects[0];
      setSelectedSubject(foundSub);
    }
    setActiveTeachBackTopic(topic);
    setActiveTab("teach-back");
  };

  const openMasteryMap = (subjectId?: string) => {
    if (subjectId) {
      const foundSub = subjects.find((s) => s.id === subjectId) || subjects[0];
      setSelectedSubject(foundSub);
    }
    setActiveTab("mastery-map");
  };

  const openConfusionDetector = (subjectName?: string) => {
    if (subjectName) {
      const foundSub = subjects.find((s) => s.name.toLowerCase() === subjectName.toLowerCase()) || subjects[0];
      setSelectedSubject(foundSub);
    }
    setActiveTab("confusion");
  };

  const updateTopicMastery = (subjectKey: string, nodeId: string, mastery: TopicMasteryState) => {
    setConceptNodes((prev) => {
      const list = prev[subjectKey] || [];
      const updated = list.map((node) => (node.id === nodeId ? { ...node, mastery } : node));
      return { ...prev, [subjectKey]: updated };
    });
    if (mastery === "Mastered") {
      addXP(50);
      triggerConfetti();
    } else {
      addXP(20);
    }
  };

  const addTeachBackEvaluation = (
    topic: string,
    subject: string,
    explanation: string,
    evalResult: TeachBackEvaluation
  ) => {
    const newItem: TeachBackHistoryItem = {
      id: `tb-${Date.now()}`,
      topic,
      subject,
      date: "Just now",
      studentExplanation: explanation,
      evaluation: evalResult,
    };
    setTeachBackHistory((prev) => [newItem, ...prev]);
    addXP(evalResult.understandingScore >= 80 ? 60 : 35);

    // If high score, automatically promote mastery on matching node!
    if (evalResult.understandingScore >= 80) {
      const foundSub = subjects.find(
        (s) => s.name.toLowerCase() === subject.toLowerCase() || s.id.toLowerCase() === subject.toLowerCase()
      );
      const subjKey = foundSub?.id || "math";
      setConceptNodes((prev) => {
        const nodes = prev[subjKey] || [];
        const matched = nodes.map((n) =>
          n.title.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(n.title.toLowerCase())
            ? { ...n, mastery: "Mastered" as TopicMasteryState, accuracy: Math.max(n.accuracy || 0, evalResult.understandingScore) }
            : n
        );
        return { ...prev, [subjKey]: matched };
      });
    }
  };

  const openWhatToLearnModal = () => setShowWhatToLearnModal(true);
  const closeWhatToLearnModal = () => setShowWhatToLearnModal(false);

  const openDiagnosticModal = (subjectName?: string) => {
    setDiagnosticSubject(subjectName || selectedSubject?.name || "Mathematics");
    setShowDiagnosticModal(true);
  };
  const closeDiagnosticModal = () => setShowDiagnosticModal(false);

  const openMistakeDetective = (analysis: MistakeAnalysis) => {
    setActiveMistakeAnalysis(analysis);
    setShowMistakeModal(true);
  };

  const closeMistakeDetective = () => {
    setShowMistakeModal(false);
  };

  const openVoiceModal = () => setShowVoiceModal(true);
  const closeVoiceModal = () => setShowVoiceModal(false);

  const toggleFlashcardMastered = (id: string) => {
    setFlashcards((prev) =>
      prev.map((card) => {
        if (card.id === id) {
          const next = !card.mastered;
          if (next) addXP(15);
          return { ...card, mastered: next };
        }
        return card;
      })
    );
  };

  const addFlashcards = (newCards: { front: string; back: string; subject: string; topic: string }[]) => {
    const mapped: Flashcard[] = newCards.map((c, i) => ({
      id: `fc-gen-${Date.now()}-${i}`,
      front: c.front,
      back: c.back,
      subject: c.subject,
      topic: c.topic,
      mastered: false,
    }));
    setFlashcards((prev) => [...mapped, ...prev]);
    addXP(25);
  };

  const addCustomSubject = (name: string, category: string = "Custom") => {
    const subjectId = `subj-${Date.now()}`;
    const starterTopics = [
      `Foundations of ${name}`,
      `Core Principles & Laws of ${name}`,
      `Advanced Methodologies in ${name}`,
      `Real-world Applications of ${name}`,
    ];
    const newSubject: SubjectItem = {
      id: subjectId,
      name,
      category: "Custom",
      iconName: "GraduationCap",
      color: "from-indigo-600 to-purple-800",
      topicsCount: starterTopics.length,
      progress: 15,
      topics: starterTopics,
    };
    setSubjects((prev) => [newSubject, ...prev]);

    // Pre-populate initial concept nodes for the custom subject
    setConceptNodes((prev) => ({
      ...prev,
      [subjectId]: [
        {
          id: `node-${subjectId}-1`,
          title: starterTopics[0],
          subject: name,
          mastery: "Mastered",
          description: `Key introductory concepts and fundamental terminology of ${name}.`,
          estimatedMinutes: 20,
          accuracy: 90,
        },
        {
          id: `node-${subjectId}-2`,
          title: starterTopics[1],
          subject: name,
          parentId: `node-${subjectId}-1`,
          mastery: "Needs Practice",
          description: `Crucial structural rules and theoretical models governing ${name}.`,
          estimatedMinutes: 30,
          accuracy: 55,
        },
        {
          id: `node-${subjectId}-3`,
          title: starterTopics[2],
          subject: name,
          parentId: `node-${subjectId}-2`,
          mastery: "Learning",
          description: `In-depth problem solving and analytical frameworks in ${name}.`,
          estimatedMinutes: 40,
          accuracy: 65,
        },
      ],
    }));

    setSelectedSubject(newSubject);
    setSelectedTopic(starterTopics[0]);
    addXP(50);
  };

  const removeWeakTopic = (id: string) => {
    setWeakTopics((prev) => prev.filter((wt) => wt.id !== id));
    addXP(30);
  };

  const startHackathonDemoFlow = () => {
    // Showcase LearnLoop loop on active subject
    if (!isAuthenticated) login();
    const activeSub = selectedSubject || subjects[0];
    setSelectedSubject(activeSub);
    setActiveTeachBackTopic(activeSub.topics[0] || `Core Concepts of ${activeSub.name}`);
    setActiveTab("teach-back");
    triggerConfetti();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        activeTab,
        setActiveTab,
        selectedSubject,
        setSelectedSubject,
        selectedTopic,
        setSelectedTopic,
        language,
        setLanguage,
        level,
        setLevel,
        xp,
        streak,
        subjects,
        weakTopics,
        questionBank,
        flashcards,
        notes,
        badges,
        conceptNodes,
        confusionList,
        teachBackHistory,
        activeTeachBackTopic,
        showWhatToLearnModal,
        showDiagnosticModal,
        diagnosticSubject,
        showMistakeModal,
        activeMistakeAnalysis,
        showVoiceModal,
        showAuthModal,
        setShowAuthModal,
        login,
        logout,
        addXP,
        triggerConfetti,
        selectTopicForTutor,
        startTeachBack,
        openMasteryMap,
        openConfusionDetector,
        updateTopicMastery,
        addTeachBackEvaluation,
        openWhatToLearnModal,
        closeWhatToLearnModal,
        openDiagnosticModal,
        closeDiagnosticModal,
        openMistakeDetective,
        closeMistakeDetective,
        openVoiceModal,
        closeVoiceModal,
        toggleFlashcardMastered,
        addFlashcards,
        addCustomSubject,
        removeWeakTopic,
        startHackathonDemoFlow,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
