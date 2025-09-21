import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import '../styles/InteractiveLearning.css';

interface Module {
  id: string;
  title: string;
  titleSwahili: string;
  icon: string;
  progress: number;
  totalLessons: number;
  category: string;
}

interface ModuleCategory {
  id: string;
  title: string;
  titleSwahili: string;
  score: number;
  maxScore: number;
  modules: Module[];
}

const InteractiveLearning: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'sw'>('en');

  const moduleCategories: ModuleCategory[] = [
    {
      id: 'anatomy',
      title: 'Basic Anatomy',
      titleSwahili: 'Anatomia ya Msingi',
      score: 16,
      maxScore: 40,
      modules: [
        {
          id: 'anatomy-1',
          title: 'Module 1',
          titleSwahili: 'Moduli 1',
          icon: '🫀', // anatomical heart
          progress: 40,
          totalLessons: 10,
          category: 'anatomy'
        }
      ]
    },
    {
      id: 'children',
      title: "Children's Health",
      titleSwahili: 'Afya ya Watoto',
      score: 3,
      maxScore: 40,
      modules: [
        {
          id: 'children-1',
          title: 'Module 2',
          titleSwahili: 'Moduli 2',
          icon: '👶', // child icon
          progress: 7.5,
          totalLessons: 10,
          category: 'children'
        }
      ]
    },
    {
      id: 'adult',
      title: 'Adult Health',
      titleSwahili: 'Afya ya Watu Wazima',
      score: 0,
      maxScore: 40,
      modules: [
        {
          id: 'adult-1',
          title: 'Module 3',
          titleSwahili: 'Moduli 3',
          icon: '❤️', // heart for adult health
          progress: 0,
          totalLessons: 10,
          category: 'adult'
        }
      ]
    }
  ];

  const handleModuleClick = (module: Module) => {
    console.log('Opening module:', module.id);
    // Navigate to module detail (to be implemented)
  };

  const handleBrowseVideos = (categoryId: string) => {
    console.log('Browse videos for:', categoryId);
    navigate('/video-modules');
  };

  return (
    <div className="modules-page">
      <header className="modules-header">
        <h1>{language === 'en' ? 'Modules' : 'Moduli'}</h1>
        <button 
          className="language-toggle"
          onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
        >
          {language === 'en' ? 'SW' : 'EN'}
        </button>
      </header>

      <div className="modules-container">
        {moduleCategories.map(category => (
          <div key={category.id} className="module-category">
            <div className="category-header">
              <h2 className="category-title">
                {language === 'en' ? category.title : category.titleSwahili}
              </h2>
              <div className="category-score">
                <span className="crown-icon">👑</span>
                <span className="score-text">{category.score}/{category.maxScore}</span>
              </div>
            </div>
            
            <div className="module-row">
              {category.modules.map(module => (
                <div 
                  key={module.id} 
                  className="module-card"
                  onClick={() => handleModuleClick(module)}
                >
                  <div className="module-content">
                    <div className="module-icon">{module.icon}</div>
                    <h3 className="module-title">
                      {language === 'en' ? module.title : module.titleSwahili}
                    </h3>
                    <div className="module-progress">
                      <div className="crown-small">👑</div>
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar-fill"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div 
                className="related-videos-card"
                onClick={() => handleBrowseVideos(category.id)}
              >
                <div className="videos-content">
                  <h3 className="videos-title">
                    {language === 'en' ? 'Related Videos' : 'Video Zinazohusiana'}
                  </h3>
                  <button className="browse-btn">
                    <span>{language === 'en' ? 'Browse' : 'Angalia'}</span>
                    <span className="browse-arrow">▶</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default InteractiveLearning;