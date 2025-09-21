// XP Manager - Centralized XP management system

interface XPTransaction {
  amount: number;
  reason: string;
  timestamp: string;
  type: 'earn' | 'spend';
}

interface XPData {
  totalXP: number;
  dailyXP: number;
  weeklyXP: number;
  transactions: XPTransaction[];
  lastResetDate: string;
  streak: number;
  level: number;
  lives: number;
}

const XP_STORAGE_KEY = 'userXPData';

// XP reward amounts
export const XP_REWARDS = {
  CHECK_IN: 50,
  COMPLETE_VISIT: 100,
  DAILY_QUESTION_CORRECT: 30,
  DAILY_QUESTION_BONUS: 50, // For completing all daily questions
  DAILY_REPORT: 50,
  STREAK_BONUS: 25, // Per day of streak
  VIDEO_WATCHED: 20,
  MODULE_COMPLETED: 75
};

// Get current XP data from localStorage
export const getXPData = (): XPData => {
  const stored = localStorage.getItem(XP_STORAGE_KEY);
  if (stored) {
    const data = JSON.parse(stored) as XPData;
    
    // Initialize lives if not present or if it's undefined/null
    if (data.lives === undefined || data.lives === null || isNaN(data.lives)) {
      data.lives = 10;
    }
    
    // Remove maxLives if it exists from old data
    if ('maxLives' in data) {
      delete (data as any).maxLives;
    }
    
    // Check if we need to reset daily XP
    const today = new Date().toDateString();
    if (data.lastResetDate !== today) {
      data.dailyXP = 0;
      data.lastResetDate = today;
      saveXPData(data);
    }
    return data;
  }
  
  // Initialize with default data
  const defaultData: XPData = {
    totalXP: 1432, // Starting XP as shown in dashboard
    dailyXP: 0,
    weeklyXP: 0,
    transactions: [],
    lastResetDate: new Date().toDateString(),
    streak: 3, // Starting streak as shown in dashboard
    level: 5,
    lives: 10 // Starting lives - no max limit
  };
  
  saveXPData(defaultData);
  return defaultData;
};

// Save XP data to localStorage
const saveXPData = (data: XPData): void => {
  localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(data));
  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent('xpUpdated', { detail: data }));
};

// Add XP points
export const addXP = (amount: number, reason: string): XPData => {
  const data = getXPData();
  
  data.totalXP += amount;
  data.dailyXP += amount;
  data.weeklyXP += amount;
  
  // Add transaction record
  data.transactions.push({
    amount,
    reason,
    timestamp: new Date().toISOString(),
    type: 'earn'
  });
  
  // Keep only last 50 transactions
  if (data.transactions.length > 50) {
    data.transactions = data.transactions.slice(-50);
  }
  
  // Update level (every 500 XP = 1 level)
  data.level = Math.floor(data.totalXP / 500) + 1;
  
  saveXPData(data);
  
  // Show notification
  showXPNotification(amount, reason);
  
  return data;
};

// Spend XP points (for future features)
export const spendXP = (amount: number, reason: string): boolean => {
  const data = getXPData();
  
  if (data.totalXP < amount) {
    return false; // Not enough XP
  }
  
  data.totalXP -= amount;
  
  // Add transaction record
  data.transactions.push({
    amount,
    reason,
    timestamp: new Date().toISOString(),
    type: 'spend'
  });
  
  saveXPData(data);
  return true;
};

// Update streak
export const updateStreak = (increment: boolean = true): number => {
  const data = getXPData();
  
  if (increment) {
    data.streak += 1;
    // Add streak bonus XP
    addXP(XP_REWARDS.STREAK_BONUS * data.streak, `${data.streak} day streak bonus!`);
  } else {
    data.streak = 0;
  }
  
  saveXPData(data);
  return data.streak;
};

// Get current streak
export const getStreak = (): number => {
  const data = getXPData();
  return data.streak;
};

// Get total XP
export const getTotalXP = (): number => {
  const data = getXPData();
  return data.totalXP;
};

// Get daily XP
export const getDailyXP = (): number => {
  const data = getXPData();
  return data.dailyXP;
};

// Get user level
export const getLevel = (): number => {
  const data = getXPData();
  return data.level;
};

// Show XP notification (visual feedback)
const showXPNotification = (amount: number, reason: string) => {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'xp-notification';
  notification.innerHTML = `
    <div class="xp-notification-content">
      <span class="xp-amount">+${amount} XP</span>
      <span class="xp-reason">${reason}</span>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  const content = notification.querySelector('.xp-notification-content') as HTMLElement;
  if (content) {
    content.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
    `;
  }
  
  const amountEl = notification.querySelector('.xp-amount') as HTMLElement;
  if (amountEl) {
    amountEl.style.cssText = `
      font-size: 18px;
      font-weight: bold;
    `;
  }
  
  const reasonEl = notification.querySelector('.xp-reason') as HTMLElement;
  if (reasonEl) {
    reasonEl.style.cssText = `
      font-size: 14px;
      opacity: 0.95;
    `;
  }
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Add to document
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
};

