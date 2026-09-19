import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { LandingPage } from "./components/LandingPage";
import { AuthModal } from "./components/AuthModal";
import { MistakeDetectiveModal } from "./components/MistakeDetectiveModal";
import { VoiceLearningModal } from "./components/VoiceLearningModal";
import { OfflineIndicator } from "./components/pwa/OfflineIndicator";

import { DashboardView } from "./components/views/DashboardView";
import { SubjectsView } from "./components/views/SubjectsView";
import { AITutorView } from "./components/views/AITutorView";
import { TeachBackView } from "./components/views/TeachBackView";
import { MasteryMapView } from "./components/views/MasteryMapView";
import { ConfusionDetectorView } from "./components/views/ConfusionDetectorView";
import { HealthCheckView } from "./components/views/HealthCheckView";
import { QuestionBankView } from "./components/views/QuestionBankView";
import { QuizView } from "./components/views/QuizView";
import { RevisionView } from "./components/views/RevisionView";
import { FlashcardsView } from "./components/views/FlashcardsView";
import { NotesView } from "./components/views/NotesView";
import { StudyPlannerView } from "./components/views/StudyPlannerView";
import { ProgressView } from "./components/views/ProgressView";
import { AchievementsView } from "./components/views/AchievementsView";
import { SettingsView } from "./components/views/SettingsView";
import { WhatToLearnModal } from "./components/WhatToLearnModal";
import { DiagnosticModal } from "./components/DiagnosticModal";

const MainApp: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If user is on the landing tab or not authenticated, render the landing page
  if (activeTab === "landing" || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)} />
        <main className="flex-1">
          <LandingPage />
        </main>
        <AuthModal />
        <VoiceLearningModal />
        <MistakeDetectiveModal />
        <WhatToLearnModal />
        <DiagnosticModal />
        <OfflineIndicator />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "subjects":
        return <SubjectsView />;
      case "tutor":
        return <AITutorView />;
      case "teach-back":
        return <TeachBackView />;
      case "mastery-map":
        return <MasteryMapView />;
      case "confusion":
        return <ConfusionDetectorView />;
      case "health-check":
        return <HealthCheckView />;
      case "question-bank":
        return <QuestionBankView />;
      case "quiz":
        return <QuizView />;
      case "revision":
        return <RevisionView />;
      case "flashcards":
        return <FlashcardsView />;
      case "notes":
        return <NotesView />;
      case "planner":
        return <StudyPlannerView />;
      case "progress":
        return <ProgressView />;
      case "achievements":
        return <AchievementsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        isMobileNavOpen={mobileNavOpen}
        onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
      />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <Sidebar
          isMobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-full overflow-x-hidden">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Offline Indicator */}
      <AuthModal />
      <MistakeDetectiveModal />
      <VoiceLearningModal />
      <WhatToLearnModal />
      <DiagnosticModal />
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
