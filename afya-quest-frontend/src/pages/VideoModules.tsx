import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VideoModules.css';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  category: string;
  hasQuiz: boolean;
  quizComplete: boolean;
  watched: boolean;
  description: string;
  videoUrl?: string;
}

const VideoModules: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [videosWithQuizStatus, setVideosWithQuizStatus] = useState<Video[]>([]);

  const videos: Video[] = [
    {
      id: '1',
      title: 'Module 1: Health Assessments',
      thumbnail: '🎬',
      duration: '6:50',
      category: 'basics',
      hasQuiz: true,
      quizComplete: false,
      watched: true,
      description: 'Learn how to conduct comprehensive health assessments using the Medical Detective\'s Handbook',
      videoUrl: '/videos/Medical_Detective_s_Handbook.mp4'
    },
    {
      id: '2',
      title: 'Module 2: Water Sanitation Practices',
      thumbnail: '💧',
      duration: '15:45',
      category: 'sanitation',
      hasQuiz: true,
      quizComplete: false,
      watched: false,
      description: 'Understanding water treatment and safe storage'
    },
    {
      id: '3',
      title: 'Module 3: Maternal and Child Health',
      thumbnail: '👶',
      duration: '20:15',
      category: 'maternal',
      hasQuiz: true,
      quizComplete: false,
      watched: false,
      description: 'Essential care for mothers and children'
    },
    {
      id: '4',
      title: 'Module 4: Vaccination Programs',
      thumbnail: '💉',
      duration: '18:00',
      category: 'immunization',
      hasQuiz: true,
      quizComplete: false,
      watched: false,
      description: 'Understanding vaccination schedules and importance'
    },
    {
      id: '5',
      title: 'Module 5: Emergency First Aid',
      thumbnail: '🚨',
      duration: '7:21',
      category: 'emergency',
      hasQuiz: true,
      quizComplete: false,
      watched: true,
      description: 'Learn essential emergency first aid techniques for common medical situations',
      videoUrl: '/videos/Emergency_First_Aid.mp4'
    }
  ];

  useEffect(() => {
    // Check localStorage for completed quizzes
    const completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '{}');
    
    const updatedVideos = videos.map(video => {
      if (completedQuizzes[video.id]) {
        return { ...video, quizComplete: true };
      }
      return video;
    });
    
    setVideosWithQuizStatus(updatedVideos);
  }, []);

  const categories = [
    { id: 'all', name: 'All Videos' },
    { id: 'basics', name: 'Health Assessment' },
    { id: 'sanitation', name: 'Sanitation' },
    { id: 'maternal', name: 'Maternal Health' },
    { id: 'immunization', name: 'Immunization' },
    { id: 'emergency', name: 'Emergency' }
  ];

  const displayVideos = videosWithQuizStatus.length > 0 ? videosWithQuizStatus : videos;
  const filteredVideos = selectedCategory === 'all'
    ? displayVideos
    : displayVideos.filter(video => video.category === selectedCategory);

  const handleVideoClick = (video: Video) => {
    console.log('Playing video:', video.id);
    if (video.videoUrl) {
      // Open video in new tab or modal
      window.open(video.videoUrl, '_blank');
    } else {
      // Fallback for videos without URLs
      alert('Video URL not available');
    }
  };

  const handleQuizClick = (video: Video) => {
    console.log('Starting quiz for:', video.id);
    // Navigate to quiz page
    navigate(`/module-quiz/${video.id}`);
  };

  return (
    <div className="video-modules">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ←
        </button>
        <h1>Video Modules and Lessons</h1>
      </header>

      <div className="module-stats">
        <div className="stat">
          <span className="stat-value">2/5</span>
          <span className="stat-label">Videos Watched</span>
        </div>
        <div className="stat">
          <span className="stat-value">1/5</span>
          <span className="stat-label">Quizzes Complete</span>
        </div>
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`tab ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="videos-grid">
        {filteredVideos.map(video => (
          <div key={video.id} className="video-card">
            <div 
              className="video-thumbnail"
              onClick={() => handleVideoClick(video)}
            >
              <div className="thumbnail-icon">{video.thumbnail}</div>
              <div className="duration">{video.duration}</div>
              {video.watched && (
                <div className="watched-badge">✓ Watched</div>
              )}
            </div>
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              {video.hasQuiz && (
                <div className="quiz-section">
                  {video.quizComplete ? (
                    <span className="quiz-status complete">✅ Quiz Complete</span>
                  ) : (
                    <button 
                      className={`quiz-btn ${(video.id === '2' || video.id === '3' || video.id === '4') ? 'coming-soon' : ''}`}
                      onClick={() => (video.id === '2' || video.id === '3' || video.id === '4') ? null : handleQuizClick(video)}
                      disabled={!video.watched || video.id === '2' || video.id === '3' || video.id === '4'}
                    >
                      {(video.id === '2' || video.id === '3' || video.id === '4') 
                        ? 'Coming Soon' 
                        : (video.watched ? 'Take Quiz' : 'Watch Video First')}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="learning-path">
        <h2>Your Learning Path</h2>
        <div className="path-progress">
          <div className="path-line">
            <div className="path-fill" style={{ width: '40%' }}></div>
          </div>
          <p>40% Complete - Keep going!</p>
        </div>
      </div>
    </div>
  );
};

export default VideoModules;