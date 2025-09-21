import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/BottomNavigation.css';

// Custom SVG Icon Components
const HomeIcon = ({ isActive }: { isActive: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={isActive ? 'var(--primary-color)' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke={isActive ? 'var(--primary-color)' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke={isActive ? 'var(--primary-color)' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HeadphonesIcon = ({ isActive }: { isActive: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18V12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12V18" stroke={isActive ? 'var(--primary-color)' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 19C21 20.1046 20.1046 21 19 21H18C16.8954 21 16 20.1046 16 19V16C16 14.8954 16.8954 14 18 14H21V19Z" stroke={isActive ? 'var(--primary-color)' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 19C3 20.1046 3.89543 21 5 21H6C7.10457 21 8 20.1046 8 19V16C8 14.8954 7.10457 14 6 14H3V19Z" stroke={isActive ? 'var(--primary-color)' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClipboardIcon = ({ isActive }: { isActive: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4H18C19.1046 4 20 4.89543 20 6V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V6C4 4.89543 4.89543 4 6 4H8" stroke={isActive ? 'var(--primary-color)' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke={isActive ? 'var(--primary-color)' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MapIcon = ({ isActive }: { isActive: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 6V22L8 18L16 22L23 18V2L16 6L8 2L1 6Z" stroke={isActive ? 'var(--primary-color)' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 2V18" stroke={isActive ? 'var(--primary-color)' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 6V22" stroke={isActive ? 'var(--primary-color)' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ProfileIcon = ({ isActive }: { isActive: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={isActive ? 'var(--primary-color)' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke={isActive ? 'var(--primary-color)' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'home',
      path: '/dashboard',
      icon: HomeIcon,
      label: 'Home'
    },
    {
      id: 'questions',
      path: '/daily-questions',
      icon: HeadphonesIcon,
      label: 'Daily Questions'
    },
    {
      id: 'learning',
      path: '/video-modules',
      icon: ClipboardIcon,
      label: 'Learning'
    },
    {
      id: 'map',
      path: '/map',
      icon: MapIcon,
      label: 'Map'
    },
    {
      id: 'profile',
      path: '/profile',
      icon: ProfileIcon,
      label: 'Profile'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    // Also highlight Learning tab when on video-modules or interactive-learning pages
    if (path === '/video-modules') {
      return location.pathname === '/video-modules' || 
             location.pathname === '/interactive-learning' ||
             location.pathname.startsWith('/module-quiz');
    }
    return location.pathname === path;
  };

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const itemIsActive = isActive(item.path);
        
        return (
          <button
            key={item.id}
            className={`nav-item ${itemIsActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
          >
            <span className="nav-icon">
              <IconComponent isActive={itemIsActive} />
            </span>
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;