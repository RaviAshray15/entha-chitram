import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import movieData from '../data/movies.json';
import { distance } from 'fastest-levenshtein';
import confetti from 'canvas-confetti';

function Play() {
  const goBack = () => navigate(-1);
  const goHome = () => navigate('/');
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDate = location.state?.date || new Date();
  const formattedDate = new Date(selectedDate).toDateString();
  const isHardDay = new Date(selectedDate).getDay() === 0;

  const [hintsShown, setHintsShown] = useState(1);
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);

  const dateKey = new Date(selectedDate).toLocaleDateString('en-CA');
  const movieForDay = movieData[dateKey];
  const allDates = Object.keys(movieData).sort();
  const currentIndex = allDates.indexOf(dateKey);
  const prevDate = allDates[currentIndex - 1];
  const nextDate = allDates[currentIndex + 1];
  const [feedback, setFeedback] = useState('');

  const winSound = new Audio('/sounds/win.mp3');
  const loseSound = new Audio('/sounds/lose.mp3');

  const correctAnswer = movieForDay?.answer;
  const hints = movieForDay?.hints || [];

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow - now;

      const hours = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, '0');
      const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowDetails(false);
        setShowStreakModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    // Set streak info if not already set
    if (localStorage.getItem('streak') === null) {
      localStorage.setItem('streak', '0');
      localStorage.setItem('guessed', '0');
      localStorage.setItem('played', '0');
    }
  }, []);

  const updateStreak = (won) => {
    const lastPlayed = localStorage.getItem('lastPlayed');
    const today = new Date().toLocaleDateString('en-CA');
    const playedSet = new Set(Object.keys(localStorage).filter(k => k.startsWith('result-')));

    if (lastPlayed !== today) {
      localStorage.setItem('lastPlayed', today);
      localStorage.setItem('played', (+localStorage.getItem('played') + 1).toString());

      if (won) {
        localStorage.setItem('guessed', (+localStorage.getItem('guessed') + 1).toString());
        localStorage.setItem('streak', (+localStorage.getItem('streak') + 1).toString());
      } else {
        localStorage.setItem('streak', '0');
      }
    }
  };

  const handleSubmit = () => {
    const cleanGuess = guess.trim().toLowerCase();
    const cleanAnswer = correctAnswer.trim().toLowerCase();
    const isCloseEnough = distance(cleanGuess, cleanAnswer) <= 3;

    if (isCloseEnough) {
      winSound.play();
      confetti();
      setResult('correct');
      setShowWinModal(true);
      localStorage.setItem(`result-${dateKey}`, 'correct');
      updateStreak(true);
    } else if (hintsShown < hints.length) {
      setFeedback('Wrong guess!');
      setHintsShown(hintsShown + 1);
      setGuess('');
    } else {
      loseSound.play();
      setResult('wrong');
      setShowLoseModal(true);
      localStorage.setItem(`result-${dateKey}`, 'wrong');
      updateStreak(false);
    }
  };

  const tryAgain = () => {
    setHintsShown(1);
    setGuess('');
    setResult(null);
    setShowWinModal(false);
    setShowLoseModal(false);
    setShowAnswer(false);
    setShowDetails(false);
    setFeedback('');
  };

  if (!movieForDay) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
          No movie set for <span className="text-rose-600 dark:text-rose-500">{formattedDate}</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Don’t pick future dates, bro you ain't Doctor Strange. 😭
        </p>
        <button className="px-6 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition dark:hover:bg-rose-500" onClick={goBack}>
          Check Other Dates
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4 py-10 pb-96 flex flex-col items-center font-['Inter']">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');`}</style>

      <button className="text-3xl font-bold text-rose-600 dark:text-rose-500 mb-2" onClick={goHome}>Entha Chitram</button>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{formattedDate}</p>

      {isHardDay && (
        <div className="mb-6 inline-block bg-red-100 text-red-700 font-semibold text-sm px-3 py-1 rounded-full uppercase tracking-wide dark:bg-red-900 dark:text-red-300">
          💀 Hard Day!
        </div>
      )}

      <div className="flex gap-3 mb-6 flex-wrap justify-center">
        <button onClick={goBack} className="px-4 py-2 bg-rose-600 text-white text-sm rounded hover:bg-rose-700 transition dark:hover:bg-rose-500">Other Days</button>
        <button onClick={() => navigate('/play', { state: { date: prevDate }, replace: true })} disabled={!prevDate}
          className={`px-4 py-2 text-sm rounded transition ${prevDate ? 'bg-rose-600 text-white hover:bg-rose-700 dark:hover:bg-rose-500' : 'bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'}`}>
          ← Previous Day
        </button>
        <button onClick={() => navigate('/play', { state: { date: nextDate }, replace: true })} disabled={!nextDate}
          className={`px-4 py-2 text-sm rounded transition ${nextDate ? 'bg-rose-600 text-white hover:bg-rose-700 dark:hover:bg-rose-500' : 'bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'}`}>
          Next Day →
        </button>
        <button onClick={() => setShowStreakModal(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition dark:hover:bg-blue-700">
          📊 Streak
        </button>
      </div>

      {/* Game Box: Input + Hint + Buttons */}
      <div className="w-full max-w-2xl flex gap-4 mb-8 justify-center">
        {/* Left side: Input + Hints */}
        <div className="flex-1 space-y-4">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            placeholder="Enter movie name"
            className="w-full h-12 px-4 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-3">Hints</h2>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-4">
              {hints.slice(0, hintsShown).map((hint, i) => (
                <div key={i} className="opacity-0 animate-fadeIn">
                  <p className="py-1">
                    <span className="font-semibold">Hint {i + 1}:</span> {hint}
                  </p>
                  {i < hintsShown - 1 && (
                    <hr className="border-gray-300 dark:border-gray-600 md:hidden mt-2 mb-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side: Buttons */}
        <div className="w-32 flex flex-col gap-3">
          <button
            onClick={handleSubmit}
            className="h-12 w-full bg-rose-600 text-white rounded-md text-sm font-semibold hover:bg-rose-700 dark:hover:bg-rose-500 transition"
          >
            Submit
          </button>

          <button
            onClick={() => setHintsShown(hintsShown + 1)}
            disabled={hintsShown >= hints.length}
            className={`h-12 mt-1 w-full text-white rounded-md text-sm font-semibold transition ${hintsShown >= hints.length
              ? 'bg-gray-300 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
              : 'bg-rose-600 hover:bg-rose-700 dark:hover:bg-rose-500'
              }`}
          >
            Show Hint
          </button>

          <button
            onClick={() => setShowDetails(true)}
            disabled={hintsShown < hints.length}
            className={`h-12 w-full text-white rounded-md text-sm font-semibold transition ${hintsShown < hints.length
              ? 'bg-gray-300 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700'
              }`}
          >
            Show Details
          </button>
        </div>
      </div>

      {feedback && (
        <div className="text-sm text-red-600 dark:text-red-400 font-medium mb-1 opacity-0 animate-fadeIn">{feedback}</div>
      )}

      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        ⏰ Next movie in: <span className="font-semibold">{timeLeft}</span>
      </div>

      {/* WIN Modal */}
      {showWinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 opacity-0 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h2 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">🎉 Yay! You guessed it!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">📅 Selected Date: <span className="font-medium">{formattedDate}</span></p>
            <p className="text-gray-700 dark:text-gray-200 mb-2">The movie was <strong>{correctAnswer}</strong>.</p>
            {movieForDay.details?.Trivia && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0">
                🧠 Trivia: {movieForDay.details.Trivia}
              </p>
            )}
            <div className="flex justify-center gap-3 flex-wrap mt-4">
              <button
                onClick={tryAgain}
                className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 dark:hover:bg-rose-700"
              >
                Try Again
              </button>
              <button
                onClick={goBack}
                className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 dark:hover:bg-rose-700"
              >
                Check Other Dates
              </button>
              <button onClick={() => setShowStreakModal(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition dark:hover:bg-blue-700">
                📊 Streak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOSE Modal */}
      {showLoseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 opacity-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">❌ Game Over!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">📅 Selected Date: <span className="font-medium">{formattedDate}</span></p>
            <p className="text-gray-700 dark:text-gray-200 mb-4">Better luck next time.</p>
            {showAnswer && (
              <p className="text-gray-700 dark:text-gray-200 mb-4 opacity-0 animate-fadeIn">
                The correct answer was <strong>{correctAnswer}</strong>.
              </p>
            )}
            <div className="flex justify-center gap-3 flex-wrap mt-4">
              <button
                onClick={tryAgain}
                className="mt-2 px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 dark:hover:bg-rose-500"
              >
                Try Again
              </button>
              <button
                onClick={goBack}
                className="mt-2 px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 dark:hover:bg-rose-500"
              >
                Check Other Dates
              </button>
              {!showAnswer && (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="px-4 py-0 text-sm text-blue-600 dark:text-blue-400 hover:underline mb-0 "
                >
                  Reveal Answer
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DETAILS Modal */}
      {showDetails && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-lg w-full max-w-sm text-left relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-3 right-4 text-gray-500 dark:text-gray-300 text-xl hover:text-gray-700 dark:hover:text-white"
            >
              &times;
            </button>
            <h2 className="text-base font-bold text-rose-600 dark:text-rose-500 mb-4 text-center">Movie Details</h2>
            <div className="text-base text-gray-800 dark:text-gray-200 space-y-2 text-center">
              <p><span className="font-semibold">Director:</span> {movieForDay.details?.Director}</p>
              <p><span className="font-semibold">Music:</span> {movieForDay.details?.Music}</p>
              <p><span className="font-semibold">Release Date:</span> {movieForDay.details?.["Release Date"]}</p>
              <p><span className="font-semibold">IMDB:</span> {movieForDay.details?.IMDB}</p>
            </div>
          </div>
        </div>
      )}


      {showStreakModal && (
        <div onClick={() => setShowStreakModal(false)} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 opacity-0 animate-fadeIn">
          <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-11 rounded-lg shadow-lg w-full max-w-sm text-center relative">
            <button className="absolute top-3 right-4 text-gray-500 dark:text-gray-300 text-xl" onClick={() => setShowStreakModal(false)}>&times;</button>
            <h2 className="text-xl font-bold text-rose-600 dark:text-rose-500 mb-6">🔥 My Streak</h2>
            <p className="mb-2"><strong>Current Streak:</strong> {localStorage.getItem('streak') || 0}</p>
            <p className="mb-2"><strong>Movies Guessed:</strong> {localStorage.getItem('guessed') || 0}</p>
            <p className="mb-2"><strong>Total Played:</strong> {localStorage.getItem('played') || 0}</p>
            <p><strong>Win Percentage:</strong> {
              localStorage.getItem('played') > 0
                ? Math.round((+localStorage.getItem('guessed') / +localStorage.getItem('played')) * 100)
                : 0
            }%</p>
            <p className='text-sm mt-6 text-gray-500'>Note: Even if you play 10 old games today, the streak logic will not change again today.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Play;
