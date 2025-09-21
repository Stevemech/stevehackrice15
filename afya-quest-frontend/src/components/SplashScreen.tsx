import React, { useEffect, useState, useRef } from 'react';
import '../styles/SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [showSoundButton, setShowSoundButton] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const attemptedAutoplay = useRef(false);

  // Create and play a pleasant chime sound using Web Audio API
  const playWelcomeSound = async (): Promise<boolean> => {
    if (audioPlayed) return true;
    
    try {
      // Create audio context
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      
      // Try to resume if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      // Check if we can actually play
      if (audioContext.state !== 'running') {
        throw new Error('Audio context not running');
      }
      
      const now = audioContext.currentTime;
      
      // Create a pleasant welcome sound with multiple notes
      const notes = [
        { freq: 523.25, time: 0, volume: 0.15 },      // C5
        { freq: 659.25, time: 0.15, volume: 0.12 },   // E5
        { freq: 783.99, time: 0.3, volume: 0.10 },    // G5
        { freq: 1046.50, time: 0.45, volume: 0.08 },  // C6
      ];
      
      notes.forEach(({ freq, time, volume }) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, now + time);
        
        // Soft, pleasant envelope
        gainNode.gain.setValueAtTime(0, now + time);
        gainNode.gain.linearRampToValueAtTime(volume, now + time + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + time + 0.8);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start(now + time);
        oscillator.stop(now + time + 0.8);
      });
      
      // Add a soft background pad
      const padOsc = audioContext.createOscillator();
      const padGain = audioContext.createGain();
      
      padOsc.type = 'sine';
      padOsc.frequency.setValueAtTime(261.63, now); // C4
      
      padGain.gain.setValueAtTime(0, now);
      padGain.gain.linearRampToValueAtTime(0.03, now + 0.1);
      padGain.gain.linearRampToValueAtTime(0.03, now + 0.7);
      padGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      
      padOsc.connect(padGain);
      padGain.connect(audioContext.destination);
      padOsc.start(now);
      padOsc.stop(now + 1.2);
      
      console.log('✅ Welcome sound playing automatically');
      setAudioPlayed(true);
      setShowSoundButton(false);
      return true;
    } catch (error) {
      console.log('⚠️ Autoplay blocked, showing sound button');
      return false;
    }
  };

  // Handle sound button click
  const handleSoundButtonClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await playWelcomeSound();
    if (success) {
      setShowSoundButton(false);
    }
  };

  // Try to play automatically on any interaction
  const handleInteraction = () => {
    if (!audioPlayed) {
      playWelcomeSound();
    }
  };

  useEffect(() => {
    // Attempt autoplay after a small delay to ensure component is mounted
    if (!attemptedAutoplay.current) {
      attemptedAutoplay.current = true;
      
      // Try to play sound automatically
      setTimeout(async () => {
        const success = await playWelcomeSound();
        if (!success) {
          // Only show button if autoplay failed
          setShowSoundButton(true);
        }
      }, 100);
    }

    // Start fade out after 4 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);

      // Complete transition after fade animation
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 4000);

    return () => {
      clearTimeout(timer);
      // Clean up audio context if needed
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        audioContextRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onComplete]);

  return (
    <div 
      className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}
      onClick={handleInteraction}
      onMouseMove={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {/* Sound button - only shows if autoplay was blocked */}
      {showSoundButton && !audioPlayed && (
        <button 
          className="sound-button subtle"
          onClick={handleSoundButtonClick}
          aria-label="Enable sound"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 22 12C22 14.6516 20.9447 17.1947 19.07 19.07M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17 12C17 13.3308 16.4774 14.6024 15.54 15.54" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>🔊</span>
        </button>
      )}
      
      <div className="splash-content">
        <div className="logo-container">
          <div className="pulse-ring"></div>
          <div className="pulse-ring delay-1"></div>
          <div className="pulse-ring delay-2"></div>
          
          <div className="logo">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Heart/Health Symbol */}
              <path 
                d="M60 100C60 100 20 70 20 45C20 32 28 20 40 20C48 20 55 24 60 30C65 24 72 20 80 20C92 20 100 32 100 45C100 70 60 100 60 100Z" 
                fill="#FF6B6B"
                className="heartbeat"
              />
              {/* Plus Symbol */}
              <rect x="52" y="40" width="16" height="40" rx="2" fill="white"/>
              <rect x="40" y="52" width="40" height="16" rx="2" fill="white"/>
            </svg>
          </div>
        </div>

        <div className="text-container">
          <h1 className="app-title slide-up">
            <span className="text-gradient">Afya Quest</span>
          </h1>
          <p className="app-tagline slide-up-delay">
            Empowering Community Health Assistants
          </p>
          <p className="app-subtitle slide-up-delay-2">
            Learn • Grow • Save Lives
          </p>
        </div>

        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>

      <div className="splash-footer">
        <p className="copyright">© 2025 Afya Quest. Making healthcare education accessible.</p>
      </div>
    </div>
  );
};

export default SplashScreen;