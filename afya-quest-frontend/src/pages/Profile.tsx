import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { reportAPI } from '../services/api';
import { 
  hasCompletedThisWeeksReflection,
  saveWeeklyReflection,
  getWeeklyReflections,
  deleteWeeklyReflection,
  availableModules,
  type WeeklyReflection
} from '../utils/reflectionManager';
import { useTheme } from '../contexts/ThemeContext';
import BottomNavigation from '../components/BottomNavigation';
import '../styles/Profile.css';

interface DailyReport {
  id: string;
  date: string;
  patientsVisited: number;
  vaccinationsGiven: number;
  healthEducation: string;
  challenges?: string;
  notes?: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'reports' | 'settings' | 'weekly-reflections'>('overview');
  const [pastReports, setPastReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Reflection states
  const [weeklyReflections, setWeeklyReflections] = useState<WeeklyReflection[]>([]);
  const [weeklyFormData, setWeeklyFormData] = useState({
    difficultModule: '',
    satisfactionRating: 0,
    comments: ''
  });

  const hasReflectedThisWeek = hasCompletedThisWeeksReflection();

  const userInfo = {
    name: 'Steve Zhang',
    role: 'Community Health Assistant',
    email: 'steve.zhang@afyaquest.com',
    phone: '+254 712 345 678',
    location: 'Kajiado Town, Kajiado',
    joinDate: 'January 2024',
    supervisor: 'Dr. John Kamau',
    level: 5,
    totalPoints: 1250,
    rank: 'Silver CHA'
  };

  useEffect(() => {
    // Check for URL parameters to set active tab
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    if (tab && ['overview', 'achievements', 'reports', 'settings', 'weekly-reflections'].includes(tab)) {
      setActiveTab(tab as any);
    }
    
    // Load reflections on component mount
    setWeeklyReflections(getWeeklyReflections());
  }, [location.search]);

  useEffect(() => {
    if (activeTab === 'reports') {
      fetchPastReports();
    } else if (activeTab === 'weekly-reflections') {
      setWeeklyReflections(getWeeklyReflections());
    }
  }, [activeTab]);

  const fetchPastReports = async () => {
    setLoading(true);
    try {
      // First try to get from backend
      const response = await reportAPI.getAllReports();
      if (response?.data && response.data.length > 0) {
        setPastReports(response.data);
      } else {
        // If no backend data, get from localStorage
        const localReports = JSON.parse(localStorage.getItem('dailyReports') || '[]');
        setPastReports(localReports);
      }
    } catch (error) {
      console.error('Error fetching reports from backend:', error);
      // Fallback to localStorage
      const localReports = JSON.parse(localStorage.getItem('dailyReports') || '[]');
      
      // Sort reports by date (most recent first)
      const sortedReports = localReports.sort((a: DailyReport, b: DailyReport) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      setPastReports(sortedReports);
    } finally {
      setLoading(false);
    }
  };

  const handleWeeklyReflectionSubmit = () => {
    if (!weeklyFormData.difficultModule || weeklyFormData.satisfactionRating === 0) {
      alert('Please fill in all required fields.');
      return;
    }
    
    try {
      saveWeeklyReflection(
        weeklyFormData.difficultModule,
        weeklyFormData.satisfactionRating,
        weeklyFormData.comments.trim()
      );
      setWeeklyFormData({ difficultModule: '', satisfactionRating: 0, comments: '' });
      setWeeklyReflections(getWeeklyReflections());
      alert('Weekly reflection saved successfully!');
    } catch (error) {
      console.error('Error saving weekly reflection:', error);
      alert('Failed to save reflection. Please try again.');
    }
  };

  const handleDeleteWeeklyReflection = (reflectionId: string) => {
    if (window.confirm('Are you sure you want to delete this reflection?')) {
      deleteWeeklyReflection(reflectionId);
      setWeeklyReflections(getWeeklyReflections());
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        // Try to delete from backend
        await reportAPI.deleteReport(reportId);
        
        // Update state
        const updatedReports = pastReports.filter(report => report.id !== reportId);
        setPastReports(updatedReports);
        
        // Also update localStorage
        const localReports = JSON.parse(localStorage.getItem('dailyReports') || '[]');
        const updatedLocalReports = localReports.filter((report: DailyReport) => report.id !== reportId);
        localStorage.setItem('dailyReports', JSON.stringify(updatedLocalReports));
        
        alert('Report deleted successfully');
      } catch (error) {
        console.error('Error deleting from backend:', error);
        
        // Still delete from localStorage even if backend fails
        const updatedReports = pastReports.filter(report => report.id !== reportId);
        setPastReports(updatedReports);
        
        const localReports = JSON.parse(localStorage.getItem('dailyReports') || '[]');
        const updatedLocalReports = localReports.filter((report: DailyReport) => report.id !== reportId);
        localStorage.setItem('dailyReports', JSON.stringify(updatedLocalReports));
        
        alert('Report deleted successfully');
      }
    }
  };

  const achievements = [
    { id: '1', title: 'First Lesson Complete', icon: '🎓', date: '2024-01-15' },
    { id: '2', title: 'Week Streak', icon: '🔥', date: '2024-01-22' },
    { id: '3', title: 'Quiz Master', icon: '🏆', date: '2024-01-25' },
    { id: '4', title: '10 Videos Watched', icon: '📹', date: '2024-02-01' },
    { id: '5', title: 'Community Helper', icon: '🤝', date: '2024-02-05' },
  ];

  const stats = [
    { label: 'Lessons Completed', value: 15 },
    { label: 'Videos Watched', value: 12 },
    { label: 'Quizzes Passed', value: 8 },
    { label: 'Current Streak', value: '7 days' },
    { label: 'Certificates Earned', value: 2 },
    { label: 'Community Visits', value: 45 }
  ];

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ←
        </button>
        <h1>My Profile</h1>
        <button className="logout-btn" onClick={() => navigate('/login')}>
          Logout
        </button>
      </header>

      <div className="profile-info">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            {userInfo.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
        <h2>{userInfo.name}</h2>
        <p className="role">{userInfo.role}</p>
        <div className="level-badge">
          Level {userInfo.level} - {userInfo.rank}
        </div>
        <div className="points-display">
          {userInfo.totalPoints} Points
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'achievements' ? 'active' : ''}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button
          className={activeTab === 'reports' ? 'active' : ''}
          onClick={() => setActiveTab('reports')}
        >
          Past Reports
        </button>
        <button
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
        <button
          className={activeTab === 'weekly-reflections' ? 'active' : ''}
          onClick={() => setActiveTab('weekly-reflections')}
        >
          Weekly Reflections
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="contact-info">
              <h3>Contact Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{userInfo.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Phone:</span>
                  <span className="value">{userInfo.phone}</span>
                </div>
                <div className="info-item">
                  <span className="label">Location:</span>
                  <span className="value">{userInfo.location}</span>
                </div>
                <div className="info-item">
                  <span className="label">Supervisor:</span>
                  <span className="value">{userInfo.supervisor}</span>
                </div>
                <div className="info-item">
                  <span className="label">Member Since:</span>
                  <span className="value">{userInfo.joinDate}</span>
                </div>
              </div>
            </div>

            <div className="performance-stats">
              <h3>Performance Statistics</h3>
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-tab">
            <h3>Your Achievements</h3>
            <div className="achievements-list">
              {achievements.map(achievement => (
                <div key={achievement.id} className="achievement-card">
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-info">
                    <h4>{achievement.title}</h4>
                    <p>Earned on {achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="locked-achievements">
              <h3>Locked Achievements</h3>
              <div className="achievement-card locked">
                <div className="achievement-icon">🔒</div>
                <div className="achievement-info">
                  <h4>Master Educator</h4>
                  <p>Complete 50 lessons to unlock</p>
                </div>
              </div>
              <div className="achievement-card locked">
                <div className="achievement-icon">🔒</div>
                <div className="achievement-info">
                  <h4>Video Expert</h4>
                  <p>Watch all video modules to unlock</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-tab">
            <h3>Past Daily Reports</h3>
            {loading ? (
              <div className="loading-message">Loading reports...</div>
            ) : pastReports.length === 0 ? (
              <div className="no-reports">
                <p>No reports found. Start submitting daily reports to see them here!</p>
                <button className="btn-primary" onClick={() => navigate('/daily-report')}>
                  Create Your First Report
                </button>
              </div>
            ) : (
              <div className="reports-list">
                {pastReports.map(report => (
                  <div key={report.id} className="report-card">
                    <div className="report-header">
                      <h4>{new Date(report.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</h4>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteReport(report.id)}
                        title="Delete report"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="report-details">
                      <div className="report-stat">
                        <span className="stat-icon">👥</span>
                        <span className="stat-value">{report.patientsVisited}</span>
                        <span className="stat-label">Patients</span>
                      </div>
                      <div className="report-stat">
                        <span className="stat-icon">💉</span>
                        <span className="stat-value">{report.vaccinationsGiven}</span>
                        <span className="stat-label">Vaccinations</span>
                      </div>
                      <div className="report-stat">
                        <span className="stat-icon">📚</span>
                        <span className="stat-value">{report.healthEducation}</span>
                        <span className="stat-label">Education Topic</span>
                      </div>
                    </div>
                    {(report.challenges || report.notes) && (
                      <div className="report-extra">
                        {report.challenges && (
                          <div className="report-field">
                            <strong>Challenges:</strong> {report.challenges}
                          </div>
                        )}
                        {report.notes && (
                          <div className="report-field">
                            <strong>Notes:</strong> {report.notes}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="reports-actions">
              <button className="btn-primary" onClick={() => navigate('/daily-report')}>
                Create New Report
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <h3>Settings</h3>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-title">Dark Mode</div>
                  <div className="setting-description">Switch between light and dark themes</div>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-title">Language Preference</div>
                  <div className="setting-description">Choose your preferred language</div>
                </div>
                <select>
                  <option>English</option>
                  <option>Swahili</option>
                </select>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-title">Notifications</div>
                  <div className="setting-description">Receive alerts for important updates</div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-title">Offline Mode</div>
                  <div className="setting-description">Download content for offline access</div>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-title">Daily Reminders</div>
                  <div className="setting-description">Get reminded to complete daily tasks</div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            <div className="settings-actions">
              <button className="btn-secondary">Change Password</button>
              <button className="btn-primary">Download Certificate</button>
              <button className="btn-danger">Delete Account</button>
            </div>
          </div>
        )}

        {activeTab === 'weekly-reflections' && (
          <div className="weekly-reflections-tab">
            <h3>Weekly Reflections</h3>
            
            {!hasReflectedThisWeek ? (
              <div className="weekly-reflection-form">
                <h4>Weekly Reflection</h4>
                
                <div className="form-field">
                  <label>Which module did you find most difficult this week? <span className="required">*</span></label>
                  <select 
                    value={weeklyFormData.difficultModule}
                    onChange={(e) => setWeeklyFormData(prev => ({ ...prev, difficultModule: e.target.value }))}
                    className="module-select"
                  >
                    <option value="">Select Module</option>
                    {availableModules.map(module => (
                      <option key={module} value={module}>{module}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>How satisfied are you with this week's training? <span className="required">*</span></label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`star ${weeklyFormData.satisfactionRating >= star ? 'active' : ''}`}
                        onClick={() => setWeeklyFormData(prev => ({ ...prev, satisfactionRating: star }))}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-field">
                  <label>Thoughts, comments, concerns?</label>
                  <textarea
                    value={weeklyFormData.comments}
                    onChange={(e) => setWeeklyFormData(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Type here!"
                    rows={4}
                    className="comments-textarea"
                  />
                </div>

                <button 
                  className="btn-primary weekly-submit-btn"
                  onClick={handleWeeklyReflectionSubmit}
                  disabled={!weeklyFormData.difficultModule || weeklyFormData.satisfactionRating === 0}
                >
                  Submit Weekly Reflection
                </button>
              </div>
            ) : (
              <div className="reflection-completed">
                <p>✅ You've already completed this week's reflection! Come back next week.</p>
              </div>
            )}

            <div className="past-weekly-reflections">
              <h4>Past Weekly Reflections</h4>
              {weeklyReflections.length === 0 ? (
                <div className="no-reflections">
                  <p>No weekly reflections yet. Complete your first weekly reflection above!</p>
                </div>
              ) : (
                <div className="weekly-reflections-list">
                  {weeklyReflections.map(reflection => (
                    <div key={reflection.id} className="weekly-reflection-card">
                      <div className="reflection-header">
                        <span className="reflection-date">
                          Week of {new Date(reflection.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDeleteWeeklyReflection(reflection.id)}
                          title="Delete reflection"
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="weekly-reflection-content">
                        <div className="reflection-field">
                          <strong>Most Difficult Module:</strong> {reflection.difficultModule}
                        </div>
                        <div className="reflection-field">
                          <strong>Satisfaction Rating:</strong>
                          <div className="rating-display">
                            {[1, 2, 3, 4, 5].map(star => (
                              <span key={star} className={`star ${reflection.satisfactionRating >= star ? 'filled' : ''}`}>
                                ⭐
                              </span>
                            ))}
                          </div>
                        </div>
                        {reflection.comments && (
                          <div className="reflection-field">
                            <strong>Comments:</strong>
                            <p>{reflection.comments}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Profile;