import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addXP, XP_REWARDS } from '../utils/xpManager';
import '../styles/ModuleQuiz.css';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface ModuleQuizData {
  moduleId: string;
  moduleTitle: string;
  passingScore: number;
  questions: QuizQuestion[];
}

// Quiz data for different modules
const quizData: { [key: string]: ModuleQuizData } = {
  '1': {
    moduleId: '1',
    moduleTitle: 'Health Assessments',
    passingScore: 70,
    questions: [
      {
        id: 'ha1',
        question: 'What is the first step in conducting a health assessment according to the Medical Detective\'s Handbook?',
        options: [
          'Immediately start physical examination',
          'Establish rapport and obtain consent',
          'Document findings',
          'Check vital signs'
        ],
        correctAnswer: 1,
        explanation: 'Establishing rapport and obtaining consent is crucial for building trust and ensuring ethical practice before any assessment begins.',
        category: 'assessment-basics',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'ha2',
        question: 'When taking a patient history, which of the following should be documented first?',
        options: [
          'Family medical history',
          'Current medications',
          'Chief complaint or reason for visit',
          'Allergies'
        ],
        correctAnswer: 2,
        explanation: 'The chief complaint helps focus the assessment and determines the direction of further questioning.',
        category: 'patient-history',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'ha3',
        question: 'What does the acronym SAMPLE stand for in patient assessment?',
        options: [
          'Signs, Allergies, Medications, Past history, Last meal, Events',
          'Symptoms, Age, Medical conditions, Prescription, Location, Emergency',
          'Signs, Assessment, Medicine, Patient data, Location, Examination',
          'Symptoms, Allergies, Medical history, Pain level, Labs, Events'
        ],
        correctAnswer: 0,
        explanation: 'SAMPLE is a mnemonic for Signs/Symptoms, Allergies, Medications, Past medical history, Last oral intake, and Events leading to the illness/injury.',
        category: 'assessment-tools',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'ha4',
        question: 'What is the normal range for adult resting heart rate?',
        options: [
          '40-60 beats per minute',
          '60-100 beats per minute',
          '80-120 beats per minute',
          '100-140 beats per minute'
        ],
        correctAnswer: 1,
        explanation: 'A normal resting heart rate for adults ranges from 60 to 100 beats per minute.',
        category: 'vital-signs',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'ha5',
        question: 'Which vital sign is often called the "fifth vital sign"?',
        options: [
          'Oxygen saturation',
          'Blood glucose',
          'Pain level',
          'Mental status'
        ],
        correctAnswer: 2,
        explanation: 'Pain is considered the fifth vital sign as it provides important information about a patient\'s condition and quality of life.',
        category: 'vital-signs',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'ha6',
        question: 'What is the correct order for conducting a physical examination?',
        options: [
          'Inspection, Palpation, Percussion, Auscultation',
          'Auscultation, Inspection, Palpation, Percussion',
          'Palpation, Inspection, Auscultation, Percussion',
          'Percussion, Palpation, Inspection, Auscultation'
        ],
        correctAnswer: 0,
        explanation: 'The correct order is Inspection, Palpation, Percussion, Auscultation (except for abdominal exam where auscultation comes before palpation).',
        category: 'physical-exam',
        difficulty: 'hard',
        points: 20
      },
      {
        id: 'ha7',
        question: 'When assessing a patient\'s mental status, what does the acronym AVPU stand for?',
        options: [
          'Alert, Verbal, Pain, Unresponsive',
          'Awake, Voice, Pressure, Unconscious',
          'Alert, Voice, Physical, Unable',
          'Active, Verbal, Passive, Unaware'
        ],
        correctAnswer: 0,
        explanation: 'AVPU is a scale for assessing consciousness: Alert, responsive to Verbal stimuli, responsive to Pain, or Unresponsive.',
        category: 'mental-status',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'ha8',
        question: 'Which of the following is a red flag symptom requiring immediate medical attention?',
        options: [
          'Mild headache for 2 days',
          'Chest pain with shortness of breath',
          'Occasional knee pain when walking',
          'Slight fever without other symptoms'
        ],
        correctAnswer: 1,
        explanation: 'Chest pain with shortness of breath could indicate a serious cardiac or pulmonary condition requiring immediate medical attention.',
        category: 'emergency-signs',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'ha9',
        question: 'What is the primary purpose of using the body mass index (BMI) in health assessment?',
        options: [
          'To determine exact body fat percentage',
          'To screen for weight categories that may lead to health problems',
          'To calculate caloric needs',
          'To measure muscle mass'
        ],
        correctAnswer: 1,
        explanation: 'BMI is a screening tool to identify possible weight-related health problems, though it doesn\'t directly measure body fat.',
        category: 'assessment-tools',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'ha10',
        question: 'When documenting findings in a health assessment, what does SOAP stand for?',
        options: [
          'Symptoms, Observation, Assessment, Plan',
          'Subjective, Objective, Assessment, Plan',
          'Signs, Observation, Analysis, Prescription',
          'Subjective, Observation, Action, Progress'
        ],
        correctAnswer: 1,
        explanation: 'SOAP notes organize documentation into Subjective data (patient reports), Objective data (measurable findings), Assessment, and Plan.',
        category: 'documentation',
        difficulty: 'medium',
        points: 15
      }
    ]
  },
  '5': {
    moduleId: '5',
    moduleTitle: 'Emergency First Aid',
    passingScore: 70,
    questions: [
      {
        id: 'efa1',
        question: 'What is the first step you should take when arriving at an emergency scene?',
        options: [
          'Start CPR immediately',
          'Check for breathing',
          'Ensure the scene is safe',
          'Call for an ambulance'
        ],
        correctAnswer: 2,
        explanation: 'Always ensure the scene is safe for you and the victim before providing any aid. Your safety is paramount to being able to help others.',
        category: 'emergency-response',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'efa2',
        question: 'What is the correct compression-to-breath ratio for adult CPR?',
        options: [
          '15:2',
          '30:2',
          '5:1',
          '30:1'
        ],
        correctAnswer: 1,
        explanation: 'For adult CPR, the recommended ratio is 30 chest compressions to 2 rescue breaths.',
        category: 'cpr-basics',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'efa3',
        question: 'How deep should chest compressions be for an adult during CPR?',
        options: [
          'At least 1 inch',
          'At least 2 inches',
          'At least 3 inches',
          'At least 4 inches'
        ],
        correctAnswer: 1,
        explanation: 'Chest compressions for adults should be at least 2 inches (5 cm) deep but no more than 2.4 inches (6 cm).',
        category: 'cpr-technique',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'efa4',
        question: 'What is the universal sign for choking?',
        options: [
          'Waving arms frantically',
          'Hands clutched to the throat',
          'Pointing to the mouth',
          'Coughing loudly'
        ],
        correctAnswer: 1,
        explanation: 'The universal sign for choking is hands clutched to the throat. A person who is truly choking cannot speak, cough, or breathe.',
        category: 'choking-emergency',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'efa5',
        question: 'For a conscious choking adult, what technique should you use?',
        options: [
          'Back blows only',
          'Chest compressions',
          'Heimlich maneuver (abdominal thrusts)',
          'Finger sweep'
        ],
        correctAnswer: 2,
        explanation: 'The Heimlich maneuver (abdominal thrusts) is the recommended technique for conscious choking adults. Stand behind the person and perform quick upward thrusts.',
        category: 'choking-emergency',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'efa6',
        question: 'How should you treat a severe bleeding wound?',
        options: [
          'Apply direct pressure with a clean cloth',
          'Apply a tourniquet immediately',
          'Wash the wound first with water',
          'Apply ice directly to the wound'
        ],
        correctAnswer: 0,
        explanation: 'Apply direct pressure with a clean cloth or bandage. Maintain pressure continuously until bleeding stops or help arrives.',
        category: 'wound-care',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'efa7',
        question: 'What are the signs of shock?',
        options: [
          'High blood pressure and slow pulse',
          'Hot, dry skin and confusion',
          'Pale, cool, clammy skin and rapid pulse',
          'Red face and loud breathing'
        ],
        correctAnswer: 2,
        explanation: 'Signs of shock include pale, cool, clammy skin, rapid pulse, rapid breathing, weakness, and anxiety. The body is not getting enough blood flow.',
        category: 'shock-treatment',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'efa8',
        question: 'How should you treat a burn injury initially?',
        options: [
          'Apply butter or oil to the burn',
          'Cool the burn with running water for 10-20 minutes',
          'Break any blisters that form',
          'Apply ice directly to the burn'
        ],
        correctAnswer: 1,
        explanation: 'Cool the burn with cool (not ice-cold) running water for 10-20 minutes. This helps reduce pain, swelling, and the risk of scarring.',
        category: 'burn-treatment',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'efa9',
        question: 'What position should an unconscious but breathing person be placed in?',
        options: [
          'Flat on their back',
          'Sitting upright',
          'Recovery position (on their side)',
          'Face down'
        ],
        correctAnswer: 2,
        explanation: 'The recovery position (on their side) helps keep the airway clear and prevents choking if the person vomits.',
        category: 'positioning',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'efa10',
        question: 'What does the acronym FAST stand for in stroke recognition?',
        options: [
          'Face, Arms, Speech, Time',
          'Fast, Alert, Stable, Treatment',
          'First, Aid, Support, Transport',
          'Face, Airway, Swallow, Temperature'
        ],
        correctAnswer: 0,
        explanation: 'FAST stands for Face drooping, Arm weakness, Speech difficulty, and Time to call emergency services. These are key signs of stroke.',
        category: 'stroke-recognition',
        difficulty: 'hard',
        points: 20
      },
      {
        id: 'efa11',
        question: 'How long should you check for breathing before starting CPR on an unconscious person?',
        options: [
          'No more than 10 seconds',
          'At least 30 seconds',
          'Exactly 1 minute',
          'Until help arrives'
        ],
        correctAnswer: 0,
        explanation: 'Check for breathing for no more than 10 seconds. If there is no breathing or only gasping, begin CPR immediately.',
        category: 'cpr-basics',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'efa12',
        question: 'What should you do if someone is having a seizure?',
        options: [
          'Hold them down to stop the movement',
          'Put something in their mouth to prevent tongue biting',
          'Clear the area and protect their head',
          'Give them water immediately'
        ],
        correctAnswer: 2,
        explanation: 'Clear the area of dangerous objects and protect their head with something soft. Never restrain them or put anything in their mouth.',
        category: 'seizure-care',
        difficulty: 'hard',
        points: 20
      }
    ]
  }
};

const ModuleQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams<{ moduleId: string }>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const quiz = quizData[moduleId || '1'];
  
  if (!quiz) {
    return (
      <div className="module-quiz">
        <div className="error-message">
          <h2>Quiz not found</h2>
          <button onClick={() => navigate('/video-modules')}>Back to Modules</button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const percentageScore = Math.round((score / quiz.questions.reduce((sum, q) => sum + q.points, 0)) * 100);
  const passed = percentageScore >= quiz.passingScore;

  const handleAnswerSelect = (answerIndex: number) => {
    if (answeredQuestions.has(currentQuestion.id)) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + currentQuestion.points);
      setCorrectAnswers(correctAnswers + 1);
      // Add XP for correct answer
      addXP(XP_REWARDS.DAILY_QUESTION_CORRECT, `Correct answer in ${quiz.moduleTitle} quiz`);
    }
    
    setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion.id]));
  };

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
    
    // Add completion XP
    if (passed) {
      addXP(50, `Passed ${quiz.moduleTitle} quiz with ${percentageScore}%`);
      
      // Save quiz completion to localStorage
      const completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '{}');
      completedQuizzes[moduleId || '1'] = {
        completed: true,
        score: percentageScore,
        date: new Date().toISOString()
      };
      localStorage.setItem('completedQuizzes', JSON.stringify(completedQuizzes));
    } else {
      addXP(10, `Attempted ${quiz.moduleTitle} quiz`);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions(new Set());
    setCorrectAnswers(0);
    setQuizCompleted(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#757575';
    }
  };

  if (quizCompleted) {
    return (
      <div className="module-quiz">
        <div className="quiz-completed">
          <h1>{passed ? '🎉 Congratulations!' : '📚 Keep Learning!'}</h1>
          <h2>Quiz Completed</h2>
          
          <div className="final-score">
            <div className={`score-circle ${passed ? 'passed' : 'failed'}`}>
              <span className="score-percentage">{percentageScore}%</span>
            </div>
          </div>

          <div className="quiz-stats">
            <div className="stat">
              <span className="stat-label">Questions Correct</span>
              <span className="stat-value">{correctAnswers}/{quiz.questions.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Points</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Status</span>
              <span className={`stat-value ${passed ? 'passed' : 'failed'}`}>
                {passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>
          </div>

          <div className="completion-message">
            {passed 
              ? `Great job! You've successfully passed the ${quiz.moduleTitle} quiz. Your knowledge is growing!`
              : `You need ${quiz.passingScore}% to pass. Review the material and try again!`
            }
          </div>

          <div className="action-buttons">
            {!passed && (
              <button className="retake-btn" onClick={handleRetakeQuiz}>
                Retake Quiz
              </button>
            )}
            <button className="back-btn" onClick={() => navigate('/video-modules')}>
              Back to Modules
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="module-quiz">
      <header className="quiz-header">
        <button className="back-btn" onClick={() => navigate('/video-modules')}>
          ←
        </button>
        <h1>{quiz.moduleTitle} Quiz</h1>
        <div className="header-stats">
          <span className="score-display">Score: {score}</span>
        </div>
      </header>

      <div className="quiz-progress">
        <div className="progress-info">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
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
            {currentQuestion.category.replace('-', ' ')}
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
            <h3>Explanation</h3>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}

        {showExplanation && (
          <div className="button-container">
            <button className="next-btn" onClick={handleNextQuestion}>
              {isLastQuestion ? 'Finish Quiz' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleQuiz;