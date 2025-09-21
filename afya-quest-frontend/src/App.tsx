import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import ChatbotWrapper from './components/ChatbotWrapper';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DailyQuestions from './pages/DailyQuestions';
import DailyReport from './pages/DailyReport';
import Itinerary from './pages/Itinerary';
import InteractiveLearning from './pages/InteractiveLearning';
import VideoModules from './pages/VideoModules';
import ModuleQuiz from './pages/ModuleQuiz';
import Profile from './pages/Profile';
import MapView from './pages/MapView';
import { initializeLivesIfNeeded } from './utils/xpManager';
import './styles/App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    // Only clear auth on first mount when showing splash
    if (showSplash) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      sessionStorage.clear();
    }
    
    // Initialize lives on app start if needed
    initializeLivesIfNeeded();
    
    // Add body class for bottom navigation spacing
    document.body.classList.add('has-bottom-nav');
    
    return () => {
      document.body.classList.remove('has-bottom-nav');
    };
  }, [showSplash]);
  
  const handleSplashComplete = () => {
    setShowSplash(false);
  };
  
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interactive-learning" element={<InteractiveLearning />} />
          <Route path="/video-modules" element={<VideoModules />} />
          <Route path="/module-quiz/:moduleId" element={<ModuleQuiz />} />
          <Route path="/daily-questions" element={<DailyQuestions />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/daily-report" element={<DailyReport />} />
          <Route path="/itinerary" element={<Itinerary />} />
        </Routes>
        <ChatbotWrapper />
      </div>
    </Router>
  );
}

export default App;