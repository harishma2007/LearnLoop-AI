export type Language =
  | "English"
  | "Tamil"
  | "Hindi"
  | "Malayalam"
  | "Telugu"
  | "Kannada"
  | "Tanglish";

export type LearningLevel = "Beginner" | "Intermediate" | "Advanced";

export type TopicMasteryState =
  | "Not Started"
  | "Learning"
  | "Needs Practice"
  | "Understood"
  | "Mastered";

export interface ConceptNode {
  id: string;
  title: string;
  subject: string;
  parentId?: string;
  mastery: TopicMasteryState;
  description: string;
  prerequisites?: string[];
  estimatedMinutes?: number;
  accuracy?: number;
  children?: ConceptNode[];
}

export interface TeachBackEvaluation {
  understandingScore: number; // 0-100%
  conceptsUnderstood: string[];
  missingConcepts: string[];
  misconceptions: string[];
  clarity: "High" | "Moderate" | "Needs Improvement" | string;
  recommendation: string;
  encouragement: string;
  suggestedAction?: "Try Again" | "Explain Simpler" | "Practice Weak Concept" | "Take Retest";
}

export interface TeachBackHistoryItem {
  id: string;
  topic: string;
  subject: string;
  date: string;
  studentExplanation: string;
  evaluation: TeachBackEvaluation;
}

export interface ConfusionItem {
  id: string;
  subject: string;
  title: string; // e.g. "2NF vs 3NF (Partial vs Transitive Dependency)"
  conceptA: string;
  conceptB: string;
  mistakesCount: number;
  whyHappening: string;
  keyDistinction: string;
  recommendedAction: string;
  severity: "High" | "Medium" | "Low";
}

export interface DiagnosticQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  concept?: string;
  difficulty?: Difficulty | string;
}

export interface DiagnosticResult {
  subject: string;
  overallScore: number;
  suggestedLevel: LearningLevel;
  assessedLevel?: LearningLevel;
  scorePercentage?: number;
  strengths?: string[];
  recommendedStartingTopic?: string;
  learningPathSummary?: string;
  topicClassifications: {
    topic: string;
    status: "Strong" | "Moderate" | "Needs Practice" | "Unknown";
    note: string;
  }[];
  personalizedPath: string[];
}

export interface WhatToLearnRecommendation {
  subject: string;
  topic: string;
  actionType: "revision" | "teach-back" | "quiz" | "tutor" | "Teach Back" | "Practice" | "Learn" | "Revision";
  title?: string;
  reason: string;
  primaryMetric?: string;
  urgency?: "High" | "Medium" | "Normal";
  estimatedMinutes?: number;
}

export type QuestionType =
  | "MCQ"
  | "2-mark"
  | "Short answer"
  | "5-mark"
  | "Long answer"
  | "10/13/16-mark"
  | "Scenario-based";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface UserProfile {
  name: string;
  email: string;
  role: "School Student" | "College Student" | "Exam Aspirant" | "Lifelong Learner";
  preferredLanguage: Language;
  learningLevel: LearningLevel;
  streakDays: number;
  xp: number;
  avatar: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  category: "Engineering & Tech" | "Sciences" | "Humanities & Commerce" | "Custom";
  iconName: string;
  color: string;
  topicsCount: number;
  progress: number;
  topics: string[];
}

export interface TopicExplanation {
  title: string;
  subject: string;
  level: LearningLevel;
  simpleExplanation: string;
  detailedExplanation: string;
  realWorldExample: string;
  keyPoints: string[];
  keyTerms: { term: string; definition: string }[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  concept: string;
}

export interface MistakeAnalysis {
  friendlyIntro: string;
  misunderstoodConcept: string;
  whyIncorrect: string;
  simpleExplanation: string;
  relatableExample: string;
  studentAnswer?: string;
  correctAnswer?: string;
  encouragement?: string;
  similarPracticeQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    hint?: string;
    explanation?: string;
  };
}

export interface QuestionBankItem {
  id: string;
  subject: string;
  unit: string;
  topic: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  answer: string;
  keyPoints?: string[];
  markingScheme?: string;
}

export interface Flashcard {
  id: string;
  subject: string;
  topic: string;
  front: string;
  back: string;
  mastered: boolean;
}

export interface NoteDocument {
  id: string;
  title: string;
  subject: string;
  date: string;
  summary: string;
  importantPoints?: string[];
  keyPoints?: string[];
  keyConcepts?: { name: string; explanation: string }[];
  generatedQuestions?: { marks: number; question: string }[];
  revisionMaterial?: string;
}

export interface StudyPlanDay {
  dayNumber?: number;
  time?: string;
  subject?: string;
  topic?: string;
  topics?: string[];
  hours?: number;
  activity?: string;
  completed: boolean;
  quizScheduled?: boolean;
  revisionFocus?: string;
}

export interface StudyPlan {
  overallStrategy: string;
  today?: StudyPlanDay[];
  tomorrow?: StudyPlanDay[];
  thisWeek?: { day: string; focus: string }[];
  schedule?: StudyPlanDay[];
  dailyTargetHours?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  dateUnlocked?: string;
  category: "Streak" | "Quiz" | "Topic" | "Special";
}

export interface WeakTopic {
  id: string;
  topic: string;
  subject: string;
  accuracy: number;
  mistakesCount: number;
  lastPracticed: string;
  recommendedAction: string;
}
