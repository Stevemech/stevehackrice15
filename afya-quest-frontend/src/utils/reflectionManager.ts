// reflectionManager.ts - Helper functions for managing daily and weekly reflections

export interface DailyReflection {
  id: string;
  date: string;
  question: string;
  answer: string;
}

export interface WeeklyReflection {
  id: string;
  date: string;
  difficultModule: string;
  satisfactionRating: number;
  comments: string;
}

// Daily reflection questions
export const dailyReflectionQuestions = [
  "What was the most rewarding part of your work today?",
  "What challenges did you face in your community visits today?",
  "How did you help improve someone's health today?",
  "What new thing did you learn today?",
  "How did you practice empathy in your interactions today?",
  "What would you do differently today?",
  "How did you make a positive impact in your community today?"
];

// Get today's daily reflection question (rotates based on day of year)
export const getTodaysQuestion = (): string => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return dailyReflectionQuestions[dayOfYear % dailyReflectionQuestions.length];
};

// Check if user has already completed today's daily reflection
export const hasCompletedTodaysReflection = (): boolean => {
  const today = new Date().toDateString();
  const reflections = getDailyReflections();
  return reflections.some(reflection => new Date(reflection.date).toDateString() === today);
};

// Save a daily reflection
export const saveDailyReflection = (question: string, answer: string): DailyReflection => {
  const reflection: DailyReflection = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    question,
    answer
  };

  const reflections = getDailyReflections();
  reflections.unshift(reflection); // Add to beginning of array
  localStorage.setItem('dailyReflections', JSON.stringify(reflections));
  
  return reflection;
};

// Get all daily reflections
export const getDailyReflections = (): DailyReflection[] => {
  const reflections = localStorage.getItem('dailyReflections');
  return reflections ? JSON.parse(reflections) : [];
};

// Delete a daily reflection
export const deleteDailyReflection = (reflectionId: string): void => {
  const reflections = getDailyReflections();
  const filteredReflections = reflections.filter(r => r.id !== reflectionId);
  localStorage.setItem('dailyReflections', JSON.stringify(filteredReflections));
};

// Check if user has completed this week's weekly reflection
export const hasCompletedThisWeeksReflection = (): boolean => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);
  
  const reflections = getWeeklyReflections();
  return reflections.some(reflection => {
    const reflectionDate = new Date(reflection.date);
    return reflectionDate >= startOfWeek;
  });
};

// Save a weekly reflection
export const saveWeeklyReflection = (difficultModule: string, satisfactionRating: number, comments: string): WeeklyReflection => {
  const reflection: WeeklyReflection = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    difficultModule,
    satisfactionRating,
    comments
  };

  const reflections = getWeeklyReflections();
  reflections.unshift(reflection); // Add to beginning of array
  localStorage.setItem('weeklyReflections', JSON.stringify(reflections));
  
  return reflection;
};

// Get all weekly reflections
export const getWeeklyReflections = (): WeeklyReflection[] => {
  const reflections = localStorage.getItem('weeklyReflections');
  return reflections ? JSON.parse(reflections) : [];
};

// Delete a weekly reflection
export const deleteWeeklyReflection = (reflectionId: string): void => {
  const reflections = getWeeklyReflections();
  const filteredReflections = reflections.filter(r => r.id !== reflectionId);
  localStorage.setItem('weeklyReflections', JSON.stringify(filteredReflections));
};

// Available modules for the weekly reflection dropdown
export const availableModules = [
  'Child Health & Nutrition',
  'Maternal Health',
  'Immunization',
  'Disease Prevention',
  'Health Education',
  'Emergency Care',
  'Mental Health',
  'Hygiene & Sanitation'
];