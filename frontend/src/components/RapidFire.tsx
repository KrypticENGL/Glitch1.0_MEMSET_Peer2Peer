import React, { useState, useEffect, useRef } from 'react';
import type { FlashcardData } from '../types/flashcard';
import './RapidFire.css';

interface RapidFireProps {
  flashcards: FlashcardData[];
  onClose: () => void;
}

interface QuizResult {
  correct: number;
  total: number;
  timeSpent: number;
  accuracy: number;
}

const RapidFire: React.FC<RapidFireProps> = ({ flashcards, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [result, setResult] = useState<QuizResult | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Shuffle flashcards for random order
  const shuffledFlashcards = React.useMemo(() => {
    return [...flashcards].sort(() => Math.random() - 0.5);
  }, [flashcards]);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, gameState]);

  // Focus input when component mounts or question changes
  useEffect(() => {
    if (inputRef.current && gameState === 'playing') {
      inputRef.current.focus();
    }
  }, [currentIndex, gameState]);

  const handleTimeUp = () => {
    if (gameState === 'playing') {
      setShowAnswer(true);
      setIsCorrect(false);
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer.trim() === '') return;

    const correctAnswer = shuffledFlashcards[currentIndex].back.toLowerCase().trim();
    const userAnswerLower = userAnswer.toLowerCase().trim();
    
    // Check if answer is correct (exact match or contains the answer)
    const isAnswerCorrect = correctAnswer === userAnswerLower || 
                           correctAnswer.includes(userAnswerLower) ||
                           userAnswerLower.includes(correctAnswer);

    setShowAnswer(true);
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setScore(score + 1);
    }

    // Auto-advance after 2 seconds
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= shuffledFlashcards.length) {
      // Game finished
      const totalTime = Math.round((Date.now() - startTime) / 1000);
      const accuracy = Math.round((score / shuffledFlashcards.length) * 100);
      
      setResult({
        correct: score,
        total: shuffledFlashcards.length,
        timeSpent: totalTime,
        accuracy: accuracy
      });
      setGameState('finished');
    } else {
      // Next question
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setShowAnswer(false);
      setIsCorrect(null);
      setTimeLeft(30);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setUserAnswer('');
    setShowAnswer(false);
    setIsCorrect(null);
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
    setResult(null);
    setStartTime(Date.now());
  };

  if (flashcards.length === 0) {
    return (
      <div className="rapid-fire-overlay">
        <div className="rapid-fire-container">
          <div className="no-cards-message">
            <h2>No Flashcards Available</h2>
            <p>Create some flashcards first to start a rapid fire round!</p>
            <button onClick={onClose} className="close-btn">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished' && result) {
    return (
      <div className="rapid-fire-overlay">
        <div className="rapid-fire-container">
          <div className="results-screen">
            <h2>Rapid Fire Complete!</h2>
            <div className="results-stats">
              <div className="stat">
                <span className="stat-label">Score</span>
                <span className="stat-value">{result.correct}/{result.total}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Accuracy</span>
                <span className="stat-value">{result.accuracy}%</span>
              </div>
              <div className="stat">
                <span className="stat-label">Time</span>
                <span className="stat-value">{result.timeSpent}s</span>
              </div>
            </div>
            <div className="results-actions">
              <button onClick={resetGame} className="play-again-btn">
                Play Again
              </button>
              <button onClick={onClose} className="close-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = shuffledFlashcards[currentIndex];

  return (
    <div className="rapid-fire-overlay">
      <div className="rapid-fire-container">
        <div className="rapid-fire-header">
          <div className="progress-info">
            <span className="question-counter">
              Question {currentIndex + 1} of {shuffledFlashcards.length}
            </span>
            <span className="score">Score: {score}</span>
          </div>
          <div className="timer-container">
            <div className="timer" style={{ 
              '--time-left': timeLeft,
              '--max-time': 30 
            } as React.CSSProperties}>
              {timeLeft}s
            </div>
          </div>
        </div>

        <div className="question-container">
          <div className="question-card">
            <h3 className="question-text">{currentCard.front}</h3>
          </div>

          <form onSubmit={handleSubmit} className="answer-form">
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="answer-input"
              disabled={showAnswer}
              autoComplete="off"
            />
            <button 
              type="submit" 
              className="submit-btn"
              disabled={showAnswer || userAnswer.trim() === ''}
            >
              Submit
            </button>
          </form>

          {showAnswer && (
            <div className={`answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="feedback-content">
                <div className="feedback-icon">
                  {isCorrect ? '✓' : '✗'}
                </div>
                <div className="feedback-text">
                  <p className="correct-answer">
                    Correct answer: <strong>{currentCard.back}</strong>
                  </p>
                  {isCorrect ? (
                    <p className="feedback-message">Great job!</p>
                  ) : (
                    <p className="feedback-message">Keep practicing!</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rapid-fire-actions">
          <button onClick={onClose} className="quit-btn">
            Quit Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default RapidFire;