// Reset daily XP (called at midnight or on app load)
export const resetDailyXP = (): void => {
  const data = getXPData();
  data.dailyXP = 0;
  data.lastResetDate = new Date().toDateString();
  saveXPData(data);
};

// Get XP needed for next level
export const getXPForNextLevel = (): number => {
  const data = getXPData();
  const currentLevelXP = (data.level - 1) * 500;
  const nextLevelXP = data.level * 500;
  return nextLevelXP - data.totalXP;
};

// Get level progress percentage
export const getLevelProgress = (): number => {
  const data = getXPData();
  const currentLevelXP = (data.level - 1) * 500;
  const nextLevelXP = data.level * 500;
  const progressXP = data.totalXP - currentLevelXP;
  const neededXP = nextLevelXP - currentLevelXP;
  return (progressXP / neededXP) * 100;
};

// Lives/Hearts Management

// Get current lives
export const getLives = (): number => {
  const data = getXPData();
  // Ensure lives is at least 0 and defaults to 10 if undefined
  return data.lives !== undefined && data.lives !== null ? data.lives : 10;
};

// Add lives
export const addLives = (amount: number, reason: string = 'Earned lives'): number => {
  const data = getXPData();
  data.lives = data.lives + amount; // No upper limit
  saveXPData(data);
  
  // Show notification
  showLivesNotification(amount, reason, 'gain');
  
  return data.lives;
};

// Remove lives
export const removeLives = (amount: number, reason: string = 'Lost lives'): number => {
  const data = getXPData();
  data.lives = Math.max(data.lives - amount, 0);
  saveXPData(data);
  
  // Show notification
  showLivesNotification(amount, reason, 'lose');
  
  // Check if game over
  if (data.lives === 0) {
    showGameOverNotification();
  }
  
  return data.lives;
};

// Reset lives to starting value
export const resetLives = (): void => {
  const data = getXPData();
  data.lives = 10; // Reset to starting value
  saveXPData(data);
};

// Initialize lives if they're at 0 or undefined
export const initializeLivesIfNeeded = (): void => {
  const data = getXPData();
  if (!data.lives || data.lives === 0) {
    data.lives = 10;
    saveXPData(data);
  }
};

// Show lives notification
const showLivesNotification = (amount: number, reason: string, type: 'gain' | 'lose') => {
  const notification = document.createElement('div');
  notification.className = 'lives-notification';
  
  const symbol = type === 'gain' ? '+' : '-';
  const hearts = type === 'gain' ? '❤️'.repeat(amount) : '💔'.repeat(amount);
  
  notification.innerHTML = `
    <div class="lives-notification-content">
      <span class="lives-amount">${symbol}${amount} ${hearts}</span>
      <span class="lives-reason">${reason}</span>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: ${type === 'gain' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  const content = notification.querySelector('.lives-notification-content') as HTMLElement;
  if (content) {
    content.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
    `;
  }
  
  const amountEl = notification.querySelector('.lives-amount') as HTMLElement;
  if (amountEl) {
    amountEl.style.cssText = `
      font-size: 18px;
      font-weight: bold;
    `;
  }
  
  const reasonEl = notification.querySelector('.lives-reason') as HTMLElement;
  if (reasonEl) {
    reasonEl.style.cssText = `
      font-size: 14px;
      opacity: 0.95;
    `;
  }
  
  // Add to document
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
};

// Show game over notification
const showGameOverNotification = () => {
  const notification = document.createElement('div');
  notification.className = 'game-over-notification';
  
  notification.innerHTML = `
    <div class="game-over-content">
      <h2>💔 No Lives Left!</h2>
      <p>Answer more questions correctly to earn lives back!</p>
      <p style="font-size: 0.9em; margin-top: 10px; opacity: 0.9;">+2 ❤️ for each correct answer</p>
    </div>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
    color: white;
    padding: 30px 40px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    z-index: 10001;
    animation: bounceIn 0.5s ease-out;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    text-align: center;
  `;
  
  // Add animation
  const style = document.createElement('style');
  if (!document.head.querySelector('style[data-lives-animations]')) {
    style.setAttribute('data-lives-animations', 'true');
    style.textContent = `
      @keyframes bounceIn {
        0% {
          transform: translate(-50%, -50%) scale(0.3);
          opacity: 0;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.05);
        }
        70% {
          transform: translate(-50%, -50%) scale(0.9);
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add to document
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.5s ease-out';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, 5000);
};
