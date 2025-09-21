import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTotalXP, getStreak, getLives, initializeLivesIfNeeded } from '../utils/xpManager';
import BottomNavigation from '../components/BottomNavigation';
import '../styles/Dashboard.css';

interface DailyTask {
  id: string;
  title: string;
  description: string;
  icon?: string;
  iconType?: 'emoji' | 'image';
  iconSrc?: string;
  isRequired: boolean;
  isCompleted: boolean;
  path: string;
}

interface LearningItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  iconType?: 'emoji' | 'image';
  iconSrc?: string;
  path: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [streakCount, setStreakCount] = useState(getStreak());
  const [xpPoints, setXpPoints] = useState(getTotalXP());
  const [lives, setLives] = useState(getLives());
  
  useEffect(() => {
    // Initialize lives if needed
    initializeLivesIfNeeded();
    
    // Update XP, streak and lives from localStorage
    const updateStats = () => {
      setXpPoints(getTotalXP());
      setStreakCount(getStreak());
      setLives(getLives());
    };
    
    // Initial update
    updateStats();
    
    // Listen for XP updates
    const handleXPUpdate = (event: CustomEvent) => {
      const data = event.detail;
      setXpPoints(data.totalXP);
      setStreakCount(data.streak);
      setLives(data.lives);
    };
    
    window.addEventListener('xpUpdated', handleXPUpdate as EventListener);
    
    // Update on focus (when user returns to tab)
    window.addEventListener('focus', updateStats);
    
    return () => {
      window.removeEventListener('xpUpdated', handleXPUpdate as EventListener);
      window.removeEventListener('focus', updateStats);
    };
  }, []);

  const dailyTasks: DailyTask[] = [
    {
      id: 'itinerary',
      title: 'Daily Itinerary',
      description: 'Find your scheduled locations and patients here!',
      iconType: 'image',
      iconSrc: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIE1hcCBCYWNrZ3JvdW5kIC0tPgogIDxyZWN0IHg9IjQiIHk9IjEyIiB3aWR0aD0iMzIiIGhlaWdodD0iMjQiIHJ4PSIzIiBmaWxsPSIjQkREQUU3Ii8+CiAgCiAgPCEtLSBNYXAgTGF5ZXJzIC0tPgogIDxyZWN0IHg9IjciIHk9IjE1IiB3aWR0aD0iMTAiIGhlaWdodD0iOCIgcng9IjEiIGZpbGw9IiM4MUMyOUQiLz4KICA8cmVjdCB4PSIyMCIgeT0iMjYiIHdpZHRoPSIxMCIgaGVpZ2h0PSI3IiByeD0iMSIgZmlsbD0iIzgxQzI5RCIvPgogIDxyZWN0IHg9IjI0IiB5PSIxOCIgd2lkdGg9IjkiIGhlaWdodD0iNSIgcng9IjEiIGZpbGw9IiM4MUMyOUQiLz4KICAKICA8IS0tIFJvYWRzIC0tPgogIDxwYXRoIGQ9Ik00IDIwTDM2IDIwIiBzdHJva2U9IiNGRkU5ODIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTE4IDEyTDE4IDM2IiBzdHJva2U9IiNGRkU5ODIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTI4IDI4TDM2IDIwIiBzdHJva2U9IiNGRkU5ODIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgCiAgPCEtLSBMb2NhdGlvbiBQaW4gLS0+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAsIDE2KSI+CiAgICA8cGF0aCBkPSJNMCAtOEMtNC40MTggLTggLTggLTQuNDE4IC04IDBDLTggMyAtNCAxMCAwIDEyQzQgMTAgOCAzIDggMEM4IC00LjQxOCA0LjQxOCAtOCAwIC04WiIgZmlsbD0iI0VGNTM1MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgICA8Y2lyY2xlIGN4PSIwIiBjeT0iMCIgcj0iMyIgZmlsbD0id2hpdGUiLz4KICA8L2c+Cjwvc3ZnPg==',
      isRequired: true,
      isCompleted: false,
      path: '/itinerary'
    },
    {
      id: 'questions',
      title: 'Daily Questions!',
      description: 'Answer your three daily questions to collect your daily XP!',
      iconType: 'image',
      iconSrc: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIEJhciBDaGFydCBCYXJzIC0tPgogIDxyZWN0IHg9IjYiIHk9IjI2IiB3aWR0aD0iNSIgaGVpZ2h0PSI4IiBmaWxsPSIjRkZDMTA3Ii8+CiAgPHJlY3QgeD0iMTMiIHk9IjIwIiB3aWR0aD0iNSIgaGVpZ2h0PSIxNCIgZmlsbD0iIzU0ODRGRiIvPgogIDxyZWN0IHg9IjIwIiB5PSIxNiIgd2lkdGg9IjUiIGhlaWdodD0iMTgiIGZpbGw9IiM2MEE1RkEiLz4KICA8cmVjdCB4PSIyNyIgeT0iMTIiIHdpZHRoPSI1IiBoZWlnaHQ9IjIyIiBmaWxsPSIjN0RENEZDIi8+CiAgCiAgPCEtLSBCb2xkIFRyZW5kIExpbmUgLS0+CiAgPHBhdGggZD0iTTggMjBMMTUuNSAxNEwyMyAxMEwzMCA2IiBzdHJva2U9IiNGRjU2NTYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIi8+CiAgCiAgPCEtLSBCb2xkIEFycm93IEhlYWQgLS0+CiAgPHBhdGggZD0iTTI2IDEwTDMwIDZMMjYgMiIgc3Ryb2tlPSIjRkY1NjU2IiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0ibm9uZSIvPgogIAogIDwhLS0gQmFzZSBMaW5lIC0tPgogIDxyZWN0IHg9IjQiIHk9IjM0IiB3aWR0aD0iMzAiIGhlaWdodD0iMSIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4=',
      isRequired: true,
      isCompleted: false,
      path: '/daily-questions'
    },
    {
      id: 'report',
      title: 'Daily Report',
      description: 'Fill out the report at the end of the day.',
      iconType: 'image',
      iconSrc: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB4PSI2IiB5PSI0IiB3aWR0aD0iMjAiIGhlaWdodD0iMjgiIHJ4PSIyIiBmaWxsPSIjNTQ4NEZGIi8+CiAgPHJlY3QgeD0iOCIgeT0iNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjI0IiBmaWxsPSJ3aGl0ZSIvPgogIDxyZWN0IHg9IjEwIiB5PSI5IiB3aWR0aD0iMTIiIGhlaWdodD0iMiIgZmlsbD0iIzU0ODRGRiIvPgogIDxyZWN0IHg9IjEwIiB5PSIxMyIgd2lkdGg9IjgiIGhlaWdodD0iMiIgZmlsbD0iI0JEQ0VGRiIvPgogIDxyZWN0IHg9IjEwIiB5PSIxNyIgd2lkdGg9IjEyIiBoZWlnaHQ9IjIiIGZpbGw9IiNCRENFRkYiLz4KICA8cmVjdCB4PSIxMCIgeT0iMjEiIHdpZHRoPSI2IiBoZWlnaHQ9IjIiIGZpbGw9IiNCRENFRkYiLz4KICA8cGF0aCBkPSJNMjIgMjBMMjggMTRMMzAgMTZMMjQgMjJMMjIgMjBaIiBmaWxsPSIjRkY2QjZCIi8+CiAgPHBhdGggZD0iTTI4IDE0TDMwIDEyTDMyIDE0TDMwIDE2TDI4IDE0WiIgZmlsbD0iI0ZGQzEwNyIvPgogIDxwYXRoIGQ9Ik0yMiAyMEwyMCAyNkwyMiAyNEwyNCAyMkwyMiAyMFoiIGZpbGw9IiMzMzMzMzMiLz4KPC9zdmc+',
      isRequired: true,
      isCompleted: false,
      path: '/daily-report'
    }
  ];

  const learningCenter: LearningItem[] = [
    {
      id: 'review',
      title: 'Review Modules',
      description: 'Modules to review based on your mistakes!',
      iconType: 'image',
      iconSrc: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIExpZ2h0YnVsYiAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMCwgOCkiPgogICAgPCEtLSBCdWxiIC0tPgogICAgPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjYiIGZpbGw9IiNGRkQ3MDAiLz4KICAgIDwhLS0gQmFzZSAtLT4KICAgIDxyZWN0IHg9Ii0zIiB5PSI1IiB3aWR0aD0iNiIgaGVpZ2h0PSIzIiByeD0iMSIgZmlsbD0iI0ZGQTAwMCIvPgogICAgPCEtLSBMaWdodCByYXlzIC0tPgogICAgPHBhdGggZD0iTS05IC0yTDEyIC0yIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjYiLz4KICAgIDxwYXRoIGQ9Ik0tNyAtN0w3IDciIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIG9wYWNpdHk9IjAuNiIvPgogICAgPHBhdGggZD0iTTcgLTdMLTcgNyIgc3Ryb2tlPSIjRkZENzAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgb3BhY2l0eT0iMC42Ii8+CiAgPC9nPgogIAogIDwhLS0gT3BlbiBCb29rIC0tPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwLCAyNikiPgogICAgPCEtLSBMZWZ0IFBhZ2UgLS0+CiAgICA8cGF0aCBkPSJNLTE0IC02TC0yIC02TC0yIDhDLTIgOSAtMyAxMCAtNCAxMEwtMTQgMTBDLTE1IDEwIC0xNiA5IC0xNiA4TC0xNiAtNEMtMTYgLTUgLTE1IC02IC0xNCAtNloiIGZpbGw9IiM2MEE1RkEiLz4KICAgIDxwYXRoIGQ9Ik0tMTQgLTRMLTQgLTRMLTQgOEwtMTQgOFoiIGZpbGw9IndoaXRlIi8+CiAgICA8IS0tIFJpZ2h0IFBhZ2UgLS0+CiAgICA8cGF0aCBkPSJNMiAtNkwxNCAtNkMxNSAtNiAxNiAtNSAxNiAtNEwxNiA4QzE2IDkgMTUgMTAgMTQgMTBMNCAxMEMzIDEwIDIgOSAyIDhMMiAtNloiIGZpbGw9IiM2MEE1RkEiLz4KICAgIDxwYXRoIGQ9Ik00IC00TDE0IC00TDE0IDhMNCA4WiIgZmlsbD0id2hpdGUiLz4KICAgIDwhLS0gQ2VudGVyIFNwaW5lIC0tPgogICAgPHJlY3QgeD0iLTIiIHk9Ii02IiB3aWR0aD0iNCIgaGVpZ2h0PSIxNiIgZmlsbD0iIzU0ODRGRiIvPgogICAgPCEtLSBUZXh0IGxpbmVzIG9uIGxlZnQgcGFnZSAtLT4KICAgIDxyZWN0IHg9Ii0xMiIgeT0iLTIiIHdpZHRoPSI2IiBoZWlnaHQ9IjEiIGZpbGw9IiNDQ0NDQ0MiLz4KICAgIDxyZWN0IHg9Ii0xMiIgeT0iMCIgd2lkdGg9IjgiIGhlaWdodD0iMSIgZmlsbD0iI0NDQ0NDQyIvPgogICAgPHJlY3QgeD0iLTEyIiB5PSIyIiB3aWR0aD0iNSIgaGVpZ2h0PSIxIiBmaWxsPSIjQ0NDQ0NDIi8+CiAgICA8cmVjdCB4PSItMTIiIHk9IjQiIHdpZHRoPSI3IiBoZWlnaHQ9IjEiIGZpbGw9IiNDQ0NDQ0MiLz4KICAgIDwhLS0gVGV4dCBsaW5lcyBvbiByaWdodCBwYWdlIC0tPgogICAgPHJlY3QgeD0iNiIgeT0iLTIiIHdpZHRoPSI2IiBoZWlnaHQ9IjEiIGZpbGw9IiNDQ0NDQ0MiLz4KICAgIDxyZWN0IHg9IjYiIHk9IjAiIHdpZHRoPSI4IiBoZWlnaHQ9IjEiIGZpbGw9IiNDQ0NDQ0MiLz4KICAgIDxyZWN0IHg9IjYiIHk9IjIiIHdpZHRoPSI1IiBoZWlnaHQ9IjEiIGZpbGw9IiNDQ0NDQ0MiLz4KICAgIDxyZWN0IHg9IjYiIHk9IjQiIHdpZHRoPSI3IiBoZWlnaHQ9IjEiIGZpbGw9IiNDQ0NDQ0MiLz4KICA8L2c+Cjwvc3ZnPg==',
      path: '/video-modules'
    }
  ];

  return (
    <div className="dashboard">
      {/* Top Stats Bar */}
      <header className="stats-header">
        <div className="stat-item">
          <span className="stat-icon">🔥</span>
          <span className="stat-value">{streakCount}</span>
        </div>
        <div className="stat-item xp">
          <span className="stat-icon">💎</span>
          <span className="stat-value">{xpPoints} XP</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">❤️</span>
          <span className="stat-value">{lives}</span>
        </div>
      </header>

      {/* Daily To-Do Section */}
      <section className="daily-todo-section">
        <h2 className="section-title">Daily To-Do</h2>
        <div className="task-list">
          {dailyTasks.map((task) => (
            <div
              key={task.id}
              className={`task-card ${task.isCompleted ? 'completed' : ''}`}
              onClick={() => navigate(task.path)}
            >
              <div className="task-icon-container">
                {task.iconType === 'image' && task.iconSrc ? (
                  <img src={task.iconSrc} alt={task.title} className="task-icon-img" />
                ) : (
                  <span className="task-icon">{task.icon || ''}</span>
                )}
              </div>
              <div className="task-content">
                <div className="task-header">
                  <h3 className="task-title">
                    {task.title}
                    {task.isRequired && <span className="required-indicator"> *</span>}
                  </h3>
                </div>
                <p className="task-description">{task.description}</p>
              </div>
              {task.isCompleted && (
                <div className="task-check">
                  <span>✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Learning Center Section */}
      <section className="learning-center-section">
        <h2 className="section-title">Learning Center</h2>
        <div className="task-list">
          {learningCenter.map((item) => (
            <div
              key={item.id}
              className="task-card"
              onClick={() => navigate(item.path)}
            >
              <div className="task-icon-container">
                {item.iconType === 'image' && item.iconSrc ? (
                  <img src={item.iconSrc} alt={item.title} className="task-icon-img" />
                ) : (
                  <span className="task-icon">{item.icon || ''}</span>
                )}
              </div>
              <div className="task-content">
                <h3 className="task-title">{item.title}</h3>
                <p className="task-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;