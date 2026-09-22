import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import GlobalSearchModal from './components/common/GlobalSearchModal';
import OnboardingModal from './components/common/OnboardingModal';
import FloatingStudyChat from './components/chat/FloatingStudyChat';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import AITutor from './pages/AITutor';
import Explainer from './pages/Explainer';
import Flashcards from './pages/Flashcards';
import Quizzes from './pages/Quizzes';
import CodingLab from './pages/CodingLab';
import Games from './pages/Games';
import Notes from './pages/Notes';
import StudyPlanner from './pages/StudyPlanner';
import Progress from './pages/Progress';
import Projects from './pages/Projects';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';

function MainApp() {
  const [inApp, setInApp] = useState(() => {
    // If entered previously or direct visit
    return localStorage.getItem('study_buddy_visited') === 'true';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Navigation payload for cross-page jumping
  const [navPayload, setNavPayload] = useState({});

  const handleStartLearning = () => {
    localStorage.setItem('study_buddy_visited', 'true');
    setInApp(true);
  };

  const handleNavigate = (tabId, payload = {}) => {
    setActiveTab(tabId);
    setNavPayload(payload);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!inApp) {
    return <LandingPage onStartLearning={handleStartLearning} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          onOpenSearch={() => setSearchOpen(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activeTab={activeTab}
        />

        {/* Dynamic Page Rendering */}
        <main className="flex-1 pb-16">
          {activeTab === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
          {activeTab === 'learn' && <Learn onNavigate={handleNavigate} initialTopic={navPayload.topic} />}
          {activeTab === 'ai_tutor' && <AITutor />}
          {activeTab === 'explainer' && <Explainer initialTopic={navPayload.topic || 'Recursion'} />}
          {activeTab === 'flashcards' && <Flashcards initialDeckId={navPayload.deckId} />}
          {activeTab === 'quizzes' && <Quizzes initialQuizId={navPayload.quizId} />}
          {activeTab === 'coding_lab' && <CodingLab initialSlug={navPayload.slug} />}
          {activeTab === 'games' && <Games initialGame={navPayload.game} />}
          {activeTab === 'notes' && <Notes onNavigate={handleNavigate} />}
          {activeTab === 'planner' && <StudyPlanner onNavigate={handleNavigate} />}
          {activeTab === 'progress' && <Progress />}
          {activeTab === 'projects' && <Projects onNavigate={handleNavigate} />}
          {activeTab === 'achievements' && <Achievements />}
          {activeTab === 'profile' && <Profile />}
        </main>
      </div>

      {/* Persistent Global Search Modal (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Onboarding Dialog for first-time students */}
      <OnboardingModal />

      {/* Floating AI Study Chat (Always accessible) */}
      <FloatingStudyChat />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
