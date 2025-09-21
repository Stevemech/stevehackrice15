import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';

const ChatbotWrapper: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check authentication status and allowed routes
    const checkAuth = () => {
      const authToken = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      const isLoggedIn = !!(authToken && user);
      
      // Define allowed routes where chatbot should appear
      const allowedRoutes = [
        '/video-modules',
        '/interactive-learning',
        '/module-quiz' // This will match /module-quiz/:moduleId
      ];
      
      // Check if current path is allowed
      const isAllowedRoute = allowedRoutes.some(route => 
        location.pathname.startsWith(route)
      );
      
      const authenticated = isLoggedIn && isAllowedRoute;
      setIsAuthenticated(authenticated);
    };

    // Initial check
    checkAuth();

    // Listen for storage changes (login/logout)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (for same-tab changes)
    window.addEventListener('authChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChanged', handleStorageChange);
    };
  }, [location.pathname]);

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Don't render anything if not authenticated or not on allowed route
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <ChatButton 
        isOpen={isChatOpen} 
        onClick={handleChatToggle} 
      />
      <ChatWindow 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
};

export default ChatbotWrapper;
