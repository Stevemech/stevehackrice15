import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addXP, getStreak, addLives, removeLives, getLives, XP_REWARDS } from '../utils/xpManager';
import { playCorrectAnswerSound, playIncorrectAnswerSound, initSounds } from '../utils/soundManager';
import BottomNavigation from '../components/BottomNavigation';
import '../styles/DailyQuestions.css';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

const DailyQuestions: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [currentLives, setCurrentLives] = useState(getLives());

  const dailyQuestions: Question[] = [
    {
      id: '1',
      question: 'What is the recommended duration for proper handwashing?',
      options: [
        '5 seconds',
        '10 seconds',
        '20 seconds',
        '30 seconds'
      ],
      correctAnswer: 2,
      explanation: 'The WHO recommends washing hands for at least 20 seconds with soap and water to effectively remove germs.',
      category: 'hygiene',
      difficulty: 'easy',
      points: 10
    },
    {
      id: '2',
      question: 'Which vitamin deficiency causes night blindness?',
      options: [
        'Vitamin A',
        'Vitamin B12',
        'Vitamin C',
        'Vitamin D'
      ],
      correctAnswer: 0,
      explanation: 'Vitamin A deficiency is a leading cause of night blindness, especially in children.',
      category: 'nutrition',
      difficulty: 'medium',
      points: 15
    },
    {
      id: '3',
      question: 'What is the first step in the chain of survival for cardiac arrest?',
      options: [
        'Start CPR',
        'Call for emergency help',
        'Check for breathing',
        'Use an AED'
      ],
      correctAnswer: 1,
      explanation: 'Calling for emergency help immediately ensures professional medical assistance is on the way while you provide initial care.',
      category: 'emergency',
      difficulty: 'hard',
      points: 20
    }
  ];

  const currentQuestion = dailyQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === dailyQuestions.length - 1;

  const handleAnswerSelect = async (answerIndex: number) => {
    if (answeredQuestions.has(currentQuestion.id)) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    // Initialize audio context on first interaction
    await initSounds();
    
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + currentQuestion.points);
      setCorrectAnswers(correctAnswers + 1);
      // Add XP for correct answer
      addXP(XP_REWARDS.DAILY_QUESTION_CORRECT, `Correct answer: ${currentQuestion.question.substring(0, 50)}...`);
      // Add 2 lives for correct answer
      const newLives = addLives(2, 'Correct answer!');
      setCurrentLives(newLives);
      // Play success sound
      playCorrectAnswerSound();
    } else {
      // Remove 1 life for wrong answer
      const newLives = removeLives(1, 'Wrong answer');
      setCurrentLives(newLives);
      // Play error sound
      playIncorrectAnswerSound();
    }
    
    setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion.id]));
  };

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleFinish = () => {
    // Add bonus XP for completing all questions
    if (answeredQuestions.size === dailyQuestions.length) {
      addXP(XP_REWARDS.DAILY_QUESTION_BONUS, 'Completed all daily questions!');
    }
    navigate('/dashboard');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <div className="daily-questions">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ←
        </button>
        <h1>Daily Questions</h1>
        <div className="header-stats">
          <div className="score-display">
            💯 Score: {score}
          </div>
          <div className="lives-display">
            ❤️ Lives: {currentLives}
          </div>
        </div>
      </header>

      <div className="question-progress">
        <div className="progress-info">
          Question {currentQuestionIndex + 1} of {dailyQuestions.length}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestionIndex + 1) / dailyQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="question-card">
        <div className="question-meta">
          <span 
            className="difficulty-badge" 
            style={{ backgroundColor: getDifficultyColor(currentQuestion.difficulty) }}
          >
            {currentQuestion.difficulty.toUpperCase()}
          </span>
          <span className="points-badge">
            {currentQuestion.points} points
          </span>
          <span className="category-badge">
            {currentQuestion.category}
          </span>
        </div>

        <h2 className="question-text">{currentQuestion.question}</h2>

        <div className="options-list">
          {currentQuestion.options.map((option, index) => {
            const isCorrect = index === currentQuestion.correctAnswer;
            const isSelected = index === selectedAnswer;
            const showResult = showExplanation;
            
            return (
              <button
                key={index}
                className={`option-btn ${
                  showResult
                    ? isCorrect
                      ? 'correct'
                      : isSelected
                      ? 'incorrect'
                      : ''
                    : ''
                } ${isSelected && !showResult ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(index)}
                disabled={answeredQuestions.has(currentQuestion.id)}
              >
                <span className="option-label">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
                {showResult && isCorrect && <span className="result-icon">✓</span>}
                {showResult && isSelected && !isCorrect && <span className="result-icon">✗</span>}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="explanation-box">
            <h3>Explanation:</h3>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}

        {showExplanation && (
          <div className="action-buttons">
            {!isLastQuestion ? (
              <button className="next-btn" onClick={handleNextQuestion}>
                Next Question →
              </button>
            ) : (
              <button className="finish-btn" onClick={handleFinish}>
                Finish Quiz
              </button>
            )}
          </div>
        )}
      </div>

      <div className="daily-streak">
        <h3>🔥 Daily Streak: {getStreak()} days</h3>
        <p>Keep answering daily questions to maintain your streak!</p>
        <div className="streak-calendar">
          {[...Array(7)].map((_, i) => (
            <div key={i} className={`day ${i < getStreak() ? 'completed' : ''}`}>
              {i < getStreak() ? '✓' : ''}
            </div>
          ))}
        </div>
        {showExplanation && isLastQuestion && (
          <div className="quiz-summary">
            <h4>Quiz Complete!</h4>
            <p>You got {correctAnswers} out of {dailyQuestions.length} questions correct!</p>
            <p>Total XP earned: {correctAnswers * XP_REWARDS.DAILY_QUESTION_CORRECT + (answeredQuestions.size === dailyQuestions.length ? XP_REWARDS.DAILY_QUESTION_BONUS : 0)} XP</p>
            <p>Lives gained: {correctAnswers * 2} ❤️ | Lives lost: {(dailyQuestions.length - correctAnswers)} 💔</p>
            <p>Current Lives: {currentLives}</p>
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default DailyQuestions;